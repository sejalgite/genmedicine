import React, { useState } from 'react';
import {
  Pill,
  ShieldCheck,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Plus,
  FileSpreadsheet,
  Lock,
  RefreshCw,
  Sliders,
  Check,
  X,
  Building2,
} from 'lucide-react';
import { FormulationDossier } from '../types';
import { ProductPortfolioView } from './pharma/ProductPortfolioView';
import { PricingEconomicsView } from './pharma/PricingEconomicsView';
import { MarketSubstitutionView } from './pharma/MarketSubstitutionView';
import { BioequivalenceView } from './pharma/BioequivalenceView';
import { BatchReleaseAuditsView } from './pharma/BatchReleaseAuditsView';
import { AdverseEventSurveillanceView } from './pharma/AdverseEventSurveillanceView';

interface PharmaB2BPortalProps {
  dossiers: FormulationDossier[];
  onSyncToConsumer: () => void;
}

export const PharmaB2BPortal: React.FC<PharmaB2BPortalProps> = ({
  dossiers,
  onSyncToConsumer,
}) => {
  const [activeNav, setActiveNav] = useState('Batch Release Audits'); // Default to Batch Release Audits as in user screenshot
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All Therapeutic Classes');
  const [showNewDossierModal, setShowNewDossierModal] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const filteredDossiers = dossiers.filter((d) => {
    const matchesSearch =
      d.molecule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ndc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.anda.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSync = () => {
    onSyncToConsumer();
    setSyncToast('Canonical dossiers pushed live to consumer discovery index & OpenSearch cluster.');
    setTimeout(() => setSyncToast(null), 4000);
  };

  const navItems = [
    { name: 'Product Portfolio', count: '52', badgeColor: 'bg-[#00334f] text-white' },
    { name: 'Pricing & Economics' },
    { name: 'Market & Substitution' },
    { name: 'Bioequivalence Certs', count: 'AB', badgeColor: 'text-[#003825] font-bold' },
    { name: 'Batch Release Audits', count: 'eBR', badgeColor: 'bg-[#dce9ff] text-[#003825] font-bold' },
    { name: 'Adverse Event Surveillance' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#d3e4fe] selection:text-[#00334f]">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full px-6 h-14 border-b border-[#c1c7cf] bg-white sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-5">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00334f] flex items-center justify-center text-white">
              <Pill className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-[#00334f] tracking-tight">PharmaCore Enterprise Portal</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#eff4ff] rounded border border-[#dce9ff] text-xs text-[#00334f]">
            <span className="font-medium text-[#72787f]">Account:</span>
            <span className="font-bold">Cipla Global Generics B2B</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#005137]"></span>
            <span className="text-[10px] text-[#005137] font-semibold">Authorized</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-white border border-[#c1c7cf] px-2.5 py-1 rounded-md text-xs">
            <Lock className="w-3.5 h-3.5 text-[#005137]" />
            <span className="font-mono text-[#0b1c30]">Tenant Isolation: Box 1</span>
          </div>
          <button
            onClick={handleSync}
            className="h-8 px-3 bg-[#006398] text-white text-xs font-semibold rounded-md hover:bg-[#00334f] flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync to Consumer Index</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {syncToast && (
        <div className="bg-[#00334f] text-white px-6 py-2 text-xs flex items-center justify-between border-b border-[#00263b] shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#85f8c4]" />
            <span>{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-slate-300 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Layout (Side Rail + Workspace) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left SideRail Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-[#c1c7cf] p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <div className="px-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#72787f]">
                Pharma B2B Workspace
              </span>
              <p className="text-xs text-[#00334f] font-bold mt-0.5">Cipla Global Operations</p>
            </div>

            {/* Rail Navigation Tabs */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeNav === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-[#dce9ff] text-[#00334f] font-bold border-l-3 border-[#00334f]'
                        : 'text-[#41474e] font-medium hover:bg-[#eff4ff] hover:text-[#00334f]'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.count && (
                      <span className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Side CTA */}
            <div className="pt-2">
              <button
                onClick={() => setShowNewDossierModal(true)}
                className="w-full h-9 bg-[#00334f] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0c4a6e] transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Dossier</span>
              </button>
            </div>
          </div>

          {/* SideRail Footer */}
          <div className="pt-3 border-t border-[#c1c7cf] text-xs text-[#72787f] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span>cGMP v4.18.2</span>
              <span className="text-[#005137] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005137]"></span>
                Connected
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9ff] p-5 lg:p-6">
          <div className="max-w-[1500px] mx-auto">
            {activeNav === 'Batch Release Audits' && (
              <BatchReleaseAuditsView onShowToast={(msg) => {
                setSyncToast(msg);
                setTimeout(() => setSyncToast(null), 4000);
              }} />
            )}

            {activeNav === 'Product Portfolio' && (
              <ProductPortfolioView
                dossiers={dossiers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                classFilter={classFilter}
                setClassFilter={setClassFilter}
                filteredDossiers={filteredDossiers}
                onOpenNewDossier={() => setShowNewDossierModal(true)}
                onShowToast={(msg) => {
                  setSyncToast(msg);
                  setTimeout(() => setSyncToast(null), 4000);
                }}
              />
            )}

            {activeNav === 'Pricing & Economics' && <PricingEconomicsView />}

            {activeNav === 'Market & Substitution' && <MarketSubstitutionView />}

            {activeNav === 'Bioequivalence Certs' && <BioequivalenceView />}

            {activeNav === 'Adverse Event Surveillance' && <AdverseEventSurveillanceView />}
          </div>
        </main>
      </div>

      {/* New Dossier Modal */}
      {showNewDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c1c7cf] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-[#0b1c30]">
            <div className="flex items-center justify-between border-b border-[#c1c7cf] pb-3">
              <h3 className="text-base font-bold text-[#00334f] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#006398]" />
                Submit New Generic ANDA Dossier
              </h3>
              <button onClick={() => setShowNewDossierModal(false)} className="text-[#72787f] hover:text-[#0b1c30]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowNewDossierModal(false);
                setSyncToast('New formulation dossier submitted to FDA Orange Book validation queue.');
                setTimeout(() => setSyncToast(null), 4000);
              }}
              className="py-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#41474e] mb-1 font-medium">Molecule &amp; Salt Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rosuvastatin Calcium 20mg"
                  className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">National Drug Code (NDC):</label>
                  <input
                    type="text"
                    required
                    placeholder="69097-xxx-xx"
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">ANDA Application #:</label>
                  <input
                    type="text"
                    required
                    placeholder="ANDA #218902"
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">Wholesale Pack Price ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue="8.50"
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">Bioequivalence Rating:</label>
                  <select className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2">
                    <option>AB - Thermodynamically Equivalent</option>
                    <option>AA - Non-Bioequivalence Issue</option>
                    <option>AP - Injectable Aqueous Solution</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c1c7cf]">
                <button
                  type="button"
                  onClick={() => setShowNewDossierModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-[#c1c7cf] bg-white text-xs hover:bg-[#eff4ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold"
                >
                  Submit for Compliance Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
