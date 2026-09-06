import React from 'react';

interface DockedInputBarProps {
  placeholder: string;
  buttonText: string;
  templateButtonText: string;
}

export const DockedInputBar: React.FC<DockedInputBarProps> = ({
  placeholder,
  buttonText,
  templateButtonText,
}) => {
  return (
    <footer className="flex-none bg-mint-100/90 backdrop-blur-md border-t border-mint-200 p-4 shadow-[0_-4px_16px_rgba(18,53,39,0.03)]" data-purpose="docked-prompt-bar">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Unified Engineering Input Container */}
        <div className="relative rounded-xl border border-mint-300 bg-white shadow-sm focus-within:border-forest-800 focus-within:ring-2 focus-within:ring-mint-500/20 transition-all">
          <textarea className="w-full resize-none border-0 bg-transparent px-4 py-3 text-xs md:text-sm text-forest-950 placeholder:text-slate-400 focus:ring-0 focus:outline-none" placeholder={placeholder} rows={2}></textarea>
          
          {/* Bottom Tools Bar inside Input Box */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-mint-100 bg-mint-50/60 rounded-b-xl">
            {/* Quick Attachment & Tag Tools */}
            <div className="flex items-center gap-1 sm:gap-2 text-refinery-muted">
              {/* Attach File */}
              <button className="p-1.5 rounded-lg hover:bg-mint-100 hover:text-forest-900 transition-colors" title="Attach Engineering Documents (CSV, PDF, DWG)" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
              </button>
              {/* Agent Mention @ */}
              <button className="px-2 py-1 rounded-lg hover:bg-mint-100 hover:text-forest-900 transition-colors flex items-center gap-0.5 text-xs font-bold font-mono" title="Mention Agent (@Code, @Doc, @Vision)" type="button">
                <span className="text-forest-700">@</span>
                <span className="text-[11px] font-semibold hidden sm:inline">Agent</span>
              </button>
              {/* Prompt Templates */}
              <button className="px-2 py-1 rounded-lg hover:bg-mint-100 hover:text-forest-900 transition-colors flex items-center gap-1 text-xs font-medium" title={templateButtonText} type="button">
                <svg className="w-3.5 h-3.5 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span className="text-[11px] hidden sm:inline">{templateButtonText}</span>
              </button>
              <div className="h-3 w-px bg-mint-200 mx-0.5"></div>
              {/* Clear Context Button */}
              <button className="text-[11px] text-refinery-muted hover:text-forest-900 px-1 py-0.5 rounded transition-colors" title="Clear Draft" type="button">
                Clear
              </button>
            </div>
            
            {/* Submit Execution Button */}
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-[0.98]" type="button">
              <span>{buttonText}</span>
              <svg className="w-3.5 h-3.5 text-zerohash-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
