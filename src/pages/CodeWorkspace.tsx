import React from 'react';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { DockedInputBar } from '../components/workspace/DockedInputBar';
import { CodeSidebarBottom, CodeSidebarContextPill } from '../components/workspace/CodeSidebarContent';
import { CodeMainArea } from '../components/workspace/CodeMainArea';

export const CodeWorkspace: React.FC = () => {
  return (
    <div className="h-screen flex flex-col font-sans antialiased text-refinery-text zerohash-gradient-bg overflow-hidden select-text">
      <WorkspaceHeader 
        agentName="Code / Calc Agent"
        agentRole="Deterministic Verifier"
      />
      
      <div className="flex-1 flex overflow-hidden">
        <WorkspaceSidebar 
          activeAgentId="code"
          bottomSection={<CodeSidebarBottom />}
          contextPill={<CodeSidebarContextPill />}
        />
        
        <main className="flex-1 flex flex-col min-w-0" data-purpose="code-main-area">
          <CodeMainArea />
          
          <DockedInputBar 
            placeholder="Write Python code or specify a thermodynamic calculation..."
            buttonText="Run Code"
            templateButtonText="Math Templates"
          />
        </main>
      </div>
    </div>
  );
};
