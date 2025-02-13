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
  addExampleBtn:HTMLButtonElement;
  saveKeyBtn: HTMLButtonElement;
  characterFileInput:HTMLInputElement;
  characterFileButton: HTMLButtonElement;
  fileInput: HTMLInputElement;
  fileButton: HTMLButtonElement;
  generateJsonBtn: HTMLButtonElement;
  peopleContainer: HTMLDivElement;
  addPersonBtn: HTMLButtonElement;
  adjectivesContainer: HTMLDivElement;
  addAdjectiveBtn: HTMLButtonElement;
  processKnowledgeBtn: HTMLButtonElement;
  addKnowledgeBtn: HTMLButtonElement;
  clientToggles: HTMLButtonElement[];
  characterName: HTMLInputElement;
  modelProvider: HTMLInputElement;
  voiceModel: HTMLInputElement;
  bioInput: HTMLInputElement;
  loreInput: HTMLInputElement;
  topicsInput: HTMLInputElement;
  styleAllInput: HTMLInputElement;
  styleChatInput: HTMLInputElement;
  stylePostInput: HTMLInputElement;
  adjectivesInput: HTMLInputElement;
  postExamplesInput: HTMLInputElement;
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

export interface OpenRouterModel {
  id: string
  name: string
  created: number
  description: string
  context_length: number
  architecture: Architecture
  pricing: Pricing
  top_provider: TopProvider
  per_request_limits: any
}

export interface Architecture {
  modality: string
  tokenizer: string
  instruct_type: string
}

export interface Pricing {
  prompt: string
  completion: string
  image: string
  request: string
}

export interface TopProvider {
  context_length: number
  max_completion_tokens: any
  is_moderated: boolean
}

// Declarar los eventos personalizados
declare global {
  interface HTMLElementEventMap {
    'fileUpload': FileUploadEvent;
    'knowledgeUpdate': KnowledgeUpdateEvent;
  }
}