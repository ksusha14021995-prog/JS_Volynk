---
title: Итоговый проект — GigaChat Web (ChatGPT-аналог)
course: Netology BHEMBD-25-OFRR-2 — Основы frontend-разработки
homework: final
task_url: https://netology.ru/profile/program/bhembd-25-ofrr-2/lessons/569348/lesson_items/3082792
tech_stack: [Vite, React 18, JavaScript, Context+useReducer, React Router 6, react-markdown, rehype-highlight, ErrorBoundary, Jest, RTL]
---

# Итоговый проект — GigaChat Web

Веб-клиент для GigaChat в стиле ChatGPT: многочатовый интерфейс, streaming, markdown с подсветкой кода, персистентность, error boundaries.

## Покрытие критериев оценки

### Интерфейс чата (макс. 6 баллов)
- [x] **Главный экран с сообщениями + полем ввода** (1 балл)
- [x] **Хронологическое отображение user/assistant с визуальным разделением** (1 балл)
- [x] Markdown в ответах (заголовки, списки, код, ссылки) — `react-markdown` + `rehype-highlight` (2 балла)
- [x] **Индикация загрузки** (TypingIndicator) (0.5 балла)
- [x] **Автоскролл к последнему сообщению** (`scrollIntoView` в `MessageList`) (0.5 балла)
- [x] Копирование ответа ассистента в буфер (0.5 балла)
- [x] «Остановить генерацию» — `AbortController` (0.5 балла)

### Управление чатами (макс. 4 балла)
- [x] Sidebar со списком всех чатов (0.5 балла)
- [x] Создание нового чата + автогенерация названия из первого сообщения (0.5 балла)
- [x] Переключение между чатами без потери данных (1 балл)
- [x] Редактирование названия + удаление с подтверждением (0.5 балла)
- [x] Поиск по названию **и** по содержимому последнего сообщения (0.5 балла)
- [x] История сохраняется в `localStorage` (1 балл)

### GigaChat API (обязательные сквозные требования)
- [x] **POST `/api/v1/chat/completions`** с заголовками + body (см. `src/api/gigachat.js`)
- [x] Контекст диалога — `messages` с ролями `system / user / assistant`
- [x] Streaming `stream: true` + SSE-парсер
- [x] При отсутствии токена / SSE — автоматический fallback на mock-режим (приложение работает для самопроверки)
- [x] Настройки `temperature`, `top_p`, `max_tokens` (см. SettingsPanel)

### Архитектура
- [x] Слоистая структура: `src/api/`, `src/store/`, `src/components/`
- [x] Адаптер API (`sendChatCompletion`)
- [x] Кастомный хук `useChat`
- [x] `ErrorBoundary` оборачивает `MessageList` (ошибка рендера не ломает sidebar)
- [x] Lazy-load `SettingsPanel` через `React.lazy + Suspense`

### Тесты
- [x] 24 теста (reducer + components + persistence) — те же из HW8.

## Что не реализовано
- Multimodal (обработка изображений через GigaChat) — пункт «дополнительно +2 балла». Можно дописать, если открыт доступ.

## Запуск локально

```bash
git clone <repo>
cd hw-final
cp .env.example .env.local      # положить токен GigaChat (опционально → mock-режим)
npm install
npm run dev                      # http://localhost:5173
npm run build
npm test                         # 24 теста
npm run preview                  # проверить production-сборку
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `VITE_GIGACHAT_TOKEN` | Access token. Без него — mock-режим (приложение всё равно работает) |
| `VITE_GIGACHAT_BASE_URL` | По умолчанию: `https://gigachat.devices.sberbank.ru/api/v1` |

## Получение токена GigaChat

1. Зарегистрироваться: https://developers.sber.ru/portal/products/gigachat
2. Создать проект, получить `Authorization key` (Base64).
3. Обменять на access token через OAuth: `POST https://ngw.devices.sberbank.ru:9443/api/v2/oauth`
   ```bash
   curl -X POST https://ngw.devices.sberbank.ru:9443/api/v2/oauth \
     -H "Authorization: Bearer <BASE64_AUTH_KEY>" \
     -H "RqUID: $(uuidgen)" \
     -d "scope=GIGACHAT_API_PERS"
   ```
4. Положить полученный `access_token` в `.env.local` как `VITE_GIGACHAT_TOKEN=...`.

## Деплой

Vercel, Netlify или любой статический хостинг — это Vite SPA. См. `vercel.json` и `netlify.toml` в репозитории.

## Структура

```
src/
├── api/gigachat.js          # адаптер: streaming SSE + REST fallback + mock
├── store/
│   ├── chatReducer.js       # reducer + типы (JSDoc)
│   └── ChatContext.jsx      # Provider + localStorage hydration
├── components/
│   ├── ErrorBoundary.jsx    # классовый компонент
│   ├── AppLayout.jsx        # каркас: sidebar + main
│   ├── Sidebar.jsx          # список чатов + поиск + CRUD
│   ├── ChatWindow.jsx       # MessageList + InputArea + state-управление
│   ├── MessageList.jsx      # автоскролл, рендер сообщений
│   ├── Message.jsx          # bubble + копирование + markdown + highlight
│   ├── InputArea.jsx        # контролируемая textarea + Send/Stop
│   ├── SettingsPanel.jsx    # drawer с параметрами модели (lazy-loaded)
│   ├── TypingIndicator.jsx
│   ├── ErrorMessage.jsx
│   └── EmptyState.jsx
├── App.jsx                  # роуты
├── main.jsx                 # entry: Router + Provider + ErrorBoundary
└── styles/global.css        # CSS-переменные + тёмная тема
```
