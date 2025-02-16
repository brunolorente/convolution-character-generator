// src/components/GenerateCharacterSection.tsx
import React, { useEffect, useState } from 'react';
import { enqueueEvent } from '../services/messageHandler';
import { BootAgentEvent } from '../types/commEvents';
import useMessageListener from '../hooks/useMessageListener';

interface GenerateCharacterSectionProps {
}

const AgentControlsSection: React.FC<GenerateCharacterSectionProps> = () => {
  const [agentStatus, setAgentStatus] = useState<boolean>(false);
  const [interval] = useState(5000); // Intervalo de escucha (en milisegundos)
  const messages = useMessageListener('<FIXME>idUsuario 1</FIXME>', interval);

  const startAgent = () => {
    let eventBody: BootAgentEvent = {
      action: "boot",
      agentId: "<FIXME>agentId</FIXME>",
      apiKey: "<FIXME>apiKey</FIXME>",
      llmModel: "<FIXME>llmModel</FIXME>",
    }
    enqueueEvent(eventBody, eventBody.action, "<FIXME>idUsuario 1</FIXME>", eventBody.agentId);
    setAgentStatus(true)
  }
  const stopAgent = () => {
    setAgentStatus(false)
  }

  useEffect(() => {
    console.log(messages);
  }, [messages])

  return (
    <section className="section" id="generate-character-section">
      <div className="section-header">
        <span>Agent controls</span>
        <button
          className="icon-button help-button"
          title="Control your agent status"
        >
          <i className="fa-solid fa-arrow-trend-up"></i>
        </button>
      </div>
      <div className="section-content">
        <div className="form-group">
            <span>{agentStatus ? 'on' : 'off'}</span>
        </div>
        <div className="form-group">
        {!agentStatus ? (
          <button onClick={startAgent}>
            <i className='fa-solid fa-play'></i>
          </button>
        ) : (
          <button onClick={stopAgent}>
            <i className='fa-solid fa-stop'></i>
          </button>
        )}
        </div>
      </div>
    </section>
  );
};

export default AgentControlsSection;
