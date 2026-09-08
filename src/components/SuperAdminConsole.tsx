import React, { useState } from 'react';
import {
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Layers,
  Search,
  RotateCw,
  Sliders,
  CheckCircle2,
  Shield,
  Bell,
  Check,
  Plus,
  BarChart3,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { MedicineOffer, AuditEvent, RankingWeights } from '../types';

interface SuperAdminConsoleProps {
  offers: MedicineOffer[];
  auditEvents: AuditEvent[];
  rankingWeights: RankingWeights;
  onUpdateWeights: (weights: RankingWeights) => void;
  onRefreshFeed: () => void;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({
  offers,
  auditEvents,
  rankingWeights,
  onUpdateWeights,
  onRefreshFeed,
}) => {
  const [selectedTenant, setSelectedTenant] = useState('GLOBAL (All 24 Multi-Tenant Schemas)');
  const [searchQuery, setSearchQuery] = useState('');
  const [freshnessFilter, setFreshnessFilter] = useState('All Listings');
  const [categoryFilter, setCategoryFilter] = useState('All Therapeutic Classes');
  const [regulatoryFilter, setRegulatoryFilter] = useState('Any Schedule');
  const [simulatedSku, setSimulatedSku] = useState('Atorvastatin 20mg');
  const [simulatedScore, setSimulatedScore] = useState(8.94);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [inspectedOffer, setInspectedOffer] = useState<MedicineOffer | null>(null);
  const [batchSuccessNotice, setBatchSuccessNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Command Center');

  // Filtered offers
  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.salt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFreshness =
      freshnessFilter === 'All Listings' ||
      (freshnessFilter === 'Fresh (<6 hours)' && o.freshnessStatus === 'fresh') ||
      (freshnessFilter === 'Warning (12h - 24h)' && o.freshnessStatus === 'warning') ||
      (freshnessFilter === 'Stale (>24h - Demoted)' && o.freshnessStatus === 'stale');

    const matchesCategory =
      categoryFilter === 'All Therapeutic Classes' ||
      (categoryFilter === 'Cardiovascular / Statins' && o.therapeuticClass.includes('Cardiovascular')) ||
      (categoryFilter === 'Antibiotics & Antivirals' && o.therapeuticClass.includes('Antibiotics')) ||
      (categoryFilter === 'Diabetes / Metformin' && o.therapeuticClass.includes('Diabetes')) ||
      (categoryFilter === 'Analgesics & NSAIDs' && o.therapeuticClass.includes('Analgesic'));

    const matchesRegulatory =
      regulatoryFilter === 'Any Schedule' ||
      (regulatoryFilter.includes('Schedule H1') && o.schedule === 'Schedule H1') ||
      (regulatoryFilter.includes('Schedule H') && !regulatoryFilter.includes('H1') && o.schedule === 'Schedule H') ||
      (regulatoryFilter.includes('OTC') && o.schedule === 'OTC Safe');

    return matchesSearch && matchesFreshness && matchesCategory && matchesRegulatory;
  });

  const handleSimulate = () => {
    const found = offers.find((o) => o.name.toLowerCase().includes(simulatedSku.toLowerCase()));
    if (found) {
      setSimulatedScore(found.rankScore);
    } else {
      // Calculate dynamic score based on current weights
      const calculated = (
        (rankingWeights.priceTransparency * 0.08 +
          rankingWeights.partnerReliability * 0.09 +
          rankingWeights.manufacturerTrust * 0.09 +
          rankingWeights.userSentiment * 0.07 +
          rankingWeights.freshnessDecay * 0.05) /
        3.8
      ).toFixed(2);
      setSimulatedScore(parseFloat(calculated));
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBatchModal(false);
    setBatchSuccessNotice('Batch #SYNC-2026-09-08-01 successfully ingested into OpenSearch & PostgreSQL schema sandbox.');
    setTimeout(() => setBatchSuccessNotice(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-cyan-200">
      {/* Top Utility & Telemetry Bar */}
      <header className="border-b border-slate-800 bg-[#0a0f18]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Logo and Platform Label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 pulse-glow"></span>
              </span>
              <span className="font-bold text-base tracking-tight text-white flex items-center">
                gen<span className="text-cyan-400">medicine</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-medium text-[11px] tracking-wide">
              Enterprise Operations <span className="text-slate-400 font-normal">v1.0 (Multi-Tenant)</span>
            </span>
          </div>

          {/* Live Infrastructure Ticker */}
          <div className="hidden xl:flex items-center gap-4 text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-medium text-slate-300">Cluster Uptime:</span>
              <span className="text-emerald-400 font-mono">99.98%</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-300">Redis Cache:</span>
              <span className="text-cyan-400 font-mono">99.4% Hit</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-300">OpenSearch:</span>
              <span className="text-emerald-400 font-mono">18ms p95</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-300">Kafka Bus:</span>
              <span className="text-slate-300 font-mono">0 lag</span>
            </div>
          </div>

          {/* Quick Action Controls & User Identity */}
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              type="button"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              New Catalogue Batch
            </button>
            <button
              onClick={() => setShowRankingModal(true)}
              className="hidden sm:flex px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 rounded transition items-center gap-1.5 text-xs cursor-pointer"
              type="button"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              Simulate Ranking
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="p-1.5 text-slate-400 hover:text-white rounded-md bg-slate-900 border border-slate-800 transition cursor-pointer"
                type="button"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                14
              </span>
            </div>

            {/* Super Admin Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center font-semibold text-cyan-300 text-xs">
                SA
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight">Dr. Alok Verma</span>
                <span className="text-[10px] text-cyan-400 font-mono">Platform Admin [Super]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Context & Scope Navigation Row */}
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
          {/* Tenant Selector */}
          <div className="flex items-center gap-2">
            <label className="text-slate-400 font-medium text-xs flex items-center gap-1.5" htmlFor="tenant-scope-select">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Tenant Scope:
            </label>
            <div className="relative">
              <select
                id="tenant-scope-select"
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 text-cyan-300 text-xs rounded font-medium focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 py-1 pl-2.5 pr-8 cursor-pointer"
              >
                <option>GLOBAL (All 24 Multi-Tenant Schemas)</option>
                <option>schema_platform_core (System Master)</option>
                <option>schema_apollo_chain (Tier-1 Partner)</option>
                <option>schema_medplus_retail (Regional Chain)</option>
                <option>schema_cipla_b2b (Manufacturer Portal)</option>
                <option>schema_dr_reddys (Direct Supply)</option>
              </select>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Strict PostgreSQL Schema Sandboxing Enabled
            </span>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto text-xs py-0.5 font-medium text-slate-300">
            {[
              { name: 'Command Center', badge: null, color: null },
              { name: 'Catalogue & Freshness', badge: 'SLA 98.6%', color: 'bg-slate-800 text-slate-300' },
              { name: 'Partner Verification', badge: '3 Pending', color: 'bg-amber-950 text-amber-300 border border-amber-800/40' },
              { name: 'Safety & Reviews', badge: '14 Flags', color: 'bg-rose-950 text-rose-300 border border-rose-800/40' },
              { name: 'Ranking & Trust Tuner (v2.4)', badge: null, color: null },
              { name: 'Commission Ledger', badge: null, color: null, hideMobile: true },
              { name: 'OpenTelemetry Tracing', badge: null, color: null, hideMobile: true },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-3 py-1 rounded transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.name
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-700/60 font-semibold shadow-sm'
                    : 'hover:bg-slate-900 text-slate-400'
                } ${tab.hideMobile ? 'hidden lg:inline-flex' : ''}`}
              >
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${tab.color}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Success notification banner if triggered */}
      {batchSuccessNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-800 text-emerald-200 px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{batchSuccessNotice}</span>
          </div>
          <button onClick={() => setBatchSuccessNotice(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
        {/* KPI Summary Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Metric 1 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg p-3.5 transition flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-medium tracking-tight">Catalogue Freshness SLA</span>
              <span className="p-1 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/30">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">98.6%</span>
              <span className="text-emerald-400 text-xs font-semibold flex items-center">↑ 1.2%</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
              <span>Target ≥98.0% (PRD Guardrail)</span>
              <span className="text-emerald-400 font-medium">Optimal</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-slate-900/80 border border-cyan-900/40 hover:border-cyan-800/60 rounded-lg p-3.5 transition flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-medium tracking-tight text-cyan-200">North Star: Action Rate</span>
              <span className="p-1 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-800/30">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-cyan-400 tracking-tight">24.8%</span>
              <span className="text-cyan-300 text-xs font-semibold">+3.4% MoM</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
              <span>142.4k Daily Discoveries</span>
              <span className="text-slate-300 font-mono">Target: 22.0%</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg p-3.5 transition flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-medium tracking-tight">Safety &amp; Review Queue</span>
              <span className="p-1 rounded bg-rose-950/70 text-rose-400 border border-rose-800/30">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-rose-300 tracking-tight">18 Items</span>
              <span className="text-rose-400 text-xs font-semibold">4 Claim Flags</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
              <span>Avg. Resolution: <strong className="text-slate-200 font-normal">14m</strong></span>
              <span className="text-amber-400">Within SLA</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg p-3.5 transition flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-medium tracking-tight">Attributable GMV (MTD)</span>
              <span className="p-1 rounded bg-indigo-950/70 text-indigo-400 border border-indigo-800/30">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">$384,920</span>
              <span className="text-indigo-400 text-xs font-semibold">$38.4k Net</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
              <span>Fee Margin: <span className="text-slate-200">10.0%</span></span>
              <span className="text-emerald-400">Reconciled</span>
            </div>
          </div>

          {/* Metric 5 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg p-3.5 transition flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-medium tracking-tight">Tenant Schemas</span>
              <span className="p-1 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-800/30">
                <Layers className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">24 Schemas</span>
              <span className="text-emerald-400 text-xs font-semibold">0 Leaks</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
              <span>Row/Schema Isolation</span>
              <span className="text-emerald-400 font-mono">100% Passed</span>
            </div>
          </div>
        </section>

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
          {/* Left / Center Major Panel (8 Cols on XL) */}
          <section className="xl:col-span-8 bg-slate-900/90 border border-slate-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
            {/* Table Control Toolbar */}
            <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Canonical Catalogue &amp; Live Partner Offer Queue
                </h2>
                <span className="bg-cyan-950 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-800/60">
                  Live Synced (OpenSearch + PostgreSQL)
                </span>
              </div>

              {/* Quick Actions & Search */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search salt, brand, NDC code..."
                    className="bg-slate-950 border border-slate-700/80 rounded text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1 w-52 md:w-64 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    type="text"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                </div>
                <button
                  onClick={onRefreshFeed}
                  className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                  title="Refresh Feed"
                  type="button"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Sub-bar */}
            <div className="px-3.5 py-2 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Freshness:</span>
                <select
                  value={freshnessFilter}
                  onChange={(e) => setFreshnessFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700/70 rounded text-[11px] text-slate-300 py-0.5 px-2 cursor-pointer"
                >
                  <option>All Listings</option>
                  <option>Fresh (&lt;6 hours)</option>
                  <option>Warning (12h - 24h)</option>
                  <option>Stale (&gt;24h - Demoted)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700/70 rounded text-[11px] text-slate-300 py-0.5 px-2 cursor-pointer"
                >
                  <option>All Therapeutic Classes</option>
                  <option>Cardiovascular / Statins</option>
                  <option>Antibiotics &amp; Antivirals</option>
                  <option>Diabetes / Metformin</option>
                  <option>Analgesics &amp; NSAIDs</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Regulatory:</span>
                <select
                  value={regulatoryFilter}
                  onChange={(e) => setRegulatoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700/70 rounded text-[11px] text-slate-300 py-0.5 px-2 cursor-pointer"
                >
                  <option>Any Schedule</option>
                  <option>Schedule H (Prescription Rx)</option>
                  <option>Schedule H1</option>
                  <option>General OTC</option>
                </select>
              </div>

              <div className="ml-auto text-[11px] text-slate-500">
                Showing <span className="text-slate-200 font-medium">{filteredOffers.length} of 12,480</span> indexed medicines
              </div>
            </div>

            {/* Primary High-Density Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                    <th className="py-2.5 px-3">Canonical Drug &amp; Salt Form</th>
                    <th className="py-2.5 px-3">Manufacturer &amp; QA</th>
                    <th className="py-2.5 px-3">Best Price vs Market</th>
                    <th className="py-2.5 px-3">Offer Freshness &amp; Source</th>
                    <th className="py-2.5 px-3">Safety &amp; Compliance</th>
                    <th className="py-2.5 px-3 text-right">Ops Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredOffers.map((offer) => {
                    const isWarning = offer.freshnessStatus === 'stale';
                    return (
                      <tr
                        key={offer.id}
                        className={`hover:bg-slate-800/40 transition ${
                          isWarning ? 'bg-amber-950/10 border-l-2 border-l-amber-500' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{offer.name}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                                offer.category === 'Lipid-Lowering'
                                  ? 'bg-cyan-950 text-cyan-400 border-cyan-800/50'
                                  : offer.category === 'Antidiabetic'
                                  ? 'bg-indigo-950 text-indigo-400 border-indigo-800/50'
                                  : offer.category === 'Macrolide'
                                  ? 'bg-amber-950 text-amber-300 border-amber-800/50'
                                  : 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                              }`}
                            >
                              {offer.category}
                            </span>
                          </div>
                          <div className="text-slate-400 text-[11px] font-mono mt-0.5">Generic Salt: {offer.salt}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="text-slate-200 font-medium">{offer.manufacturer}</div>
                          <div
                            className={`flex items-center gap-1 text-[10px] mt-0.5 ${
                              isWarning ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{offer.qaCert}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono">
                          <div
                            className={`font-semibold text-sm ${
                              isWarning ? 'text-slate-300' : 'text-emerald-400'
                            }`}
                          >
                            ${offer.bestPrice.toFixed(2)}{' '}
                            <span className="text-[10px] text-slate-400 font-normal">/ {offer.unit}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            {isWarning ? (
                              <span className="text-amber-400">Drift Alert &gt; 14%</span>
                            ) : (
                              <>
                                <span className="line-through text-slate-500">${offer.marketPrice.toFixed(2)}</span>
                                <span className="text-emerald-400 font-medium">(-{offer.savingsSpreadPercent}% spread)</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isWarning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                              }`}
                            ></span>
                            <span
                              className={`font-medium ${
                                isWarning ? 'text-amber-300' : 'text-slate-200'
                              }`}
                            >
                              {offer.partnerName}
                            </span>
                          </div>
                          <div
                            className={`text-[10px] mt-0.5 font-mono ${
                              isWarning ? 'text-rose-400 font-semibold' : 'text-slate-400'
                            }`}
                          >
                            {offer.freshness} • {offer.partnerType}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] border font-medium ${
                              offer.schedule === 'OTC Safe'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                                : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                            }`}
                          >
                            {offer.isRxRequired ? `Rx Required [${offer.schedule}]` : 'OTC Safe (General Sale)'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isWarning ? (
                              <button
                                onClick={() => {
                                  offer.freshnessStatus = 'fresh';
                                  offer.freshness = 'Updated just now';
                                  onRefreshFeed();
                                }}
                                className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/60 rounded text-[11px] font-medium transition cursor-pointer"
                                type="button"
                              >
                                Force Re-Fetch
                              </button>
                            ) : (
                              <button
                                onClick={() => setInspectedOffer(offer)}
                                className="px-2 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 rounded text-[11px] font-medium transition cursor-pointer"
                                type="button"
                              >
                                Inspect ({offer.offersCount})
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Automated price drift detection: <strong className="text-emerald-400 font-normal">Active (Threshold 15%)</strong></span>
                <span>•</span>
                <span>Batch ID: <span className="font-mono text-slate-300">#SYNC-2026-09-08-09</span></span>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] cursor-pointer">
                  Previous
                </button>
                <span className="px-2 py-1 font-mono text-slate-300">Page 1 of 240</span>
                <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] cursor-pointer">
                  Next
                </button>
              </div>
            </div>
          </section>

          {/* Right Operational Sidebars (4 Cols on XL) */}
          <aside className="xl:col-span-4 space-y-4">
            {/* Widget 1: Ranking & Trust Weight Tuner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Ranking &amp; Trust Weight Tuner
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    v2.4 Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Multi-criteria algorithmic weights applied during canonical search comparison. Dynamically recalculates offer priority in OpenSearch.
                </p>

                {/* Guardrail Disclaimer Notice */}
                <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[11px] mb-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-none mt-0.5" />
                  <div>
                    <strong className="font-semibold text-amber-300">Clinical Equivalence Guardrail:</strong>{' '}
                    Ranking reflects transparency, availability, &amp; verified quality; it does not replace licensed medical advice.
                  </div>
                </div>

                {/* Interactive Algorithm Weight Sliders */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Price Transparency &amp; Savings Spread</span>
                      <span className="font-mono font-semibold text-cyan-400">{rankingWeights.priceTransparency}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={rankingWeights.priceTransparency}
                      onChange={(e) =>
                        onUpdateWeights({ ...rankingWeights, priceTransparency: parseInt(e.target.value) })
                      }
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Partner Reliability &amp; Delivery SLA</span>
                      <span className="font-mono font-semibold text-emerald-400">{rankingWeights.partnerReliability}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={rankingWeights.partnerReliability}
                      onChange={(e) =>
                        onUpdateWeights({ ...rankingWeights, partnerReliability: parseInt(e.target.value) })
                      }
                      className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Manufacturer Trust Rating (GMP/FDA)</span>
                      <span className="font-mono font-semibold text-indigo-400">{rankingWeights.manufacturerTrust}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={rankingWeights.manufacturerTrust}
                      onChange={(e) =>
                        onUpdateWeights({ ...rankingWeights, manufacturerTrust: parseInt(e.target.value) })
                      }
                      className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>User Sentiment &amp; Packaging Quality</span>
                      <span className="font-mono font-semibold text-violet-400">{rankingWeights.userSentiment}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={rankingWeights.userSentiment}
                      onChange={(e) =>
                        onUpdateWeights({ ...rankingWeights, userSentiment: parseInt(e.target.value) })
                      }
                      className="w-full accent-violet-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Freshness Decay Penalty (Stale &gt; 12h)</span>
                      <span className="font-mono font-semibold text-rose-400">{rankingWeights.freshnessDecay}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={rankingWeights.freshnessDecay}
                      onChange={(e) =>
                        onUpdateWeights({ ...rankingWeights, freshnessDecay: parseInt(e.target.value) })
                      }
                      className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Simulation Sandbox */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="simulate-drug">
                  Simulate Ranking Score on Canonical SKU:
                </label>
                <div className="flex gap-2">
                  <input
                    id="simulate-drug"
                    value={simulatedSku}
                    onChange={(e) => setSimulatedSku(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-xs rounded px-2.5 py-1 text-slate-200 flex-1 font-mono"
                    type="text"
                  />
                  <button
                    onClick={handleSimulate}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-xs transition cursor-pointer"
                    type="button"
                  >
                    Test ({simulatedScore.toFixed(2)}/10)
                  </button>
                </div>
              </div>
            </div>

            {/* Widget 2: Multi-Tenant Real-Time Security & Audit Stream */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Multi-Tenant Security &amp; Audit Log
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Feed
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Immutable trace of tenant-scoped changes, regulatory triggers, and moderation overrides.
              </p>

              {/* Audit Events Timeline List */}
              <div className="space-y-2 font-mono text-[11px] max-h-56 overflow-y-auto pr-1">
                {auditEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-2 rounded border transition ${
                      evt.type === 'MODERATION_FLAG'
                        ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-800/60'
                        : evt.type === 'STALENESS_GUARD'
                        ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-800/60'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-400 mb-0.5">
                      <span
                        className={`font-semibold ${
                          evt.type === 'MODERATION_FLAG'
                            ? 'text-rose-400'
                            : evt.type === 'STALENESS_GUARD'
                            ? 'text-amber-400'
                            : evt.type === 'RBAC_AUDIT'
                            ? 'text-emerald-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        [{evt.time}] {evt.type}
                      </span>
                      <span className="text-slate-500 text-[10px]">tenant: {evt.tenant}</span>
                    </div>
                    <div className="text-slate-200 text-[11px] font-sans">{evt.description}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Audit Controls */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Cryptographically Chained</span>
                <button
                  onClick={() => alert('Audit stream exported to CSV format with SHA-256 signature.')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  Export Audit CSV
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Global Operations Footer */}
      <footer className="border-t border-slate-800 bg-[#070b12] px-4 py-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-300">genmedicine Architecture:</span>
            <span className="text-slate-400">Multi-Tenant PostgreSQL (Separate Schemas) • Redis Cache • OpenSearch Cluster</span>
          </div>
          <span className="hidden md:inline text-slate-700">|</span>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-slate-300 font-medium">Observability:</span>
            <span className="text-cyan-400 font-mono">OpenTelemetry / Sentry / Prometheus ACTIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px]">
            SESSION: JWT_TENANT_ISOLATED
          </span>
          <span className="text-slate-500">© 2026 genmedicine SaaS Platform. Ops Authority Console.</span>
        </div>
      </footer>

      {/* Inspect Offer Modal */}
      {inspectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide">
                  Canonical Offer Inspection
                </span>
                <h3 className="text-lg font-bold text-white">{inspectedOffer.name}</h3>
              </div>
              <button
                onClick={() => setInspectedOffer(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Generic Salt Active:</span>
                  <span className="font-medium text-slate-200">{inspectedOffer.salt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Manufacturer:</span>
                  <span className="font-medium text-slate-200">{inspectedOffer.manufacturer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">QA Compliance:</span>
                  <span className="font-medium text-emerald-400">{inspectedOffer.qaCert}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Regulatory Schedule:</span>
                  <span className="font-medium text-rose-300">{inspectedOffer.schedule}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded bg-cyan-950/30 border border-cyan-800/40">
                <div>
                  <span className="text-slate-300 block font-medium">Best Price via {inspectedOffer.partnerName}</span>
                  <span className="text-slate-400 text-[11px]">Normal market retail: ${inspectedOffer.marketPrice.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-cyan-400">${inspectedOffer.bestPrice.toFixed(2)}</span>
                  <span className="block text-[10px] text-emerald-400">Save {inspectedOffer.savingsSpreadPercent}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectedOffer(null)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInspectedOffer(null);
                  alert(`Dispatched audit verification ping for ${inspectedOffer.name}.`);
                }}
                className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
              >
                Trigger Sync Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Catalogue Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Ingest New Catalogue Batch
              </h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Tenant Partition:</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200">
                  <option>schema_apollo_chain (Tier-1 Partner)</option>
                  <option>schema_medplus_retail (Regional Chain)</option>
                  <option>schema_cipla_b2b (Manufacturer Portal)</option>
                  <option>schema_dr_reddys (Direct Supply)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Batch Manifest / Kafka Topic:</label>
                <input
                  type="text"
                  defaultValue="topic.medicine.inventory.v2.batch-0908"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ingestion Mode:</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="radio" name="ingest-mode" defaultChecked className="accent-cyan-500" />
                    <span>Differential Sync with Strict Freshness SLA Guard</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="radio" name="ingest-mode" className="accent-cyan-500" />
                    <span>Full Re-Index (OpenSearch Canonical Cluster)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium cursor-pointer"
                >
                  Execute Batch Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulate Ranking Modal */}
      {showRankingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Algorithm Ranking Simulator
              </h3>
              <button onClick={() => setShowRankingModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <p className="text-slate-400">
                Simulating search scoring weights over active OpenSearch multi-tenant index.
              </p>
              <div className="space-y-2 font-mono text-[11px] bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Price Transparency (35%):</span>
                  <span className="text-cyan-400">+3.15 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Partner SLA 98.6% (25%):</span>
                  <span className="text-emerald-400">+2.46 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FDA/GMP Audited (20%):</span>
                  <span className="text-indigo-400">+1.98 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">User Sentiment 4.8★ (15%):</span>
                  <span className="text-violet-400">+1.44 pts</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-white">Aggregate Composite Score:</span>
                  <span className="text-cyan-300">8.94 / 10.00</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowRankingModal(false)}
                className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
