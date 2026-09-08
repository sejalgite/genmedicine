import React, { useState } from 'react';
import {
  Network,
  Shield,
  Server,
  Database,
  Layers,
  Activity,
  Cpu,
  Boxes,
  Lock,
  GitBranch,
  Search,
  DollarSign,
  Cloud,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const ArchitectureVisualizer: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useState<number>(1);
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const flows = [
    {
      id: 1,
      title: 'Flow 1: Medicine Search & Ranking Comparison',
      steps: [
        'Customer enters search term on Mobile / Web App.',
        'Edge Layer (Cloudflare + API Gateway) verifies JWT and rate limits.',
        'Search & Ranking Module queries OpenSearch Cluster with tenant weights.',
        'Redis Read-Through Cache returns cached canonical generic formulations in <18ms.',
        'Clinical Equivalence Guardrail & Bioequivalence AB badges applied before delivery.',
      ],
    },
    {
      id: 2,
      title: 'Flow 2: Order Placement, Escrow & Pharmacy Dispatch',
      steps: [
        'Alex Morgan confirms substitution with Apollo Care Pharmacy #104.',
        'Order & Escrow Service reserves stock and locks payment in escrow vault.',
        'Kafka Event Bus publishes `order.created` event to partition topic.',
        'Pharmacy Partner Portal picks up order; Dr. Michael Chen scans lot barcodes.',
        'Cold-chain temperature tag verified; order released to SwiftRx courier.',
      ],
    },
    {
      id: 3,
      title: 'Flow 3: Real-Time B2B Inventory & Catalog Sync',
      steps: [
        'PharmaCore / Cipla B2B API pushes updated wholesale batch manifest.',
        'Differential Sync Worker validates FDA Orange Book ANDA dossier certification.',
        'PostgreSQL isolated tenant schema (`schema_cipla_b2b`) updated via transaction.',
        'OpenSearch reverse-index regenerated for active market substitution queries.',
      ],
    },
    {
      id: 4,
      title: 'Flow 4: Tenant Onboarding & PostgreSQL Schema Sandboxing',
      steps: [
        'Super Admin or Tenant Admin initiates registration of new pharmacy group.',
        'PostgreSQL Migration Engine spins up new isolated schema: `CREATE SCHEMA tenant_x;`.',
        'Row-Level Security (RLS) policies and KMS BYOK encryption keys generated.',
        'Admin invite issued with mandatory FIDO2 / TOTP MFA authentication.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Architecture Header */}
        <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                SYSTEM SPECIFICATION v3.2
              </span>
              <span className="text-xs text-slate-400 font-mono">13-LAYER ARCHITECTURAL BLUEPRINT</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 tracking-tight">
              Multi-Tenant SaaS Platform Architecture
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              High-throughput, HIPAA-compliant, micro-partitioned architecture separating client tiers, edge gateways,
              isolated PostgreSQL schemas, Redis caching, and OpenSearch ranking engines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24 PostgreSQL Schemas Active
            </span>
          </div>
        </div>

        {/* 13 Architectural Modules Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Layer 1: Clients & Actors */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-xs font-mono font-bold uppercase">1. Clients / Users</span>
              <Boxes className="w-4 h-4" />
            </div>
            <ul className="text-xs space-y-1.5 text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                <span>Customer Mobile App (React Native / Web)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                <span>Pharmacy Dispense Hub (Apollo #104 Portal)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                <span>Medicine Company B2B (Cipla Global API)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                <span>Tenant Admin (Apollo Health Group)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                <span>Super Admin (Platform Ops Console)</span>
              </li>
            </ul>
          </div>

          {/* Layer 2: Edge & Security */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-mono font-bold uppercase">2. Edge &amp; Security</span>
              <Shield className="w-4 h-4" />
            </div>
            <ul className="text-xs space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                <span>DNS + Cloudflare CDN Edge Cache</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                <span>WAF DDoS Protection &amp; SSL/TLS 1.3</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                <span>ALB / Nginx Reverse Proxy (Port 3000)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                <span>API Gateway (Rate Limiter + JWT Validator)</span>
              </li>
            </ul>
          </div>

          {/* Layer 3: Application & Modules */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-mono font-bold uppercase">3. Application Services</span>
              <Server className="w-4 h-4" />
            </div>
            <ul className="text-xs space-y-1.5 text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>Ranking &amp; Trust Weight Tuner</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>Order Placement &amp; Escrow Vault</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>Rx OCR AI Document Scanner</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>Kafka Event Bus &amp; Background Workers</span>
              </li>
            </ul>
          </div>

          {/* Layer 4: Multi-Tenant Data Layer */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-mono font-bold uppercase">4. Data Isolation Layer</span>
              <Database className="w-4 h-4" />
            </div>
            <ul className="text-xs space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span>PostgreSQL 16 (Separate Schemas)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span>schema_tenant_apollo / cipla / medplus</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span>Redis Read-Through Cache (99.4% Hit)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span>OpenSearch Cluster (18ms Search SLA)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Business Flow Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                Key Business Flows (End-to-End Tracing)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select a critical platform workflow to view its architectural execution pathway across services.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {flows.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFlow(f.id)}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition whitespace-nowrap ${
                    selectedFlow === f.id
                      ? 'bg-cyan-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Flow {f.id}
                </button>
              ))}
            </div>
          </div>

          {/* Active Flow Walkthrough */}
          {(() => {
            const activeFlow = flows.find((f) => f.id === selectedFlow) || flows[0];
            return (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-cyan-300">{activeFlow.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {activeFlow.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[11px] font-bold flex items-center justify-center border border-cyan-700">
                          {idx + 1}
                        </span>
                        {idx < activeFlow.steps.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-slate-600 hidden md:block" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Architectural Decisions & Tenancy Specification Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Key Architectural Decisions &amp; Multi-Tenant Guarantees
            </h2>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Architecture Component</th>
                  <th className="py-3 px-4">Production Choice</th>
                  <th className="py-3 px-4">Tenant Isolation Mechanism</th>
                  <th className="py-3 px-4">SLA &amp; Compliance Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Database Isolation</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">PostgreSQL (Separate Schemas)</td>
                  <td className="py-3 px-4">Schema partition per tenant (`schema_tenant_id`) with strict search_path</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">0 cross-tenant data leaks guaranteed</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Search &amp; Comparison Engine</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">OpenSearch 2.x Cluster</td>
                  <td className="py-3 px-4">Alias-based index filtering with tenant ID routing keys</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">p95 search latency &lt; 20ms</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">High-Speed Caching</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Redis Cluster (Read-Through)</td>
                  <td className="py-3 px-4">Namespaced key prefixes (`tenant:apollo:sku:med_1`)</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">99.4% cache hit ratio</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Event Streaming &amp; Audit</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Apache Kafka Bus</td>
                  <td className="py-3 px-4">Partitioned message headers tagged with authenticated Tenant UUID</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">Zero consumer group lag</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Regulatory Drug Compliance</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">FDA Orange Book AB Engine</td>
                  <td className="py-3 px-4">Strict cryptographic sign-off hash on every prescription lot release</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">HIPAA &amp; FDA 21 CFR Part 11 compliant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
