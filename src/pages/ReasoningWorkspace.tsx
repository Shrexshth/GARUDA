import React from 'react';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { ChatStream } from '../components/workspace/ChatStream';
import { ReasoningSidebarBottom, ReasoningSidebarContextPill } from '../components/workspace/ReasoningSidebarContent';
import { DockedInputBar } from '../components/workspace/DockedInputBar';

export const ReasoningWorkspace: React.FC = () => {
  return (
    <div className="h-screen flex flex-col font-sans antialiased text-refinery-text zerohash-gradient-bg overflow-hidden select-text">
      <WorkspaceHeader 
        agentName="Reasoning Agent"
        agentRole="Generalist Orchestrator"
      />
      
      <div className="flex-1 flex overflow-hidden">
        <WorkspaceSidebar 
          activeAgentId="reasoning"
          bottomSection={<ReasoningSidebarBottom />}
          contextPill={<ReasoningSidebarContextPill />}
        />
        
        <main className="flex-1 flex flex-col min-w-0" data-purpose="chat-main-area">
          <ChatStream />
          <DockedInputBar 
            placeholder="Ask Reasoning Agent, attach P&amp;ID or DCS logs, or tag another agent with @..."
            buttonText="Run Reasoning"
            templateButtonText="Prompt Templates"
          />
        </main>
      </div>
    </div>
  );
};
