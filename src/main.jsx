import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ChatProvider } from './store/ChatContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/global.css';
import 'highlight.js/styles/github.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
