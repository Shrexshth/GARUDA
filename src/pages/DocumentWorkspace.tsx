import React from 'react';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { DockedInputBar } from '../components/workspace/DockedInputBar';
import { DocumentSidebarBottom, DocumentSidebarContextPill } from '../components/workspace/DocumentSidebarContent';
import { DocumentMainArea } from '../components/workspace/DocumentMainArea';

export const DocumentWorkspace: React.FC = () => {
  return (
    <div className="h-screen flex flex-col font-sans antialiased text-refinery-text zerohash-gradient-bg overflow-hidden select-text">
      <WorkspaceHeader 
        agentName="Document Agent"
        agentRole="Technical Drafter"
      />
      
      <div className="flex-1 flex overflow-hidden">
        <WorkspaceSidebar 
          activeAgentId="document"
          bottomSection={<DocumentSidebarBottom />}
          contextPill={<DocumentSidebarContextPill />}
        />
        
        <main className="flex-1 flex flex-col min-w-0" data-purpose="document-main-area">
          <DocumentMainArea />
          
          <DockedInputBar 
            placeholder="Instruct Document Agent to revise clause, recalculate values, or tag another agent with @..."
            buttonText="Regenerate Clause"
            templateButtonText="Template Clauses"
          />
        </main>
      </div>
    </div>
  );
};
