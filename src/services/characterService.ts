// src/services/characterService.ts
import { CharacterData, MessageExample, UIElements } from '../types';

export class CharacterService {
  private static instance: CharacterService | null = null;
  private currentCharacter: CharacterData | null = null;
  private elements: UIElements | null = null;

  static getInstance(): CharacterService {
    if (!CharacterService.instance) {
      CharacterService.instance = new CharacterService();
    }
    return CharacterService.instance;
  }

  private constructor() {}

  setElements(elements: UIElements): void {
    this.elements = elements;
  }

  getCurrentCharacter(): CharacterData | null {
    return this.currentCharacter;
  }

  setCurrentCharacter(character: CharacterData): void {
    this.currentCharacter = character;
  }

  collectCharacterData(knowledge: string[] = []): CharacterData {
    if (!this.elements) {
      throw new Error('UI Elements not initialized in CharacterService');
    }

    const messageExamples = this.collectMessageExamples();
    const adjectives = this.collectAdjectives();
    const people = this.collectPeople();
    const selectedClients = this.getSelectedClients();

    return {
      name: this.getElementValue('character-name'),
      clients: selectedClients,
      modelProvider: this.getElementValue('model-provider'),
      settings: {
        secrets: {},
        voice: {
          model: this.getElementValue('voice-model')
        }
      },
      plugins: [],
      bio: this.splitTextareaContent('bio'),
      lore: this.splitTextareaContent('lore'),
      knowledge: knowledge,
      messageExamples,
      postExamples: this.splitTextareaContent('post-examples'),
      topics: this.splitTextareaContent('topics'),
      style: {
        all: this.splitTextareaContent('style-all'),
        chat: this.splitTextareaContent('style-chat'),
        post: this.splitTextareaContent('style-post')
      },
      adjectives,
      people
    };
  }

  private getElementValue(id: string): string {
    const element = document.getElementById(id);
    if (!element || !(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      console.warn(`Element with id '${id}' not found or is not an input/textarea`);
      return '';
    }
    return element.value;
  }

  private splitTextareaContent(id: string): string[] {
    const content = this.getElementValue(id);
    if (!content) return [];
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  private collectMessageExamples(): MessageExample[][] {
    const container = document.getElementById('message-examples-container');
    if (!container) {
      console.warn('Message examples container not found');
      return [];
    }

    const examples = Array.from(container.querySelectorAll('.message-example'))
      .map(example => this.processMessageExample(example))
      .filter((example): example is MessageExample[] => example !== null);

    return examples;
  }

  private processMessageExample(example: Element): MessageExample[] | null {
    const userMessage = example.querySelector('.user-message') as HTMLTextAreaElement;
    const charMessage = example.querySelector('.character-message') as HTMLTextAreaElement;

    if (!userMessage || !charMessage) {
      console.warn('Message example missing user or character message');
      return null;
    }

    const userText = userMessage.value.trim();
    const charText = charMessage.value.trim();

    if (!userText && !charText) return null;

    return [
      {
        user: '{{user1}}',
        content: { text: userText }
      },
      {
        user: this.getElementValue('character-name') || 'character',
        content: { text: charText }
      }
    ];
  }

  private collectAdjectives(): string[] {
    const container = document.getElementById('adjectives-container');
    if (!container) {
      console.warn('Adjectives container not found');
      return [];
    }

    return Array.from(container.querySelectorAll<HTMLInputElement>('.adjective-name'))
      .map(input => input.value.trim().toLowerCase())
      .filter(adj => adj.length > 0);
  }

  private collectPeople(): string[] {
    const container = document.getElementById('people-container');
    if (!container) {
      console.warn('People container not found');
      return [];
    }

    return Array.from(container.querySelectorAll<HTMLInputElement>('.person-name'))
      .map(input => input.value.trim())
      .filter(name => name.length > 0);
  }

  private getSelectedClients(): string[] {
    const clientToggles = document.querySelectorAll<HTMLElement>('.client-toggle.active');
    return Array.from(clientToggles)
      .map(toggle => toggle.dataset.client || '')
      .filter(client => client.length > 0);
  }
}