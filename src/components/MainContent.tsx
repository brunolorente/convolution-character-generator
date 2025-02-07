// src/components/MainContent.tsx
import React from 'react';

const MainContent: React.FC = () => {
  return (
    <div className="main-content">
      {/* SECTION: Basic Information */}
      <section className="section">
        <div className="section-header">
          <span>Basic Information</span>
          <button
            className="icon-button help-button"
            title="Set the character's name, model provider, and voice settings"
          >
            <i className="fa-solid fa-id-card"></i>
          </button>
        </div>
        <div className="section-content">
          <div className="form-group">
            <label htmlFor="character-name">Character Name</label>
            <input
              type="text"
              id="character-name"
              placeholder="Enter the character's full name (e.g., John Smith, Lady Catherine)"
            />
          </div>
          <div className="form-group">
            <label>Available Clients</label>
            <div className="client-toggles">
              <button className="client-toggle" data-client="discord">
                Discord
              </button>
              <button className="client-toggle" data-client="direct">
                Direct
              </button>
              <button className="client-toggle" data-client="twitter">
                Twitter
              </button>
              <button className="client-toggle" data-client="telegram">
                Telegram
              </button>
              <button className="client-toggle" data-client="farcaster">
                Farcaster
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="model-provider">Model Provider</label>
            <select id="model-provider">
              <option value="">Select a provider</option>
              <option value="openai">OpenAI</option>
              <option value="eternalai">EternalAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="grok">Grok</option>
              <option value="groq">Groq</option>
              <option value="llama_cloud">Llama Cloud</option>
              <option value="together">Together</option>
              <option value="llama_local">Llama Local</option>
              <option value="google">Google</option>
              <option value="claude_vertex">Claude Vertex</option>
              <option value="redpill">Redpill</option>
              <option value="openrouter">OpenRouter</option>
              <option value="ollama">Ollama</option>
              <option value="heurist">Heurist</option>
              <option value="galadriel">Galadriel</option>
              <option value="falai">FalAI</option>
              <option value="gaianet">GaiaNet</option>
              <option value="ali_bailian">Ali Bailian</option>
              <option value="volengine">VolEngine</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="voice-model">Voice Model</label>
            <input
              type="text"
              id="voice-model"
              placeholder="Voice synthesis model identifier for text-to-speech"
            />
          </div>
        </div>
      </section>

      {/* Character Details & Style */}
      <CharacterDetailsSection />
      <ExamplesSection />
      <AdjectivesAndPeopleSection />
      <KnowledgeProcessingSection />
      <CharacterResultSection />
    </div>
  );
};

export default MainContent;

/* =========================
   Sub-sections as functions
   ========================= */
function CharacterDetailsSection() {
  return (
    <div className="two-columns">
      <section className="section">
        <div className="section-header">
          <span>Character Details</span>
          <button
            className="icon-button help-button"
            title="Define the character's biography, lore, and areas of knowledge"
          >
            <i className="fa-solid fa-book"></i>
          </button>
        </div>
        <div className="section-content">
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              placeholder="Write the character's biography... One sentence per line."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="lore">Lore</label>
            <textarea
              id="lore"
              placeholder="Describe the character's world, history... One sentence per line."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="topics">Topics</label>
            <textarea
              id="topics"
              placeholder="List topics... One sentence per line."
            ></textarea>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <span>Style</span>
          <button
            className="icon-button help-button"
            title="Set how the character communicates in different contexts"
          >
            <i className="fa-solid fa-pen-fancy"></i>
          </button>
        </div>
        <div className="section-content">
          <div className="form-group">
            <label htmlFor="style-all">General Style</label>
            <textarea
              id="style-all"
              placeholder="Describe how the character communicates in general..."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="style-chat">Chat Style</label>
            <textarea
              id="style-chat"
              placeholder="Describe chat-specific mannerisms..."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="style-post">Post Style</label>
            <textarea
              id="style-post"
              placeholder="Describe how the character writes posts..."
            ></textarea>
          </div>
        </div>
      </section>
    </div>
  );
}

function ExamplesSection() {
  return (
    <section className="section">
      <div className="section-header">
        <span>Examples</span>
        <button
          className="icon-button help-button"
          title="Add example conversations and posts to demonstrate the character's style"
        >
          <i className="fa-solid fa-comments"></i>
        </button>
      </div>
      <div className="section-content">
        <div className="form-group">
          <div className="message-examples-header">
            <label>Message Examples</label>
            <button
              id="add-example"
              className="action-button add-button"
              title="Add Example"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <div id="message-examples-container"></div>
        </div>
        <div className="form-group">
          <label htmlFor="post-examples">Post Examples</label>
          <textarea
            id="post-examples"
            placeholder="Write example posts that demonstrate the character's style..."
          ></textarea>
        </div>
      </div>
    </section>
  );
}

function AdjectivesAndPeopleSection() {
  return (
    <div className="two-columns">
      <section className="section">
        <div className="section-header">
          <span>Adjectives</span>
          <button
            className="icon-button help-button"
            title="Add single-word traits that describe the character"
          >
            <i className="fa-solid fa-tags"></i>
          </button>
        </div>
        <div className="section-content">
          <div className="form-group">
            <div className="adjectives-header">
              <label>Character Adjectives</label>
              <button
                id="add-adjective"
                className="action-button add-button"
                title="Add Adjective"
              >
                +
              </button>
            </div>
            <div id="adjectives-container"></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <span>People</span>
          <button
            className="icon-button help-button"
            title="Add people that the character knows or has relationships with"
          >
            <i className="fa-solid fa-user-group"></i>
          </button>
        </div>
        <div className="section-content">
          <div className="form-group">
            <div className="people-header">
              <label>Known People</label>
              <button
                id="add-person"
                className="action-button add-button"
                title="Add Person"
              >
                +
              </button>
            </div>
            <div id="people-container"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function KnowledgeProcessingSection() {
  return (
    <section className="section">
      <div className="section-header">
        <span>Knowledge Processing</span>
        <button
          className="icon-button help-button"
          title="Add knowledge to the character by uploading files or entering it manually"
        >
          <i className="fa-solid fa-brain"></i>
        </button>
      </div>
      <div className="section-content">
        <div className="drop-zone knowledge-drop-zone" id="drop-zone">
          <div className="drop-zone-content">
            <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
            <p>
              Drag and drop PDF or text files here to add to the character's
              knowledge base
            </p>
            <span className="or-divider">or</span>
            <input
              type="file"
              id="file-input"
              multiple
              style={{ display: 'none' }}
            />
            <button
              id="file-button"
              className="action-button"
              title="Select Knowledge Files"
            >
              <i className="fa-solid fa-folder-open"></i>
            </button>
          </div>
        </div>
        <div id="file-list"></div>
        <div id="processing-status"></div>
        <div className="process-controls">
          <button
            id="process-knowledge"
            className="action-button generate-button"
            title="Process Knowledge Files"
          >
            <i className="fa-solid fa-gears"></i>
          </button>
        </div>
        <div className="knowledge-display">
          <div className="knowledge-header">
            <h3>Knowledge Base</h3>
            <button
              id="add-knowledge"
              className="action-button add-button"
              title="Add Knowledge Entry"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <div id="knowledge-entries" className="knowledge-entries"></div>
        </div>
      </div>
    </section>
  );
}

function CharacterResultSection() {
  return (
    <section className="section">
      <div className="section-header">
        <span>Character Result</span>
        <button
          className="icon-button help-button"
          title="Generate and download the final character JSON"
        >
          <i className="fa-solid fa-code"></i>
        </button>
      </div>
      <div className="section-content">
        <div className="result-controls">
          <button
            id="generate-json"
            className="action-button generate-button"
            title="Generate Character"
          >
            <i className="fa-solid fa-bolt"></i>
          </button>
          <button
            id="download-json"
            className="action-button download-button"
            title="Download JSON"
            disabled
          >
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
        <div id="knowledge-content" className="debug-output"></div>
      </div>
    </section>
  );
}
