import React from 'react';

export const CodeMainArea: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#030A07]">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-[#05120D] p-6 rounded-xl border border-[#1F6148] shadow-xs font-mono text-slate-300 text-sm zerohash-dark-glow">
          <div className="flex items-center justify-between border-b border-[#1F6148] pb-2 mb-4">
            <span className="text-[#62B18E] font-bold">Python Sandbox (Air-Gapped)</span>
            <span className="text-xs bg-[#1F6148] px-2 py-1 rounded">Jupyter-Kernel-1</span>
          </div>
          
          <div className="space-y-4">
            {/* Input Cell */}
            <div className="flex">
              <div className="text-[#399572] pr-4 select-none">In [1]:</div>
              <div className="flex-1">
                <pre className="text-blue-300 bg-[#030A07] p-2 rounded border border-[#1F6148]/50">
                  <code>
                    import pandas as pd<br/>
                    import numpy as np<br/>
                    <br/>
                    # Calculate transient setpoint variations based on specific heat capacity<br/>
                    delta_t = 136.0 - 148.0 # TI-1048 variance<br/>
                    cp_naphtha = 2.1 # kJ/kg.K (approx)<br/>
                    mass_flow = 1200 # kg/h<br/>
                    <br/>
                    heat_loss = mass_flow * cp_naphtha * delta_t<br/>
                    print(f"Heat Duty Variation: {'{heat_loss:.2f}'} kJ/h")
                  </code>
                </pre>
              </div>
            </div>
            
            {/* Output Cell */}
            <div className="flex">
              <div className="text-rose-400 pr-4 select-none">Out[1]:</div>
              <div className="flex-1 text-slate-100">
                <pre className="bg-black p-2 rounded border border-[#1F6148]/50">
                  Heat Duty Variation: -30240.00 kJ/h
                </pre>
              </div>
            </div>
            
             {/* Input Cell 2 */}
            <div className="flex mt-6">
              <div className="text-[#399572] pr-4 select-none">In [2]:</div>
              <div className="flex-1">
                <div className="h-6 w-1/2 bg-[#1F6148]/50 rounded animate-pulse"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
