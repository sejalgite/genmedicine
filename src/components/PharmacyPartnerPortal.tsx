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
  const [activeOrderId, setActiveOrderId] = useState<string>('ord-1');
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
          <button onClick={() => setActionSuccessNotice(null)} className="text-emerald-200 hover:text-white">
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
              <span className="text-2xl font-bold text-slate-900 font-mono">14</span>
              <span className="text-xs text-amber-600 font-semibold">3 Expedited</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Target SLA: 45 min fulfillment</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Pharmacist Verifications</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">6</span>
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
              <span>Today's Generic Dispense Rate</span>
              <Sparkles className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">84.2%</span>
              <span className="text-xs text-cyan-600 font-semibold">+8.1% vs branded</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Savings Generated: $3,210.00 today</p>
          </div>
        </section>

        {/* 2-Column Core Dispense Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Active Dispense Order Focus */}
          <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-5 p-5">
            {/* Active Order Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">{activeOrder.orderNumber}</h2>
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

              {/* SLA Target Countdown */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-right">
                <div className="text-[10px] uppercase font-semibold text-slate-400">SLA Fulfillment Target</div>
                <div className="text-base font-bold font-mono text-emerald-600">
                  {activeOrder.slaMinutesRemaining}m remaining
                </div>
              </div>
            </div>

            {/* Prescriber & Rx Document Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Prescription #</span>
                <span className="font-mono font-bold text-slate-800">{activeOrder.rxNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Prescriber MD:</span>
                <span className="font-medium text-slate-800">{activeOrder.prescriber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Prescriber NPI / State Lic:</span>
                <span className="font-mono text-slate-700">{activeOrder.prescriberNpi} (Verified)</span>
              </div>
            </div>

            {/* Physical Lot Verification & Barcode Matching Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  Physical Fulfillment &amp; Lot Barcode Verification
                </h3>
                <span className="text-xs text-slate-500 font-mono">Scan barcode to match lot ID</span>
              </div>

              <div className="space-y-3">
                {activeOrder.items.map((item, index) => {
                  const isScanned = index === 0 ? barcodeScanned1 : barcodeScanned2;
                  const setScanned = index === 0 ? setBarcodeScanned1 : setBarcodeScanned2;

                  return (
                    <div
                      key={item.barcode}
                      className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{item.name}</span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono">
                            {item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Active Salt: <span className="text-slate-700">{item.genericSalt}</span> • {item.dosage}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                          <span>Lot: {item.lotNumber}</span>
                          <span>•</span>
                          <span>{item.expiryDate}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">Replaces: {item.brandDisplaced}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <div className="text-sm font-bold text-slate-900">${item.price.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">Save ${item.savings.toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => setScanned(!isScanned)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            isScanned
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isScanned ? 'text-emerald-600' : 'text-slate-400'}`} />
                          {isScanned ? 'Verified & Matched' : 'Scan Barcode'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Packaging & Cold-Chain Sensor Verification */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-slate-900">Packaging &amp; Cold-Chain Seal Status</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeOrder.packagingColdChain.tempRange}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tamperSealLocked}
                    onChange={(e) => setTamperSealLocked(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>
                    Tamper-Evident Security Seal Locked (Tag <strong className="font-mono text-slate-800">{activeOrder.packagingColdChain.sensorTag}</strong>)
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pharmacistSigned}
                    onChange={(e) => setPharmacistSigned(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>
                    DDI Engine Pass &amp; Digital Sign-Off (<strong className="font-mono text-slate-800">{activeOrder.ddiCheck.hash}</strong>)
                  </span>
                </label>
              </div>
            </div>

            {/* Pharmacist Action CTA Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/30">
              <div>
                <div className="text-sm font-bold text-emerald-900">Final Verification Sign-Off</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Releasing triggers instantaneous courier dispatch notification and releases $
                  {activeOrder.escrowValue.toFixed(2)} from consumer escrow to Pharmacy Vault.
                </p>
              </div>

              <button
                disabled={!barcodeScanned1 || !barcodeScanned2 || !tamperSealLocked || !pharmacistSigned}
                onClick={handleApprove}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                Approve &amp; Release to Courier
              </button>
            </div>
          </div>

          {/* Right Column (4 cols): SwiftRx Courier Telemetry & Dispense Queue */}
          <div className="xl:col-span-4 space-y-6">
            {/* SwiftRx Medical Courier Telemetry Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">SwiftRx Medical Courier</h3>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  ETA {activeOrder.courier.etaMinutes} mins
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Carrier Service:</span>
                  <span className="font-medium text-slate-800">{activeOrder.courier.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Assigned Driver:</span>
                  <span className="font-bold text-slate-900">{activeOrder.courier.driverName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vehicle Type:</span>
                  <span className="font-medium text-slate-800">{activeOrder.courier.vehicleType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    {activeOrder.courier.status}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => alert(`Dialing courier driver ${activeOrder.courier.driverName} at ${activeOrder.courier.driverPhone}...`)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Courier
                </button>
                <button
                  onClick={() => alert('Opening live vehicle GPS tracking overlay...')}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live GPS
                </button>
              </div>
            </div>

            {/* Incoming Dispense Queue List */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Incoming Dispense Queue</h3>
                <span className="text-xs text-slate-500 font-mono">{orders.length} in queue</span>
              </div>

              <div className="space-y-2.5">
                {orders.map((ord) => {
                  const isSelected = ord.id === activeOrderId;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setActiveOrderId(ord.id)}
                      className={`p-3 rounded-lg border text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ord.timeAgo}</span>
                      </div>
                      <div className="font-medium text-slate-800 mt-1">{ord.patientName}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {ord.items.map((i) => i.name).join(', ')}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60 text-[11px]">
                        <span className="text-slate-400 font-mono">${ord.escrowValue.toFixed(2)} Escrow</span>
                        <span
                          className={`font-semibold ${
                            ord.status === 'Completed' || ord.status === 'Dispatched'
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
