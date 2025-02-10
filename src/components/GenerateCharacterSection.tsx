// src/components/GenerateCharacterSection.tsx
import React, { useState } from 'react';

interface GenerateCharacterSectionProps {
  onGenerateCharacter: (prompt: string, model: string, apiKey: string) => Promise<void>;
  onRefineCharacter: (prompt: string, model: string, apiKey: string) => Promise<void>;
}

const GenerateCharacterSection: React.FC<GenerateCharacterSectionProps> = ({
  onGenerateCharacter,
  onRefineCharacter,
}) => {
  const [model, setModel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setStatus('Please enter a prompt');
      return;
    }
    if (!model) {
      setStatus('Please select a model');
      return;
    }
    if (!apiKey) {
      setStatus('Please set your OpenRouter API key');
      return;
    }
    setStatus('Generating character...');
    try {
      await onGenerateCharacter(prompt, model, apiKey);
      setStatus('Character generated successfully');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const handleRefine = async () => {
    if (!prompt.trim()) {
      setStatus('Please enter refinement instructions');
      return;
    }
    if (!model) {
      setStatus('Please select a model');
      return;
    }
    if (!apiKey) {
      setStatus('Please set your OpenRouter API key');
      return;
    }
    setStatus('Refining character...');
    try {
      await onRefineCharacter(prompt, model, apiKey);
      setStatus('Character refined successfully');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <span>Generate Character</span>
        <button className="icon-button help-button" title="Generate a new character using AI by providing a description">
          <i className="fa-solid fa-wand-sparkles"></i>
        </button>
      </div>
      <div className="section-content">
        <div className="form-group">
          <label htmlFor="model-select">AI Model</label>
          <select id="model-select" value={model} onChange={(e) => setModel(e.target.value)}>
            <optgroup label="OpenAI Models">
              <option value="openai/gpt-4-0125-preview">GPT-4 Turbo Preview (0125)</option>
              <option value="openai/gpt-4-1106-preview">GPT-4 Turbo Preview (1106)</option>
              <option value="openai/gpt-4-vision-preview">GPT-4 Vision</option>
              <option value="openai/gpt-4">GPT-4</option>
              <option value="openai/gpt-3.5-turbo-0125">GPT-3.5 Turbo (0125)</option>
              <option value="openai/gpt-3.5-turbo-1106">GPT-3.5 Turbo (1106)</option>
              <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo [FREE]</option>
            </optgroup>
            <optgroup label="Anthropic Models">
              <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
              <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="anthropic/claude-2.1">Claude 2.1</option>
              <option value="anthropic/claude-2">Claude 2</option>
              <option value="anthropic/claude-instant-1.2">Claude Instant 1.2</option>
            </optgroup>
            <optgroup label="Google Models">
              <option value="google/gemini-pro">Gemini Pro [FREE]</option>
              <option value="google/gemini-pro-vision">Gemini Pro Vision</option>
              <option value="google/palm-2">PaLM 2 [FREE]</option>
              <option value="google/palm-2-vision">PaLM 2 Vision</option>
            </optgroup>
            <optgroup label="Meta Models">
              <option value="meta/llama-2-70b-chat">Llama 2 70B Chat [FREE]</option>
              <option value="meta/llama-2-13b-chat">Llama 2 13B Chat [FREE]</option>
              <option value="meta/llama-2-7b-chat">Llama 2 7B Chat [FREE]</option>
            </optgroup>
            <optgroup label="Mistral Models">
              <option value="mistral/mistral-large">Mistral Large</option>
              <option value="mistral/mistral-medium">Mistral Medium</option>
              <option value="mistral/mistral-small">Mistral Small [FREE]</option>
              <option value="mistral/mixtral-8x7b">Mixtral 8x7B [FREE]</option>
            </optgroup>
            <optgroup label="Other Models">
              <option value="perplexity/pplx-70b-online">PPLX 70B Online</option>
              <option value="perplexity/pplx-7b-online">PPLX 7B Online [FREE]</option>
              <option value="perplexity/pplx-70b-chat">PPLX 70B Chat</option>
              <option value="perplexity/pplx-7b-chat">PPLX 7B Chat [FREE]</option>
              <option value="cohere/command">Cohere Command</option>
              <option value="cohere/command-light">Cohere Command Light [FREE]</option>
              <option value="cohere/command-nightly">Cohere Command Nightly</option>
              <option value="cohere/command-light-nightly">Cohere Command Light Nightly [FREE]</option>
            </optgroup>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="api-key">OpenRouter API Key</label>
          <div id="api-key-input" className="input-group" style={{ display: 'flex' }}>
            <input
              type="text"
              id="api-key"
              placeholder="Enter your OpenRouter API key starting with 'sk-' from openrouter.ai"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button id="save-key" className="action-button save-button" title="Save API Key" onClick={() => {/* opcional: guardar en localStorage */}}>
              <i className="fa-solid fa-floppy-disk"></i>
            </button>
          </div>
          {/* Aquí podrías mostrar el estado del API key si es necesario */}
        </div>
        <div className="form-group">
          <label htmlFor="character-prompt">Character Description</label>
          <div className="input-group">
            <textarea
              id="character-prompt"
              placeholder="Describe your character in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            <div className="button-group">
              <button id="generate-from-prompt" className="action-button generate-button" title="Generate from Prompt" onClick={handleGenerate}>
                <i className="fa-solid fa-bolt"></i>
              </button>
              <button id="refine-character" className="action-button generate-button" title="Refine existing character" onClick={handleRefine}>
                <i className="fa-solid fa-wand-sparkles"></i>
              </button>
            </div>
          </div>
          <div id="prompt-status">{status}</div>
        </div>
      </div>
    </section>
  );
};

export default GenerateCharacterSection;
