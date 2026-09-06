import React from 'react';
import { TopNavigationBar } from '../components/common/TopNavigationBar';
import { EnterpriseFooter } from '../components/common/EnterpriseFooter';
import { 
  Play, Settings, MoreVertical, Plus, 
  CheckCircle2, Clock, Zap, Activity,
  FileText, Database, Box
} from 'lucide-react';

// Data for workflows
const workflowsList = [
  { id: 1, name: 'P&ID Data Extraction', status: 'active', type: 'Scheduled', lastRun: '10m ago', successRate: '99.9%' },
  { id: 2, name: 'Thermodynamic Heat Balance', status: 'active', type: 'Manual', lastRun: '2h ago', successRate: '100%' },
  { id: 3, name: 'Shift Handover Report Gen', status: 'paused', type: 'Event', lastRun: '1d ago', successRate: '98.5%' },
  { id: 4, name: 'Safety Incident Triage', status: 'active', type: 'Webhook', lastRun: '5m ago', successRate: '99.1%' },
];

export const WorkflowsDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
       <TopNavigationBar />
       
       <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Page Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
           <div>
             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Automated Workflows</h1>
             <p className="text-sm text-slate-500 mt-1">Orchestrate agents and tools into autonomous pipelines.</p>
           </div>
           <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-forest-900 hover:bg-forest-950 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
             <Plus size={16} />
             <span>Create Workflow</span>
           </button>
         </div>

         {/* Metrics */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Active Workflows" value="12" icon={<Activity className="text-status-green" size={20} />} trend="+2 this week" />
            <MetricCard title="Executions (24h)" value="1,432" icon={<Zap className="text-amber-500" size={20} />} trend="+14% vs yesterday" />
            <MetricCard title="Success Rate" value="99.8%" icon={<CheckCircle2 className="text-status-green" size={20} />} trend="Stable" />
            <MetricCard title="Compute Saved" value="450 hrs" icon={<Clock className="text-blue-500" size={20} />} trend="+45 hrs this week" />
         </div>

         {/* Main Content Split */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Workflow List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[600px]">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Pipelines</h3>
                <Settings size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {workflowsList.map((wf, idx) => (
                  <div key={wf.id} className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-50 ${idx === 0 ? 'bg-mint-50/30' : ''}`}>
                    <div>
                      <div className="flex items-center space-x-2">
                         <h4 className="text-sm font-medium text-slate-900">{wf.name}</h4>
                         {wf.status === 'active' ? (
                           <span className="flex h-2 w-2 rounded-full bg-status-green"></span>
                         ) : (
                           <span className="flex h-2 w-2 rounded-full bg-slate-300"></span>
                         )}
                      </div>
                      <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-500">
                         <span>{wf.type}</span>
                         <span>•</span>
                         <span>Run: {wf.lastRun}</span>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-700">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual Builder Mockup */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-20">
                 <div>
                   <h3 className="font-semibold text-slate-800">P&ID Data Extraction</h3>
                   <p className="text-xs text-slate-500 mt-0.5">Pipeline execution graph</p>
                 </div>
                 <div className="flex space-x-2">
                   <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center space-x-1.5">
                     <Settings size={14} />
                     <span>Configure</span>
                   </button>
                   <button className="px-3 py-1.5 text-xs font-medium text-white bg-forest-900 hover:bg-forest-950 rounded-md transition-colors flex items-center space-x-1.5 shadow-sm">
                     <Play size={14} className="fill-current" />
                     <span>Run Now</span>
                   </button>
                 </div>
               </div>
               
               {/* Canvas Area */}
               <div className="flex-1 bg-slate-50/50 p-8 relative overflow-y-auto flex items-start justify-center">
                 
                 {/* Background Dot Pattern */}
                 <div className="absolute inset-0 dark-dot-matrix opacity-40 pointer-events-none"></div>

                 {/* Pipeline Diagram */}
                 <div className="relative z-10 flex flex-col items-center w-full max-w-lg space-y-6 pt-4 pb-12">
                    
                    {/* Trigger Node */}
                    <div className="w-full relative">
                      <div className="absolute left-1/2 bottom-[-24px] w-0.5 h-6 bg-slate-300 transform -translate-x-1/2"></div>
                      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 flex items-center space-x-4 max-w-xs mx-auto">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                          <Clock className="text-blue-500" size={20} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-slate-800">Schedule Trigger</h5>
                          <p className="text-xs text-slate-500">Runs daily at 00:00</p>
                        </div>
                      </div>
                    </div>

                    {/* Agent Node 1 */}
                    <div className="w-full relative">
                      <div className="absolute left-1/2 bottom-[-24px] w-0.5 h-6 bg-slate-300 transform -translate-x-1/2"></div>
                      <div className="bg-white border border-mint-200 shadow-[0_4px_12px_-2px_rgba(57,149,114,0.1)] rounded-lg p-4 flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_16px_-4px_rgba(57,149,114,0.15)] duration-200 cursor-pointer">
                        <div className="h-10 w-10 rounded-lg bg-mint-50 flex items-center justify-center border border-mint-100 shrink-0">
                          <FileText className="text-status-green" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-semibold text-slate-800">Document Ingestion Agent</h5>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">v1.2</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Extracts raw text and tables from uploaded PDFs.</p>
                        </div>
                      </div>
                    </div>

                    {/* Agent Node 2 */}
                    <div className="w-full relative">
                      <div className="absolute left-1/2 bottom-[-24px] w-0.5 h-6 bg-slate-300 transform -translate-x-1/2"></div>
                      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 flex items-center space-x-4 opacity-95 transition-transform hover:-translate-y-1 hover:shadow-md duration-200 cursor-pointer">
                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0">
                          <Box className="text-purple-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-semibold text-slate-800">Vision Analysis Agent</h5>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Identifies P&ID symbols and equipment tags.</p>
                        </div>
                      </div>
                    </div>

                    {/* Output Node */}
                    <div className="w-full">
                      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 flex items-center space-x-4 max-w-xs mx-auto">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0">
                          <Database className="text-slate-600" size={20} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-slate-800">Update Asset DB</h5>
                          <p className="text-xs text-slate-500">Postgres Write Operation</p>
                        </div>
                      </div>
                    </div>

                 </div>

               </div>
            </div>
         </div>
       </main>
       
       <EnterpriseFooter />
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2 rounded-lg bg-slate-50">
          {icon}
        </div>
      </div>
      <div className="mt-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>
    </div>
    <div className="mt-4 text-xs font-medium text-slate-500">
      {trend}
    </div>
  </div>
);
