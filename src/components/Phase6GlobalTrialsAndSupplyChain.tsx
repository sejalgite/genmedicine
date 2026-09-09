import React, { useState, useEffect } from 'react';
import {
  Globe,
  TrendingUp,
  AlertTriangle,
  FlaskConical,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  FileText,
  DollarSign,
  Layers,
  ChevronRight,
  Scale,
  Sparkles,
  Plane,
  Building,
  Check,
  Info,
} from 'lucide-react';
import type {
  InventoryForecastResult,
  PredictiveShortageAlert,
  PatentCliffEvent,
  ClinicalTrialProtocol,
  PatientTrialMatchResult,
  ConsentLedgerRecord,
  CrossBorderArbitrageOpportunity,
  RegulatoryComplianceCheck,
} from '../types';
import {
  fetchPredictiveSupplyChainReport,
  requestBulkReorder,
  fetchClinicalTrialProtocols,
  runPatientTrialMatch,
  submitTrialConsent,
  fetchConsentLedger,
  fetchCrossBorderArbitrage,
  checkMoleculeCompliance,
} from '../services/phase6ApiClient';

type ActiveTab = 'supply-chain' | 'clinical-trials' | 'cross-border';

export const Phase6GlobalTrialsAndSupplyChain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('supply-chain');
  const [loading, setLoading] = useState(true);

  // Module 1 State: Predictive Supply Chain
  const [forecastReport, setForecastReport] = useState<InventoryForecastResult | null>(null);
  const [selectedPatentCliff, setSelectedPatentCliff] = useState<PatentCliffEvent | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState<string | null>(null);

  // Module 2 State: Clinical Trials & ZKP
  const [protocols, setProtocols] = useState<ClinicalTrialProtocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<ClinicalTrialProtocol | null>(null);
  const [patientMatches, setPatientMatches] = useState<PatientTrialMatchResult[]>([]);
  const [consentLedger, setConsentLedger] = useState<ConsentLedgerRecord[]>([]);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [consentingTrialNct, setConsentingTrialNct] = useState<string | null>(null);
  const [consentSuccessMsg, setConsentSuccessMsg] = useState<string | null>(null);

  // Module 3 State: Cross-Border Regulatory
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<CrossBorderArbitrageOpportunity[]>([]);
  const [selectedArbitrage, setSelectedArbitrage] = useState<CrossBorderArbitrageOpportunity | null>(null);
  const [complianceQuery, setComplianceQuery] = useState('Atorvastatin');
  const [complianceResult, setComplianceResult] = useState<RegulatoryComplianceCheck | null>(null);
  const [checkingCompliance, setCheckingCompliance] = useState(false);
  const [arbitrageUnits, setArbitrageUnits] = useState(500);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [forecast, trialProtocols, ledger, arbitrage] = await Promise.all([
          fetchPredictiveSupplyChainReport(),
          fetchClinicalTrialProtocols(),
          fetchConsentLedger(),
          fetchCrossBorderArbitrage(),
        ]);

        setForecastReport(forecast);
        if (forecast.patentCliffEvents.length > 0) {
          setSelectedPatentCliff(forecast.patentCliffEvents[0]);
        }

        setProtocols(trialProtocols);
        if (trialProtocols.length > 0) {
          setSelectedProtocol(trialProtocols[0]);
        }

        setConsentLedger(ledger);
        setArbitrageOpportunities(arbitrage);
        if (arbitrage.length > 0) {
          setSelectedArbitrage(arbitrage[0]);
        }

        // Run initial patient match
        const matches = await runPatientTrialMatch({
          patientId: 'usr-customer-01',
          age: 44,
          diagnoses: ['Type 2 Diabetes', 'Hypercholesterolemia'],
          activeMedications: ['Metformin 1000mg ER', 'Atorvastatin 20mg'],
        });
        setPatientMatches(matches);

        // Initial compliance check
        const comp = await checkMoleculeCompliance('Atorvastatin');
        setComplianceResult(comp);
      } catch (err) {
        console.error('Failed to load Phase 6 data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleTriggerReorder = async (alert: PredictiveShortageAlert) => {
    setReorderingId(alert.id);
    setReorderSuccessMsg(null);
    try {
      const res = await requestBulkReorder(alert.id);
      setReorderSuccessMsg(
        `PO #${res.poNumber} successfully issued to ${alert.suggestedB2BSupplier} for ${alert.recommendedReorderQuantity} units. ETA: ${res.deliveryEtaDays} days.`
      );
      // Refresh forecast report
      const updated = await fetchPredictiveSupplyChainReport();
      setForecastReport(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setReorderingId(null);
    }
  };

  const handleRunMatchSimulation = async () => {
    setMatchingInProgress(true);
    setConsentSuccessMsg(null);
    try {
      const matches = await runPatientTrialMatch({
        patientId: 'usr-customer-01',
        age: 44,
        diagnoses: ['Type 2 Diabetes', 'Hypercholesterolemia', 'COPD'],
        activeMedications: ['Metformin 1000mg', 'Atorvastatin 20mg'],
      });
      setPatientMatches(matches);
    } catch (err) {
      console.error(err);
    } finally {
      setMatchingInProgress(false);
    }
  };

  const handleSignConsent = async (match: PatientTrialMatchResult) => {
    setConsentingTrialNct(match.nctNumber);
    setConsentSuccessMsg(null);
    try {
      const res = await submitTrialConsent(match.patientId, match.nctNumber, match.zeroKnowledgeProofHash);
      setConsentSuccessMsg(
        `Cryptographic ZKP Consent verified & anchored on smart contract (${res.ledgerRecord.smartContractAddress.slice(0, 10)}...). $${match.estimatedPatientStipend.toLocaleString()} stipend locked in escrow.`
      );
      const updatedLedger = await fetchConsentLedger();
      setConsentLedger(updatedLedger);
    } catch (err) {
      console.error(err);
    } finally {
      setConsentingTrialNct(null);
    }
  };

  const handleCheckCompliance = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!complianceQuery) return;
    setCheckingCompliance(true);
    try {
      const res = await checkMoleculeCompliance(complianceQuery);
      setComplianceResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingCompliance(false);
    }
  };

  return (
    <div className="flex-1 bg-[#06090e] text-slate-100 flex flex-col min-h-screen">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#071322] to-slate-950 border-b border-cyan-900/40 px-4 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Global Trials & Predictive Supply Chain
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono font-semibold">
                    Phase 6 • v5.0 Live
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-jurisdictional regulatory harmonization, neural patent cliff demand forecasting, and zero-knowledge clinical trial recruitment.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-md">
            <div className="text-left border-r border-slate-800 pr-3">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Monitored SKUs</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">842 Molecules</div>
            </div>
            <div className="text-left border-r border-slate-800 pr-3">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Patent Cliff Cap</div>
              <div className="text-sm font-bold text-amber-400 font-mono">$89.9B At Risk</div>
            </div>
            <div className="text-left border-r border-slate-800 pr-3">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Active Trials</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">4 Global Sponsors</div>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Max Arbitrage</div>
              <div className="text-sm font-bold text-purple-400 font-mono">95.8% Landed Savings</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-5 border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveTab('supply-chain')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'supply-chain'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Predictive Inventory AI & Patent Cliff</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              Shortage AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clinical-trials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'clinical-trials'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Decentralized Trials & ZKP Consent</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono">
              HIPAA ZKP
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cross-border')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'cross-border'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Scale className="w-4 h-4 text-purple-400" />
            <span>Cross-Border Regulatory & Arbitrage</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">
              FDA / EMA / CDSCO
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 w-full flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <p className="text-sm font-medium">Synchronizing Phase 6 Global Intelligence Engine...</p>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* TAB 1: PREDICTIVE INVENTORY AI & PATENT CLIFF FORECASTING */}
            {/* ========================================================================= */}
            {activeTab === 'supply-chain' && forecastReport && (
              <div className="space-y-6">
                {/* Status message */}
                {reorderSuccessMsg && (
                  <div className="bg-emerald-950/80 border border-emerald-700/70 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-200 shadow-md">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{reorderSuccessMsg}</span>
                    </div>
                    <button
                      onClick={() => setReorderSuccessMsg(null)}
                      className="text-emerald-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Patent Cliff Visualizer Grid */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Upcoming Blockbuster Patent Cliff Matrix
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Neural demand models anticipating massive generic substitution surges upon innovator loss-of-exclusivity (LOE).
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Surge Risk Tier:</span>
                      <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800 text-[11px] font-mono">
                        High Demand Surge
                      </span>
                    </div>
                  </div>

                  {/* Patent Cliff Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-4">
                    {forecastReport.patentCliffEvents.map((pc) => {
                      const isSelected = selectedPatentCliff?.id === pc.id;
                      return (
                        <div
                          key={pc.id}
                          onClick={() => setSelectedPatentCliff(pc)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-950/30 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{pc.brandDrug}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60">
                                {pc.daysUntilExpiry}d
                              </span>
                            </div>
                            <div className="text-[11px] text-cyan-400 mt-0.5 font-medium line-clamp-1">
                              {pc.genericMolecule}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">{pc.primaryManufacturer}</div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Market Size:</span>
                              <span className="font-mono text-slate-200 font-semibold">${pc.marketSizeUsdBillion}B/yr</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Projected Drop:</span>
                              <span className="font-mono text-emerald-400 font-bold">-{pc.projectedGenericPriceDropPercent}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Pipeline Mfrs:</span>
                              <span className="font-mono text-cyan-300 font-medium">{pc.pipelineGenericMfrCount} Applicants</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Patent Cliff Deep-Dive */}
                  {selectedPatentCliff && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            PATENT EXPIRATION: {selectedPatentCliff.patentExpiryDate}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {selectedPatentCliff.therapeuticClass}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Branded <strong className="text-white">{selectedPatentCliff.brandDrug}</strong> currently sells at{' '}
                          <strong className="text-amber-300">${selectedPatentCliff.currentBrandPrice.toFixed(2)}</strong>. Generic market entry expected at{' '}
                          <strong className="text-emerald-300">${selectedPatentCliff.expectedGenericEntryPrice.toFixed(2)}</strong> with {selectedPatentCliff.pipelineGenericMfrCount} ANDA filers ramping batch synthesis.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Patient Annual Savings</div>
                          <div className="text-sm font-bold text-emerald-400 font-mono">
                            ${(selectedPatentCliff.currentBrandPrice - selectedPatentCliff.expectedGenericEntryPrice).toFixed(2)} / Rx
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('cross-border');
                            setComplianceQuery(selectedPatentCliff.genericMolecule.split(' ')[0]);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <span>Analyze Sourcing</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 12-Month Demand Curve Chart & Shortage Alerts Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: 12-Month AI Demand Curve */}
                  <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-cyan-400" />
                            12-Month AI Demand Surge Forecast Curve
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Comparing baseline historical consumption against patent-cliff generic substitution spikes.
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-sm bg-slate-600"></span>
                            <span className="text-slate-400">Baseline</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
                            <span className="text-cyan-300 font-medium">AI Surge</span>
                          </div>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="mt-5 space-y-2.5">
                        {forecastReport.demandCurve.map((dp, idx) => {
                          const maxVal = 30000;
                          const baselineWidth = Math.round((dp.baselineDemandUnits / maxVal) * 100);
                          const aiWidth = Math.round((dp.aiPredictedDemandUnits / maxVal) * 100);
                          const isHighRisk = dp.projectedShortageRiskPercent > 50;

                          return (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              <span className="w-16 font-mono text-[11px] text-slate-400 shrink-0">{dp.month}</span>
                              <div className="flex-1 bg-slate-950 h-5 rounded-md overflow-hidden relative border border-slate-800/80 flex items-center">
                                {/* Baseline Bar */}
                                <div
                                  style={{ width: `${baselineWidth}%` }}
                                  className="h-full bg-slate-700/80 absolute left-0 top-0"
                                ></div>
                                {/* AI Surge Delta */}
                                <div
                                  style={{ left: `${baselineWidth}%`, width: `${aiWidth - baselineWidth}%` }}
                                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 absolute top-0 opacity-90"
                                ></div>
                              </div>
                              <div className="w-24 text-right font-mono text-[11px] shrink-0 flex items-center justify-end gap-1.5">
                                <span className="text-cyan-300 font-semibold">{dp.aiPredictedDemandUnits.toLocaleString()}</span>
                                <span
                                  className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                    isHighRisk ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {dp.projectedShortageRiskPercent}% risk
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        Neural demand multipliers factor epidemiological seasonality and PBM formulary switches.
                      </span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        Optimized Working Cap: ${forecastReport.aggregateCapitalOptimizedUsd.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Right: Active Predictive Shortage Alerts */}
                  <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            Regional Drug Shortage Alert Radar
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Automated stockout alerts trigger instant B2B distributor PO replenishment.
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono font-bold">
                          {forecastReport.imminentShortageCount} Imminent
                        </span>
                      </div>

                      {/* Alert Cards */}
                      <div className="mt-4 space-y-3">
                        {forecastReport.shortageAlerts.map((alert) => {
                          const isReordering = reorderingId === alert.id;
                          return (
                            <div
                              key={alert.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                alert.isAutoReordered
                                  ? 'bg-emerald-950/20 border-emerald-700/60'
                                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-xs font-bold text-white">{alert.molecule}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    Displacing: {alert.brandEquivalents.join(', ')}
                                  </div>
                                </div>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                    alert.projectedStockoutDays <= 4
                                      ? 'bg-red-950 text-red-400 border border-red-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  Stockout in {alert.projectedStockoutDays}d
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-800/70 text-[11px]">
                                <div>
                                  <span className="text-slate-500">Current Stock:</span>{' '}
                                  <strong className="text-slate-200 font-mono">{alert.currentDispensaryStock}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500">30d Demand:</span>{' '}
                                  <strong className="text-cyan-400 font-mono">{alert.predictedDemandNext30d}</strong>
                                </div>
                                <div className="col-span-2 text-[10px] text-slate-400">
                                  <span>Supplier:</span> <strong className="text-slate-300">{alert.suggestedB2BSupplier}</strong>
                                </div>
                              </div>

                              {/* Action Bar */}
                              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                                <span className="text-[10px] text-emerald-400 font-mono">
                                  Save {alert.savingsVsSpotPrice}% vs spot rate
                                </span>
                                {alert.isAutoReordered ? (
                                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                    <Check className="w-3.5 h-3.5" />
                                    PO Dispatched
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleTriggerReorder(alert)}
                                    disabled={isReordering}
                                    className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                                  >
                                    {isReordering && <RefreshCw className="w-3 h-3 animate-spin" />}
                                    <span>Auto-Replenish ({alert.recommendedReorderQuantity})</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Automatic EDI 850 Purchase Orders routed through B2B manufacturer gateway.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: DECENTRALIZED CLINICAL TRIALS & ZKP CONSENT */}
            {/* ========================================================================= */}
            {activeTab === 'clinical-trials' && (
              <div className="space-y-6">
                {/* Consent notification banner */}
                {consentSuccessMsg && (
                  <div className="bg-emerald-950/80 border border-emerald-700/70 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-200 shadow-md">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{consentSuccessMsg}</span>
                    </div>
                    <button
                      onClick={() => setConsentSuccessMsg(null)}
                      className="text-emerald-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Top Section: Sponsored Protocols & Zero-Knowledge AI Matcher */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Sponsored Protocols Explorer */}
                  <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-emerald-400" />
                            Decentralized Clinical Trial (DCT) Network
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Precision opt-in matching connecting eligible patients with sponsored clinical studies and digital bioequivalence registries.
                          </p>
                        </div>
                        <button
                          onClick={handleRunMatchSimulation}
                          disabled={matchingInProgress}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                        >
                          {matchingInProgress ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>Run ZKP Match</span>
                        </button>
                      </div>

                      {/* Protocols List */}
                      <div className="mt-4 space-y-3">
                        {protocols.map((p) => {
                          const isSelected = selectedProtocol?.protocolId === p.protocolId;
                          return (
                            <div
                              key={p.protocolId}
                              onClick={() => setSelectedProtocol(p)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-950/20 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold">
                                      {p.nctNumber}
                                    </span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                      {p.phase}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">{p.sponsor}</span>
                                  </div>
                                  <h3 className="text-xs font-bold text-white mt-1.5 leading-snug">{p.title}</h3>
                                  <div className="text-[11px] text-slate-400 mt-1">
                                    Condition: <strong className="text-slate-300">{p.conditionTarget}</strong>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="text-[10px] text-slate-400">Patient Stipend</div>
                                  <div className="text-sm font-bold text-emerald-400 font-mono">
                                    ${p.patientStipendUsd.toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              {/* Progress and Tags */}
                              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">
                                  Enrolled: <strong className="text-cyan-300 font-mono">{p.currentEnrolled}</strong> / {p.enrollmentTarget} ({Math.round((p.currentEnrolled / p.enrollmentTarget) * 100)}%)
                                </span>
                                {p.virtualVisitsSupported && (
                                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                                    <Globe className="w-3 h-3" /> Home Decentralized Visits
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Zero-Knowledge Patient Match Results */}
                  <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Lock className="w-4 h-4 text-cyan-400" />
                            Zero-Knowledge (ZKP) Eligibility Scanner
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Screening patient health record & pharmacy dispensing history without revealing raw PHI.
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
                          Alex Morgan (44y)
                        </span>
                      </div>

                      {/* Match Cards */}
                      <div className="mt-4 space-y-3">
                        {patientMatches.map((m) => {
                          const isConsenting = consentingTrialNct === m.nctNumber;
                          return (
                            <div
                              key={m.matchId}
                              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white font-mono">{m.nctNumber}</span>
                                    <span className="text-[10px] text-slate-400">• {m.sponsor}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{m.trialTitle}</div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-sm font-bold text-emerald-400 font-mono">{m.matchScorePercent}%</div>
                                  <div className="text-[9px] text-slate-400 uppercase font-mono">Match Score</div>
                                </div>
                              </div>

                              {/* Biomarker Tags */}
                              <div className="space-y-1">
                                {m.matchedBiomarkers.map((b, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                                    <Check className="w-3 h-3 shrink-0" />
                                    <span>{b}</span>
                                  </div>
                                ))}
                              </div>

                              {/* ZKP Cryptographic Digest */}
                              <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800/80 text-[10px] font-mono text-slate-400">
                                <div className="text-[9px] text-slate-500 uppercase">Zero-Knowledge Proof Signature:</div>
                                <div className="text-cyan-400 break-all leading-none mt-0.5">{m.zeroKnowledgeProofHash}</div>
                              </div>

                              {/* Consent Action */}
                              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-[11px] font-mono text-slate-300 font-semibold">
                                  Stipend: <span className="text-emerald-400">${m.estimatedPatientStipend.toLocaleString()}</span>
                                </span>
                                <button
                                  onClick={() => handleSignConsent(m)}
                                  disabled={isConsenting}
                                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                                >
                                  {isConsenting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
                                  <span>Sign ZKP Consent</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      Zero-knowledge proofs comply with FDA 21 CFR Part 11 and HIPAA Title II Privacy Rules.
                    </div>
                  </div>
                </div>

                {/* Bottom: Immutable Cryptographic Consent Ledger */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Decentralized Consent & Stipend Escrow Ledger
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tamper-proof on-chain verification verifying patient informed consent and automated stipend disbursement triggers.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs">
                      {consentLedger.length} Verified Ledger Blocks
                    </span>
                  </div>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase font-mono">
                          <th className="py-2.5 px-3">Ledger ID</th>
                          <th className="py-2.5 px-3">Patient Snippet</th>
                          <th className="py-2.5 px-3">Trial NCT</th>
                          <th className="py-2.5 px-3">Smart Contract</th>
                          <th className="py-2.5 px-3">ZKP Signature</th>
                          <th className="py-2.5 px-3">Timestamp</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        {consentLedger.map((rec) => (
                          <tr key={rec.ledgerId} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-cyan-300 font-bold">{rec.ledgerId}</td>
                            <td className="py-2.5 px-3 text-slate-200">{rec.patientIdSnippet}</td>
                            <td className="py-2.5 px-3 text-emerald-400 font-bold">{rec.trialNct}</td>
                            <td className="py-2.5 px-3 text-slate-400 text-[10px]">{rec.smartContractAddress.slice(0, 14)}...</td>
                            <td className="py-2.5 px-3 text-slate-400 text-[10px]">{rec.zkpVerificationSignature.slice(0, 16)}...</td>
                            <td className="py-2.5 px-3 text-slate-400">{new Date(rec.timestamp).toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                                ANCHORED
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: CROSS-BORDER REGULATORY SYNCHRONIZATION & ARBITRAGE */}
            {/* ========================================================================= */}
            {activeTab === 'cross-border' && (
              <div className="space-y-6">
                {/* Landed Cost vs US Retail Arbitrage Calculator */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Scale className="w-4 h-4 text-purple-400" />
                        Global Generic Drug Landed Cost & Arbitrage Engine
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Cross-border regulatory harmonization mapping international WHO-GMP ex-factory pricing vs US retail PBM spreads.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Order Volume:</span>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={arbitrageUnits}
                        onChange={(e) => setArbitrageUnits(parseInt(e.target.value))}
                        className="w-32 accent-purple-500 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-purple-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {arbitrageUnits} units
                      </span>
                    </div>
                  </div>

                  {/* Arbitrage Opportunity Selector Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
                    {arbitrageOpportunities.map((opp) => {
                      const isSelected = selectedArbitrage?.id === opp.id;
                      return (
                        <div
                          key={opp.id}
                          onClick={() => {
                            setSelectedArbitrage(opp);
                            setComplianceQuery(opp.genericMolecule.split(' ')[0]);
                            checkMoleculeCompliance(opp.genericMolecule.split(' ')[0]).then(setComplianceResult);
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-purple-950/30 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/40'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white line-clamp-1">{opp.genericMolecule.split('(')[0]}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                                {opp.sourceJurisdiction.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">{opp.sourceManufacturer}</div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">US Retail Price:</span>
                              <span className="font-mono text-red-400 line-through">${opp.usRetailPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Landed Cost:</span>
                              <span className="font-mono text-emerald-400 font-bold">${opp.landedCostUsd.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Net Patient Savings:</span>
                              <span className="font-mono text-purple-300 font-bold">{opp.savingsSpreadPercent}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Arbitrage Deep-Dive Waterfall Breakdown */}
                  {selectedArbitrage && (
                    <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800/90 grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Step 1: Ex-Factory */}
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">1. Ex-Factory Synthesis Price</div>
                        <div className="text-base font-bold text-slate-100 font-mono mt-0.5">
                          ${selectedArbitrage.sourceExFactoryPrice.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">WHO-GMP Batch Direct Rate</div>
                      </div>

                      {/* Step 2: Logistics & Customs */}
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">2. Cold Airfreight & Tariff</div>
                        <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                          +${selectedArbitrage.tariffsAndFreight.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Customs Clearance & IoT Pack</div>
                      </div>

                      {/* Step 3: Total Landed Cost */}
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">3. Final Landed Import Cost</div>
                        <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                          =${selectedArbitrage.landedCostUsd.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Fully Regulated & Inspected</div>
                      </div>

                      {/* Step 4: Total Batch Savings */}
                      <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/70">
                        <div className="text-[10px] text-purple-300 uppercase font-mono">4. Total Net Savings ({arbitrageUnits} Qty)</div>
                        <div className="text-base font-bold text-purple-300 font-mono mt-0.5">
                          ${((selectedArbitrage.usRetailPrice - selectedArbitrage.landedCostUsd) * arbitrageUnits).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-purple-400 mt-1 font-semibold">{selectedArbitrage.savingsSpreadPercent}% Less vs US PBM</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Multi-Jurisdiction Regulatory Pharmacopeia Crosswalk */}
                {selectedArbitrage && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Building className="w-4 h-4 text-cyan-400" />
                          Multi-Jurisdiction Regulatory Harmonization Crosswalk
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Equivalence mapping across US FDA, European EMA, WHO Prequalification, and India CDSCO.
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-mono font-semibold">
                        {selectedArbitrage.regulatoryReadiness.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {selectedArbitrage.harmonizedRecords.map((rec, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white font-mono">{rec.jurisdiction.replace('_', ' ')}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                rec.status === 'APPROVED'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-cyan-400 font-medium">{rec.regulatoryBody}</div>
                          <div className="space-y-1 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                            <div>
                              <span className="text-slate-500">Dossier:</span>{' '}
                              <strong className="text-slate-300 font-mono">{rec.dossierType}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500">GMP Standard:</span>{' '}
                              <strong className="text-slate-300">{rec.gmpComplianceStandard}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500">Bioequivalence:</span>{' '}
                              <strong className="text-slate-300">{rec.bioequivalenceRequirement}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instant Regulatory Equivalence Validator */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Live International Equivalence Validator
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Assess global supply availability and Section 804 import parity compliance for any active molecule.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCheckCompliance} className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={complianceQuery}
                      onChange={(e) => setComplianceQuery(e.target.value)}
                      placeholder="Enter molecule name (e.g., Atorvastatin, Apixaban, Semaglutide, Salmeterol)..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={checkingCompliance}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      {checkingCompliance ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Validate Parity</span>
                    </button>
                  </form>

                  {complianceResult && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{complianceResult.queryMolecule}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono font-bold">
                            {complianceResult.harmonizationIndexPercent}% Harmonization Index
                          </span>
                        </div>
                        {complianceResult.importParityViable ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                            <Check className="w-4 h-4" /> Import Parity Viable
                          </span>
                        ) : (
                          <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                            <AlertTriangle className="w-4 h-4" /> Additional Clearance Required
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">US FDA:</span>
                          <span className={complianceResult.fdaOrangeBookRated ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {complianceResult.fdaOrangeBookRated ? 'AB-Rated' : 'Pending'}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">EU EMA:</span>
                          <span className={complianceResult.emaSmPcHooksValid ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {complianceResult.emaSmPcHooksValid ? 'SmPC Valid' : 'Pending'}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">WHO PQ:</span>
                          <span className={complianceResult.whoPrequalified ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {complianceResult.whoPrequalified ? 'Pre-Qualified' : 'Pending'}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">CDSCO India:</span>
                          <span className={complianceResult.cdscoSugamRegistered ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {complianceResult.cdscoSugamRegistered ? 'SUGAM Reg' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                        {complianceResult.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
