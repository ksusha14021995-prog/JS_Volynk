import styles from './SearchInput.module.css';

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
