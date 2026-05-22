import { chatReducer, initialState } from '../chatReducer.js';

describe('chatReducer', () => {
  test('CREATE_CHAT добавляет чат и делает его активным', () => {
    const next = chatReducer(initialState, {
      type: 'CREATE_CHAT',
      payload: { id: 'c1' },
    });
    expect(next.chats).toHaveLength(1);
    expect(next.chats[0].id).toBe('c1');
    expect(next.activeChatId).toBe('c1');
  });

  test('DELETE_CHAT удаляет и сбрасывает active, если это был active', () => {
    let s = chatReducer(initialState, { type: 'CREATE_CHAT', payload: { id: 'c1' } });
    s = chatReducer(s, { type: 'DELETE_CHAT', payload: { id: 'c1' } });
    expect(s.chats).toHaveLength(0);
    expect(s.activeChatId).toBeNull();
  });

  test('RENAME_CHAT меняет название', () => {
    let s = chatReducer(initialState, { type: 'CREATE_CHAT', payload: { id: 'c1' } });
    s = chatReducer(s, {
      type: 'RENAME_CHAT',
      payload: { id: 'c1', title: 'Новое имя' },
    });
    expect(s.chats[0].title).toBe('Новое имя');
  });

  test('ADD_MESSAGE добавляет в конец массива', () => {
    let s = chatReducer(initialState, { type: 'CREATE_CHAT', payload: { id: 'c1' } });
    s = chatReducer(s, {
      type: 'ADD_MESSAGE',
      payload: { chatId: 'c1', message: { id: 'm1', role: 'user', content: 'hi' } },
    });
    expect(s.chats[0].messages).toHaveLength(1);
    expect(s.chats[0].messages[0].content).toBe('hi');
  });

  test('ADD_MESSAGE первого user-сообщения автогенерирует title', () => {
    let s = chatReducer(initialState, { type: 'CREATE_CHAT', payload: { id: 'c1' } });
    const original = s.chats[0].title;
    s = chatReducer(s, {
      type: 'ADD_MESSAGE',
      payload: {
        chatId: 'c1',
        message: { id: 'm1', role: 'user', content: 'Привет ассистент!' },
      },
    });
    expect(s.chats[0].title).not.toBe(original);
    expect(s.chats[0].title).toBe('Привет ассистент!');
  });

  test('ADD_MESSAGE длинного сообщения обрезает title до 40 + …', () => {
    const longText = 'А'.repeat(100);
    let s = chatReducer(initialState, { type: 'CREATE_CHAT', payload: { id: 'c1' } });
    s = chatReducer(s, {
      type: 'ADD_MESSAGE',
      payload: {
        chatId: 'c1',
        message: { id: 'm1', role: 'user', content: longText },
      },
    });
    expect(s.chats[0].title.length).toBeLessThanOrEqual(41);
    expect(s.chats[0].title.endsWith('…')).toBe(true);
  });

  test('UPDATE_MESSAGE меняет content по id', () => {
    let s = chatReducer(initialState, { type: 'CREATE_CHAT', payload: { id: 'c1' } });
    s = chatReducer(s, {
      type: 'ADD_MESSAGE',
      payload: { chatId: 'c1', message: { id: 'm1', role: 'assistant', content: '' } },
    });
    s = chatReducer(s, {
      type: 'UPDATE_MESSAGE',
      payload: { chatId: 'c1', messageId: 'm1', content: 'обновлено' },
    });
    expect(s.chats[0].messages[0].content).toBe('обновлено');
  });

  test('HYDRATE заменяет state целиком', () => {
    const payload = {
      chats: [{ id: 'c1', title: 'X', messages: [], createdAt: 1, updatedAt: 1 }],
      activeChatId: 'c1',
      isLoading: false,
      error: null,
    };
    const s = chatReducer(initialState, { type: 'HYDRATE', payload });
    expect(s).toEqual(payload);
  });
});
