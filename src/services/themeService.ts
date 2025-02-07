import { Theme } from "../types/theme";

export class ThemeService {
  private static instance: ThemeService | null = null;
  private static readonly themeKey = 'theme';
  private static readonly defaultTheme: Theme = 'light';

  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  initialize(): void {
    const savedTheme = localStorage.getItem(ThemeService.themeKey);
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    const widget = document.querySelector('gecko-coin-ticker-widget');

    if (savedTheme && this.isValidTheme(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light');
    }

    // Añadir event listener al botón de theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  private setTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(ThemeService.themeKey, theme);
    
    // Actualizar ícono
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' 
        ? 'fa-solid fa-sun theme-icon' 
        : 'fa-solid fa-moon theme-icon';
    }
    
    // Actualizar widget
    const widget = document.querySelector('gecko-coin-ticker-widget');
    if (widget) {
      widget.setAttribute('dark-mode', theme === 'dark' ? 'true' : 'false');
    }
  }

  private toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private getCurrentTheme(): Theme {
    const theme = document.documentElement.getAttribute('data-theme');
    return this.isValidTheme(theme) ? theme : ThemeService.defaultTheme;
  }

  private isValidTheme(theme: string | null): theme is Theme {
    return theme === 'light' || theme === 'dark';
  }
}