import styles from './EmptyState.module.css';

export default function EmptyState({ text = 'Начните новый диалог' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} aria-hidden="true">💬</div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}
