import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Pill,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Store,
  Clock,
  ArrowRight,
  Upload,
  FileText,
  User,
  ShoppingBag,
  CreditCard,
  Truck,
  Check,
  Eye,
  Sliders,
  Lock,
  Heart,
} from 'lucide-react';
import { MobileSubScreen, UserAccount, PrescriptionOcrResult } from '../types';
import { apiClient } from '../services/apiClient';

interface CustomerMobileAppProps {
  currentUser?: UserAccount | null;
  onOrderPlaced: (orderData: any) => void;
  onNavigateToPharmacy: () => void;
  onOpenAuth?: () => void;
}

export const CustomerMobileApp: React.FC<CustomerMobileAppProps> = ({
  currentUser,
  onOrderPlaced,
  onNavigateToPharmacy,
  onOpenAuth,
}) => {
  const [currentStep, setCurrentStep] = useState<MobileSubScreen>('discover');
  const [searchQuery, setSearchQuery] = useState('Atorvastatin 20mg');
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(true);
  const [substituteLipitor, setSubstituteLipitor] = useState(true);
  const [substituteMetformin, setSubstituteMetformin] = useState(true);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'express' | 'scheduled' | 'pickup'>('express');
  const [countdownSeconds, setCountdownSeconds] = useState(899); // 14:59
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [profileToast, setProfileToast] = useState<string | null>(null);
  const [autoRefillAtorvastatin, setAutoRefillAtorvastatin] = useState(true);
  const [autoRefillMetformin, setAutoRefillMetformin] = useState(false);

  // Phase 4 Live Gemini OCR State
  const [ocrPreset, setOcrPreset] = useState<'cardio-jenkins' | 'diabetes-metformin' | 'antibiotic-azithromycin'>('cardio-jenkins');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState<PrescriptionOcrResult | null>(null);

  const triggerScan = async (presetId: 'cardio-jenkins' | 'diabetes-metformin' | 'antibiotic-azithromycin') => {
    setOcrPreset(presetId);
    setOcrLoading(true);
    try {
      const res = await apiClient.performPrescriptionOcr(undefined, presetId);
      setOcrData(res);
    } catch (e) {
      console.warn('OCR error:', e);
    } finally {
      setOcrLoading(false);
    }
  };

  useEffect(() => {
    triggerScan('cardio-jenkins');
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const deliveryFee = selectedDeliveryMethod === 'express' ? 2.5 : 0.0;
  const genericTotal = (substituteLipitor ? 14.2 : 42.5) + (substituteMetformin ? 4.8 : 11.5);
  const totalSavings = (substituteLipitor ? 28.3 : 0) + (substituteMetformin ? 6.7 : 0);
  const grandTotal = genericTotal + deliveryFee + 1.0; // $1 platform transparency fee

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    onOrderPlaced({
      id: 'ord-1',
      orderNumber: '#GEN-ORD-88219',
      patientName: 'Alex Morgan',
      patientAddress: '452 Broadway, Apt 4B, New York, NY 10013',
      itemsCount: 2,
      total: grandTotal,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 flex flex-col items-center justify-start text-slate-900">
      {/* Mobile Device Mockup Frame */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col min-h-[780px]">
        {/* Device Top Status Bar */}
        <div className="bg-slate-900 text-white px-5 py-2 flex items-center justify-between text-xs font-medium">
          <span className="font-mono">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-cyan-900 text-cyan-300 px-1.5 py-0.2 rounded font-mono">5G</span>
            <div className="w-4 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Step Navigation Pill in Customer Experience */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-cyan-400 font-bold tracking-tight">genmedicine Mobile</span>
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-full">
            <button
              onClick={() => {
                setCurrentStep('discover');
                setOrderSuccess(false);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                currentStep === 'discover' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Compare
            </button>
            <button
              onClick={() => {
                setCurrentStep('scan');
                setOrderSuccess(false);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                currentStep === 'scan' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Scan Rx
            </button>
            <button
              onClick={() => setCurrentStep('checkout')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                currentStep === 'checkout' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Dispatch
            </button>
            <button
              onClick={() => setCurrentStep('profile')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                currentStep === 'profile' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Profile
            </button>
          </div>
        </div>

        {/* SUB-SCREEN 1: SEARCH & DISCOVERY / COMPARISON (Matching Image 6) */}
        {currentStep === 'discover' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Top Search & Location Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Deliver to <strong className="text-slate-800">10013 (SoHo, NYC)</strong></span>
                </div>
                <span className="text-cyan-600 font-semibold cursor-pointer">Change</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search generic salt, brand name, or Rx..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Regulatory Guardrail Banner */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-none mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="font-semibold">Clinical Equivalence Guardrail (FR-DISC-05):</strong>{' '}
                Generics feature identical active chemical salts, purity, and bioavailability as innovator drugs.
              </div>
            </div>

            {/* Active Molecule Match: Side-by-Side Comparison */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wide">
                  Active Molecule Match
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Save 66% with Generic
                </span>
              </div>

              {/* 2-Col Card: Brand vs Generic */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Brand Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Branded Standard</span>
                    <h4 className="font-bold text-slate-900 text-xs mt-0.5">Lipitor® 20mg</h4>
                    <p className="text-[10px] text-slate-500">Pfizer Laboratories</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <span className="text-base font-bold font-mono text-slate-900">$42.50</span>
                    <span className="block text-[10px] text-slate-400">30 tablets</span>
                  </div>
                </div>

                {/* Generic Card (Rank #1) */}
                <div className="bg-cyan-50/70 border-2 border-cyan-500 rounded-xl p-3 flex flex-col justify-between relative shadow-xs">
                  <div className="absolute -top-2 right-2 bg-cyan-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    #1 RECOMMENDED
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-800 font-bold uppercase">Generic Equivalent</span>
                    <h4 className="font-bold text-slate-900 text-xs mt-0.5">Atorvastatin 20mg</h4>
                    <p className="text-[10px] text-slate-600">Cipla / Sun Pharma (FDA AB)</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-cyan-200">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-bold font-mono text-cyan-800">$14.20</span>
                      <span className="text-[10px] text-emerald-600 font-bold">-66%</span>
                    </div>
                    <span className="block text-[10px] text-slate-500">30 tablets (Equal Bioavail.)</span>
                  </div>
                </div>
              </div>

              {/* Expandable Why Ranked #1 Box */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setShowFormulaBreakdown(!showFormulaBreakdown)}
                  className="w-full px-3 py-2 text-left flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    Why is this generic ranked #1? (Formula Breakdown)
                  </span>
                  {showFormulaBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showFormulaBreakdown && (
                  <div className="px-3 pb-3 pt-1 space-y-1.5 text-[11px] border-t border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between text-slate-600">
                      <span>• Price Transparency (35% weight):</span>
                      <strong className="font-mono text-cyan-700">Lowest in NYC</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• Partner SLA (25% weight):</span>
                      <strong className="font-mono text-emerald-700">98.6% on-time delivery</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• Manufacturer Trust (20% weight):</span>
                      <strong className="font-mono text-indigo-700">US-FDA / WHO-GMP Verified</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• User Sentiment (15% weight):</span>
                      <strong className="font-mono text-violet-700">4.9 ★ (1,420 reviews)</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Local Pharmacy Offers List */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>Verified Local Partner Offers (3)</span>
                <span className="text-[10px] text-slate-400 font-normal">Real-Time Inventory</span>
              </h3>

              {/* Offer 1: Apollo Care #104 */}
              <div className="p-3 border border-cyan-300 rounded-xl bg-cyan-50/40 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-cyan-600" />
                    <span className="font-bold text-slate-900 text-xs">Apollo Care Pharmacy #104</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      In Stock
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">0.4 miles away • 45 min Express Courier</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900">$14.20</div>
                  <button
                    onClick={() => setCurrentStep('scan')}
                    className="mt-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    Select Offer <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Offer 2: MedPlus Direct Express */}
              <div className="p-3 border border-slate-200 rounded-xl bg-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-800 text-xs">MedPlus Direct Express</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">1.2 miles away • 2 hr delivery</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-800">$15.10</div>
                  <button
                    onClick={() => setCurrentStep('scan')}
                    className="mt-1 px-2 py-0.5 border border-slate-200 text-slate-700 rounded text-[10px] hover:bg-slate-50 cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* Prescription Upload Quick Card */}
            <div className="p-3.5 border-2 border-dashed border-cyan-400/60 rounded-2xl bg-cyan-50/30 text-center space-y-2">
              <Upload className="w-6 h-6 text-cyan-600 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Have a Written Doctor's Prescription?</h4>
                <p className="text-[11px] text-slate-500">Scan your Rx to automatically find highest-saving bioequivalent generic salts.</p>
              </div>
              <button
                onClick={() => setCurrentStep('scan')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Launch AI Document Scanner
              </button>
            </div>
          </div>
        )}

        {/* SUB-SCREEN 2: AI PRESCRIPTION SCANNER & VALIDATION (Phase 4 Gemini 2.0 Vision) */}
        {currentStep === 'scan' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-600">Step 2 of 3 • Phase 4 Live</span>
                <h3 className="text-sm font-bold text-slate-900">Gemini 2.0 Multimodal OCR</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[10px] font-bold">
                {ocrData ? `OCR ${(ocrData.overallConfidence * 100).toFixed(1)}% Conf` : 'Scanning...'}
              </span>
            </div>

            {/* Quick Sample Prescriptions / Upload Switcher */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Select Sample Prescription Document:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => triggerScan('cardio-jenkins')}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer text-[10px] ${
                    ocrPreset === 'cardio-jenkins'
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold block truncate">Cardiology</span>
                  <span className="text-slate-500 text-[9px]">Atorvastatin + Met</span>
                </button>

                <button
                  onClick={() => triggerScan('diabetes-metformin')}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer text-[10px] ${
                    ocrPreset === 'diabetes-metformin'
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold block truncate">Endocrine</span>
                  <span className="text-slate-500 text-[9px]">Metformin ER</span>
                </button>

                <button
                  onClick={() => triggerScan('antibiotic-azithromycin')}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer text-[10px] ${
                    ocrPreset === 'antibiotic-azithromycin'
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold block truncate">Urgent Care</span>
                  <span className="text-slate-500 text-[9px]">Azithro Z-Pak</span>
                </button>
              </div>
            </div>

            {/* Document Preview Canvas with Laser Animation */}
            <div className="relative bg-slate-100 border border-slate-300 rounded-xl p-3 overflow-hidden shadow-inner">
              {ocrLoading && (
                <div className="absolute inset-0 bg-cyan-950/20 backdrop-blur-xs flex items-center justify-center z-20">
                  <div className="flex items-center gap-2 bg-slate-900 text-cyan-300 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Gemini 2.0 Multimodal OCR Scanning...</span>
                  </div>
                </div>
              )}

              <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 space-y-2 font-mono text-[10px] text-slate-600 relative">
                <div className="flex justify-between border-b pb-1 text-slate-400">
                  <span className="font-bold text-slate-700">{ocrData?.prescriber.clinic || 'METROPOLITAN HEALTH CLINIC'}</span>
                  <span>NPI: {ocrData?.prescriber.npi || '1982348102'}</span>
                </div>
                <div className="text-slate-800 font-sans flex justify-between">
                  <div><strong>Patient:</strong> {ocrData?.patientNameSnippet || 'Alex Morgan'}</div>
                  <div className="text-slate-500 text-[9px]">DEA: {ocrData?.prescriber.dea}</div>
                </div>

                {/* Bounding Box Highlights */}
                {ocrData?.extractedMedications.map((med, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 border-2 rounded relative ${
                      idx === 0 ? 'border-cyan-500 bg-cyan-500/10' : 'border-indigo-500 bg-indigo-500/10'
                    }`}
                  >
                    <span className="absolute -top-2 right-1 bg-cyan-600 text-white text-[8px] px-1 rounded font-mono font-bold">
                      OCR Conf {(med.confidenceScore * 100).toFixed(1)}%
                    </span>
                    <div className="font-bold text-slate-900">{med.brandName} ({med.genericName}) — Sig: {med.sigInstructions}</div>
                  </div>
                ))}

                <div className="pt-2 flex justify-between items-center text-[9px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> {ocrData?.prescriber.name} Digital Signature Verified
                  </span>
                  <span className="text-cyan-700 font-mono">FDA Orange Book AB Match</span>
                </div>
              </div>
            </div>

            {/* Extracted Medications with Substitution Toggles */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800">Extracted Medications &amp; Substitution Engine:</h4>

              {ocrData?.extractedMedications.map((med, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{idx + 1}. {med.genericName} ({med.quantityPrescribed} Qty)</span>
                    <span className="font-mono font-bold text-cyan-800 text-xs">${med.estimatedGenericPrice.toFixed(2)}</span>
                  </div>
                  <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-cyan-200 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-cyan-600 w-4 h-4"
                    />
                    <div className="text-[11px]">
                      <span className="font-bold text-cyan-800">FDA AB-Rated Generic Cipla Substitution</span>
                      <span className="text-slate-500 block">Replaces {med.brandName} (Save ${ (med.estimatedBrandPrice - med.estimatedGenericPrice).toFixed(2) })</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {/* Total Savings Callout */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700">Calculated Prescription Savings</span>
                <div className="font-bold text-base text-emerald-900">${totalSavings.toFixed(2)} Saved</div>
              </div>
              <button
                onClick={() => setCurrentStep('checkout')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* SUB-SCREEN 3: CHECKOUT & PARTNER DISPATCH HANDOFF (Matching Image 5) */}
        {currentStep === 'checkout' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {orderSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Order Dispatched to Apollo Care #104!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Order ID: <strong className="font-mono text-slate-800">#GEN-ORD-88219</strong>
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Pharmacist:</span>
                    <span className="font-bold text-slate-800">Dr. Michael Chen, PharmD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Escrow Locked:</span>
                    <span className="font-mono text-emerald-700 font-bold">${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Status:</span>
                    <span className="font-bold text-cyan-600">SwiftRx Cold Courier Dispatched</span>
                  </div>
                </div>
                <button
                  onClick={onNavigateToPharmacy}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  View Live in Pharmacy Partner Portal →
                </button>
              </div>
            ) : (
              <>
                {/* Countdown Timer Header */}
                <div className="flex items-center justify-between bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-[11px]">Inventory Reserved for:</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-amber-800">{formatTime(countdownSeconds)}</span>
                </div>

                {/* Fulfillment Partner Store Card */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Apollo Care Pharmacy #104</h4>
                      <p className="text-[10px] text-slate-500">Pharmacist: Dr. Michael Chen, PharmD</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    Verified Partner
                  </span>
                </div>

                {/* Delivery Options */}
                <div className="space-y-2">
                  <span className="font-bold text-xs text-slate-800">Fulfillment Method:</span>
                  <div className="space-y-1.5">
                    <label
                      onClick={() => setSelectedDeliveryMethod('express')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                        selectedDeliveryMethod === 'express'
                          ? 'border-cyan-500 bg-cyan-50/50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-cyan-600" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Express Pharmacy Courier</div>
                          <div className="text-[10px] text-slate-500">SwiftRx Cold-Chain (30-45 mins)</div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900">+$2.50</span>
                    </label>

                    <label
                      onClick={() => setSelectedDeliveryMethod('scheduled')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                        selectedDeliveryMethod === 'scheduled'
                          ? 'border-cyan-500 bg-cyan-50/50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Standard Same-Day Delivery</div>
                          <div className="text-[10px] text-slate-500">Arrives today by 6:00 PM</div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-emerald-700">FREE</span>
                    </label>
                  </div>
                </div>

                {/* Patient Address & Payment */}
                <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deliver to:</span>
                    <span className="font-semibold text-slate-800">Alex Morgan, 452 Broadway, SoHo, NY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-indigo-600" /> HSA/FSA Card ending 4402
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Medicines Subtotal (Generics):</span>
                    <span className="font-mono text-slate-900">${genericTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Total Substituted Savings:</span>
                    <span className="font-mono">-${totalSavings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Courier Fee:</span>
                    <span className="font-mono text-slate-900">
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Transparency Escrow:</span>
                    <span className="font-mono text-slate-900">$1.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-xs text-slate-900">
                    <span>Total Amount (Escrowed):</span>
                    <span className="font-mono text-cyan-800 text-sm">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order CTA */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Place Order with Apollo Care (${grandTotal.toFixed(2)})
                </button>
              </>
            )}
          </div>
        )}

        {/* SUB-SCREEN 4: CUSTOMER HEALTH PROFILE & MEDICINE CABINET */}
        {currentStep === 'profile' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Profile Toast Banner */}
            {profileToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-medium flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-none" />
                  <span>{profileToast}</span>
                </div>
                <button onClick={() => setProfileToast(null)} className="text-emerald-700 font-bold ml-2">
                  ×
                </button>
              </div>
            )}

            {/* Profile Overview Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-base font-mono">
                    {currentUser?.name
                      ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'AM'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-white">
                        {currentUser?.name || 'Alex Morgan'}
                      </h3>
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[9px] font-bold uppercase">
                        Verified Patient
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {currentUser?.email || 'alex.morgan@healthmail.com'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {currentUser?.phone || '+1 (555) 234-5678'} • SoHo, NY
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stat Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block">Total Generic Savings</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">$412.80</span>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block">Active Prescriptions</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">3 Rx</span>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block">Assigned Pharmacy</span>
                  <span className="text-[11px] font-bold text-slate-200 mt-0.5 block truncate">Apollo #104</span>
                </div>
              </div>
            </div>

            {/* Section 1: Virtual Medicine Cabinet */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-cyan-600" />
                  My Virtual Medicine Cabinet
                </h4>
                <button
                  onClick={() => {
                    setProfileToast('Scanning barcode to link new medication...');
                    setTimeout(() => setCurrentStep('scan'), 400);
                  }}
                  className="text-[10px] text-cyan-600 font-semibold hover:underline cursor-pointer"
                >
                  + Add Rx Medication
                </button>
              </div>

              {/* Medicine 1 */}
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">Atorvastatin 20mg</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Generic for Lipitor®
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Mfg: Cipla USA • Dosage: 1 tablet daily with evening meal
                    </p>
                    <p className="text-[10px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 18 days supply remaining (Refill available)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileToast('Refill request sent to Apollo Care Pharmacy #104!');
                      setTimeout(() => setProfileToast(null), 4000);
                    }}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold text-[10px] cursor-pointer shadow-2xs"
                  >
                    Request Refill
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px]">
                  <span className="text-slate-500">Auto-Refill Schedule:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefillAtorvastatin}
                      onChange={(e) => {
                        setAutoRefillAtorvastatin(e.target.checked);
                        setProfileToast(
                          e.target.checked
                            ? 'Auto-refill enabled for Atorvastatin 20mg'
                            : 'Auto-refill disabled for Atorvastatin 20mg'
                        );
                        setTimeout(() => setProfileToast(null), 3000);
                      }}
                      className="accent-cyan-600 w-3.5 h-3.5"
                    />
                    <span className="font-medium text-slate-700">Auto-Ship via Apollo Care</span>
                  </label>
                </div>
              </div>

              {/* Medicine 2 */}
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">Metformin 500mg ER</span>
                      <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">
                        Generic for Glucophage® XR
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Mfg: Aurobindo • Dosage: 1 tablet BID with food
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> 24 days supply remaining
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileToast('Refill request sent to Apollo Care Pharmacy #104!');
                      setTimeout(() => setProfileToast(null), 4000);
                    }}
                    className="px-2.5 py-1 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    Refill
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px]">
                  <span className="text-slate-500">Auto-Refill Schedule:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefillMetformin}
                      onChange={(e) => {
                        setAutoRefillMetformin(e.target.checked);
                        setProfileToast(
                          e.target.checked
                            ? 'Auto-refill enabled for Metformin 500mg'
                            : 'Auto-refill disabled for Metformin 500mg'
                        );
                        setTimeout(() => setProfileToast(null), 3000);
                      }}
                      className="accent-cyan-600 w-3.5 h-3.5"
                    />
                    <span className="font-medium text-slate-700">Auto-Ship via Apollo Care</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 1.5: Apple HealthKit & Google Health Connect Sync */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Apple HealthKit &amp; Google Health Sync
                </h4>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                  Active Link
                </span>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Connected PHR Source:</span>
                  <strong className="text-slate-800">Apple HealthKit (Bi-Directional)</strong>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">BP Vitals</span>
                    <strong className="text-slate-800 font-mono">118/76</strong>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">Glucose CGM</span>
                    <strong className="text-emerald-700 font-mono">96 mg/dL</strong>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">Adherence</span>
                    <strong className="text-purple-700 font-mono">14 Days 🔥</strong>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">Verified Drug Allergies:</span>
                  <span className="text-rose-600 font-semibold font-mono">Penicillin, NSAIDs</span>
                </div>
              </div>
            </div>

            {/* Section 2: Health Insurance & Pre-Tax HSA Wallet */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                Insurance &amp; Payment Wallet
              </h4>

              <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Primary Health Coverage:</span>
                  <span className="font-bold text-slate-800">
                    {currentUser?.insuranceProvider || 'BlueCross Anthem Select'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Member Rx Group / ID:</span>
                  <span className="font-mono font-bold text-slate-700">
                    {currentUser?.memberId || 'BC-99420-ALEX'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                  <span className="text-slate-500">Pre-Tax HSA/FSA Balance:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ${(currentUser?.hsaFsaBalance || 840.5).toFixed(2)} Available
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Recent Order Dispatches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-600" />
                  Recent Dispense Orders
                </h4>
                <button
                  onClick={onNavigateToPharmacy}
                  className="text-[10px] text-cyan-600 font-semibold hover:underline cursor-pointer"
                >
                  View in Pharmacy Hub →
                </button>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-xs">#GEN-ORD-88219</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                    SwiftRx Courier En Route
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Apollo Care Pharmacy #104 • 2 items (Atorvastatin 20mg, Metformin 500mg)
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                  <span className="text-slate-500">Escrow Value: $22.50</span>
                  <span className="text-emerald-700 font-bold">ETA: ~12 mins</span>
                </div>
              </div>
            </div>

            {/* Account Settings & Auth Actions */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth();
                  else alert('Unified Auth Screen is accessible from the top navigation bar.');
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch Account / Sign In as Different Role</span>
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Data protected under HIPAA &amp; 21 CFR Part 11 regulations.
              </p>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <div className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-slate-500 text-[10px] font-medium">
          <button
            onClick={() => setCurrentStep('discover')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              currentStep === 'discover' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setCurrentStep('scan')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              currentStep === 'scan' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Scan Rx</span>
          </button>
          <button
            onClick={() => setCurrentStep('checkout')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              currentStep === 'checkout' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Checkout</span>
          </button>
          <button
            onClick={() => setCurrentStep('profile')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              currentStep === 'profile' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
