// src/services/uiService.ts
import { API_KEY_STORAGE_KEY } from "../constants";
import { UIElements, CharacterData, MessageExample } from "../types";
import { apiCall } from "../utils/api";
import { formatFileSize } from "../utils/character";
import { CharacterService } from "./characterService";
import { FileService } from "./fileService";

export class UIService {
  private static instance: UIService | null = null;
  private elements: UIElements;
  
  static getInstance(): UIService {
    if (!UIService.instance) {
      const fileService = new FileService();
      const characterService = CharacterService.getInstance();
      UIService.instance = new UIService(fileService, characterService);
    }
    return UIService.instance;
  }

  initialize(): void {
    // Explicitly reference methods to prevent unused warnings
    this.setupClientToggleListeners();
    this.setupDropZone();
    this.setupCharacterDropZone();
    this.setupButtons();
    this.setupFileInputs();
    this.setupEventListeners();
  }
  
  private constructor(
    private readonly fileService: FileService,
    private readonly characterService: CharacterService
  ) {
    this.elements = this.initializeElements();
    this.characterService.setElements(this.elements);
    this.setupEventListeners();
  }

  private initializeElements(): UIElements {
    return {
      characterPrompt: document.getElementById('character-prompt') as HTMLTextAreaElement,
      generateFromPromptBtn: document.getElementById('generate-from-prompt') as HTMLButtonElement,
      promptStatus: document.getElementById('prompt-status') as HTMLDivElement,
      processingStatus: document.getElementById('processing-status') as HTMLDivElement,
      dropZone: document.getElementById('drop-zone') as HTMLDivElement,
      fileList: document.getElementById('file-list') as HTMLDivElement,
      downloadBtn: document.getElementById('download-json') as HTMLButtonElement,
      knowledgeContent: document.getElementById('knowledge-content') as HTMLDivElement,
      messageExamplesContainer: document.getElementById('message-examples-container') as HTMLDivElement,
      modelSelect: document.getElementById('model-select') as HTMLSelectElement,
      apiKeyInput: document.getElementById('api-key') as HTMLInputElement,
      apiKeyStatus: document.getElementById('api-key-status') as HTMLDivElement,
      characterDropZone: document.getElementById('character-drop-zone') as HTMLDivElement,
      characterFileStatus: document.getElementById('character-file-status') as HTMLDivElement,
      knowledgeEntries: document.getElementById('knowledge-entries') as HTMLDivElement
    };
  }

  private setupEventListeners(): void {
    this.setupDropZone();
    this.setupCharacterDropZone();
    this.setupButtons();
    this.setupFileInputs();
    this.setupClientToggleListeners();
    this.setupRefinementListener()
  }

  private setupDropZone(): void {
    const { dropZone } = this.elements;

    dropZone.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      
      if (e.dataTransfer?.files) {
        const files = Array.from(e.dataTransfer.files);
        this.handleFileUpload(files);
      }
    });
  }

  private setupCharacterDropZone(): void {
    const { characterDropZone } = this.elements;

    characterDropZone.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      characterDropZone.classList.add('drag-over');
    });

    characterDropZone.addEventListener('dragleave', (e: DragEvent) => {
      e.preventDefault();
      characterDropZone.classList.remove('drag-over');
    });

    characterDropZone.addEventListener('drop', async (e: DragEvent) => {
      e.preventDefault();
      characterDropZone.classList.remove('drag-over');
      
      if (e.dataTransfer?.files.length) {
        const file = e.dataTransfer.files[0];
        await this.handleCharacterFileUpload(file);
      }
    });
  }

  private async handleCharacterFileUpload(file: File): Promise<void> {
    const { characterFileStatus } = this.elements;

    if (!file.name.endsWith('.json')) {
      this.updateStatus(characterFileStatus, 'Please select a JSON file', 'error');
      return;
    }

    this.updateStatus(characterFileStatus, 'Loading character...', '');

    try {
      const content = await file.text();
      let characterData: CharacterData;

      try {
        characterData = JSON.parse(content);
      } catch (parseError) {
        const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (!apiKey) {
          throw new Error('Please set your OpenRouter API key to fix JSON formatting');
        }

        this.updateStatus(characterFileStatus, 'Fixing JSON formatting...', '');
        const response = await apiCall('/api/fix-json', {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey
          },
          body: JSON.stringify({ content })
        });
        characterData = response.character;
      }

      this.populateFormFields(characterData);
      this.updateStatus(characterFileStatus, 'Character loaded successfully', 'success');
    } catch (error) {
      console.error('Character loading error:', error);
      this.updateStatus(characterFileStatus, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }

  private setupButtons(): void {
    const { generateFromPromptBtn, downloadBtn } = this.elements;

    generateFromPromptBtn.addEventListener('click', () => this.handleGenerateFromPrompt());
    downloadBtn.addEventListener('click', () => this.handleDownload());
  }

  private setupFileInputs(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const characterFileInput = document.getElementById('character-file-input') as HTMLInputElement;

    if (fileInput) {
      fileInput.addEventListener('change', (e: Event) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        this.handleFileUpload(files);
      });
    }

    if (characterFileInput) {
      characterFileInput.addEventListener('change', async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          await this.handleCharacterFileUpload(file);
        }
      });
    }
  }

  private setupClientToggleListeners(): void {
    const clientToggles = document.querySelectorAll('.client-toggle');
    clientToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const clientToggle = e.currentTarget as HTMLElement;
        clientToggle.classList.toggle('active');
        
        // Actualizar la lista de clientes seleccionados
        const selectedClients = this.getSelectedClients();
        
        // Actualizar el personaje actual
        const currentCharacter = this.characterService.getCurrentCharacter();
        if (currentCharacter) {
          currentCharacter.clients = selectedClients;
          this.characterService.setCurrentCharacter(currentCharacter);
        }
      });
    });
  }

  private getSelectedClients(): string[] {
    const activeToggles = document.querySelectorAll('.client-toggle.active');
    return Array.from(activeToggles).map(toggle => 
      (toggle as HTMLElement).dataset.client || ''
    ).filter(client => client !== '');
  }

  private updateStatus(element: HTMLElement, message: string, className: string = ''): void {
    element.textContent = message;
    element.className = className;
  }

  private static createElementWithClass(tagName: string, className: string): HTMLElement {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
  }

  static createMessageExample(): HTMLElement {
    const example = this.createElementWithClass('div', 'message-example');
    example.innerHTML = `
      <div class="message-pair">
        <textarea placeholder="Write an example user message..." class="user-message"></textarea>
      </div>
      <div class="message-pair">
        <textarea placeholder="Write the character's response..." class="character-message"></textarea>
      </div>
      <button class="action-button delete-button" title="Remove Example">×</button>
    `;
    
    example.querySelector('.delete-button')?.addEventListener('click', () => {
      example.remove();
    });
    
    return example;
  }

  static createPersonEntry(value: string = ''): HTMLElement {
    const entry = this.createElementWithClass('div', 'person-entry');
    entry.innerHTML = `
      <input type="text" class="person-name" placeholder="Enter person's name" value="${value}">
      <button class="action-button delete-button" title="Remove Person">×</button>
    `;
    
    entry.querySelector('.delete-button')?.addEventListener('click', () => {
      entry.remove();
    });
    
    return entry;
  }

  private async handleGenerateFromPrompt(): Promise<void> {
    const { characterPrompt, modelSelect, promptStatus, generateFromPromptBtn } = this.elements;
    const prompt = characterPrompt.value.trim();
    const selectedModel = modelSelect.value;
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);

    if (!prompt) {
      this.updateStatus(promptStatus, 'Please enter a prompt', 'error');
      return;
    }

    if (!selectedModel) {
      this.updateStatus(promptStatus, 'Please select a model', 'error');
      return;
    }

    if (!apiKey) {
      this.updateStatus(promptStatus, 'Please set your OpenRouter API key', 'error');
      return;
    }

    this.updateStatus(promptStatus, 'Generating character...', '');
    generateFromPromptBtn.disabled = true;

    try {
      const data = await apiCall('/api/generate-character', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ 
          prompt,
          model: selectedModel
        })
      });

      this.populateFormFields(data.character);
      this.updateStatus(promptStatus, 'Character generated successfully', 'success');
    } catch (error) {
      console.error('Generation error:', error);
      this.updateStatus(promptStatus, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      generateFromPromptBtn.disabled = false;
    }
  }

  private handleDownload(): void {
    const currentCharacter = this.characterService.getCurrentCharacter();
    if (!currentCharacter) return;

    const blob = new Blob([JSON.stringify(currentCharacter, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCharacter.name || 'character'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private handleFileUpload(files: File[]): void {
    this.fileService.addFiles(files);
    this.updateFileList(this.fileService.getFiles());
  }

  handleRemoveFile(index: number): void {
    this.fileService.removeFile(index);
    this.updateFileList(this.fileService.getFiles());
  }

  private updateFileList(files: File[]): void {
    const { fileList } = this.elements;
    fileList.innerHTML = files.map((file, index) => `
      <div class="file-item">
        <span class="file-name">${file.name}</span>
        <span class="file-size">${formatFileSize(file.size)}</span>
        <button class="remove-file" onclick="window.removeFile(${index})">×</button>
      </div>
    `).join('');
  }

  /*
  private populateFormFields(data: CharacterData): void {
    const fieldsMapping: Record<string, string | string[]> = {
      'character-name': 'name',
      'model-provider': 'modelProvider',
      'voice-model': ['settings', 'voice', 'model'],
      'bio': 'bio',
      'lore': 'lore',
      'topics': 'topics',
      'style-all': ['style', 'all'],
      'style-chat': ['style', 'chat'],
      'style-post': ['style', 'post'],
      'post-examples': 'postExamples',
      'adjectives': 'adjectives'
    };
  
    Object.entries(fieldsMapping).forEach(([elementId, mappedKey]) => {
      const element = document.getElementById(elementId);
      
      // Manejar elementos de entrada y áreas de texto
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        const value = Array.isArray(mappedKey)
          ? mappedKey.reduce((obj: any, key: string) => obj?.[key], data)
          : data[mappedKey as keyof CharacterData];
  
        if (value !== undefined) {
          // Manejo especial para selects y elementos con múltiples valores
          if (element instanceof HTMLSelectElement && typeof value === 'string') {
            const normalizedValue = value.toLowerCase();
            const matchingOption = Array.from(element.options)
              .find(option => option.value.toLowerCase() === normalizedValue);
  
            if (matchingOption) {
              element.value = matchingOption.value;
            } else {
              const newOption = new Option(value, value);
              element.add(newOption);
              element.value = value;
            }
            
            element.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            // Manejo para otros tipos de elementos
            element.value = Array.isArray(value) ? value.join('\n') : value;
          }
        }
      } 
      // Manejo especial para contenedores de elementos dinámicos
      else if (elementId === 'adjectives-container' && Array.isArray(data.adjectives)) {
        const container = element as HTMLElement;
        container.innerHTML = '';
        
        data.adjectives.forEach(adj => {
          const entryElement = document.createElement('div');
          entryElement.className = 'adjective-entry';
          entryElement.innerHTML = `
            <input type="text" class="adjective-name" value="${adj}">
            <button class="action-button delete-button" title="Remove Adjective">×</button>
          `;
          
          entryElement.querySelector('.delete-button')?.addEventListener('click', () => {
            entryElement.remove();
          });
          
          container.appendChild(entryElement);
        });
      }
    });
  
    // Métodos de actualización existentes
    this.updateClientToggles(data.clients || []);
    this.updateMessageExamples(data.messageExamples || []);
    this.updateKnowledgeDisplay(data.knowledge || []);
  
    this.elements.downloadBtn.disabled = false;
    this.characterService.setCurrentCharacter(data);
  }
  */
  private populateFormFields(data: CharacterData): void {
    // Manejo específico para Model Provider
    const modelProviderSelect = document.getElementById('model-provider') as HTMLSelectElement;
    if (modelProviderSelect && data.modelProvider) {
      const normalizedModelProvider = data.modelProvider.toLowerCase();
      const matchingOption = Array.from(modelProviderSelect.options)
        .find(option => option.value.toLowerCase() === normalizedModelProvider);
  
      if (matchingOption) {
        modelProviderSelect.value = matchingOption.value;
      } else {
        const newOption = new Option(data.modelProvider, data.modelProvider);
        modelProviderSelect.add(newOption);
        modelProviderSelect.value = data.modelProvider;
      }
  
      modelProviderSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  
    const fieldsMapping: Record<string, keyof CharacterData | string[]> = {
      'character-name': 'name',
      'voice-model': ['settings', 'voice', 'model'],
      'bio': 'bio',
      'lore': 'lore',
      'topics': 'topics',
      'style-all': ['style', 'all'],
      'style-chat': ['style', 'chat'],
      'style-post': ['style', 'post'],
      'post-examples': 'postExamples'
    };
  
    Object.keys(fieldsMapping).forEach(elementId => {
      const element = document.getElementById(elementId);
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return;
  
      const mappedKey = fieldsMapping[elementId];
      const value = Array.isArray(mappedKey)
        ? mappedKey.reduce((obj: any, key: string) => obj?.[key], data)
        : data[mappedKey as keyof CharacterData];
  
      if (value !== undefined) {
        element.value = Array.isArray(value) ? value.join('\n') : value;
      }
    });
  
    // Manejo de adjectives
    const adjectivesContainer = document.getElementById('adjectives-container');
    if (adjectivesContainer && data.adjectives && data.adjectives.length > 0) {
      // Limpiar contenedor actual
      adjectivesContainer.innerHTML = '';
      
      // Añadir cada adjetivo
      data.adjectives.forEach(adj => {
        const adjectiveEntry = document.createElement('div');
        adjectiveEntry.className = 'adjective-entry';
        adjectiveEntry.innerHTML = `
          <input type="text" class="adjective-name" value="${adj}">
          <button class="action-button delete-button" title="Remove Adjective">×</button>
        `;
        
        adjectiveEntry.querySelector('.delete-button')?.addEventListener('click', () => {
          adjectiveEntry.remove();
        });
        
        adjectivesContainer.appendChild(adjectiveEntry);
      });
    }
  
    this.updateClientToggles(data.clients || []);
    this.updateMessageExamples(data.messageExamples || []);
    this.updateKnowledgeDisplay(data.knowledge || []);
  
    this.elements.downloadBtn.disabled = false;
    this.characterService.setCurrentCharacter(data);
  }

  private createMessageExample(): HTMLElement {
    const example = document.createElement('div');
    example.className = 'message-example';
    example.innerHTML = `
      <div class="message-pair">
        <textarea placeholder="Write an example user message..." class="user-message"></textarea>
      </div>
      <div class="message-pair">
        <textarea placeholder="Write the character's response..." class="character-message"></textarea>
      </div>
      <button class="action-button delete-button" title="Remove Example">×</button>
    `;
    
    example.querySelector('.delete-button')?.addEventListener('click', () => {
      example.remove();
    });
    
    return example;
  }

  // Ensure these methods are called somewhere
  private updateClientToggles(clients: string[]): void {
    document.querySelectorAll('.client-toggle').forEach(toggle => {
      const client = (toggle as HTMLElement).dataset.client;
      if (client) {
        toggle.classList.toggle('active', clients.includes(client));
      }
    });
  }

  private updateMessageExamples(examples: MessageExample[][]): void {
    const { messageExamplesContainer } = this.elements;
    messageExamplesContainer.innerHTML = '';
    
    if (examples.length === 0) {
      messageExamplesContainer.appendChild(this.createMessageExample()); // Uso con this
      return;
    }
  
    examples.forEach(example => {
      const exampleElement = this.createMessageExample(); // Uso con this
      const userMessage = exampleElement.querySelector('.user-message') as HTMLTextAreaElement;
      const charMessage = exampleElement.querySelector('.character-message') as HTMLTextAreaElement;
      
      if (userMessage && charMessage && example[0] && example[1]) {
        userMessage.value = example[0].content.text;
        charMessage.value = example[1].content.text;
      }
      
      messageExamplesContainer.appendChild(exampleElement);
    });
  }

  private updateKnowledgeDisplay(knowledge: string[]): void {
    const { knowledgeEntries } = this.elements;
    knowledgeEntries.innerHTML = '';
    
    if (knowledge.length === 0) {
      knowledgeEntries.innerHTML = '<div class="no-knowledge">No knowledge entries yet</div>';
      return;
    }

    knowledge.forEach((entry, index) => {
      const entryElement = document.createElement('div');
      entryElement.className = 'knowledge-entry';
      entryElement.innerHTML = `
        <span class="entry-number">${index + 1}.</span>
        <input type="text" class="knowledge-text" value="${entry}">
        <button class="action-button delete-button" title="Remove Knowledge">×</button>
      `;
      
      knowledgeEntries.appendChild(entryElement);
    });
  }

  private async handleRefineCharacter(): Promise<void> {
    const refinePrompt = this.elements.characterPrompt.value.trim();
    const selectedModel = this.elements.modelSelect.value;
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  
    if (!this.characterService.getCurrentCharacter()) {
      this.updateStatus(this.elements.promptStatus, 'No character data to refine. Please generate or load a character first.', 'error');
      return;
    }
  
    if (!refinePrompt) {
      this.updateStatus(this.elements.promptStatus, 'Please enter refinement instructions', 'error');
      return;
    }
  
    if (!selectedModel) {
      this.updateStatus(this.elements.promptStatus, 'Please select a model', 'error');
      return;
    }
  
    if (!apiKey) {
      this.updateStatus(this.elements.promptStatus, 'Please set your OpenRouter API key', 'error');
      return;
    }
  
    this.updateStatus(this.elements.promptStatus, 'Refining character...', '');
    const refineCharacterBtn = document.getElementById('refine-character') as HTMLButtonElement;
    refineCharacterBtn.disabled = true;
  
    try {
      const response = await apiCall('/api/refine-character', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ 
          prompt: refinePrompt,
          model: selectedModel,
          currentCharacter: this.characterService.getCurrentCharacter()
        })
      });
  
      this.populateFormFields(response.character);
      this.updateStatus(this.elements.promptStatus, 'Character refined successfully', 'success');
      this.elements.characterPrompt.value = ''; // Limpiar el prompt de refinamiento
    } catch (error) {
      console.error('Refinement error:', error);
      this.updateStatus(
        this.elements.promptStatus, 
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'error'
      );
    } finally {
      refineCharacterBtn.disabled = false;
    }
  }

  private setupRefinementListener(): void {
    const refineCharacterBtn = document.getElementById('refine-character');
    if (refineCharacterBtn) {
      refineCharacterBtn.addEventListener('click', () => this.handleRefineCharacter());
    }
  }
}

// Global window method for removing files
declare global {
  interface Window {
    removeFile: (index: number) => void;
  }
}
  
window.removeFile = (index: number) => {
  UIService.getInstance().handleRemoveFile(index);
};
