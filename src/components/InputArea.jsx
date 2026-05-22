import { useRef, useState } from 'react';
import styles from './InputArea.module.css';

const MAX_LINES = 5;

export default function InputArea({ onSend, onStop, isLoading = false }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 20;
    const max = lineHeight * MAX_LINES + 16;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  };

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isLoading;

  const submit = () => {
    if (!canSend) return;
    onSend(trimmed);
    setValue('');
    setTimeout(adjustHeight, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Прикрепить изображение"
      >
        📎
      </button>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        rows={1}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Напишите сообщение… (Enter — отправить, Shift+Enter — перенос)"
      />
      {isLoading ? (
        <button type="button" className={styles.stopBtn} onClick={onStop}>
          Стоп
        </button>
      ) : (
        <button
          type="button"
          className={styles.sendBtn}
          onClick={submit}
          disabled={!canSend}
        >
          Отправить
        </button>
      )}
    </div>
  );
}
