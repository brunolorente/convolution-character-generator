// src/components/Sidebar.tsx
import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      {/* SECTION: Load Character */}
      <section className="section">
        <div className="section-header">
          <button
            className="icon-button help-button"
            title="Drop or select a character JSON file to load an existing character"
          >
            <i className="fa-solid fa-file-import"></i>
          </button>
          <span>Load Character</span>
        </div>
        <div className="section-content">
          <div className="drop-zone" id="character-drop-zone">
            <div className="drop-zone-content">
              <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
              <p>Drag and drop a character JSON file here</p>
              <span className="or-divider">or</span>
              <input
                type="file"
                id="character-file-input"
                accept=".json"
                style={{ display: 'none' }}
              />
              <button
                id="character-file-button"
                className="action-button"
                title="Select Character File"
              >
                <i className="fa-solid fa-folder-open"></i>
              </button>
            </div>
          </div>
          <div id="character-file-status"></div>

          <div className="backup-management">
            <h3>Saved Backups</h3>
            <div className="backup-controls">
              <input
                type="text"
                id="new-backup-name"
                placeholder="Backup name"
              />
              {/* 
                Tu HTML tenía onclick="window.saveBackup(...)" 
                En React sería onClick={() => window.saveBackup(...)} 
                o mejor un handler real. 
              */}
              <button
                className="primary-button"
              >
                <i className="fa-solid fa-floppy-disk"></i> Save New
              </button>
            </div>
            <div id="backup-list" className="backup-list"></div>
          </div>
        </div>
      </section>

      {/* SECTION: Generate Character */}
      <section className="section">
        <div className="section-header">
          <span>Generate Character</span>
          <button
            className="icon-button help-button"
            title="Generate a new character using AI by providing a description"
          >
            <i className="fa-solid fa-wand-sparkles"></i>
          </button>
        </div>
        <div className="section-content">
          <div className="form-group">
            <label htmlFor="model-select">AI Model</label>
            <select id="model-select">
              <optgroup label="OpenAI Models">
                <option value="openai/gpt-4-0125-preview">
                  GPT-4 Turbo Preview (0125)
                </option>
                <option value="openai/gpt-4-1106-preview">
                  GPT-4 Turbo Preview (1106)
                </option>
                <option value="openai/gpt-4-vision-preview">
                  GPT-4 Vision
                </option>
                <option value="openai/gpt-4">GPT-4</option>
                <option value="openai/gpt-3.5-turbo-0125">
                  GPT-3.5 Turbo (0125)
                </option>
                <option value="openai/gpt-3.5-turbo-1106">
                  GPT-3.5 Turbo (1106)
                </option>
                <option value="openai/gpt-3.5-turbo">
                  GPT-3.5 Turbo [FREE]
                </option>
              </optgroup>
              {/* ... Resto de <optgroup> ... */}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="api-key">OpenRouter API Key</label>
            <div
              id="api-key-input"
              className="input-group"
              style={{ display: 'none' }}
            >
              <input
                type="text"
                id="api-key"
                placeholder="Enter your OpenRouter API key starting with 'sk-' from openrouter.ai"
              />
              <button
                id="save-key"
                className="action-button save-button"
                title="Save API Key"
              >
                <i className="fa-solid fa-floppy-disk"></i>
              </button>
            </div>
            <div id="api-key-status" className="api-key-status">
              <span className="status-text"></span>
              <button
                id="remove-key"
                className="action-button delete-button"
                title="Remove API Key"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="character-prompt">Character Description</label>
            <div className="input-group">
              <textarea
                id="character-prompt"
                placeholder="Describe your character in detail..."
              ></textarea>
              <div className="button-group">
                <button
                  id="generate-from-prompt"
                  className="action-button generate-button"
                  title="Generate from Prompt"
                >
                  <i className="fa-solid fa-bolt"></i>
                </button>
                <button
                  id="refine-character"
                  className="action-button generate-button"
                  title="Refine existing character"
                >
                  <i className="fa-solid fa-wand-sparkles"></i>
                </button>
              </div>
            </div>
            <div id="prompt-status"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
