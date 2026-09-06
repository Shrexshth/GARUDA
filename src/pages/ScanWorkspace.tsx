import React from 'react';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { DockedInputBar } from '../components/workspace/DockedInputBar';
import { ScanSidebarBottom, ScanSidebarContextPill } from '../components/workspace/ScanSidebarContent';
import { ScanMainArea } from '../components/workspace/ScanMainArea';

export const ScanWorkspace: React.FC = () => {
  return (
    <div className="h-screen flex flex-col font-sans antialiased text-refinery-text zerohash-gradient-bg overflow-hidden select-text">
      <WorkspaceHeader 
        agentName="Scan / Vision Agent"
        agentRole="Extractor Engine"
      />
      
      <div className="flex-1 flex overflow-hidden">
        <WorkspaceSidebar 
          activeAgentId="scan"
          bottomSection={<ScanSidebarBottom />}
          contextPill={<ScanSidebarContextPill />}
        />
        
        <main className="flex-1 flex flex-col min-w-0" data-purpose="scan-main-area">
          <ScanMainArea />
          
          <DockedInputBar 
            placeholder="Instruct Vision Agent to extract specific bounding boxes or OCR hand-written logs..."
            buttonText="Extract Data"
            templateButtonText="Extraction Templates"
          />
        </main>
      </div>
    </div>
  );
};
