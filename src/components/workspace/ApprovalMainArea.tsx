import React from 'react';

export const ApprovalMainArea: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        <div className="bg-white border-2 border-rose-100 p-8 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-forest-900">Authorization Request</h2>
              <p className="text-sm text-slate-500 font-mono mt-1">REQ-20260905-8422</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Pending Signature
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
            <div>
              <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-bold">Initiated By</p>
              <p className="font-semibold text-forest-900">R. Sharma (Unit-1 Lead)</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-bold">Policy Category</p>
              <p className="font-semibold text-forest-900">DoP Section II-B (Operational Emergencies)</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-bold">Action Requested</p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-1">
                <p className="font-medium text-forest-900 mb-2">Temporary override of Interlock ILK-101A (Desalter Trip)</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Based on AI verification of crude salt content fluctuations, requested to bypass ILK-101A for 4 hours to stabilize mix valve pressure drop and prevent unnecessary unit trip.
                  Demulsifier dosage increase of 10ppm has already been applied.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-mint-50 border border-mint-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <svg className="w-5 h-5 text-status-green mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p className="text-sm font-bold text-forest-900">AI Policy Verification Passed</p>
              <p className="text-xs text-forest-700 mt-1">
                This request complies with MRPL-SOP-CDU1-042 (Page 14, Section 4.2). The condition requires Shift Superintendent approval.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 border-t border-slate-100 pt-6">
            <button className="flex-1 bg-forest-900 hover:bg-forest-950 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              Sign &amp; Approve
            </button>
            <button className="flex-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Reject Request
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
