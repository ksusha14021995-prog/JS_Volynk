import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm.jsx';
import AppLayout from './components/AppLayout.jsx';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(true); // HW6: пропускаем auth для удобства самопроверки
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!isAuthed) {
    return <AuthForm onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout theme={theme} onThemeChange={setTheme} />} />
      <Route
        path="/chat/:chatId"
        element={<AppLayout theme={theme} onThemeChange={setTheme} />}
      />
      <Route path="*" element={<AppLayout theme={theme} onThemeChange={setTheme} />} />
    </Routes>
  );
}
