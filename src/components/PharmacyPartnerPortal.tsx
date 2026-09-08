import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Truck,
  DollarSign,
  QrCode,
  Lock,
  Thermometer,
  FileCheck,
  ExternalLink,
  ChevronRight,
  UserCheck,
  RotateCcw,
  Sparkles,
  Phone,
  Check,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { DispenseOrder } from '../types';

interface PharmacyPartnerPortalProps {
  orders: DispenseOrder[];
  onApproveOrder: (orderId: string) => void;
}

export const PharmacyPartnerPortal: React.FC<PharmacyPartnerPortalProps> = ({
  orders,
  onApproveOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'verify' | 'queue' | 'courier' | 'vault'>('verify');
  const [activeOrderId, setActiveOrderId] = useState<string>('ord-1');
  const [searchQueue, setSearchQueue] = useState('');
  const [queueFilter, setQueueFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [barcodeScanned1, setBarcodeScanned1] = useState(true);
  const [barcodeScanned2, setBarcodeScanned2] = useState(true);
  const [tamperSealLocked, setTamperSealLocked] = useState(true);
  const [pharmacistSigned, setPharmacistSigned] = useState(true);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const handleApprove = () => {
    if (!activeOrder) return;
    onApproveOrder(activeOrder.id);
    setActionSuccessNotice(
      `Order ${activeOrder.orderNumber} approved & released! Escrow ($${activeOrder.escrowValue.toFixed(2)}) released to Pharmacy Vault. Courier notified.`
    );
    setTimeout(() => setActionSuccessNotice(null), 6000);
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQueue.toLowerCase()) ||
      ord.patientName.toLowerCase().includes(searchQueue.toLowerCase()) ||
      ord.rxNumber.toLowerCase().includes(searchQueue.toLowerCase());
    if (!matchesSearch) return false;
    if (queueFilter === 'pending') return ord.status !== 'Completed' && ord.status !== 'Dispatched';
    if (queueFilter === 'completed') return ord.status === 'Completed' || ord.status === 'Dispatched';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7fafc] text-slate-800 flex flex-col font-sans">
      {/* Pharmacy Hub Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Apollo Care Pharmacy #104</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
                  NYC-DOWNTOWN-104
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Licensed Pharmacist on Duty: <strong className="text-slate-700">Dr. Michael Chen, PharmD</strong> (#NY-PHARM-440291)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-slate-600 font-medium">Auto-Order Ingest:</span>
              <span className="font-bold text-emerald-600 font-mono">Kafka Live</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
              <span>DEA: FD-991204</span>
              <span>•</span>
              <span>NY Board of Pharmacy Reg</span>
            </div>
          </div>
        </div>
      </header>

      {/* Success banner */}
      {actionSuccessNotice && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-medium flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button onClick={() => setActionSuccessNotice(null)} className="text-emerald-200 hover:text-white cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
        {/* KPI Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Orders Awaiting Dispense</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">{orders.length}</span>
              <span className="text-xs text-amber-600 font-semibold">Ready for verification</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Target SLA: 45 min fulfillment</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Pharmacist Verifications</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">100%</span>
              <span className="text-xs text-emerald-600 font-semibold">DDI Auto-Checked</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Zero drug interaction warnings</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Escrow Pending Release</span>
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">$4,820.50</span>
              <span className="text-xs text-slate-500">22 Orders</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Settles to Pharmacy Vault on handoff</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Generic Dispense Rate</span>
              <Sparkles className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">84.2%</span>
              <span className="text-xs text-cyan-600 font-semibold">+8.1% vs branded</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Savings Generated: $3,210.00 today</p>
          </div>
        </section>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'verify'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Verification &amp; Dispense Station</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'verify' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {activeOrder.orderNumber}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'queue'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Incoming Dispense Queue</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'queue' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('courier')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'courier'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>SwiftRx Courier &amp; Telemetry</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'courier' ? 'bg-emerald-700 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {activeOrder.courier.etaMinutes}m ETA
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'vault'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pharmacy Vault &amp; Escrow</span>
          </button>
        </div>

        {/* Tab 1: Verification & Dispense Station */}
        {activeTab === 'verify' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-5 p-6">
            {/* Active Order Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900">{activeOrder.orderNumber}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      activeOrder.status === 'Completed' || activeOrder.status === 'Dispatched'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {activeOrder.status}
                  </span>
                  {activeOrder.isColdChain && (
                    <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-semibold flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5" />
                      Cold-Chain Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Recipient: <strong className="text-slate-800">{activeOrder.patientName}</strong> • {activeOrder.patientAddress}
                </p>
              </div>

              {/* Quick queue switcher dropdown or notice */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">SLA Fulfillment Target</div>
                  <div className="text-base font-bold font-mono text-emerald-600">
                    {activeOrder.slaMinutesRemaining}m remaining
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('queue')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  Switch Order
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Prescriber & Rx Document Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Prescription ID:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{activeOrder.rxNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Prescribing Physician:</span>
                <span className="font-semibold text-slate-800">{activeOrder.prescriber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">NPI &amp; State License:</span>
                <span className="font-mono text-slate-700">{activeOrder.prescriberNpi} (Registry Verified)</span>
              </div>
            </div>

            {/* Physical Lot Verification & Barcode Matching Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  Physical Fulfillment &amp; Lot Barcode Verification
                </h3>
                <span className="text-xs text-slate-500 font-mono">Scan package barcode to confirm active lot</span>
              </div>

              <div className="space-y-3">
                {activeOrder.items.map((item, index) => {
                  const isScanned = index === 0 ? barcodeScanned1 : barcodeScanned2;
                  const setScanned = index === 0 ? setBarcodeScanned1 : setBarcodeScanned2;

                  return (
                    <div
                      key={item.barcode}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{item.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-semibold">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Active Salt: <span className="text-slate-700 font-medium">{item.genericSalt}</span> • {item.dosage}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1.5 flex-wrap">
                          <span>Lot: {item.lotNumber}</span>
                          <span>•</span>
                          <span>Expiry: {item.expiryDate}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">Replaces Brand: {item.brandDisplaced}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <div className="text-base font-bold text-slate-900">${item.price.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">Consumer Saves ${item.savings.toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => setScanned(!isScanned)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                            isScanned
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <Check className={`w-4 h-4 ${isScanned ? 'text-emerald-600' : 'text-slate-400'}`} />
                          {isScanned ? 'Verified & Matched' : 'Scan Barcode'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Packaging & Cold-Chain Sensor Verification */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-slate-900">Packaging &amp; Cold-Chain Sensor Check</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Sensor: {activeOrder.packagingColdChain.tempRange}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={tamperSealLocked}
                    onChange={(e) => setTamperSealLocked(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4 rounded"
                  />
                  <span>
                    Tamper-Evident Security Seal Locked (Tag <strong className="font-mono text-slate-800">{activeOrder.packagingColdChain.sensorTag}</strong>)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={pharmacistSigned}
                    onChange={(e) => setPharmacistSigned(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4 rounded"
                  />
                  <span>
                    DDI Engine Pass &amp; Digital Sign-Off (<strong className="font-mono text-slate-800">{activeOrder.ddiCheck.hash}</strong>)
                  </span>
                </label>
              </div>
            </div>

            {/* Pharmacist Action CTA Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-emerald-950/10 border border-emerald-500/30">
              <div>
                <div className="text-base font-bold text-emerald-900">Final Pharmacist Verification Sign-Off</div>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Releasing triggers instantaneous courier dispatch notification and releases $
                  {activeOrder.escrowValue.toFixed(2)} from consumer escrow to Pharmacy Vault.
                </p>
              </div>

              <button
                disabled={!barcodeScanned1 || !barcodeScanned2 || !tamperSealLocked || !pharmacistSigned}
                onClick={handleApprove}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                Approve &amp; Release to Courier
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Incoming Dispense Queue */}
        {activeTab === 'queue' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Incoming Dispense Queue</h2>
                <p className="text-xs text-slate-500">
                  Prescription orders dispatched by tenant network awaiting pharmacist fulfillment.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQueue}
                    onChange={(e) => setSearchQueue(e.target.value)}
                    placeholder="Search order #, patient, Rx..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex rounded-lg border border-slate-200 p-0.5 text-xs bg-slate-50">
                  <button
                    onClick={() => setQueueFilter('all')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                      queueFilter === 'all' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setQueueFilter('pending')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                      queueFilter === 'pending' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setQueueFilter('completed')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                      queueFilter === 'completed' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold tracking-wider">
                    <th className="py-3 px-4">Order &amp; Rx Details</th>
                    <th className="py-3 px-4">Patient &amp; Address</th>
                    <th className="py-3 px-4">Prescribed Medicines</th>
                    <th className="py-3 px-4">Cold-Chain</th>
                    <th className="py-3 px-4">Escrow Value</th>
                    <th className="py-3 px-4">Fulfillment SLA</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-50/70 transition ${
                        ord.id === activeOrderId ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-slate-400 text-[11px]">Rx: {ord.rxNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{ord.patientName}</div>
                        <div className="text-slate-400 text-[11px] truncate max-w-xs">{ord.patientAddress}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">
                          {ord.items.map((i) => i.name).join(', ')}
                        </div>
                        <div className="text-emerald-600 text-[11px]">
                          {ord.items.length} Generic Equivalent{ord.items.length > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.isColdChain ? (
                          <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 text-[11px] font-semibold flex items-center gap-1 w-fit">
                            <Thermometer className="w-3 h-3" />
                            {ord.packagingColdChain.tempRange}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Standard Ambient</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ${ord.escrowValue.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-emerald-600">
                          {ord.slaMinutesRemaining}m target
                        </span>
                        <div className="text-[10px] text-slate-400">{ord.timeAgo}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveOrderId(ord.id);
                            setActiveTab('verify');
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <span>Load Order</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: SwiftRx Courier Telemetry */}
        {activeTab === 'courier' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-base text-slate-900">SwiftRx Medical Logistics Dispatch</h3>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  ETA {activeOrder.courier.etaMinutes} mins
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Carrier Service:</span>
                  <span className="font-bold text-slate-800">{activeOrder.courier.company}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Assigned Driver:</span>
                  <span className="font-bold text-slate-900">{activeOrder.courier.driverName}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Vehicle Fleet Type:</span>
                  <span className="font-medium text-slate-800">{activeOrder.courier.vehicleType}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Telemetry Status:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {activeOrder.courier.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => alert(`Dialing courier driver ${activeOrder.courier.driverName} at ${activeOrder.courier.driverPhone}...`)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Call Courier ({activeOrder.courier.driverPhone})
                </button>
                <button
                  onClick={() => alert('Live GPS tracking overlay engaged: Driver is 1.4 miles away heading South on Broadway.')}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live GPS Radar
                </button>
              </div>
            </div>

            {/* Waypoint simulation card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Delivery Route Waypoints
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Checkpoint 1: Dispatch Received</div>
                    <div className="text-slate-500 mt-0.5">Order confirmed by Apollo Pharmacy #104 packaging desk.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50/50 border border-indigo-200">
                  <Truck className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Checkpoint 2: En Route to Pharmacy Pickup</div>
                    <div className="text-slate-500 mt-0.5">Driver Carlos Vance is 4 mins away with refrigerated carry vault.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 opacity-60">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">Checkpoint 3: Final Delivery Hand-off</div>
                    <div className="text-slate-500 mt-0.5">{activeOrder.patientAddress} (Signature Required upon arrival).</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pharmacy Vault & Escrow */}
        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Pharmacy Vault Balance
                </h3>
              </div>

              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Available for Payout</div>
                <div className="text-3xl font-bold font-mono text-slate-900 mt-1">$28,490.15</div>
                <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +14.2% week-over-week
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Escrow in Transit:</span>
                  <span className="font-mono font-bold text-slate-900">$4,820.50</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Auto-ACH Sweep:</span>
                  <span className="font-medium text-slate-800">Every Friday (Chase ****8891)</span>
                </div>
              </div>

              <button
                onClick={() => alert('Initiating manual instant ACH payout to linked pharmacy operating account...')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Request Instant Transfer
              </button>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">Recent Escrow Releases &amp; Settlement Log</h3>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">ORD-2026-9810</span>
                    <span className="text-slate-500 ml-2">Atorvastatin + Metformin • Patient S. Miller</span>
                  </div>
                  <span className="text-emerald-700 font-bold">+$142.50 Settled</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">ORD-2026-9784</span>
                    <span className="text-slate-500 ml-2">Rosuvastatin • Patient J. Doe</span>
                  </div>
                  <span className="text-emerald-700 font-bold">+$88.00 Settled</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">ORD-2026-9762</span>
                    <span className="text-slate-500 ml-2">Lisinopril + Amlodipine • Patient E. Rostova</span>
                  </div>
                  <span className="text-emerald-700 font-bold">+$65.20 Settled</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
