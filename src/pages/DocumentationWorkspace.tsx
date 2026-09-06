import React from 'react';
import { TopNavigationBar } from '../components/common/TopNavigationBar';

export const DocumentationWorkspace: React.FC = () => {
  const docFiles = [
    { id: 'DOC-991', name: 'SOP-CDU-Operations.pdf', category: 'Standard Operating Procedures', updated: '2026-08-15', size: '2.4 MB' },
    { id: 'DOC-992', name: 'PID-Desalter-Unit-D101.dwg', category: 'Engineering Drawings', updated: '2026-08-10', size: '15.1 MB' },
    { id: 'DOC-993', name: 'Emergency-Response-Guidelines.pdf', category: 'Safety', updated: '2026-07-22', size: '1.1 MB' },
    { id: 'DOC-994', name: 'API-570-Piping-Inspection.pdf', category: 'Compliance', updated: '2026-09-01', size: '4.8 MB' },
  ];

  return (
    <>
      <TopNavigationBar />
      <div className="min-h-screen bg-[#F8FCF9] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-forest-950">System Documentation</h1>
            <p className="text-sm text-refinery-muted mt-1">Repository of reference documents, P&IDs, SOPs, and compliance materials.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-mint-300 text-forest-900 rounded-lg shadow-sm text-sm font-semibold hover:bg-mint-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-forest-900 text-white rounded-lg shadow-sm text-sm font-semibold hover:bg-forest-950 transition-colors">
              Upload Document
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar / Categories */}
          <div className="col-span-1 space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-forest-900 mb-4">Categories</h3>
            {['All Documents', 'Standard Operating Procedures', 'Engineering Drawings', 'Safety', 'Compliance'].map((cat, idx) => (
              <button key={idx} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${idx === 0 ? 'bg-mint-100 text-forest-950' : 'text-slate-600 hover:bg-mint-50'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Main Document List */}
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-mint-200 overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
                <thead className="bg-mint-50/80 border-b border-mint-200 text-xs font-semibold text-forest-900 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Document Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mint-100 text-sm">
                  {docFiles.map((doc) => (
                    <tr key={doc.id} className="hover:bg-mint-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="p-2 rounded bg-mint-100 text-forest-700">
                            {doc.name.endsWith('.pdf') ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            )}
                          </span>
                          <span className="font-semibold text-forest-950">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{doc.category}</td>
                      <td className="px-6 py-4 text-slate-500">{doc.updated}</td>
                      <td className="px-6 py-4 text-slate-500">{doc.size}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-forest-700 hover:text-forest-900 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
