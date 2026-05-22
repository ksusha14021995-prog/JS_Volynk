import { useRef, useEffect } from 'react';
import MessageList from './MessageList.jsx';
import InputArea from './InputArea.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import styles from './ChatWindow.module.css';
import { useChat } from '../store/ChatContext.jsx';
import { sendChatCompletion } from '../api/gigachat.js';

export default function ChatWindow({ chat, settings, onOpenSettings, theme, onThemeChange }) {
  const { state, dispatch } = useChat();
  const abortRef = useRef(null);
  const listEndRef = useRef(null);

  // автоскролл вниз при появлении новых сообщений
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chat.messages.length, chat.messages[chat.messages.length - 1]?.content]);

  const handleSend = async (text) => {
    const userMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    const assistantId = `a-${Date.now()}`;
    const assistantPlaceholder = {
      id: assistantId,
      role: 'assistant',
      content: '',
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { chatId: chat.id, message: userMessage } });
    dispatch({
      type: 'ADD_MESSAGE',
      payload: { chatId: chat.id, message: assistantPlaceholder },
    });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = [...chat.messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      await sendChatCompletion({
        messages: history,
        settings,
        signal: controller.signal,
        onChunk: (full) => {
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: { chatId: chat.id, messageId: assistantId, content: full },
          });
        },
      });
    } catch (err) {
      if (err?.name !== 'AbortError') {
        dispatch({ type: 'SET_ERROR', payload: err?.message ?? 'Ошибка запроса' });
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            chatId: chat.id,
            messageId: assistantId,
            content: '_(ошибка получения ответа)_',
          },
        });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  return (
    <div className={styles.window}>
      <header className={styles.header}>
        <h1 className={styles.title}>{chat.title}</h1>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeBtn}
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Переключить тему"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button
            type="button"
            className={styles.settingsBtn}
            onClick={onOpenSettings}
            aria-label="Открыть настройки"
          >
            ⚙
          </button>
        </div>
      </header>

      <ErrorBoundary>
        <MessageList
          messages={chat.messages}
          isAssistantTyping={
            state.isLoading &&
            chat.messages[chat.messages.length - 1]?.content === ''
          }
          endRef={listEndRef}
        />
      </ErrorBoundary>

      {state.error && (
        <div className={styles.errorRow}>
          <ErrorMessage text={state.error} />
        </div>
      )}

      <InputArea onSend={handleSend} onStop={handleStop} isLoading={state.isLoading} />
    </div>
  );
}
