import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import EmptyState from './EmptyState.jsx';
import styles from './AppLayout.module.css';
import { useChat } from '../store/ChatContext.jsx';

const SettingsPanel = lazy(() => import('./SettingsPanel.jsx'));

export default function AppLayout({ theme, onThemeChange }) {
  const { state, dispatch } = useChat();
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    model: 'GigaChat',
    temperature: 1,
    top_p: 0.9,
    max_tokens: 2048,
    system_prompt: 'Ты полезный ассистент.',
  });

  useEffect(() => {
    if (chatId) {
      if (state.chats.some((c) => c.id === chatId)) {
        if (state.activeChatId !== chatId) {
          dispatch({ type: 'SELECT_CHAT', payload: { id: chatId } });
        }
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [chatId, state.chats, state.activeChatId, dispatch, navigate]);

  const activeChat = state.chats.find((c) => c.id === state.activeChatId) ?? null;

  const handleSelectChat = (id) => {
    dispatch({ type: 'SELECT_CHAT', payload: { id } });
    navigate(`/chat/${id}`);
    setIsSidebarOpen(false);
  };

  const handleCreateChat = () => {
    const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    dispatch({ type: 'CREATE_CHAT', payload: { id } });
    navigate(`/chat/${id}`);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = (id) => {
    if (!window.confirm('Удалить чат?')) return;
    const wasActive = state.activeChatId === id;
    dispatch({ type: 'DELETE_CHAT', payload: { id } });
    if (wasActive) navigate('/');
  };

  const handleRenameChat = (id, title) => {
    dispatch({ type: 'RENAME_CHAT', payload: { id, title } });
  };

  return (
    <div className={styles.layout}>
      <button
        className={styles.burger}
        onClick={() => setIsSidebarOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        aria-label="Список чатов"
      >
        <Sidebar
          chats={state.chats}
          activeChatId={state.activeChatId}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
        />
      </aside>

      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className={styles.main}>
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
            theme={theme}
            onThemeChange={onThemeChange}
          />
        ) : (
          <div className={styles.placeholder}>
            <EmptyState text="Создайте новый чат, чтобы начать диалог" />
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        {isSettingsOpen && (
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onChange={setSettings}
            theme={theme}
            onThemeChange={onThemeChange}
          />
        )}
      </Suspense>
    </div>
  );
}
