const TOKEN = import.meta.env.VITE_GIGACHAT_TOKEN;
const BASE_URL =
  import.meta.env.VITE_GIGACHAT_BASE_URL ?? 'https://gigachat.devices.sberbank.ru/api/v1';

const MOCK_REPLY = [
  'Это **mock-режим** GigaChat (токен не задан).\n\n',
  'Чтобы включить реальный API:\n',
  '1. Получите токен на https://developers.sber.ru/portal/products/gigachat\n',
  '2. Положите его в `.env.local` как `VITE_GIGACHAT_TOKEN=...`\n',
  '3. Перезапустите `npm run dev`\n\n',
  'Пример блока кода:\n',
  '```js\n',
  'const sum = (a, b) => a + b;\n',
  '```',
];

/**
 * Отправляет сообщения в GigaChat. Поддерживает streaming.
 * @param {Object} opts
 * @param {Array<{role: string, content: string}>} opts.messages
 * @param {Object} [opts.settings] - { model, temperature, top_p, max_tokens, system_prompt }
 * @param {AbortSignal} [opts.signal]
 * @param {(chunk: string) => void} [opts.onChunk] - вызывается при каждом chunk в стриме
 * @returns {Promise<string>} полный текст ответа
 */
export async function sendChatCompletion({ messages, settings = {}, signal, onChunk }) {
  if (!TOKEN) {
    return mockStream({ onChunk, signal });
  }

  const body = {
    model: settings.model ?? 'GigaChat',
    messages: settings.system_prompt
      ? [{ role: 'system', content: settings.system_prompt }, ...messages]
      : messages,
    temperature: settings.temperature ?? 1,
    top_p: settings.top_p ?? 0.9,
    max_tokens: settings.max_tokens ?? 2048,
    stream: true,
  };

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`GigaChat ${res.status}: ${txt.slice(0, 200)}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('text/event-stream') && res.body) {
    return readSSE(res.body, onChunk);
  }

  // REST fallback
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content ?? '';
  if (onChunk) onChunk(text);
  return text;
}

async function readSSE(stream, onChunk) {
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const event = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') return full;
        try {
          const json = JSON.parse(data);
          const delta = json?.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            full += delta;
            if (onChunk) onChunk(full);
          }
        } catch {
          // не-JSON событие — пропускаем
        }
      }
    }
  }
  return full;
}

async function mockStream({ onChunk, signal }) {
  let full = '';
  for (const chunk of MOCK_REPLY) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await new Promise((r) => setTimeout(r, 150));
    full += chunk;
    if (onChunk) onChunk(full);
  }
  return full;
}
