import { useState, useMemo } from 'react';
import ChatList from './ChatList.jsx';
import SearchInput from './SearchInput.jsx';
import styles from './Sidebar.module.css';

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onRenameChat,
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => {
      if (c.title.toLowerCase().includes(q)) return true;
      const last = c.messages[c.messages.length - 1];
      if (last?.content?.toLowerCase?.().includes(q)) return true;
      return false;
    });
  }, [query, chats]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <button className={styles.newChat} type="button" onClick={onCreateChat}>
          <span className={styles.plus}>+</span> Новый чат
        </button>
      </div>
      <div className={styles.search}>
        <SearchInput value={query} onChange={setQuery} placeholder="Поиск по чатам" />
      </div>
      <ChatList
        chats={filtered}
        activeChatId={activeChatId}
        onSelect={onSelectChat}
        onDelete={onDeleteChat}
        onRename={onRenameChat}
      />
    </div>
  );
}
