import { useState } from 'react';
import styles from './ChatItem.module.css';

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export default function ChatItem({ chat, isActive, onClick, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(chat.title);

  const commit = () => {
    const v = draft.trim();
    if (v && v !== chat.title) onRename(v);
    setIsEditing(false);
  };

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={isEditing ? undefined : onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (isEditing) return;
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      {isEditing ? (
        <input
          autoFocus
          className={styles.titleInput}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              setDraft(chat.title);
              setIsEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className={styles.title}>{chat.title}</div>
      )}
      <div className={styles.meta}>
        <span className={styles.date}>{formatDate(chat.updatedAt)}</span>
        <span className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Переименовать"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setDraft(chat.title);
            }}
          >
            ✎
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Удалить"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </button>
        </span>
      </div>
    </div>
  );
}
