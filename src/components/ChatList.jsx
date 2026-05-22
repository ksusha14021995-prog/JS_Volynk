import ChatItem from './ChatItem.jsx';
import EmptyState from './EmptyState.jsx';
import styles from './ChatList.module.css';

export default function ChatList({ chats, activeChatId, onSelect, onDelete, onRename }) {
  if (chats.length === 0) {
    return (
      <div className={styles.empty}>
        <EmptyState text="Чатов нет" />
      </div>
    );
  }
  return (
    <ul className={styles.list}>
      {chats.map((chat) => (
        <li key={chat.id}>
          <ChatItem
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onSelect(chat.id)}
            onDelete={() => onDelete(chat.id)}
            onRename={(title) => onRename(chat.id, title)}
          />
        </li>
      ))}
    </ul>
  );
}
