import styles from './TypingIndicator.module.css';

export default function TypingIndicator({ isVisible = true }) {
  if (!isVisible) return null;
  return (
    <div className={styles.indicator} role="status" aria-label="Ассистент печатает">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}
