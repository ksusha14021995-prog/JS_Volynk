import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ text }) {
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon} aria-hidden="true">⚠</span>
      <span>{text}</span>
    </div>
  );
}
