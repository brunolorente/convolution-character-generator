// src/services/apiKeyService.ts
import { API_KEY_STORAGE_KEY } from '../constants';

export class ApiKeyService {
  private static instance: ApiKeyService | null = null;

  static getInstance(): ApiKeyService {
    if (!ApiKeyService.instance) {
      ApiKeyService.instance = new ApiKeyService();
    }
    return ApiKeyService.instance;
  }

  private constructor() {}

  getApiKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }

  saveApiKey(apiKey: string): void {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  }

  removeApiKey(): void {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }

  checkSavedApiKey(): boolean {
    return !!this.getApiKey();
  }

  updateApiKeyDisplay(apiKeyInput: HTMLElement, apiKeyStatus: HTMLElement): void {
    const hasKey = this.checkSavedApiKey();
    apiKeyInput.style.display = hasKey ? 'none' : 'flex';
    apiKeyStatus.style.display = hasKey ? 'flex' : 'none';
    
    const statusText = apiKeyStatus.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = hasKey ? 'API key is set' : '';
    }
  }
}