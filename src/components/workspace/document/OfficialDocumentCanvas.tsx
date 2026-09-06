import React from 'react';

export const OfficialDocumentCanvas: React.FC = () => {
  return (
    <div className="lg:col-span-7 space-y-4">
      {/* Visual Official Document Paper */}
      <article className="bg-white border border-mint-200/90 rounded-xl shadow-sm p-6 md:p-8 zerohash-card-glow relative overflow-hidden transition-all text-refinery-text" id="nfa-paper-canvas">
        {/* Watermark Banner Stamp - Moved to relative flow to prevent overlap */}
        <div className="flex justify-end mb-4">
          <div className="px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            AI DRAFT — PENDING ENGINEERING REVIEW
          </div>
        </div>

        {/* Official Document Letterhead */}
        <div className="border-b border-mint-200 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img alt="MRPL Sovereign Crest" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVyjViWOnv-5usepSiwmaCJ8ZyDSkIgeC3VBUJzNRpqvW0HYu6b2cNxrpp45YAS4lBZdW678Nu4gtMt2f2YbpvBurje-NzYlrobzCVBEFkr9c1QVALWxSv8jAxd6AgJ-7JZWzTGEeUKU3bmbB8dhLT6_Ys3a0wf2WGFhNy1XjRZaIlepknDXzsbCuFdRMWwGjPt22PCE8OakCqx5mKnIr2ACIr0Q8y0ocR5amnLRl3N6JkWzR0J5RqcjcnsXoSm7OGEz0" />
              <div>
                <h2 className="text-xs md:text-sm font-extrabold text-forest-950 uppercase tracking-tight">
                  Mangalore Refinery and Petrochemicals Limited
                </h2>
                <p className="text-[10px] uppercase tracking-wider text-forest-800 font-bold mt-0.5">
                  (A Subsidiary of ONGC) • Technical Services Division • Refinery Complex III
                </p>
                <p className="text-[10.5px] font-mono text-refinery-muted mt-0.5">
                  Kuthethoor P.O., Via Katipalla, Mangaluru – 575030, Karnataka, India
                </p>
              </div>
            </div>
            <div className="font-mono text-right text-[11px] text-refinery-muted space-y-0.5 pt-1">
              <div><strong className="text-forest-950">Doc No:</strong> NFA-CDU1-2025-0842</div>
              <div><strong className="text-forest-950">Date:</strong> 28-Feb-2025</div>
              <div><strong className="text-forest-950">Status:</strong> DRAFT (v1.2)</div>
            </div>
          </div>
        </div>

        {/* Sign-Off Authority Header Block Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 bg-mint-50/70 border border-mint-200 rounded-xl mb-5 text-xs">
          <div className="p-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-refinery-muted block">Originator / Prepared By:</span>
            <div className="font-bold text-forest-950 mt-0.5">Rajesh Sharma</div>
            <div className="text-refinery-muted text-[11px]">Lead Process Engineer (CDU/VDU)</div>
            <div className="font-mono text-[10.5px] text-status-verified font-bold mt-1">Status: Authored ✓</div>
          </div>
          <div className="p-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-refinery-muted block">Technical Review:</span>
            <div className="font-bold text-forest-950 mt-0.5">A. K. Verma</div>
            <div className="text-refinery-muted text-[11px]">DGM (Process Engineering)</div>
            <div className="font-mono text-[10.5px] text-blue-700 font-medium mt-1">Assigned for Concurrence</div>
          </div>
          <div className="p-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-refinery-muted block">Approving Authority:</span>
            <div className="font-bold text-forest-950 mt-0.5">S. Narayanan</div>
            <div className="text-refinery-muted text-[11px]">CGM (Refinery Operations)</div>
            <div className="font-mono text-[10.5px] text-refinery-muted mt-1">Pending Submission</div>
          </div>
        </div>

        {/* Document Subject Headline */}
        <div className="mb-5 space-y-1">
          <div className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted">Subject &amp; Purpose</div>
          <div className="p-3 bg-mint-100/70 rounded-xl border border-mint-200 text-xs md:text-sm font-bold text-forest-950 leading-snug">
            NOTE FOR APPROVAL (NFA): Interlock Override &amp; Dynamic DCS Setpoint Readjustment for Pre-flash Column (C-101) Following Crude Feed Transition to Arab Extra Light (AXL).
          </div>
        </div>

        {/* Section 1.0 Executive Summary */}
        <div className="mb-5 space-y-1.5" id="sec-1">
          <h3 className="text-xs md:text-sm font-extrabold text-forest-950 flex items-center gap-2">
            <span className="text-forest-800">1.0</span>
            <span>Executive Summary &amp; Background</span>
          </h3>
          <div className="text-xs md:text-sm text-forest-950 leading-relaxed space-y-2 pl-4 border-l-2 border-mint-300">
            <p>
              During the scheduled transition of Crude Distillation Unit 1 (CDU-1) from Basrah Heavy to Arab Extra Light (AXL) blend on 28-Feb-2025 at 04:15 hrs IST, plant telemetry registered an abrupt <strong className="font-bold text-rose-700 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">12.4°C temperature drop</strong> across the upper section of the Pre-flash Tower (C-101).
            </p>
            <p>
              The Vision Agent verified visual piping alignments from P&amp;ID <code className="font-mono bg-mint-50 px-1.5 py-0.5 rounded border border-mint-200 text-forest-900 font-semibold">MRPL-PID-D101-C101-REV4</code>, identifying that the overhead thermocouple (<code className="font-mono bg-mint-50 px-1.5 py-0.5 rounded border border-mint-200 text-forest-900 font-semibold">TI-1048</code>) exhibited unstable delta fluctuation due to localized sub-cooling caused by higher-than-anticipated light-naphtha boiling fractions.
            </p>
          </div>
        </div>

        {/* Section 2.0 Process Telemetry Table */}
        <div className="mb-5 space-y-2" id="sec-2">
          <h3 className="text-xs md:text-sm font-extrabold text-forest-950 flex items-center gap-2">
            <span className="text-forest-800">2.0</span>
            <span>Observed Process Telemetry &amp; Anomaly Variance</span>
          </h3>
          <div className="rounded-xl overflow-hidden border border-mint-200 shadow-xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-mint-100/80 text-[10.5px] uppercase tracking-wider text-forest-900 font-bold border-b border-mint-200">
                <tr>
                  <th className="px-3.5 py-2">Tag ID</th>
                  <th className="px-3.5 py-2">Description</th>
                  <th className="px-3.5 py-2">Baseline Design</th>
                  <th className="px-3.5 py-2">Observed Real-Time</th>
                  <th className="px-3.5 py-2">Variance</th>
                  <th className="px-3.5 py-2">Audit State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mint-100 text-slate-800 bg-white">
                <tr className="hover:bg-mint-50/60">
                  <td className="px-3.5 py-2 font-bold text-forest-950">TI-1048</td>
                  <td className="px-3.5 py-2 font-sans text-refinery-muted">C-101 Top Tray Temp</td>
                  <td className="px-3.5 py-2">148.5 °C</td>
                  <td className="px-3.5 py-2 font-bold text-rose-700">136.1 °C</td>
                  <td className="px-3.5 py-2 text-rose-700 font-bold">-12.4 °C (-8.3%)</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">Trip Threshold</span>
                  </td>
                </tr>
                <tr className="hover:bg-mint-50/60">
                  <td className="px-3.5 py-2 font-bold text-forest-950">FCV-201</td>
                  <td className="px-3.5 py-2 font-sans text-refinery-muted">Reflux Control Valve</td>
                  <td className="px-3.5 py-2">62.0 %</td>
                  <td className="px-3.5 py-2 font-bold text-amber-700">66.8 %</td>
                  <td className="px-3.5 py-2 text-amber-700 font-bold">+4.8 %</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Over-cooling</span>
                  </td>
                </tr>
                <tr className="hover:bg-mint-50/60">
                  <td className="px-3.5 py-2 font-bold text-forest-950">PI-1042</td>
                  <td className="px-3.5 py-2 font-sans text-refinery-muted">Column Head Pressure</td>
                  <td className="px-3.5 py-2">2.45 kg/cm²</td>
                  <td className="px-3.5 py-2">2.41 kg/cm²</td>
                  <td className="px-3.5 py-2 text-refinery-muted">-0.04 kg/cm²</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded-full bg-mint-100 text-forest-800 font-bold text-[10px]">Nominal</span>
                  </td>
                </tr>
                <tr className="hover:bg-mint-50/60">
                  <td className="px-3.5 py-2 font-bold text-forest-950">E-104A/B</td>
                  <td className="px-3.5 py-2 font-sans text-refinery-muted">Crude Pre-heat Exchangers</td>
                  <td className="px-3.5 py-2">192.0 °C</td>
                  <td className="px-3.5 py-2">188.5 °C</td>
                  <td className="px-3.5 py-2 text-amber-700 font-bold">-3.5 °C</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded-full bg-mint-50 text-forest-800 font-bold text-[10px]">Monitoring</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3.0 Sandboxed REPL Output Block */}
        <div className="mb-5 space-y-2" id="sec-3">
          <h3 className="text-xs md:text-sm font-extrabold text-forest-950 flex items-center gap-2">
            <span className="text-forest-800">3.0</span>
            <span>Thermodynamic Verification &amp; Code Agent REPL Output</span>
          </h3>
          <div className="rounded-xl overflow-hidden border border-zerohash-borderDark bg-zerohash-cardDark text-emerald-100 zerohash-dark-glow">
            <div className="bg-forest-950/90 px-4 py-2 border-b border-zerohash-borderDark flex items-center justify-between font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zerohash-bright"></div>
                <span className="font-bold text-white ml-2">Sandboxed REPL • Apple M2 Max Metal Core (Air-Gapped)</span>
              </div>
              <span className="text-zerohash-accent font-bold">Verification: CONVERGED (0 errors)</span>
            </div>
            <div className="p-3.5 font-mono text-xs space-y-1 text-slate-200">
              <p className="text-refinery-muted font-sans text-[11px]"># Peng-Robinson EOS Equilibrium for AXL Feed Blend</p>
              <p><span className="text-white">ΔH_vaporization</span> = calc_dew_point_enthalpy(T_obs=136.1, P=2.41, api_gravity=39.4)</p>
              <p><span className="text-zerohash-accent font-bold">&gt;&gt;&gt; Result:</span> Enthalpy deficit = <strong className="text-rose-300 underline decoration-rose-400">-41.28 kJ/kg</strong> | VLE condensation margin = <strong className="text-white">+8.4% liquid fallback</strong></p>
              <p className="text-refinery-muted font-sans text-[11px] pt-1"># Safe setpoint adjustment boundary calculation:</p>
              <p><span className="text-white">target_reflux_fcv201</span> = solve_constrained_reflux(target_temp=142.0, min_separation=99.2)</p>
              <p><span className="text-zerohash-accent font-bold">&gt;&gt;&gt; Recommended DCS Setpoint:</span> FCV-201 = <strong className="text-zerohash-bright font-bold">59.5%</strong> (Current: 66.8%, Reduction: -7.3%)</p>
            </div>
          </div>
        </div>

        {/* Section 4.0 Actionable DCS Instructions Table */}
        <div className="mb-5 space-y-2" id="sec-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-extrabold text-forest-950 flex items-center gap-2">
              <span className="text-forest-800">4.0</span>
              <span>Actionable DCS Setpoint Directives</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold border border-amber-200">
              Requires Shift In-Charge Authorization
            </span>
          </div>
          <div className="p-4 rounded-xl bg-mint-50/70 border border-mint-200 space-y-2 text-xs">
            <ol className="list-decimal pl-4 space-y-2 text-forest-950">
              <li>
                <strong>Step 1 (Immediate):</strong> Step down reflux controller <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-mint-200 text-forest-900 font-bold">FIC-201</code> from 66.8% to 62.0% over 10 minutes (ramp rate: 0.5%/min).
              </li>
              <li>
                <strong>Step 2:</strong> Monitor top tray temperature <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-mint-200 text-forest-900 font-bold">TI-1048</code> until recovery to 142.0°C ± 1.5°C is established.
              </li>
              <li>
                <strong>Step 3:</strong> If column delta P exceeds 0.28 kg/cm², align pre-heat bypass valve <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-mint-200 text-forest-900 font-bold">MOV-108</code> as mapped on Isometric Sheet ISO-F101-02.
              </li>
              <li>
                <strong>Step 4:</strong> Re-engage automated cascade loop once crude gravity stabilises above 38.5° API.
              </li>
            </ol>
          </div>
        </div>

        {/* Section 5.0 Delegation of Power (DoP) Justification */}
        <div className="mb-6 space-y-2" id="sec-5">
          <h3 className="text-xs md:text-sm font-extrabold text-forest-950 flex items-center gap-2">
            <span className="text-forest-800">5.0</span>
            <span>Delegation of Power (DoP) Justification &amp; Financial Impact</span>
          </h3>
          <div className="p-4 rounded-xl bg-mint-100/70 border border-mint-200 text-xs md:text-sm text-forest-950 space-y-2.5 leading-relaxed">
            <p>
              Under the provision of <strong>MRPL Delegation of Powers (DoP) Section II-B (Operational Emergencies &amp; Process Interlock Optimization)</strong>, the Chief General Manager (Refinery Operations) in concurrence with DGM (Process) is empowered to approve transient setpoint modifications to avert un-scheduled tower flaring or off-spec heavy naphtha slop disposal.
            </p>
            <div className="flex flex-wrap items-center justify-between pt-1 border-t border-mint-200 font-mono text-xs">
              <span className="font-bold text-forest-950">Avoided Slop Downgrade Value: <strong className="text-status-verified font-bold">₹18.4 Lakhs / day</strong></span>
              <span className="text-refinery-muted text-[11px]">Certified by Refinery Accounting Ledger</span>
            </div>
          </div>
        </div>

        {/* Formal Digital Sign-Off Footer Table */}
        <div className="pt-5 border-t border-mint-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
          <div className="p-3 bg-mint-50/60 rounded-xl border border-mint-200 space-y-1">
            <div className="font-mono text-[10px] text-status-verified font-bold">[Digitally Signed via PIV Key]</div>
            <div className="font-bold text-forest-950 text-xs">Rajesh Sharma</div>
            <div className="text-refinery-muted text-[11px]">Lead Process Engineer (CDU/VDU)</div>
            <div className="text-[10px] text-refinery-muted font-mono">Timestamp: 28-Feb-2025 04:42 IST</div>
          </div>
          <div className="p-3 bg-mint-50/60 rounded-xl border border-mint-200 space-y-1">
            <div className="font-mono text-[10px] text-blue-700 font-bold">[Awaiting Digital Token Signature]</div>
            <div className="font-bold text-forest-950 text-xs">A. K. Verma</div>
            <div className="text-refinery-muted text-[11px]">DGM (Process Engineering)</div>
            <div className="text-[10px] text-refinery-muted font-mono">Status: Pending Concurrence</div>
          </div>
          <div className="p-3 bg-mint-50/60 rounded-xl border border-mint-200 space-y-1">
            <div className="font-mono text-[10px] text-refinery-muted font-bold">[Final Approver in Workflow]</div>
            <div className="font-bold text-forest-950 text-xs">S. Narayanan</div>
            <div className="text-refinery-muted text-[11px]">CGM (Refinery Operations)</div>
            <div className="text-[10px] text-refinery-muted font-mono">DoP Schedule II-B Signatory</div>
          </div>
        </div>
      </article>
    </div>
  );
};
