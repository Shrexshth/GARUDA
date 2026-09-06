import React from 'react';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { DockedInputBar } from '../components/workspace/DockedInputBar';
import { ApprovalSidebarBottom, ApprovalSidebarContextPill } from '../components/workspace/ApprovalSidebarContent';
import { ApprovalMainArea } from '../components/workspace/ApprovalMainArea';

export const ApprovalWorkspace: React.FC = () => {
  return (
    <div className="h-screen flex flex-col font-sans antialiased text-refinery-text zerohash-gradient-bg overflow-hidden select-text">
      <WorkspaceHeader 
        agentName="Approval / Workflow"
        agentRole="Governance Gatekeeper"
      />
      
      <div className="flex-1 flex overflow-hidden">
        <WorkspaceSidebar 
          activeAgentId="approval"
          bottomSection={<ApprovalSidebarBottom />}
          contextPill={<ApprovalSidebarContextPill />}
        />
        
        <main className="flex-1 flex flex-col min-w-0" data-purpose="approval-main-area">
          <ApprovalMainArea />
          
          <DockedInputBar 
            placeholder="Add a comment to this authorization request or tag another agent with @..."
            buttonText="Post Comment"
            templateButtonText="Standard Responses"
          />
        </main>
      </div>
    </div>
  );
};
