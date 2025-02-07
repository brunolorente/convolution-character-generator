// src/components/App.tsx
import React, { useEffect } from 'react';
import { UIService } from '../services/uiService';
import { ApiKeyService } from '../services/apiKeyService';
import { ThemeService } from '../services/themeService';

import TopFrame from './TopFrame';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const App: React.FC = () => {
  useEffect(() => {
    // Lógica que antes estaba en main.ts (DOMContentLoaded)
    const uiService = UIService.getInstance();
    uiService.initialize();

    const themeService = ThemeService.getInstance();
    themeService.initialize();

    const apiKeyService = ApiKeyService.getInstance();
    const apiKeyInputEl = document.getElementById('api-key-input');
    const apiKeyStatusEl = document.getElementById('api-key-status');
    if (apiKeyInputEl && apiKeyStatusEl) {
      apiKeyService.updateApiKeyDisplay(apiKeyInputEl, apiKeyStatusEl);
    }

    // Rastrear posición del mouse para tooltips
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX + 20}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Manejar errores de extensiones
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes('message port closed') ||
        event.reason?.message?.includes('crypto.randomUUID')
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    const handleError = (e: ErrorEvent) => {
      if (
        e.message.includes('The message port closed') ||
        e.message.includes('crypto.randomUUID') ||
        e.message.includes('Failed to fetch chrome-extension')
      ) {
        e.stopImmediatePropagation();
        return true;
      }
      return false;
    };
    window.addEventListener('error', handleError, true);

    // Cleanup cuando se desmonte <App />
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return (
    <>
      <TopFrame />
      <div className="container">
        <Sidebar />
        <MainContent />
        {/* Si quieres, aquí pondrías <CreditsColumn /> algún día */}
      </div>
    </>
  );
};

export default App;
