import Message from './Message.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import EmptyState from './EmptyState.jsx';
import styles from './MessageList.module.css';

export default function MessageList({ messages, isAssistantTyping = false, endRef }) {
  if (messages.length === 0) {
    return (
      <div className={styles.list}>
        <div className={styles.emptyWrap}>
          <EmptyState text="Начните новый диалог" />
        </div>
        <div ref={endRef} />
      </div>
    );
  }
  return (
    <div className={styles.list}>
      {messages.map((m) => (
        <Message
          key={m.id}
          variant={m.role === 'user' ? 'user' : 'assistant'}
          content={m.content}
          sender={m.role === 'user' ? 'Вы' : 'GigaChat'}
        />
      ))}
      {isAssistantTyping && (
        <div className={styles.typingRow}>
          <TypingIndicator />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
