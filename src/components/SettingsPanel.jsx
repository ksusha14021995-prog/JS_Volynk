import styles from './SettingsPanel.module.css';

const MODELS = ['GigaChat', 'GigaChat-Plus', 'GigaChat-Pro', 'GigaChat-Max'];

const DEFAULTS = {
  model: 'GigaChat',
  temperature: 1,
  top_p: 0.9,
  max_tokens: 2048,
  system_prompt: 'Ты полезный ассистент.',
};

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onChange,
  theme,
  onThemeChange,
}) {
  const set = (patch) => onChange({ ...settings, ...patch });
  const reset = () => {
    onChange(DEFAULTS);
    onThemeChange('light');
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Настройки</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={styles.body}>
          <label className={styles.field}>
            <span className={styles.label}>Модель</span>
            <select
              value={settings.model}
              onChange={(e) => set({ model: e.target.value })}
              className={styles.select}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Temperature: {settings.temperature.toFixed(2)}</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={settings.temperature}
              onChange={(e) => set({ temperature: Number(e.target.value) })}
              className={styles.slider}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Top-P: {settings.top_p.toFixed(2)}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.top_p}
              onChange={(e) => set({ top_p: Number(e.target.value) })}
              className={styles.slider}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Max Tokens</span>
            <input
              type="number"
              min="1"
              max="32000"
              value={settings.max_tokens}
              onChange={(e) => set({ max_tokens: Number(e.target.value) })}
              className={styles.numberInput}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>System Prompt</span>
            <textarea
              rows="4"
              value={settings.system_prompt}
              onChange={(e) => set({ system_prompt: e.target.value })}
              className={styles.textarea}
            />
          </label>

          <label className={styles.fieldRow}>
            <span className={styles.label}>Тёмная тема</span>
            <input
              type="checkbox"
              role="switch"
              checked={theme === 'dark'}
              onChange={(e) => onThemeChange(e.target.checked ? 'dark' : 'light')}
            />
          </label>
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.resetBtn} onClick={reset}>
            Сбросить
          </button>
          <button type="button" className={styles.saveBtn} onClick={onClose}>
            Сохранить
          </button>
        </footer>
      </aside>
    </>
  );
}
