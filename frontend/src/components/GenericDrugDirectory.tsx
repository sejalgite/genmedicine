import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Pill,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Calculator,
  CheckCircle2,
  Info,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  X,
  Plus,
  Trash2,
  Store,
  Clock,
  ChevronRight,
  Check,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import type { MedicineOffer, UserAccount, SavingsCalculationResult } from '../types';
import { apiClient, type CategoryInfo } from '../services/apiClient';

interface GenericDrugDirectoryProps {
  currentUser?: UserAccount | null;
  onOrderPlaced?: (orderData: any) => void;
  onNavigateToMobileApp?: () => void;
  onNavigateToPharmacy?: () => void;
}

export const GenericDrugDirectory: React.FC<GenericDrugDirectoryProps> = ({
  currentUser,
  onOrderPlaced,
  onNavigateToMobileApp,
  onNavigateToPharmacy,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rank' | 'savings' | 'price-asc' | 'price-desc' | 'name'>('savings');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Data State
  const [medicines, setMedicines] = useState<MedicineOffer[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineOffer | null>(null);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [selectedForSavings, setSelectedForSavings] = useState<{ id: string; qty: number }[]>([
    { id: 'med-1', qty: 1 }, // Atorvastatin
    { id: 'med-2', qty: 1 }, // Metformin
    { id: 'med-7', qty: 1 }, // Losartan
  ]);
  const [savingsResult, setSavingsResult] = useState<SavingsCalculationResult | null>(null);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [medsRes, catsRes] = await Promise.all([
          apiClient.getMedicines({ q: searchQuery, category: selectedCategory, sort: sortBy }),
          apiClient.getCategories(),
        ]);
        setMedicines(medsRes.medicines);
        setCategories(catsRes);
      } catch (err) {
        console.error('Failed to load medicine directory data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [searchQuery, selectedCategory, sortBy]);

  // Recalculate Savings whenever selections change
  useEffect(() => {
    async function runCalc() {
      if (!showSavingsCalculator || selectedForSavings.length === 0) return;
      const res = await apiClient.calculateSavings({
        items: selectedForSavings.map((s) => ({ medicineId: s.id, quantityMonthly: s.qty })),
      });
      setSavingsResult(res);
    }
    runCalc();
  }, [selectedForSavings, showSavingsCalculator]);

  // Key Statistics
  const totalSavingsAverage = useMemo(() => {
    if (medicines.length === 0) return 0;
    const sum = medicines.reduce((acc, m) => acc + m.savingsSpreadPercent, 0);
    return Math.round(sum / medicines.length);
  }, [medicines]);

  // Quick Order Action
  const handleQuickOrder = (med: MedicineOffer) => {
    if (onOrderPlaced) {
      onOrderPlaced({
        id: `ord-${Date.now()}`,
        orderNumber: `#GEN-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        patientName: currentUser?.name || 'Alex Morgan',
        patientAddress: currentUser?.address || '452 Broadway, Apt 4B, New York, NY',
        itemsCount: 1,
        total: med.bestPrice + 1.0, // +$1 platform fee
        medicineName: med.name,
        brandDisplaced: med.brandName || 'Brand',
      });
    }
    setOrderToast(`Order created for ${med.name}! Routed to partner pharmacy.`);
    setTimeout(() => setOrderToast(null), 4000);
  };

  // Toggle Medicine in Savings Calculator
  const toggleMedicineInCalculator = (medId: string) => {
    setSelectedForSavings((prev) => {
      const exists = prev.some((item) => item.id === medId);
      if (exists) {
        return prev.filter((item) => item.id !== medId);
      }
      return [...prev, { id: medId, qty: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 p-4 md:p-8 font-sans">
      {/* Toast Notification */}
      {orderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{orderToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-32 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-cyan-400" />
                  Phase 1 Core Foundation
                </span>
                <span className="px-3 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  FDA Orange Book AB-Certified
                </span>
                <span className="text-xs text-slate-400 font-mono">REST API: /api/v1/medicines</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Generic Drug Discovery &amp; Price Comparison
              </h1>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Search verified chemical salts, therapeutic classes, and FDA-certified bioequivalent generics.
                Eliminate middleman PBM spreads with direct transparent pricing from WHO-GMP certified manufacturers.
              </p>
            </div>

            {/* Quick Actions & Stats */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => setShowSavingsCalculator(true)}
                className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold text-xs md:text-sm rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Annual Savings Calculator</span>
              </button>

              <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5">
                <div className="text-center flex-1">
                  <div className="text-xs text-slate-400 uppercase font-mono">Avg Savings</div>
                  <div className="text-lg font-extrabold text-emerald-400 font-mono">{totalSavingsAverage}% OFF</div>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="text-center flex-1">
                  <div className="text-xs text-slate-400 uppercase font-mono">Active SKUs</div>
                  <div className="text-lg font-extrabold text-cyan-400 font-mono">{medicines.length} Formulations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter & View Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Generic salt (e.g. Atorvastatin), Brand name (e.g. Lipitor), or Indication (e.g. Hypertension)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="savings">Highest Savings Spread (%)</option>
                <option value="price-asc">Lowest Generic Price ($)</option>
                <option value="price-desc">Highest Generic Price ($)</option>
                <option value="rank">Highest Quality &amp; Trust Rank</option>
                <option value="name">Alphabetical (A - Z)</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  title="Table Comparison View"
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Therapeutic Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 text-[11px] font-mono uppercase mr-1 whitespace-nowrap">Class:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-lg font-medium transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Molecules ({medicines.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1 rounded-lg font-medium transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.name
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70 bg-black/40 px-1.5 py-0.2 rounded font-mono">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Showing {medicines.length} verified generic formulations</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time API Push active
          </span>
        </div>

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {medicines.map((med) => {
              const dollarSavings = (med.marketPrice - med.bestPrice).toFixed(2);
              return (
                <div
                  key={med.id}
                  className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-4 transition duration-200 flex flex-col justify-between group shadow-lg"
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-mono uppercase tracking-wider">
                        {med.therapeuticClass}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold">
                          FDA {med.fdaTeCode || 'AB'}
                        </span>
                        {med.isRxRequired ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-semibold">
                            Rx
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-semibold">
                            OTC
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Brand Displaced Banner */}
                    {med.brandName && (
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="line-through text-slate-500">{med.brandName}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                        <span className="text-cyan-300 font-semibold">Certified Generic</span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {med.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono line-clamp-1">{med.salt}</p>
                  </div>

                  {/* Pricing Spread Box */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Brand Name Price</span>
                        <span className="text-sm line-through text-slate-400 font-mono">
                          ${med.marketPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 uppercase font-mono block font-bold">
                          Generic Offer
                        </span>
                        <span className="text-xl font-extrabold text-emerald-400 font-mono">
                          ${med.bestPrice.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ {med.unit}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Patient Net Savings:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
                        Save ${dollarSavings} ({med.savingsSpreadPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Indications Tags */}
                  {med.indications && med.indications.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {med.indications.slice(0, 2).map((ind, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-800/60 rounded text-[11px] text-slate-300 font-sans"
                        >
                          {ind}
                        </span>
                      ))}
                      {med.indications.length > 2 && (
                        <span className="px-1.5 py-0.5 text-[11px] text-slate-500">
                          +{med.indications.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Manufacturer & Partner Info */}
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate max-w-[140px]">{med.partnerName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{med.freshness}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedMedicine(med)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Dossier</span>
                    </button>
                    <button
                      onClick={() => handleQuickOrder(med)}
                      className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Order Generic</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TABLE COMPARISON VIEW */}
        {viewMode === 'table' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                    <th className="py-3.5 px-4">Generic Formulation</th>
                    <th className="py-3.5 px-4">Brand Benchmark</th>
                    <th className="py-3.5 px-4">Therapeutic Class</th>
                    <th className="py-3.5 px-4">Bioequivalence</th>
                    <th className="py-3.5 px-4">Brand vs. Generic Price</th>
                    <th className="py-3.5 px-4">Net Savings</th>
                    <th className="py-3.5 px-4">Partner Hub</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans text-slate-300">
                  {medicines.map((med) => {
                    const dollarSavings = (med.marketPrice - med.bestPrice).toFixed(2);
                    return (
                      <tr key={med.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-bold text-white">
                          <div>{med.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono font-normal truncate max-w-xs">
                            {med.salt}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <span className="font-semibold text-cyan-300">{med.brandName || 'Brand Ref'}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {med.therapeuticClass}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
                            {med.fdaTeCode || 'AB'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="line-through text-slate-500">${med.marketPrice.toFixed(2)}</span>
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                            <span className="text-emerald-400 font-bold text-sm">
                              ${med.bestPrice.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">per {med.unit}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-emerald-400 font-bold">
                            Save ${dollarSavings}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ({med.savingsSpreadPercent}% off)
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <div>{med.partnerName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{med.freshness}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedMedicine(med)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition"
                            >
                              Dossier
                            </button>
                            <button
                              onClick={() => handleQuickOrder(med)}
                              className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow"
                            >
                              Order
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DRUG DETAIL / DOSSIER MODAL */}
        {selectedMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl my-8">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1.5 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                    FDA ORANGE BOOK {selectedMedicine.fdaTeCode || 'AB'} RATED
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Bioequivalence: {selectedMedicine.bioequivalencePercent || 99.2}%
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedMedicine.name}</h2>
                <p className="text-xs text-slate-400 font-mono">
                  Benchmark Reference: <span className="text-cyan-300">{selectedMedicine.brandName}</span>
                </p>
              </div>

              {/* Pharmacology Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono uppercase block text-[10px]">Active Pharmaceutical Salt</span>
                  <span className="text-slate-200 font-semibold">{selectedMedicine.salt}</span>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono uppercase block text-[10px]">Therapeutic Category</span>
                  <span className="text-slate-200 font-semibold">{selectedMedicine.therapeuticClass}</span>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono uppercase block text-[10px]">Primary Manufacturer</span>
                  <span className="text-slate-200 font-semibold">{selectedMedicine.manufacturer}</span>
                  <span className="text-[10px] text-emerald-400 block">{selectedMedicine.qaCert}</span>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono uppercase block text-[10px]">Regulatory Schedule</span>
                  <span className="text-slate-200 font-semibold">{selectedMedicine.schedule}</span>
                  <span className="text-[10px] text-slate-400 block">
                    {selectedMedicine.isRxRequired ? 'Requires Valid Prescription' : 'Available Over-the-Counter'}
                  </span>
                </div>
              </div>

              {/* Clinical Description */}
              {selectedMedicine.description && (
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase text-slate-400">Mechanism of Action</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {selectedMedicine.description}
                  </p>
                </div>
              )}

              {/* Indications & Available Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {selectedMedicine.indications && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono uppercase text-slate-400">Approved Indications</h4>
                    <ul className="space-y-1">
                      {selectedMedicine.indications.map((ind, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMedicine.dosageStrengths && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono uppercase text-slate-400">Dosage Form Variants</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMedicine.dosageStrengths.map((str, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-mono text-[11px]"
                        >
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-mono block">Transparent Cash Price</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    ${selectedMedicine.bestPrice.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-400"> / {selectedMedicine.unit}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMedicine(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleQuickOrder(selectedMedicine);
                      setSelectedMedicine(null);
                    }}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-lg flex items-center gap-1.5"
                  >
                    <span>Order Generic at ${selectedMedicine.bestPrice.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANNUAL SAVINGS CALCULATOR MODAL */}
        {showSavingsCalculator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl my-8">
              <button
                onClick={() => setShowSavingsCalculator(false)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                    POLYPHARMACY PRESCRIPTION SAVINGS
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">Annual Prescription Savings Calculator</h2>
                <p className="text-xs text-slate-400">
                  Select your monthly maintenance medications to calculate your projected annual out-of-pocket savings
                  by switching from brand-name drugs to certified FDA generic equivalents.
                </p>
              </div>

              {/* Medicine Selection Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400">Select Active Medications:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {medicines.map((med) => {
                    const isSelected = selectedForSavings.some((s) => s.id === med.id);
                    return (
                      <div
                        key={med.id}
                        onClick={() => toggleMedicineInCalculator(med.id)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{med.name}</div>
                          <div className="text-[10px] text-slate-500">{med.brandName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-emerald-400 font-bold">${med.bestPrice.toFixed(2)}</div>
                          <span className={`text-[10px] ${isSelected ? 'text-cyan-400 font-bold' : 'text-slate-600'}`}>
                            {isSelected ? '✓ Selected' : '+ Add'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Savings Results Summary Card */}
              {savingsResult && (
                <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-slate-950 to-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Monthly Brand Cost</span>
                      <span className="text-lg font-bold text-slate-300 line-through font-mono">
                        ${savingsResult.totalBrandMonthly.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-emerald-400 uppercase font-mono block font-bold">
                        New Monthly Generic Cost
                      </span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">
                        ${savingsResult.totalGenericMonthly.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/40">
                      <span className="text-[10px] text-emerald-300 uppercase font-mono block font-bold">
                        Total Projected Annual Savings
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-300 font-mono">
                        ${savingsResult.annualSavings.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-400 block font-mono">
                        ({savingsResult.averageSavingsPercent}% savings / year)
                      </span>
                    </div>
                  </div>

                  {/* Itemized Breakdown Table */}
                  <div className="overflow-x-auto text-[11px]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                          <th className="pb-1.5">Medicine</th>
                          <th className="pb-1.5">Brand Cost</th>
                          <th className="pb-1.5">Generic Cost</th>
                          <th className="pb-1.5 text-right">Annual Savings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {savingsResult.itemizedSavings.map((item) => (
                          <tr key={item.medicineId}>
                            <td className="py-2 font-semibold text-white">
                              {item.name} <span className="text-slate-500 font-normal">({item.brandName})</span>
                            </td>
                            <td className="py-2 font-mono text-slate-400">${item.brandCost.toFixed(2)}</td>
                            <td className="py-2 font-mono text-emerald-400 font-bold">${item.genericCost.toFixed(2)}</td>
                            <td className="py-2 font-mono text-emerald-300 font-bold text-right">
                              ${item.annualSavings.toFixed(2)} ({item.savingsPercent}%)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowSavingsCalculator(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSavingsCalculator(false);
                    setOrderToast(`Prescription savings plan active! Saved $${savingsResult?.annualSavings.toFixed(2)}.`);
                    setTimeout(() => setOrderToast(null), 4000);
                  }}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow"
                >
                  Apply Generic Substitution Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
