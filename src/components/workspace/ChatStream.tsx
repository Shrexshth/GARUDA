import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ChatStream: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Top Contextual Session Header Bar */}
      <section className="flex-none bg-white/85 backdrop-blur-md border-b border-mint-200 px-6 py-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Session Title & Tags */}
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-sm md:text-base font-extrabold text-forest-950 tracking-tight">
                Crude Assay TBP Curve &amp; Pre-flash Column Operational Strategy
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-mint-100 text-forest-800 border border-mint-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
                Live Session
              </span>
            </div>
            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-refinery-muted font-medium">Target: Pre-flash Tower C-101 top tray temperature balance</span>
            </div>
          </div>

          {/* Session Quick Actions */}
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mint-200 bg-white hover:bg-mint-50/70 text-forest-900 text-xs font-semibold shadow-xs transition-colors" type="button">
              <svg className="w-3.5 h-3.5 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              <span>Save Context</span>
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mint-200 bg-white hover:bg-mint-50/70 text-forest-900 text-xs font-semibold shadow-xs transition-colors" type="button">
              <svg className="w-3.5 h-3.5 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <span>Export Transcript</span>
            </button>
            <button 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-950 text-white text-xs font-semibold shadow-xs hover:shadow transition-all" 
              type="button"
              onClick={() => navigate('/workspace/document')}
            >
              <svg className="w-3.5 h-3.5 text-zerohash-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Share to Document Agent</span>
            </button>
          </div>
        </div>
      </section>

      {/* Scrollable Message Stream */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 space-y-6 [mask-image:linear-gradient(to_bottom,black_calc(100%-4rem),transparent_100%)]" data-purpose="chat-stream">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* USER MESSAGE */}
          <article className="bg-white border border-mint-200/90 rounded-xl p-5 zerohash-card-glow shadow-sm transition-all hover:shadow-md" data-purpose="user-query-card">
            <div className="flex items-start justify-between gap-4 border-b border-mint-100 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-white text-xs font-bold flex items-center justify-center ring-2 ring-mint-200">
                  RS
                </div>
                <div>
                  <div className="text-xs font-bold text-forest-950">Rajesh Sharma <span className="text-refinery-muted font-normal">· Lead Process Engineer (CDU/VDU)</span></div>
                  <div className="text-[11px] text-refinery-muted">10:24 AM IST · Refinery Terminal Station 4B</div>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-mint-50 text-forest-800 border border-mint-200 px-2.5 py-0.5 rounded-full font-medium">Query #MRPL-CDU1-8842</span>
            </div>
            
            {/* Query Text */}
            <p className="text-forest-950 text-sm leading-relaxed font-normal">
              We are observing a <strong className="font-bold text-rose-700 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">12°C temperature drop</strong> across the Pre-flash Tower top tray during the Arab Extra Light crude switch. Check if this correlates with higher light naphtha overhead vapor draw or preheat train fouling at E-104A/B, and recommend immediate DCS setpoint adjustments.
            </p>

            {/* Attachments Chips */}
            <div className="mt-4 pt-3 border-t border-mint-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-refinery-muted">Attached Inputs:</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-mint-50/80 border border-mint-200 text-xs text-forest-900 hover:bg-mint-100 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="font-mono text-[11px] font-medium">MRPL_Assay_AEL_2025.csv</span>
                <span className="text-[10px] text-refinery-muted">(42 KB)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-mint-50/80 border border-mint-200 text-xs text-forest-900 hover:bg-mint-100 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span className="font-mono text-[11px] font-medium">CDU1_DCS_Trend_Log_0428.pdf</span>
                <span className="text-[10px] text-refinery-muted">(1.2 MB)</span>
              </div>
            </div>
          </article>

          {/* AGENT RESPONSE CONTAINER */}
          <article className="bg-white border border-mint-200 rounded-xl p-5 zerohash-card-glow space-y-6 shadow-sm transition-all hover:shadow-md" data-purpose="agent-response-card">
            {/* Agent Header & Model Provenance */}
            <div className="flex items-center justify-between border-b border-mint-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-forest-900 text-zerohash-accent flex items-center justify-center shadow-xs ring-2 ring-mint-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-forest-950">Reasoning Agent</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-mint-100 text-forest-800 border border-mint-300">v3.4-Q8</span>
                    <span className="text-[10px] font-mono text-refinery-muted">Seed #84920</span>
                  </div>
                  <div className="text-[11px] text-refinery-muted">Generalist Orchestrator · Multi-Agent Verification Complete</div>
                </div>
              </div>
              {/* Execution Telemetry */}
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-forest-900 bg-mint-50/90 px-3 py-1 rounded-full border border-mint-200">
                <span>Latency: 412ms</span>
                <span className="text-mint-300">·</span>
                <span className="text-forest-800 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
                  Confidence: 99.4%
                </span>
              </div>
            </div>

            {/* AgentThinkingAccordion */}
            <details className="group bg-mint-50/60 rounded-xl border border-mint-300/80 text-xs overflow-hidden transition-all shadow-xs" open>
              <summary className="flex items-center justify-between p-3.5 font-bold text-forest-950 cursor-pointer select-none hover:bg-mint-100/50 transition-colors">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-forest-900 group-open:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span className="text-forest-900 tracking-tight">Agent Thinking &amp; Multi-Agent Context Resolution</span>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-mint-200/90 text-forest-900 font-semibold border border-mint-300">
                    4 deterministic steps executed
                  </span>
                </div>
                <span className="text-[11px] font-normal text-refinery-muted group-open:hidden">Show execution graph</span>
              </summary>
              
              <div className="px-4 pb-4 pt-1 space-y-2.5 font-mono text-[11.5px] border-t border-mint-200/80 bg-white/70">
                {/* Step 1 */}
                <div className="flex items-start gap-2.5">
                  <span className="text-forest-800 font-bold">Step 1</span>
                  <span className="px-2 py-0.5 rounded bg-mint-100 text-forest-900 text-[10px] uppercase tracking-wider font-bold border border-mint-200">[Tool: Local RAG]</span>
                  <span className="text-forest-950 flex-1 font-sans text-xs">
                    Scanned MRPL CDU-1 Operating Manual Sec 4.2 (<span className="text-forest-900 font-semibold underline decoration-mint-400">Pre-flash Tray Hydroliquid Balance</span>). Extracted standard top tray temperature baseline (<span className="font-mono font-semibold">148°C ± 2°C</span>).
                  </span>
                </div>
                {/* Step 2 */}
                <div className="flex items-start gap-2.5">
                  <span className="text-forest-800 font-bold">Step 2</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] uppercase tracking-wider font-bold border border-blue-200">[Handoff: Code/Calc Agent]</span>
                  <span className="text-forest-950 flex-1 font-sans text-xs">
                    Ran tray vapor-liquid equilibrium (Antoine eq. for C4-C7 fractions). Computed enthalpy delta = <code className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-mono">-41.2 kJ/kg</code> matching the 12°C sensible heat drop.
                  </span>
                </div>
                {/* Step 3 */}
                <div className="flex items-start gap-2.5">
                  <span className="text-forest-800 font-bold">Step 3</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] uppercase tracking-wider font-bold border border-amber-200">[Internal Context]</span>
                  <span className="text-forest-950 flex-1 font-sans text-xs">
                    Cross-referenced E-104A/B exchanger shell-side skin thermocouple history. E-104B skin temp is <span className="text-forest-900 font-bold bg-mint-100/70 px-1 rounded">normal (218°C)</span>; rules out acute fouling as the primary driver.
                  </span>
                </div>
                {/* Step 4 */}
                <div className="flex items-start gap-2.5">
                  <span className="text-forest-800 font-bold">Step 4</span>
                  <span className="px-2 py-0.5 rounded bg-mint-200 text-forest-950 text-[10px] uppercase tracking-wider font-bold border border-mint-300">[Synthesis]</span>
                  <span className="text-forest-950 flex-1 font-sans text-xs">
                    Formulated deterministic mitigation steps strictly governed by Refinery Safety Limit (RSL-08 for Pre-flash Column C-101).
                  </span>
                </div>
              </div>
            </details>

            {/* Synthesized Response Body */}
            <div className="text-forest-950 space-y-4 text-xs md:text-sm leading-relaxed">
              <p>
                Based on thermodynamic modeling of the <strong>Arab Extra Light (AEL)</strong> crude blend assay and historical CDU-1 trend logs, the <strong>12°C temperature drop</strong> at the top tray of Pre-flash Tower (C-101) is primarily caused by <span className="font-semibold text-forest-900 bg-mint-100/80 px-1.5 py-0.5 rounded border border-mint-200">elevated light naphtha vaporization (higher Reid Vapor Pressure ~ 8.2 psi)</span> rather than heat exchanger train fouling.
              </p>

              {/* Zerohash High-Impact Deep Forest-Green Telemetry / Terminal Block */}
              <div className="rounded-xl overflow-hidden my-4 border border-zerohash-borderDark bg-zerohash-cardDark text-emerald-100 zerohash-dark-glow">
                <div className="bg-forest-950/90 px-4 py-2.5 border-b border-zerohash-borderDark flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zerohash-bright"></div>
                    <span className="ml-2 font-mono font-bold text-xs text-white">Pre-flash Column (C-101) Process Delta Matrix</span>
                  </div>
                  <span className="text-[10px] font-mono text-zerohash-accent bg-forest-900/90 px-2 py-0.5 rounded border border-zerohash-borderDark">Live DCS Telemetry vs Design</span>
                </div>
                <div className="overflow-x-auto p-1">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-forest-900/60 text-[11px] text-mint-300 uppercase tracking-wider">
                      <tr>
                        <th className="px-3.5 py-2.5">Parameter Tag</th>
                        <th className="px-3.5 py-2.5">Design Baseline</th>
                        <th className="px-3.5 py-2.5">Current Value</th>
                        <th className="px-3.5 py-2.5">Deviation (Δ)</th>
                        <th className="px-3.5 py-2.5">Safe Envelope</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zerohash-borderDark text-slate-200">
                      <tr className="hover:bg-forest-900/40">
                        <td className="px-3.5 py-2.5 font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                          Column Top Temp (TI-1012)
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-300">148.0 °C</td>
                        <td className="px-3.5 py-2.5 text-rose-400 font-bold">136.0 °C</td>
                        <td className="px-3.5 py-2.5 text-rose-400 font-bold">-12.0 °C</td>
                        <td className="px-3.5 py-2.5 text-rose-300 font-sans font-medium">± 4.0 °C [EXCEEDED]</td>
                      </tr>
                      <tr className="hover:bg-forest-900/40">
                        <td className="px-3.5 py-2.5 font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          Overhead Pressure (PIC-1004)
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-300">2.45 kg/cm²g</td>
                        <td className="px-3.5 py-2.5 text-amber-300">2.58 kg/cm²g</td>
                        <td className="px-3.5 py-2.5 text-amber-300">+0.13 kg/cm²g</td>
                        <td className="px-3.5 py-2.5 text-zerohash-accent font-sans">2.2 – 2.7 kg/cm²g</td>
                      </tr>
                      <tr className="hover:bg-forest-900/40">
                        <td className="px-3.5 py-2.5 font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
                          Top Reflux Flow (FIC-102)
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-300">48.0 m³/hr</td>
                        <td className="px-3.5 py-2.5 text-zerohash-accent">48.2 m³/hr</td>
                        <td className="px-3.5 py-2.5 text-zerohash-accent">+0.2 m³/hr</td>
                        <td className="px-3.5 py-2.5 text-zerohash-accent font-sans">40 – 55 m³/hr</td>
                      </tr>
                      <tr className="hover:bg-forest-900/40">
                        <td className="px-3.5 py-2.5 font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
                          E-104A/B Pressure Drop (DPIT-108)
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-300">1.6 bar</td>
                        <td className="px-3.5 py-2.5 text-amber-300">1.8 bar</td>
                        <td className="px-3.5 py-2.5 text-amber-300">+0.2 bar</td>
                        <td className="px-3.5 py-2.5 text-zerohash-bright font-sans">&lt; 2.2 bar [STABLE]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Root Cause Diagnostics */}
              <div className="space-y-2.5 mt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">Root Cause Identification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-mint-200 bg-mint-50/70 space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-mint-200 text-forest-900 font-extrabold text-xs">1</span>
                      <span className="text-xs font-bold text-forest-950">Elevated Volatile C4/C5 Fraction Slip</span>
                    </div>
                    <p className="text-xs text-refinery-muted leading-normal">
                      Arab Extra Light contains 18.4% volatile fractions below 110°C boiling cut vs 14.1% in previous Arab Medium. The higher latent heat of vaporization absorbs excess sensible heat from tray 1–4, lowering indicated top tray temperatures.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-mint-200 bg-mint-50/70 space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-mint-200 text-forest-900 font-extrabold text-xs">2</span>
                      <span className="text-xs font-bold text-forest-950">Preheat Train Integrity (E-104A/B)</span>
                    </div>
                    <p className="text-xs text-refinery-muted leading-normal">
                      The modest 0.2 bar delta at DPIT-108 confirms that fouling is <strong className="text-forest-800 font-semibold">negligible</strong>. Cleaning or bypass of E-104 train is not currently required.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actionable DCS Adjustments Protocol */}
              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-forest-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Immediate DCS Setpoint Recommendations (Refinery Protocol RSL-08)
                </h4>
                <ol className="list-decimal list-inside text-xs space-y-2 text-forest-950 font-normal pl-0.5">
                  <li className="p-2.5 rounded-xl bg-mint-50 border border-mint-200">
                    <strong>Adjust Top Reflux Flow (FIC-102):</strong> Step down setpoint from <code className="bg-white px-2 py-0.5 rounded border border-mint-300 text-forest-900 font-mono font-bold">48.0 m³/hr → 44.5 m³/hr</code> in 2 equal increments of 1.75 m³/hr spaced 10 minutes apart. This will restore tray sub-cooling equilibrium.
                  </li>
                  <li className="p-2.5 rounded-xl bg-mint-50 border border-mint-200">
                    <strong>Adjust Furnace Bypass Valve (TV-108):</strong> Increase opening by <code className="bg-white px-2 py-0.5 rounded border border-mint-300 text-forest-900 font-mono font-bold">+4%</code> to increase column feed inlet temperature to 235°C without exceeding maximum tube skin threshold (380°C).
                  </li>
                  <li className="p-2.5 rounded-xl bg-mint-50 border border-mint-200">
                    <strong>Overhead Naphtha Stabilizer Trim:</strong> Alert Unit-2 Stabilizer operator for an anticipated 6.5% volumetric surge in wild naphtha rundown rate over the next 45 minutes.
                  </li>
                </ol>
              </div>

              {/* Cross-Agent Handoff CTA Box in Zerohash Mint Card Style */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-mint-100/90 via-mint-50 to-white border border-mint-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    Direct Multi-Agent Next Actions
                  </div>
                  <p className="text-[11px] text-refinery-muted mt-0.5 font-medium">
                    Would you like to draft a formal Shift Handover Note or run enthalpy balances in Python REPL?
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button className="px-3.5 py-2 rounded-lg bg-forest-900 hover:bg-forest-950 text-white text-xs font-bold transition-all whitespace-nowrap shadow-xs hover:shadow flex items-center gap-1.5" type="button">
                    <span>Draft Handover Note (Document Agent)</span>
                    <span className="text-zerohash-accent">→</span>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-mint-50 text-forest-900 border border-mint-300 text-xs font-bold transition-all whitespace-nowrap shadow-xs flex items-center gap-1.5" type="button">
                    <span>Verify Heat Balance (Code/Calc)</span>
                    <span className="text-mint-500">→</span>
                  </button>
                </div>
              </div>

            </div>
          </article>
        </div>
      </div>
    </>
  );
};
