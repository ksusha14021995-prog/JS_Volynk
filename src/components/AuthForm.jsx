import { useState } from 'react';
import ErrorMessage from './ErrorMessage.jsx';
import styles from './AuthForm.module.css';

const SCOPES = ['GIGACHAT_API_PERS', 'GIGACHAT_API_B2B', 'GIGACHAT_API_CORP'];

export default function AuthForm({ onLogin }) {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState(SCOPES[0]);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (credentials.trim().length === 0) {
      setError('Заполните поле Credentials.');
      return;
    }
    setError('');
    onLogin({ credentials, scope });
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={submit}>
        <h1 className={styles.title}>GigaChat — вход</h1>
        <p className={styles.hint}>Введите Authorization key (Base64) и выберите scope.</p>

        <label className={styles.field}>
          <span className={styles.label}>Credentials (Base64)</span>
          <input
            type="password"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            className={styles.input}
            placeholder="MzAxN…"
          />
        </label>

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Scope</legend>
          {SCOPES.map((s) => (
            <label key={s} className={styles.radio}>
              <input
                type="radio"
                name="scope"
                value={s}
                checked={scope === s}
                onChange={() => setScope(s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </fieldset>

        {error && <ErrorMessage text={error} />}

        <button type="submit" className={styles.submit}>
          Войти
        </button>
      </form>
    </div>
  );
}
