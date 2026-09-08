import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Clock, FileText, ExternalLink } from 'lucide-react';

export const BioequivalenceView: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c1c7cf] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#00334f]">FDA Orange Book Bioequivalence Certifications</h2>
          <p className="text-xs text-[#41474e] mt-1">
            Therapeutic equivalence ratings (TE Codes), in-vitro dissolution profile overlays, and ANDA approval dossiers.
          </p>
        </div>
        <span className="px-3 py-1 rounded bg-[#dce9ff] text-[#003825] font-bold text-xs border border-[#a2b5cc] self-start">
          100% AB Rated
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-[#72787f] uppercase">Approved ANDAs</div>
          <div className="text-2xl font-bold text-[#00334f] mt-1">52</div>
          <p className="text-xs text-[#005137] mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Active in US FDA Orange Book
          </p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-[#72787f] uppercase">Mean In-Vitro Dissolution</div>
          <div className="text-2xl font-bold text-[#006398] mt-1">f2 = 68.4</div>
          <p className="text-xs text-[#72787f] mt-1">ICH Q6A compliant (threshold &gt; 50)</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-[#72787f] uppercase">EU-GMP Facility Standing</div>
          <div className="text-2xl font-bold text-[#003825] mt-1">Verified</div>
          <p className="text-xs text-[#72787f] mt-1">Next inspection in 142 days</p>
        </div>
      </div>

      {/* Regulatory Dossier Table */}
      <div className="bg-white border border-[#c1c7cf] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#c1c7cf] bg-[#eff4ff]">
          <h3 className="font-bold text-sm text-[#00334f]">Therapeutic Equivalence Ratings (FDA Orange Book)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#c1c7cf] text-[#41474e] font-semibold bg-[#f8f9ff]">
                <th className="py-2.5 px-4">Molecule / Strength</th>
                <th className="py-2.5 px-4">TE Code</th>
                <th className="py-2.5 px-4">Reference Listed Drug (RLD)</th>
                <th className="py-2.5 px-4">ANDA #</th>
                <th className="py-2.5 px-4">Dissolution Test</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff]">
              {[
                { molecule: 'Atorvastatin Calcium 20mg', te: 'AB', rld: 'Lipitor (Pfizer)', anda: 'ANDA #205912', f2: '68.4', status: 'Approved' },
                { molecule: 'Metformin HCl 500mg ER', te: 'AB', rld: 'Glucophage XR (Merck)', anda: 'ANDA #210449', f2: '71.2', status: 'Approved' },
                { molecule: 'Azithromycin 250mg', te: 'AB', rld: 'Zithromax (Pfizer)', anda: 'ANDA #208115', f2: '64.9', status: 'Approved' },
                { molecule: 'Rosuvastatin Calcium 10mg', te: 'AB', rld: 'Crestor (AstraZeneca)', anda: 'ANDA #214301', f2: '69.0', status: 'Approved' },
                { molecule: 'Amlodipine Besylate 5mg', te: 'AB', rld: 'Norvasc (Pfizer)', anda: 'ANDA #202994', f2: '74.5', status: 'Approved' },
              ].map((row) => (
                <tr key={row.anda} className="hover:bg-[#f8f9ff]">
                  <td className="py-3 px-4 font-bold text-[#00334f]">{row.molecule}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#003825] font-bold font-mono">
                      {row.te}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#41474e]">{row.rld}</td>
                  <td className="py-3 px-4 font-mono text-[#006398]">{row.anda}</td>
                  <td className="py-3 px-4 font-mono text-[#005137]">f2 = {row.f2} (Passed)</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[#005137] font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
