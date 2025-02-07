// src/types/index.ts
export interface CharacterData {
  name: string;
  clients: string[];
  modelProvider: string;
  settings: {
    secrets: Record<string, unknown>;
    voice: {
      model: string;
    };
  };
  plugins: unknown[];
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: MessageExample[][];
  postExamples: string[];
  topics: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  adjectives: string[];
  people: string[];
}

export interface MessageExample {
  user: string;
  content: {
    text: string;
  };
}

export interface Backup {
  name: string;
  timestamp: string;
  data: CharacterData;
}

export interface BackupListItem {
  name: string;
  timestamp: string;
  key: string;
}

export interface UIElements {
  characterPrompt: HTMLTextAreaElement;
  generateFromPromptBtn: HTMLButtonElement & { disabled: boolean };
  promptStatus: HTMLDivElement;
  processingStatus: HTMLDivElement;
  dropZone: HTMLDivElement;
  fileList: HTMLDivElement;
  downloadBtn: HTMLButtonElement & { disabled: boolean };
  knowledgeContent: HTMLDivElement;
  messageExamplesContainer: HTMLDivElement;
  modelSelect: HTMLSelectElement;
  apiKeyInput: HTMLInputElement;
  apiKeyStatus: HTMLDivElement;
  characterDropZone: HTMLDivElement;
  characterFileStatus: HTMLDivElement;
  knowledgeEntries: HTMLDivElement;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProcessFilesResponse {
  knowledge: string[];
}

export interface FixJsonResponse {
  character: CharacterData;
}

// Tipos para los eventos personalizados
export interface FileUploadEvent extends Event {
  detail: {
    files: File[];
  };
}

export interface KnowledgeUpdateEvent extends Event {
  detail: {
    knowledge: string[];
  };
}

// Declarar los eventos personalizados
declare global {
  interface HTMLElementEventMap {
    'fileUpload': FileUploadEvent;
    'knowledgeUpdate': KnowledgeUpdateEvent;
  }
}