// src/main.ts
import { UIService } from './services/uiService';
import { ApiKeyService } from './services/apiKeyService';
import { ThemeService } from './services/themeService';
import './assets/styles/style.scss';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar servicios principales
  const uiService = UIService.getInstance();
  uiService.initialize();

  const themeService = ThemeService.getInstance();
  themeService.initialize();

  const apiKeyService = ApiKeyService.getInstance();
  // Comprobar API key guardada
  apiKeyService.updateApiKeyDisplay(
    document.getElementById('api-key-input')!,
    document.getElementById('api-key-status')!
  );

  // Rastrear posición del mouse para tooltips
  document.addEventListener('mousemove', (e: MouseEvent) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX + 20}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

  // Manejar errores de extensiones del navegador
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    if (event.reason?.message?.includes('message port closed') ||
        event.reason?.message?.includes('crypto.randomUUID')) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (e: ErrorEvent) => {
    if (e.message.includes('The message port closed') ||
        e.message.includes('crypto.randomUUID') ||
        e.message.includes('Failed to fetch chrome-extension')) {
      e.stopImmediatePropagation();
      return true;
    }
    return false;
  }, true);
});