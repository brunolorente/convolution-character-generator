// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

import './assets/styles/style.scss';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);