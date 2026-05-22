/**
 * @typedef {{ id: string, role: 'system'|'user'|'assistant', content: string }} Message
 * @typedef {{ id: string, title: string, messages: Message[], createdAt: number, updatedAt: number }} Chat
 * @typedef {{ chats: Chat[], activeChatId: string|null, isLoading: boolean, error: string|null }} ChatState
 * @typedef {
 *   { type: 'HYDRATE', payload: ChatState } |
 *   { type: 'CREATE_CHAT', payload: { id: string, title?: string } } |
 *   { type: 'DELETE_CHAT', payload: { id: string } } |
 *   { type: 'RENAME_CHAT', payload: { id: string, title: string } } |
 *   { type: 'SELECT_CHAT', payload: { id: string|null } } |
 *   { type: 'ADD_MESSAGE', payload: { chatId: string, message: Message } } |
 *   { type: 'UPDATE_MESSAGE', payload: { chatId: string, messageId: string, content: string } } |
 *   { type: 'SET_LOADING', payload: boolean } |
 *   { type: 'SET_ERROR', payload: string|null }
 * } ChatAction
 */

/** @type {ChatState} */
export const initialState = {
  chats: [],
  activeChatId: null,
  isLoading: false,
  error: null,
};

const TITLE_MAX = 40;

function deriveTitle(text) {
  const t = text.trim();
  if (!t) return null;
  return t.length > TITLE_MAX ? `${t.slice(0, TITLE_MAX).trim()}…` : t;
}

/**
 * @param {ChatState} state
 * @param {ChatAction} action
 * @returns {ChatState}
 */
export function chatReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'CREATE_CHAT': {
      const newChat = {
        id: action.payload.id,
        title: action.payload.title ?? `Новый чат ${state.chats.length + 1}`,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        ...state,
        chats: [newChat, ...state.chats],
        activeChatId: newChat.id,
      };
    }

    case 'DELETE_CHAT': {
      const remaining = state.chats.filter((c) => c.id !== action.payload.id);
      return {
        ...state,
        chats: remaining,
        activeChatId:
          state.activeChatId === action.payload.id ? null : state.activeChatId,
      };
    }

    case 'RENAME_CHAT':
      return {
        ...state,
        chats: state.chats.map((c) =>
          c.id === action.payload.id
            ? { ...c, title: action.payload.title, updatedAt: Date.now() }
            : c
        ),
      };

    case 'SELECT_CHAT':
      return { ...state, activeChatId: action.payload.id };

    case 'ADD_MESSAGE': {
      const { chatId, message } = action.payload;
      return {
        ...state,
        chats: state.chats.map((c) => {
          if (c.id !== chatId) return c;
          const next = {
            ...c,
            messages: [...c.messages, message],
            updatedAt: Date.now(),
          };
          // авто-название по первому user-сообщению
          if (
            message.role === 'user' &&
            c.messages.filter((m) => m.role === 'user').length === 0
          ) {
            const derived = deriveTitle(message.content);
            if (derived) next.title = derived;
          }
          return next;
        }),
      };
    }

    case 'UPDATE_MESSAGE': {
      const { chatId, messageId, content } = action.payload;
      return {
        ...state,
        chats: state.chats.map((c) =>
          c.id !== chatId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, content } : m
                ),
                updatedAt: Date.now(),
              }
        ),
      };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
