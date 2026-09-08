import React, { useState } from 'react';
import {
  Pill,
  ShieldCheck,
  Search,
  CloudDownload,
  CheckCircle2,
  Bell,
  Shield,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Truck,
  Award,
  Layers,
  Sparkles,
  Edit,
  Upload,
  ChevronRight,
  Plus,
  FileSpreadsheet,
  Lock,
  RefreshCw,
  Sliders,
  Check,
  X,
} from 'lucide-react';
import { FormulationDossier } from '../types';

interface PharmaB2BPortalProps {
  dossiers: FormulationDossier[];
  onSyncToConsumer: () => void;
}

export const PharmaB2BPortal: React.FC<PharmaB2BPortalProps> = ({
  dossiers,
  onSyncToConsumer,
}) => {
  const [activeNav, setActiveNav] = useState('Product Portfolio');
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All Therapeutic Classes');
  const [showNewDossierModal, setShowNewDossierModal] = useState(false);
  const [wholesalePriceDelta, setWholesalePriceDelta] = useState(-0.3);
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

          {/* Tenant Switcher & Isolation Schema Tag */}
          <div className="hidden lg:flex items-center gap-1.5 border border-[#c1c7cf] rounded-md px-2 py-1 bg-[#eff4ff]">
            <span className="h-2 w-2 rounded-full bg-[#005137] animate-pulse"></span>
            <span className="text-xs text-[#00334f] font-semibold">Cipla Global Therapeutics</span>
            <span className="text-[10px] text-[#41474e] font-mono px-1 py-0.5 bg-white rounded border border-[#c1c7cf]">
              cpl_tenant_prod
            </span>
          </div>

          {/* Compliance Verification Badge */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#68dba9] bg-[#eff4ff] text-[#003825]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#005137]" />
            <span className="text-[11px] font-semibold tracking-wider">WHO-GMP &amp; US-FDA Certified</span>
          </div>

          {/* Search Bar */}
          <div className="relative w-64 lg:w-72">
            <Search className="w-4 h-4 absolute left-2.5 top-2 text-[#72787f]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-12 text-xs bg-white border border-[#c1c7cf] rounded-md focus:outline-none focus:border-[#006398] focus:ring-1 focus:ring-[#006398]"
              placeholder="Search SKU, NDC #, ANDA..."
              type="text"
            />
            <span className="absolute right-2 top-1.5 text-[10px] font-mono text-[#72787f] border border-[#c1c7cf] px-1 rounded bg-[#eff4ff]">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Navigation Controls & Trailing Profile Cluster */}
        <div className="flex items-center gap-3">
          <nav className="hidden 2xl:flex items-center gap-4 text-xs">
            <button className="border-b-2 border-[#00334f] text-[#00334f] font-semibold pb-1">Portfolio</button>
            <button className="text-[#41474e] font-medium hover:text-[#0b1c30]">Pricing &amp; Economics</button>
            <button className="text-[#41474e] font-medium hover:text-[#0b1c30]">Market Analytics</button>
            <button className="text-[#41474e] font-medium hover:text-[#0b1c30]">Compliance</button>
            <button className="text-[#41474e] font-medium hover:text-[#0b1c30]">Audits</button>
          </nav>

          <div className="h-4 w-px bg-[#c1c7cf] hidden 2xl:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting full regulatory telemetry package (eCTD JSON / CSV)...')}
              className="h-8 px-2.5 bg-white border border-[#c1c7cf] text-[#0b1c30] text-xs font-semibold rounded-md hover:bg-[#eff4ff] flex items-center gap-1 cursor-pointer"
            >
              <CloudDownload className="w-3.5 h-3.5" />
              Export Telemetry
            </button>
            <button
              onClick={handleSync}
              className="h-8 px-2.5 bg-[#0c4a6e] text-white text-xs font-semibold rounded-md border border-[#006398] hover:bg-[#00334f] flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Batch Release
            </button>
          </div>

          <div className="flex items-center gap-1 text-[#41474e]">
            <button className="w-8 h-8 rounded hover:bg-[#e5eeff] flex items-center justify-center" aria-label="Notifications">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded hover:bg-[#e5eeff] flex items-center justify-center" aria-label="Security">
              <Shield className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded hover:bg-[#e5eeff] flex items-center justify-center" aria-label="Help">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Section with Hotlinked Headshot */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#c1c7cf]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold leading-tight text-[#0b1c30]">Dr. Aris Thorne</p>
              <p className="text-[10px] text-[#72787f]">VP Commercial &amp; Reg Affairs</p>
            </div>
            <div className="relative w-8 h-8 rounded-full border border-[#c1c7cf] overflow-hidden bg-[#dce9ff] flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                alt="Dr. Aris Thorne"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjqiX6gS0KXrIbfRQZ8AQQkapKckRVKUKUtBNX0CPRNonoRxacnAPJPpu2f2OFQEcj0urCeCpM4COb7cCg2_BKF9GdScgdQu5_lc3hoxWYA75otw5qHIVtLiPjB5cSJz8du21P8eCGaUFPzrnr1W4J9u5Hq4CgazjO6izkCfNR6zyYQEUQ1DIRZ1YxBK4QJy5d632oj1RKioT3f0EVcJr1NwDfeQ6InjWAxnwopO8EbJ04vbeVoTLTsg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sync Banner if triggered */}
      {syncToast && (
        <div className="bg-[#005137] text-white px-6 py-2 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#85f8c4]" />
            <span>{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-[#85f8c4] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Application Shell Layout (Persistent Left Rail + Canvas Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Persistent Admin SideNav */}
        <aside className="hidden md:flex flex-col justify-between w-64 border-r border-[#c1c7cf] bg-[#f8f9ff] p-2 shrink-0">
          <div>
            {/* Tenant Info Header */}
            <div className="px-3 py-2 mb-2 rounded-lg bg-white border border-[#c1c7cf] flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0c4a6e] text-white flex items-center justify-center font-bold text-sm">
                CP
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xs font-bold text-[#00334f] truncate">Cipla Global API</h2>
                <p className="text-[10px] font-mono text-[#72787f] truncate">Tenant ID: CPL-IND-8842</p>
              </div>
            </div>

            {/* Rail Navigation Tabs */}
            <nav className="space-y-1">
              {[
                { name: 'Product Portfolio', count: '52', badgeColor: 'bg-[#00334f] text-white' },
                { name: 'Pricing & Economics' },
                { name: 'Market & Substitution' },
                { name: 'Bioequivalence Certs', count: 'AB', badgeColor: 'text-[#003825] font-bold' },
                { name: 'Batch Release Audits' },
                { name: 'Adverse Event Surveillance' },
              ].map((item) => {
                const isActive = activeNav === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-[#dce9ff] text-[#00334f] font-semibold border-l-2 border-[#00334f]'
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

            {/* Quick CTA inside SideRail */}
            <div className="mt-5 px-1">
              <button
                onClick={() => setShowNewDossierModal(true)}
                className="w-full h-9 bg-[#00334f] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0c4a6e] transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Dossier
              </button>
            </div>
          </div>

          {/* SideRail Footer Utility Tabs */}
          <div className="pt-2 border-t border-[#c1c7cf] space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-1 text-xs text-[#41474e] hover:bg-[#eff4ff] rounded cursor-pointer">
              <Sliders className="w-3.5 h-3.5" />
              <span>Tenant Isolation Config</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-1 text-xs text-[#41474e] hover:bg-[#eff4ff] rounded cursor-pointer">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Regulatory Telemetry</span>
            </button>
            <div className="px-3 py-1 text-[10px] text-[#72787f] font-mono flex justify-between items-center">
              <span>v4.18.2-cGMP</span>
              <span className="flex items-center gap-1 text-[#003825]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#68dba9]"></span>
                Sync Live
              </span>
            </div>
          </div>
        </aside>

        {/* Main Dynamic Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9ff] p-5">
          <div className="max-w-[1600px] mx-auto space-y-5">
            {/* Header Context Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#c1c7cf] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#00334f] tracking-tight">Medicine Company B2B Portal</h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#00334f] border border-[#c1c7cf] text-xs font-medium">
                    SaaS Partition: Box 1
                  </span>
                </div>
                <p className="text-xs text-[#41474e] mt-1">
                  Active SKU catalog, wholesale-to-consumer pharmacy margin modeling, and real-time FDA Orange Book bioequivalence governance.
                </p>
              </div>

              {/* Utility Buttons */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                <div className="flex items-center gap-1 bg-white border border-[#c1c7cf] px-2.5 py-1 rounded-md text-xs">
                  <Lock className="w-3.5 h-3.5 text-[#005137]" />
                  <span className="font-mono text-[#0b1c30]">Row-Level Security: Active</span>
                </div>
                <button
                  onClick={() => alert('Opening Wholesale Pricing Matrix Configuration...')}
                  className="h-8 px-3 bg-white border border-[#c1c7cf] text-[#0b1c30] text-xs font-semibold rounded-md hover:bg-[#eff4ff] flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Pricing Matrix Config
                </button>
                <button
                  onClick={handleSync}
                  className="h-8 px-3 bg-[#006398] text-white text-xs font-semibold rounded-md hover:bg-[#00334f] flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync to Consumer Index
                </button>
              </div>
            </div>

            {/* 1. Executive KPI Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {/* Metric 1 */}
              <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#006398] shadow-xs">
                <div className="flex items-center justify-between text-[#41474e] mb-1">
                  <span className="text-[11px] tracking-wider uppercase text-[#72787f] font-semibold">Active Generic SKUs</span>
                  <Pill className="w-4 h-4 text-[#006398]" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#00334f] tabular-nums">52</span>
                  <span className="text-xs text-[#41474e] font-medium">Approved Formulations</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#003825]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#005137]" />
                  <span>100% Catalogue Synced (0 Stale Listings)</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#005137] shadow-xs">
                <div className="flex items-center justify-between text-[#41474e] mb-1">
                  <span className="text-[11px] tracking-wider uppercase text-[#72787f] font-semibold">Market Substitution Share</span>
                  <TrendingUp className="w-4 h-4 text-[#005137]" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#00334f] tabular-nums">68.4%</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#dce9ff] text-[#00334f] text-[11px] font-semibold tabular-nums">
                    +5.1% MoM
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-[#41474e]">
                  Across 1.2M monthly genmedicine consumer queries
                </p>
              </div>

              {/* Metric 3 */}
              <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#0c4a6e] shadow-xs">
                <div className="flex items-center justify-between text-[#41474e] mb-1">
                  <span className="text-[11px] tracking-wider uppercase text-[#72787f] font-semibold">Network Dispensed Units</span>
                  <Truck className="w-4 h-4 text-[#0c4a6e]" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#00334f] tabular-nums">428,500</span>
                  <span className="text-xs text-[#41474e]">Units</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#41474e]">Gross B2B Wholesale:</span>
                  <span className="font-bold text-[#00334f] tabular-nums font-mono">$1.84M USD</span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#5bb8fe] shadow-xs">
                <div className="flex items-center justify-between text-[#41474e] mb-1">
                  <span className="text-[11px] tracking-wider uppercase text-[#72787f] font-semibold">Bioequivalence Integrity</span>
                  <Award className="w-4 h-4 text-[#006398]" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#005137] tabular-nums">99.8%</span>
                  <span className="text-xs text-[#003825] font-semibold">FDA Orange Book</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#72787f]">
                  <span className="h-2 w-2 rounded-full bg-[#005137]"></span>
                  <span>All 52 formulation stability protocols active</span>
                </div>
              </div>
            </section>

            {/* 2. Innovator Substitution & Market Demand Analytics (Bento Layout) */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Left 2 Cols: Substitution Capture Matrix */}
              <div className="xl:col-span-2 bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#c1c7cf]">
                  <div>
                    <h3 className="text-base font-bold text-[#00334f]">Innovator Displacement &amp; Consumer Switching</h3>
                    <p className="text-xs text-[#41474e]">Real-time genmedicine search comparison conversion against brand-name innovators</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-2">
                    <span className="text-xs text-[#72787f]">Timeframe:</span>
                    <select className="h-8 text-xs border border-[#c1c7cf] rounded bg-[#f8f9ff] px-2">
                      <option>Last 30 Days (Rolling)</option>
                      <option>Current Quarter (Q3 2026)</option>
                      <option>Year-to-Date</option>
                    </select>
                  </div>
                </div>

                {/* Comparison Cards List */}
                <div className="space-y-2.5">
                  {/* Item 1 */}
                  <div className="p-3 border border-[#c1c7cf] rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#00334f] font-bold">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#00334f]">Cipla Atorvastatin 20mg</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d3e4fe] text-[#41474e]">Cardiovascular</span>
                          </div>
                          <p className="text-xs text-[#72787f]">Displacing: <span className="text-[#0b1c30] font-medium">Pfizer Lipitor® 20mg Oral</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="text-base font-bold text-[#003825] tabular-nums">$14.20</div>
                          <div className="text-xs text-[#72787f] line-through tabular-nums">Pfizer: $42.50</div>
                        </div>
                        <div className="w-36">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-[#00334f]">66% Switch Rate</span>
                            <span className="text-[#72787f] tabular-nums">142k/mo</span>
                          </div>
                          <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                            <div className="h-full bg-[#006398]" style={{ width: '66%' }}></div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert('Inspecting Lipitor displacement telemetry: 142k monthly switches.')}
                          className="h-8 px-2.5 border border-[#c1c7cf] text-[#41474e] hover:text-[#00334f] rounded text-xs font-medium cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 border border-[#c1c7cf] rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#00334f] font-bold">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#00334f]">Cipla Metformin 500mg ER</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d3e4fe] text-[#41474e]">Metabolic &amp; Endocrine</span>
                          </div>
                          <p className="text-xs text-[#72787f]">Displacing: <span className="text-[#0b1c30] font-medium">Merck Glucophage® 500mg</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="text-base font-bold text-[#003825] tabular-nums">$4.80</div>
                          <div className="text-xs text-[#72787f] line-through tabular-nums">Innovator: $11.50</div>
                        </div>
                        <div className="w-36">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-[#00334f]">74% Switch Rate</span>
                            <span className="text-[#72787f] tabular-nums">185k/mo</span>
                          </div>
                          <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                            <div className="h-full bg-[#006398]" style={{ width: '74%' }}></div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert('Inspecting Glucophage displacement telemetry.')}
                          className="h-8 px-2.5 border border-[#c1c7cf] text-[#41474e] hover:text-[#00334f] rounded text-xs font-medium cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 border border-[#c1c7cf] rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#00334f] font-bold">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#00334f]">Cipla Azithromycin 500mg</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d3e4fe] text-[#41474e]">Anti-Infective</span>
                          </div>
                          <p className="text-xs text-[#72787f]">Displacing: <span className="text-[#0b1c30] font-medium">Pfizer Zithromax® Z-Pak</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="text-base font-bold text-[#003825] tabular-nums">$8.40</div>
                          <div className="text-xs text-[#72787f] line-through tabular-nums">Innovator: $28.00</div>
                        </div>
                        <div className="w-36">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-[#00334f]">61% Switch Rate</span>
                            <span className="text-[#72787f] tabular-nums">98k/mo</span>
                          </div>
                          <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                            <div className="h-full bg-[#006398]" style={{ width: '61%' }}></div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert('Inspecting Zithromax displacement telemetry.')}
                          className="h-8 px-2.5 border border-[#c1c7cf] text-[#41474e] hover:text-[#00334f] rounded text-xs font-medium cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 1 Col: B2B Pricing Elasticity Simulator */}
              <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#c1c7cf]">
                    <h3 className="text-base font-bold text-[#00334f]">Ranking Algorithm Elasticity</h3>
                    <Sparkles className="w-4 h-4 text-[#72787f]" />
                  </div>
                  <p className="text-xs text-[#41474e] mt-2">
                    Simulate B2B wholesale pricing changes to analyze predicted top-of-ranking placement in consumer drug searches.
                  </p>

                  {/* Interactive Wholesale Margin Adjuster */}
                  <div className="mt-3 p-3 bg-[#f8f9ff] rounded-lg border border-[#c1c7cf] space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#72787f]">Wholesale Pack Price Adjustment:</span>
                      <span className="font-mono text-[#00334f] font-bold">
                        {wholesalePriceDelta > 0 ? `+$${wholesalePriceDelta.toFixed(2)}` : `-$${Math.abs(wholesalePriceDelta).toFixed(2)}`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-1.50"
                      max="1.50"
                      step="0.10"
                      value={wholesalePriceDelta}
                      onChange={(e) => setWholesalePriceDelta(parseFloat(e.target.value))}
                      className="w-full accent-[#006398] cursor-pointer"
                    />

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-[#c1c7cf]">
                      <span className="text-[#72787f]">Target Wholesale Margin:</span>
                      <span className="font-mono text-[#00334f] font-bold">
                        {(34.5 + wholesalePriceDelta * 3).toFixed(1)}% (${(3.28 + wholesalePriceDelta).toFixed(2)}/pack)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#72787f]">Pharmacy Acquisition Cost:</span>
                      <span className="font-mono text-[#00334f] font-bold">
                        ${(9.8 + wholesalePriceDelta).toFixed(2)} / 30-day unit
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#72787f]">Algorithm Placement Index:</span>
                      <span className="px-2 py-0.5 rounded bg-[#68dba9] text-[#003825] font-bold text-[11px]">
                        #1 Lowest Cost Bioequivalent
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Callout */}
                  <div className="mt-3 p-3 bg-[#eff4ff] border border-[#dce9ff] rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-[#006398] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-[#00334f]">Pricing Optimization Insight</span>
                        <p className="text-xs text-[#41474e] mt-0.5">
                          Decreasing Wholesale Pack price for <strong className="text-[#0b1c30]">Atorvastatin</strong> by{' '}
                          <span className="text-[#003825] font-semibold">-$0.30</span> triggers top tier priority across 32 regional retail pharmacy chains, projected to unlock{' '}
                          <strong className="text-[#0b1c30]">+18,400 units/mo</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert('Full Monte Carlo Elasticity Simulator invoked across 52 active SKUs.')}
                  className="mt-4 w-full h-9 bg-white border border-[#006398] text-[#006398] hover:bg-[#e5eeff] text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  Launch Full Elasticity Simulator
                </button>
              </div>
            </section>

            {/* 3. Canonical Product Portfolio & Drug Dossier Table + Regulatory release side panel */}
            <section className="grid grid-cols-1 2xl:grid-cols-4 gap-5">
              {/* Left 3 Columns: High Density Portfolio Table */}
              <div className="2xl:col-span-3 bg-white border border-[#c1c7cf] rounded-xl shadow-xs overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[#c1c7cf] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                  <div>
                    <h3 className="text-base font-bold text-[#00334f]">Canonical Generic Formulation Catalog</h3>
                    <p className="text-xs text-[#41474e]">Validated dossiers under Cipla Global API Tenant partition (FDA Orange Book Bioequivalent)</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                      className="h-8 text-xs border border-[#c1c7cf] rounded-md bg-[#f8f9ff] px-2 cursor-pointer"
                    >
                      <option>All Therapeutic Classes</option>
                      <option>Cardiovascular (18)</option>
                      <option>Metabolic &amp; Endocrine (14)</option>
                      <option>Anti-Infectives (12)</option>
                      <option>Respiratory &amp; Oncology (8)</option>
                    </select>
                    <select className="h-8 text-xs border border-[#c1c7cf] rounded-md bg-[#f8f9ff] px-2 cursor-pointer">
                      <option>Schedule: All</option>
                      <option>Rx Only</option>
                      <option>Schedule H</option>
                      <option>OTC Generic</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f8f9ff] border-b border-[#c1c7cf] text-[#72787f] uppercase text-[11px] font-semibold">
                        <th className="py-2.5 px-4">Molecule &amp; National Code</th>
                        <th className="py-2.5 px-4">RLD Reference</th>
                        <th className="py-2.5 px-4">B2B Wholesale / Dispense</th>
                        <th className="py-2.5 px-4">Active Batch SLA</th>
                        <th className="py-2.5 px-4">Regulatory Clearance</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eff4ff] text-xs">
                      {filteredDossiers.map((dos) => (
                        <tr key={dos.id} className="hover:bg-[#eff4ff] transition group">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#00334f]">{dos.molecule}</div>
                            <div className="text-[11px] font-mono text-[#72787f]">{dos.formulation}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-[#0b1c30]">{dos.rldReference}</div>
                            <div className="text-[11px] text-[#72787f]">{dos.nda}</div>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <div className="font-semibold text-[#00334f]">
                              ${dos.wholesalePrice.toFixed(2)} <span className="text-[#72787f] font-normal">/ pack</span>
                            </div>
                            <div className="text-[11px] text-[#003825]">Dispense: ${dos.dispensePrice.toFixed(2)}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-mono text-[#0b1c30]">{dos.activeBatch}</div>
                            <div className="flex items-center gap-1 text-[11px] text-[#003825]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#005137]"></span>
                              Freshness {dos.freshnessPercent}% (Exp {dos.expiryYear})
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="px-1.5 py-0.2 rounded bg-[#68dba9] text-[#003825] text-[10px] font-bold">
                                {dos.rating}
                              </span>
                              <span className="text-[10px] font-mono text-[#72787f]">{dos.anda}</span>
                            </div>
                            <span className="text-[11px] text-[#003825]">{dos.regulatoryClearance}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => alert(`Editing wholesale pricing for ${dos.molecule}`)}
                                className="p-1 hover:bg-[#e5eeff] rounded text-[#72787f] hover:text-[#00334f] cursor-pointer"
                                title="Edit Wholesale Pricing"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => alert(`Uploading Certificate of Analysis for ${dos.activeBatch}`)}
                                className="p-1 hover:bg-[#e5eeff] rounded text-[#72787f] hover:text-[#00334f] cursor-pointer"
                                title="Upload Batch Certificate of Analysis"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => alert(`Telemetry inspector for ${dos.molecule}`)}
                                className="p-1 hover:bg-[#e5eeff] rounded text-[#72787f] hover:text-[#00334f] cursor-pointer"
                                title="Inspect Telemetry"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 border-t border-[#c1c7cf] bg-[#f8f9ff] flex items-center justify-between mt-auto text-xs text-[#72787f]">
                  <span>Showing <strong className="text-[#0b1c30]">1-5</strong> of <strong className="text-[#0b1c30]">52</strong> active pharmaceutical formulations</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2 py-1 border border-[#c1c7cf] rounded bg-white text-xs disabled:opacity-40 cursor-pointer" disabled>
                      Previous
                    </button>
                    <button className="px-2.5 py-1 rounded bg-[#00334f] text-white text-xs font-bold cursor-pointer">1</button>
                    <button className="px-2.5 py-1 border border-[#c1c7cf] rounded bg-white text-xs hover:bg-[#eff4ff] cursor-pointer">2</button>
                    <button className="px-2.5 py-1 border border-[#c1c7cf] rounded bg-white text-xs hover:bg-[#eff4ff] cursor-pointer">3</button>
                    <span className="px-1">...</span>
                    <button className="px-2.5 py-1 border border-[#c1c7cf] rounded bg-white text-xs hover:bg-[#eff4ff] cursor-pointer">11</button>
                    <button className="px-2 py-1 border border-[#c1c7cf] rounded bg-white text-xs text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer">
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 1 Column: QA & Batch Release Ledger */}
              <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#c1c7cf]">
                  <div>
                    <h3 className="text-base font-bold text-[#00334f]">QA &amp; Batch Release Ledger</h3>
                    <p className="text-xs text-[#72787f]">Sign-off cryptographic verification</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#005137]" />
                </div>

                {/* Ledger Items */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#c1c7cf]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#00334f]">Batch #CP-2026-99A</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#003825] font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#005137]"></span>
                        RELEASED
                      </span>
                    </div>
                    <p className="text-[#0b1c30] mt-1 font-medium">Atorvastatin Calcium 20mg</p>
                    <div className="mt-2 text-[#72787f] flex items-center justify-between text-[11px]">
                      <span>Sign-off: QP-Dr. Nair (FDA Reg)</span>
                      <span className="font-mono">14 mins ago</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#c1c7cf]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#00334f]">Batch #CP-2026-102C</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#006398] font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#006398]"></span>
                        IN QA AUDIT
                      </span>
                    </div>
                    <p className="text-[#0b1c30] mt-1 font-medium">Metformin ER 500mg</p>
                    <div className="mt-2 text-[#72787f] flex items-center justify-between text-[11px]">
                      <span>Pending: Dissolution Profiling</span>
                      <span className="font-mono">Assigned: Lab-4</span>
                    </div>
                  </div>
                </div>

                {/* Expiration Radar */}
                <div className="pt-3 border-t border-[#c1c7cf]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#72787f]">
                    Dossier Standing &amp; Renewals
                  </span>
                  <ul className="mt-2 space-y-2 text-xs">
                    <li className="flex items-center justify-between">
                      <span className="text-[#0b1c30]">EU-GMP Facility Renewal:</span>
                      <span className="font-semibold text-[#006398]">In 142 Days</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#0b1c30]">DMF #034812 (Active Drug):</span>
                      <span className="font-semibold text-[#003825]">Good Standing</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#0b1c30]">Annual ANDA Reporting:</span>
                      <span className="font-semibold text-[#00334f]">Filed Nov 2025</span>
                    </li>
                  </ul>
                </div>

                {/* Direct Compliance CTAs */}
                <div className="pt-3 border-t border-[#c1c7cf] space-y-2">
                  <button
                    onClick={() => setShowNewDossierModal(true)}
                    className="w-full h-9 bg-[#00334f] text-white text-xs font-semibold rounded-md hover:bg-[#0c4a6e] transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    + Submit New ANDA / Molecule Dossier
                  </button>
                  <button
                    onClick={() => alert('Exporting Regulatory Audit Pack (eCTD v4.0 XML/PDF)...')}
                    className="w-full h-9 bg-white border border-[#c1c7cf] text-[#0b1c30] hover:bg-[#eff4ff] text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#72787f]" />
                    Export Regulatory Audit Pack (eCTD)
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* New Dossier Modal */}
      {showNewDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c1c7cf] rounded-xl max-w-lg w-full p-5 shadow-2xl text-[#0b1c30]">
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
                alert('New formulation dossier submitted to FDA Orange Book validation queue.');
              }}
              className="py-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#41474e] mb-1 font-medium">Molecule &amp; Salt Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rosuvastatin Calcium 20mg"
                  className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded px-3 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">National Drug Code (NDC):</label>
                  <input
                    type="text"
                    required
                    placeholder="69097-xxx-xx"
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">ANDA Application #:</label>
                  <input
                    type="text"
                    required
                    placeholder="ANDA #218902"
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded px-3 py-1.5 font-mono"
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
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">Bioequivalence Rating:</label>
                  <select className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded px-3 py-1.5">
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
                  className="px-3 py-1.5 rounded border border-[#c1c7cf] bg-white text-xs hover:bg-[#eff4ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold"
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
