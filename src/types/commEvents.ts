export interface BootAgentEvent {
    action: AgentRuntimeAction,
    agentId: string,
    apiKey: string,
    llmModel: string,
}

export interface StopAgentEvent {
    action: AgentRuntimeAction,
    llmModel: string,
}

export type AgentRuntimeAction = 'boot' | 'stop'