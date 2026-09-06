import React from 'react';

export const ScanMainArea: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-32 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_calc(100%-4rem),transparent_100%)]">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white p-6 rounded-xl border border-mint-200 shadow-xs">
          <h2 className="text-lg font-bold text-forest-900 mb-4">Vision Analysis: P&amp;ID D101-C101-REV4</h2>
          
          {/* Empty State / Upload Zone */}
          <div className="bg-mint-50/50 rounded-xl border-2 border-dashed border-mint-200 mb-6 p-12 text-center transition-all hover:bg-mint-50 hover:border-mint-300 cursor-pointer">
            <svg className="w-12 h-12 text-mint-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <h3 className="text-sm font-bold text-forest-900">Upload P&amp;ID or Isometric Diagram</h3>
            <p className="text-xs text-refinery-muted mt-1">Drag and drop your engineering file here, or click to browse.</p>
            <p className="text-[10px] text-mint-500 mt-2 font-mono">Supports: PDF, DXF, PNG, JPEG</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-forest-900 border-b border-mint-100 pb-2">Extracted Data Points</h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-refinery-muted uppercase bg-mint-50/50">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Tag ID</th>
                  <th className="px-4 py-2">Component Type</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-mint-50">
                  <td className="px-4 py-3 font-mono text-forest-800 font-bold">TI-1048</td>
                  <td className="px-4 py-3 text-slate-600">Thermocouple</td>
                  <td className="px-4 py-3 text-slate-600">Overhead Vapor Line</td>
                  <td className="px-4 py-3 text-status-green font-semibold text-xs">Identified</td>
                </tr>
                <tr className="border-b border-mint-50">
                  <td className="px-4 py-3 font-mono text-forest-800 font-bold">FV-205</td>
                  <td className="px-4 py-3 text-slate-600">Flow Control Valve</td>
                  <td className="px-4 py-3 text-slate-600">Reflux Inlet</td>
                  <td className="px-4 py-3 text-status-green font-semibold text-xs">Identified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
