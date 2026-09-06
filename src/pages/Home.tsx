import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigationBar } from '../components/common/TopNavigationBar';
import { EnterpriseFooter } from '../components/common/EnterpriseFooter';
import { HeroSection } from '../components/home/HeroSection';
import { EnterpriseMetricsStrip } from '../components/home/EnterpriseMetricsStrip';
import { AgentPillarGrid } from '../components/home/AgentPillarGrid';
import { DarkTrustSection } from '../components/home/DarkTrustSection';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRunAgent = (prompt: string) => {
    console.log("Run Agent with prompt:", prompt);
    // Note: We can expand this later to route to a specific agent based on prompt analysis
    // For now, let's just route to the Reasoning Workspace as a default entry point
    navigate('/workspace/reasoning');
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNavigationBar />
      
      <main>
        <HeroSection onSubmitPrompt={handleRunAgent} />
        <EnterpriseMetricsStrip />
        <AgentPillarGrid />
        <DarkTrustSection />
      </main>

      <EnterpriseFooter />
    </div>
  );
};
