// src/services/knowledgeService.ts
import { apiCall } from '../utils/api';
import { API_KEY_STORAGE_KEY } from '../constants';

export class KnowledgeService {
  private static instance: KnowledgeService | null = null;
  private knowledgeBase: string[] = [];

  static getInstance(): KnowledgeService {
    if (!KnowledgeService.instance) {
      KnowledgeService.instance = new KnowledgeService();
    }
    return KnowledgeService.instance;
  }

  private constructor() {}

  getKnowledge(): string[] {
    return this.knowledgeBase;
  }

  setKnowledge(knowledge: string[]): void {
    this.knowledgeBase = knowledge;
  }

  addKnowledgeEntry(entry: string): void {
    this.knowledgeBase.push(entry);
  }

  removeKnowledgeEntry(index: number): void {
    this.knowledgeBase.splice(index, 1);
  }

  async processFiles(files: File[]): Promise<string[]> {
    if (files.length === 0) {
      throw new Error('No files to process');
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${window.location.origin}/api/process-files`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newKnowledge = data.knowledge || [];
      this.knowledgeBase = [...this.knowledgeBase, ...newKnowledge];
      return this.knowledgeBase;
    } catch (error) {
      console.error('Error processing files:', error);
      throw error;
    }
  }

  async fixJsonFormatting(content: string): Promise<any> {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!apiKey) {
      throw new Error('API key is required to fix JSON formatting');
    }

    return await apiCall('/api/fix-json', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey
      },
      body: JSON.stringify({ content })
    });
  }
}

// src/services/entryService.ts
export class EntryService {
  private static instance: EntryService | null = null;
  
  static getInstance(): EntryService {
    if (!EntryService.instance) {
      EntryService.instance = new EntryService();
    }
    return EntryService.instance;
  }

  private constructor() {}

  createKnowledgeEntry(value: string = ''): HTMLElement {
    const entry = document.createElement('div');
    entry.className = 'knowledge-entry';
    entry.innerHTML = `
      <span class="entry-number"></span>
      <input type="text" class="knowledge-text" value="${value}" placeholder="Enter knowledge...">
      <button class="action-button delete-button" title="Remove Knowledge">×</button>
    `;
    
    entry.querySelector('.delete-button')?.addEventListener('click', () => {
      entry.remove();
      this.updateKnowledgeNumbers();
    });
    
    return entry;
  }

  createAdjectiveEntry(value: string = ''): HTMLElement {
    const entry = document.createElement('div');
    entry.className = 'adjective-entry';
    entry.innerHTML = `
      <input type="text" class="adjective-name" placeholder="Enter an adjective" value="${value}">
      <button class="action-button delete-button" title="Remove Adjective">×</button>
    `;
    
    entry.querySelector('.delete-button')?.addEventListener('click', () => {
      entry.remove();
    });
    
    return entry;
  }

  updateKnowledgeNumbers(): void {
    document.querySelectorAll('.knowledge-entry').forEach((entry, index) => {
      const numberSpan = entry.querySelector('.entry-number');
      if (numberSpan) {
        numberSpan.textContent = `${index + 1}.`;
      }
    });
  }
}