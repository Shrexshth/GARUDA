import React from 'react';
import { TopNavigationBar } from '../components/common/TopNavigationBar';

export const AuditTrailWorkspace: React.FC = () => {
  const auditLogs = [
    { id: 'AT-1004', time: '10:24 AM IST', agent: 'Reasoning Agent', action: 'Modified Pre-flash Column setpoints based on thermodynamic modeling', status: 'Approved' },
    { id: 'AT-1003', time: '09:12 AM IST', agent: 'Document Agent', action: 'Drafted NFA for Maintenance on E-104A', status: 'Pending Review' },
    { id: 'AT-1002', time: '08:45 AM IST', agent: 'Scan Agent', action: 'Extracted Valve specs from P&ID DWG-4092', status: 'Completed' },
    { id: 'AT-1001', time: '07:30 AM IST', agent: 'Code Agent', action: 'Ran Python enthalpy balances for CDU-1', status: 'Completed' },
  ];

  return (
    <>
      <TopNavigationBar />
      <div className="min-h-screen bg-[#F8FCF9] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-forest-950">System Audit Trail</h1>
            <p className="text-sm text-refinery-muted mt-1">Immutable log of all agent actions, approvals, and system events.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-mint-300 text-forest-900 rounded-lg shadow-sm text-sm font-semibold hover:bg-mint-50 transition-colors">
            Export Logs (CSV)
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-mint-200 overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
            <thead className="bg-mint-50/80 border-b border-mint-200 text-xs font-semibold text-forest-900 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Event ID</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Initiating Agent</th>
                <th className="px-6 py-4">Action Summary</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mint-100 text-sm">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-mint-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-forest-800">{log.id}</td>
                  <td className="px-6 py-4 text-slate-500">{log.time}</td>
                  <td className="px-6 py-4 font-semibold text-forest-950">{log.agent}</td>
                  <td className="px-6 py-4 text-slate-700">{log.action}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      log.status === 'Completed' || log.status === 'Approved' ? 'bg-mint-100 text-forest-800 border-mint-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};
