// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Importa tus estilos globales (SCSS) si quieres
import './assets/styles/style.scss';

// Renderizamos la App en #root
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
