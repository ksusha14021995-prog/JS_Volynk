import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import styles from './Message.module.css';

export default function Message({ variant, content, sender }) {
  const [copied, setCopied] = useState(false);
  const isUser = variant === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // не критично
    }
  };

  return (
    <div className={`${styles.row} ${isUser ? styles.rowUser : styles.rowAssistant}`}>
      {!isUser && (
        <div className={styles.avatar} aria-hidden="true">
          G
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
        <div className={styles.sender}>{sender}</div>
        <div className={styles.content}>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content || ' '}</ReactMarkdown>
        </div>
        {!isUser && (
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopy}
            aria-label="Копировать сообщение"
          >
            {copied ? '✓ Скопировано' : 'Копировать'}
          </button>
        )}
      </div>
    </div>
  );
}
