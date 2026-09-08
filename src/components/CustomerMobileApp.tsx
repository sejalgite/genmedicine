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
} from 'lucide-react';
import { MobileSubScreen } from '../types';

interface CustomerMobileAppProps {
  onOrderPlaced: (orderData: any) => void;
  onNavigateToPharmacy: () => void;
}

export const CustomerMobileApp: React.FC<CustomerMobileAppProps> = ({
  onOrderPlaced,
  onNavigateToPharmacy,
}) => {
  const [currentStep, setCurrentStep] = useState<MobileSubScreen>('discover');
  const [searchQuery, setSearchQuery] = useState('Atorvastatin 20mg');
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(true);
  const [substituteLipitor, setSubstituteLipitor] = useState(true);
  const [substituteMetformin, setSubstituteMetformin] = useState(true);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'express' | 'scheduled' | 'pickup'>('express');
  const [countdownSeconds, setCountdownSeconds] = useState(899); // 14:59
  const [orderSuccess, setOrderSuccess] = useState(false);

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

        {/* SUB-SCREEN 2: AI PRESCRIPTION SCANNER & VALIDATION (Matching Image 7) */}
        {currentStep === 'scan' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-600">Step 2 of 3</span>
                <h3 className="text-sm font-bold text-slate-900">AI Document Scanner &amp; Validation</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[10px] font-bold">
                OCR 99.2% High Conf
              </span>
            </div>

            {/* Document Preview Canvas with Bounding Boxes */}
            <div className="relative bg-slate-100 border border-slate-300 rounded-xl p-3 overflow-hidden shadow-inner">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 space-y-2 font-mono text-[10px] text-slate-600">
                <div className="flex justify-between border-b pb-1 text-slate-400">
                  <span>METROPOLITAN HEALTH CLINIC</span>
                  <span>Rx #99420-B</span>
                </div>
                <div className="text-slate-800 font-sans">
                  <strong>Patient:</strong> Alex Morgan • <strong>Date:</strong> Sep 08, 2026
                </div>

                {/* Bounding Box 1 */}
                <div className="p-1.5 border-2 border-cyan-500 bg-cyan-500/10 rounded relative">
                  <span className="absolute -top-2 right-1 bg-cyan-600 text-white text-[8px] px-1 rounded">
                    OCR Conf 99.4%
                  </span>
                  <div className="font-bold text-slate-900">Lipitor (Atorvastatin) 20mg — Sig: 1 tab daily</div>
                </div>

                {/* Bounding Box 2 */}
                <div className="p-1.5 border-2 border-indigo-500 bg-indigo-500/10 rounded relative">
                  <span className="absolute -top-2 right-1 bg-indigo-600 text-white text-[8px] px-1 rounded">
                    OCR Conf 98.2%
                  </span>
                  <div className="font-bold text-slate-900">Glucophage XR (Metformin) 500mg — Sig: 1 tab BID</div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[9px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Dr. Sarah Jenkins Digital Signature Verified
                  </span>
                  <span>Clinic Stamp Legible</span>
                </div>
              </div>
            </div>

            {/* Extracted Medications with Substitution Toggles */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800">Extracted Medications &amp; Substitution Engine:</h4>

              {/* Drug 1 */}
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">1. Atorvastatin 20mg (30 Tabs)</span>
                  <span className="font-mono font-bold text-cyan-800 text-xs">$14.20</span>
                </div>
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-cyan-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={substituteLipitor}
                    onChange={(e) => setSubstituteLipitor(e.target.checked)}
                    className="accent-cyan-600 w-4 h-4"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-cyan-800">Generic Cipla Substitution Recommended</span>
                    <span className="text-slate-500 block">Replaces Pfizer Lipitor® (Save $28.30)</span>
                  </div>
                </label>
              </div>

              {/* Drug 2 */}
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">2. Metformin 500mg ER (60 Tabs)</span>
                  <span className="font-mono font-bold text-cyan-800 text-xs">$4.80</span>
                </div>
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={substituteMetformin}
                    onChange={(e) => setSubstituteMetformin(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-indigo-800">Generic Aurobindo Substitution Recommended</span>
                    <span className="text-slate-500 block">Replaces Glucophage® XR (Save $6.70)</span>
                  </div>
                </label>
              </div>
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
          <button className="flex flex-col items-center gap-1 cursor-pointer">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
