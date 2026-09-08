import React, { useState } from 'react';
import {
  Building2,
  Users,
  Store,
  Key,
  ShieldCheck,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Smartphone,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  CreditCard,
  Network,
} from 'lucide-react';
import { TenantUser, DispensaryOutlet } from '../types';

interface TenantAdminPortalProps {
  users: TenantUser[];
  outlets: DispensaryOutlet[];
  onAddUser: (user: TenantUser) => void;
  onAddOutlet: (outlet: DispensaryOutlet) => void;
}

export const TenantAdminPortal: React.FC<TenantAdminPortalProps> = ({
  users,
  outlets,
  onAddUser,
  onAddOutlet,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [searchMember, setSearchMember] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const apiKey = 'sk_live_apollo_9942_89f0a21d9b32e180';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handlePingWebhook = () => {
    setWebhookStatus('Sending test ping to https://api.apollohealth.internal/v1/orders/webhook...');
    setTimeout(() => {
      setWebhookStatus('HTTP 200 OK — Handshake authenticated with HMAC-SHA256 signature.');
    }, 1000);
    setTimeout(() => {
      setWebhookStatus(null);
    }, 5000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      u.email.toLowerCase().includes(searchMember.toLowerCase()) ||
      u.role.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800 flex flex-col font-sans">
      {/* Top Organization Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              AH
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apollo Health Group</h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-xs font-semibold">
                  TEN-APOLLO-9942
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  PostgreSQL Sandboxing: Strict
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-mono">
                <span>Data Residency: US-East</span>
                <span>•</span>
                <span>HIPAA BAA: Active</span>
                <span>•</span>
                <span>KMS-BYOK: Hardware HSM</span>
                <span>•</span>
                <span className="text-emerald-600 font-sans font-medium">100% Tenant Isolation Verified</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons & User Profile */}
          <div className="flex items-center gap-2.5 self-start lg:self-center flex-wrap">
            <button
              onClick={() => setShowOutletModal(true)}
              className="h-9 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Store className="w-4 h-4 text-indigo-600" />
              + Register New Outlet
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Users className="w-4 h-4" />
              + Invite Member
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200">
                ER
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800">Elena Rostova</div>
                <div className="text-[10px] text-slate-500">Tenant Admin (VP Ops)</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
        {/* KPI Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Members</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">142</span>
              <span className="text-xs text-slate-500 font-medium">/ 200 seats allocated</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">71% Seat Utilization</span>
              <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Upgrade Seats</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Dispensary Outlets</span>
              <Store className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">{outlets.length} Active</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                100% Online
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Inventory Sync SLA</span>
              <span className="text-emerald-600 font-mono font-medium">&lt; 30s Real-time</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Monthly API Quota</span>
              <Network className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">2.4M</span>
              <span className="text-xs text-slate-500">/ 5.0M reqs (48%)</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Rate Limit: 2,500 req/min</span>
              <span className="text-emerald-600 font-medium">Unthrottled</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Current Plan</span>
              <CreditCard className="w-4 h-4 text-violet-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">$12,450</span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Enterprise Dedicated</span>
              <span className="text-slate-700 font-mono">Renews Oct 1, 2026</span>
            </div>
          </div>
        </section>

        {/* Webhook notification banner */}
        {webhookStatus && (
          <div className="bg-slate-900 text-cyan-300 p-3 rounded-lg text-xs font-mono flex items-center justify-between border border-cyan-700 shadow-md">
            <span>{webhookStatus}</span>
            <button onClick={() => setWebhookStatus(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2-Column Split: Main Team & Outlets vs Tenant Security & Webhooks */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left 8 Cols: Organization Users & RBAC Permissions */}
          <div className="xl:col-span-8 space-y-6">
            {/* Team Members Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Organization Users &amp; RBAC Permissions</h2>
                  <p className="text-xs text-slate-500">
                    Granular role definitions with MFA enforcement and physical store scope confinement.
                  </p>
                </div>
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    placeholder="Search member name, email..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold tracking-wider">
                      <th className="py-3 px-4">Member Name &amp; Email</th>
                      <th className="py-3 px-4">Role &amp; Privilege</th>
                      <th className="py-3 px-4">Store / Scope Confinement</th>
                      <th className="py-3 px-4">MFA Security</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200">
                              {user.initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{user.name}</div>
                              <div className="text-slate-500 font-mono text-[11px]">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              user.role.includes('Dispenser')
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : user.role.includes('Inventory')
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : user.role.includes('Compliance')
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{user.scope}</div>
                          <div className="text-slate-400 text-[11px]">{user.location}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                user.mfaType === 'sms-degraded' ? 'bg-amber-400' : 'bg-emerald-500'
                              }`}
                            ></span>
                            <span className="font-medium text-slate-700">{user.mfaMethod}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Active {user.lastActive}</div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => alert(`Configuring granular permissions for ${user.name}...`)}
                            className="px-2.5 py-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded font-medium cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Managed Physical Dispensaries & Outlets */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Managed Physical Dispensaries &amp; Outlets</h2>
                  <p className="text-xs text-slate-500">
                    Retail stores bound to tenant schema partition with real-time stock sync.
                  </p>
                </div>
                <button
                  onClick={() => setShowOutletModal(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Outlet
                </button>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {outlets.map((outlet) => (
                  <div key={outlet.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                        {outlet.outletCode}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {outlet.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 mt-2">{outlet.name}</div>
                    <p className="text-xs text-slate-500 mt-1">{outlet.address}</p>
                    <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-500 font-mono">
                      <span>DEA: {outlet.dea}</span>
                      <span className="text-indigo-600 font-bold">{outlet.skuCount} SKUs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Tenant Security Health, API Tokens & Webhooks */}
          <div className="xl:col-span-4 space-y-6">
            {/* Tenant Isolation Health Widget */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Tenant Isolation Health
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  PASS (100%)
                </span>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">PostgreSQL Schema Sandboxing:</span>
                  <span className="font-bold text-emerald-700">Strict (schema_apollo_chain)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Row-Level Security (RLS):</span>
                  <span className="font-bold text-emerald-700">Enforced on all tables</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">BYOK KMS Encryption:</span>
                  <span className="font-mono text-indigo-700 font-semibold">AWS KMS / HSM-140-2</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Audit Trail Cryptography:</span>
                  <span className="font-mono text-slate-700">SHA-256 Merkle Chained</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Quarterly third-party SOC-2 Type II attestation report available for download under Organization Compliance.
              </div>
            </div>

            {/* API Tokens & Production Webhooks */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  API Tokens &amp; Webhooks
                </h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  v1.2 REST &amp; Kafka
                </span>
              </div>

              {/* API Token Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Active Production Sync Key:
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-700">
                  <span className="truncate flex-1">
                    {showKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-sans cursor-pointer"
                  >
                    {showKey ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                    title="Copy API Key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Used by Apollo Downtown #104 and regional depots for ERP inventory feeds.
                </p>
              </div>

              {/* Webhook Ping Simulator */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Dispense Order Dispatch Webhook:
                </label>
                <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-200 truncate">
                  https://api.apollohealth.internal/v1/orders/webhook
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400">Events: order.dispensed, stock.low</span>
                  <button
                    onClick={handlePingWebhook}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-medium cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
              </div>
            </div>

            {/* Tenant Security Feed */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Tenant Audit Log</h3>
              <div className="space-y-2 text-xs font-mono text-slate-600">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-indigo-600 font-semibold">[14:02]</span> Order #GEN-ORD-88219 routed to Outlet #104.
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-emerald-600 font-semibold">[13:45]</span> Inventory batch sync finished (1,240 items).
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-400">[11:20]</span> User Dr. Michael Chen authenticated via FIDO2 passkey.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Invite Team Member
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('memberName') as HTMLInputElement).value;
                const email = (form.elements.namedItem('memberEmail') as HTMLInputElement).value;
                const role = (form.elements.namedItem('memberRole') as HTMLSelectElement).value;

                onAddUser({
                  id: `usr-${Date.now()}`,
                  name,
                  initials: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
                  email,
                  role,
                  scope: 'Apollo Downtown #104',
                  location: 'New York Hub',
                  mfaMethod: 'TOTP App',
                  mfaType: 'totp',
                  lastActive: 'Just invited',
                  status: 'Invited',
                });

                setShowInviteModal(false);
              }}
              className="py-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Full Name:</label>
                <input
                  name="memberName"
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Foster, PharmD"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Work Email Address:</label>
                <input
                  name="memberEmail"
                  type="email"
                  required
                  placeholder="name@apollohealth.internal"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Role &amp; Permissions Scope:</label>
                <select name="memberRole" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs">
                  <option>Dispenser Authority (Pharmacist Sign-Off)</option>
                  <option>Inventory Manager</option>
                  <option>Compliance Auditor (Read-Only)</option>
                  <option>Billing Specialist</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Outlet Modal */}
      {showOutletModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                Register New Physical Outlet
              </h3>
              <button onClick={() => setShowOutletModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('outletName') as HTMLInputElement).value;
                const address = (form.elements.namedItem('outletAddress') as HTMLInputElement).value;
                const dea = (form.elements.namedItem('outletDea') as HTMLInputElement).value;

                onAddOutlet({
                  id: `out-${Date.now()}`,
                  outletCode: `OUTLET #${Math.floor(100 + Math.random() * 900)}`,
                  name,
                  address,
                  dea,
                  skuCount: 850,
                  status: 'LIVE SYNC',
                });

                setShowOutletModal(false);
              }}
              className="py-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Dispensary / Outlet Name:</label>
                <input
                  name="outletName"
                  type="text"
                  required
                  placeholder="e.g. Apollo Brooklyn Health Plaza"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Physical Address:</label>
                <input
                  name="outletAddress"
                  type="text"
                  required
                  placeholder="Street, City, State, ZIP"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">DEA / State Pharmacy License #:</label>
                <input
                  name="outletDea"
                  type="text"
                  required
                  placeholder="FD-998822"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOutletModal(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Register &amp; Bind Partition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
