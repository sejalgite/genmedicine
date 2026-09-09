import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, FileText, Plus, X } from 'lucide-react';

export const AdverseEventSurveillanceView: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    setToast('MedWatch 3500A direct signal transmitted to FDA FAERS & Pharmacovigilance safety desk.');
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c1c7cf] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#00334f]">Pharmacovigilance &amp; Adverse Event Surveillance</h2>
          <p className="text-xs text-[#41474e] mt-1">
            Real-time telemetry from dispensing retail pharmacies, patient reports, and automated MedWatch 3500A filing rails.
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="h-8 px-3.5 bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Safety Signal (MedWatch)</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-[#eff4ff] border border-[#a2b5cc] text-[#00334f] text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#005137]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="text-xs text-[#72787f] uppercase font-semibold">Critical Safety Alerts</div>
          <div className="text-2xl font-bold text-[#005137] mt-1 font-mono">0 Flags</div>
          <p className="text-xs text-[#72787f] mt-1">Zero Class I / II recalls across all batches</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="text-xs text-[#72787f] uppercase font-semibold">Mild / Self-Resolving Events</div>
          <div className="text-2xl font-bold text-[#00334f] mt-1 font-mono">12 Reports</div>
          <p className="text-xs text-[#72787f] mt-1">Expected known side effects (e.g. GI upset)</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="text-xs text-[#72787f] uppercase font-semibold">FDA 15-Day Alert Compliance</div>
          <div className="text-2xl font-bold text-[#003825] mt-1 font-mono">100%</div>
          <p className="text-xs text-[#72787f] mt-1">Mean filing turnaround: 2.1 days</p>
        </div>
      </div>

      <div className="bg-white border border-[#c1c7cf] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#c1c7cf] bg-[#eff4ff] flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#00334f]">Active Pharmacovigilance Signal Ledger</h3>
          <span className="text-xs text-[#72787f]">FDA FAERS Ingest Pipeline</span>
        </div>
        <div className="divide-y divide-[#e5eeff] text-xs">
          {[
            { id: 'SIG-2026-091', molecule: 'Metformin HCl 500mg ER', event: 'Mild nausea / transient GI distress', source: 'Apollo Care #104 (Dispense Followup)', severity: 'Non-Serious (Expected)', date: 'Today, 08:20 UTC' },
            { id: 'SIG-2026-088', molecule: 'Atorvastatin 20mg', event: 'Mild headache (self-resolving)', source: 'Customer Mobile In-App Check-in', severity: 'Non-Serious (Expected)', date: 'Yesterday, 14:15 UTC' },
            { id: 'SIG-2026-074', molecule: 'Amlodipine Besylate 5mg', event: 'Minor peripheral edema', source: 'Physician MedWatch Direct', severity: 'Monitored', date: 'Sep 05, 2026' },
          ].map((s) => (
            <div key={s.id} className="p-4 hover:bg-[#f8f9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#00334f]">{s.id}</span>
                  <span className="font-semibold text-[#0b1c30]">{s.molecule}</span>
                </div>
                <p className="text-xs text-[#41474e] mt-1">{s.event}</p>
                <div className="text-[11px] text-[#72787f] mt-1">Source: {s.source} • Reported {s.date}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eff4ff] text-[#00334f] border border-[#a2b5cc] self-start sm:self-center">
                {s.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c1c7cf] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#c1c7cf] pb-3">
              <h3 className="font-bold text-base text-[#00334f]">File MedWatch 3500A Signal</h3>
              <button onClick={() => setShowReportModal(false)} className="text-[#72787f] hover:text-[#0b1c30]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#41474e] mb-1 font-medium">Suspect Formulation:</label>
                <select className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-medium">
                  <option>Atorvastatin Calcium 20mg (Film-Coated Tablet)</option>
                  <option>Metformin Hydrochloride 500mg ER</option>
                  <option>Azithromycin Monohydrate 250mg</option>
                  <option>Rosuvastatin Calcium 10mg</option>
                  <option>Amlodipine Besylate 5mg</option>
                </select>
              </div>
              <div>
                <label className="block text-[#41474e] mb-1 font-medium">Adverse Event Description:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe patient reaction, onset latency, and resolution..."
                  className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg p-3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#c1c7cf]">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-[#c1c7cf] bg-white text-xs hover:bg-[#eff4ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold"
                >
                  Submit to FDA FAERS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
