import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { chatReducer, initialState } from './chatReducer.js';

const STORAGE_KEY = 'netology-fe-hw6:chats';

const ChatContext = createContext(null);

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.chats)) return initialState;
    return {
      chats: parsed.chats,
      activeChatId: parsed.activeChatId ?? null,
      isLoading: false,
      error: null,
    };
  } catch {
    return initialState;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, undefined, loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ chats: state.chats, activeChatId: state.activeChatId })
      );
    } catch {
      // localStorage недоступен или переполнен — игнорируем
    }
  }, [state.chats, state.activeChatId]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}
