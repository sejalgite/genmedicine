import React from 'react';
import {
  Pill,
  Search,
  Plus,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Award,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { FormulationDossier } from '../../types';

interface ProductPortfolioViewProps {
  dossiers: FormulationDossier[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  classFilter: string;
  setClassFilter: (c: string) => void;
  filteredDossiers: FormulationDossier[];
  onOpenNewDossier: () => void;
  onShowToast: (msg: string) => void;
}

export const ProductPortfolioView: React.FC<ProductPortfolioViewProps> = ({
  searchQuery,
  setSearchQuery,
  classFilter,
  setClassFilter,
  filteredDossiers,
  onOpenNewDossier,
  onShowToast,
}) => {
  return (
    <div className="space-y-5">
      {/* 3 Clean KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#006398] shadow-xs">
          <div className="flex items-center justify-between text-[#72787f] text-xs font-semibold uppercase">
            <span>Approved Formulations</span>
            <Pill className="w-4 h-4 text-[#006398]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#00334f] font-mono">52 SKUs</span>
            <span className="text-xs text-[#005137] font-semibold">100% In Good Standing</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">FDA Orange Book AB-Rated</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#005137] shadow-xs">
          <div className="flex items-center justify-between text-[#72787f] text-xs font-semibold uppercase">
            <span>Market Substitution Rate</span>
            <TrendingUp className="w-4 h-4 text-[#005137]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#00334f] font-mono">68.4%</span>
            <span className="text-xs text-[#005137] font-semibold">Switching from Innovators</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">Saves patients up to 88% cash</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#00334f] shadow-xs">
          <div className="flex items-center justify-between text-[#72787f] text-xs font-semibold uppercase">
            <span>Network Dispensed Volume</span>
            <Truck className="w-4 h-4 text-[#00334f]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#00334f] font-mono">428,500</span>
            <span className="text-xs text-[#72787f]">Units (30 Days)</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">$1.84M USD Wholesale Gross</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#c1c7cf] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#72787f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search molecule, salt name, NDC or ANDA #..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#f8f9ff] border border-[#c1c7cf] rounded-md focus:outline-none focus:border-[#006398]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-8 text-xs border border-[#c1c7cf] rounded-md bg-[#f8f9ff] px-2.5 text-[#00334f] font-medium"
          >
            <option>All Therapeutic Classes</option>
            <option>Cardiovascular (18)</option>
            <option>Metabolic &amp; Endocrine (14)</option>
            <option>Anti-Infectives (12)</option>
            <option>Respiratory &amp; Oncology (8)</option>
          </select>

          <button
            onClick={onOpenNewDossier}
            className="h-8 px-3.5 bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Dossier</span>
          </button>
        </div>
      </div>

      {/* Formulation Catalog Table */}
      <div className="bg-white border border-[#c1c7cf] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c1c7cf] text-[#41474e] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Molecule &amp; Dosage</th>
                <th className="py-3 px-4">ANDA &amp; NDC Codes</th>
                <th className="py-3 px-4">Reference Listed Drug (RLD)</th>
                <th className="py-3 px-4">Bioequivalence</th>
                <th className="py-3 px-4">Wholesale Pack</th>
                <th className="py-3 px-4">Retail Dispense</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff]">
              {filteredDossiers.map((d) => (
                <tr key={d.id} className="hover:bg-[#f8f9ff] transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#00334f]">{d.molecule}</div>
                    <div className="text-[10px] text-[#72787f]">{d.dosageForm}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-[#006398] font-bold">{d.anda}</div>
                    <div className="text-[10px] text-[#72787f]">{d.ndc}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#0b1c30]">
                    <span className="font-medium">{d.innovatorBrand}</span>
                    <div className="text-[10px] text-[#72787f]">({d.innovatorMfg})</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#003825] font-mono font-bold text-xs">
                      {d.bioequivalenceRating}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[#00334f]">
                    ${d.wholesalePackPrice.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[#005137]">
                    ${d.retailDispensePrice.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onShowToast(`Inspecting FDA Orange Book dossier for ${d.molecule}`)}
                      className="px-2.5 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00334f] rounded font-semibold text-[11px] transition cursor-pointer border border-[#c1c7cf]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-[#c1c7cf] bg-[#f8f9ff] flex items-center justify-between text-xs text-[#72787f]">
          <span>
            Showing <strong className="text-[#00334f]">{filteredDossiers.length}</strong> active formulations
          </span>
          <span className="font-mono text-[11px]">Last Sync: 100% Verified</span>
        </div>
      </div>
    </div>
  );
};
