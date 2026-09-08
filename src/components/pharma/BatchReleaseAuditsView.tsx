import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Plus,
  X,
  FileText,
  Download,
  AlertTriangle,
  Building2,
  Check,
} from 'lucide-react';
import { BatchAuditRecord, initialBatchAudits } from '../../data/batchData';

interface BatchReleaseAuditsViewProps {
  onShowToast: (msg: string) => void;
}

export const BatchReleaseAuditsView: React.FC<BatchReleaseAuditsViewProps> = ({
  onShowToast,
}) => {
  const [batches, setBatches] = useState<BatchAuditRecord[]>(initialBatchAudits);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [plantFilter, setPlantFilter] = useState('ALL');
  const [selectedBatchForCoA, setSelectedBatchForCoA] = useState<BatchAuditRecord | null>(null);
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);

  // New batch form state
  const [newBatchNum, setNewBatchNum] = useState('CP-2026-140G');
  const [newMolecule, setNewMolecule] = useState('Atorvastatin Calcium 20mg');
  const [newPlant, setNewPlant] = useState('Goa Plant Unit 3');
  const [newLotSize, setNewLotSize] = useState('150,000 tablets');
  const [newAssay, setNewAssay] = useState('99.7');
  const [newDissolution, setNewDissolution] = useState('93.4');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.molecule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.plant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.coaNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesPlant = plantFilter === 'ALL' || b.plant === plantFilter;

    return matchesSearch && matchesStatus && matchesPlant;
  });

  const handleSignOffBatch = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            status: 'RELEASED',
            releaseDate: 'Just now (QP Verified)',
            sterilityStatus: 'Pass (USP <71>)',
            coaNumber: b.coaNumber.replace('AUD', 'AB'),
          };
        }
        return b;
      })
    );
    onShowToast(`Batch successfully signed off by Qualified Person (QP) and marked RELEASED.`);
  };

  const handleCreateNewBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: BatchAuditRecord = {
      id: `batch-${Date.now()}`,
      batchNumber: newBatchNum,
      molecule: newMolecule,
      dosage: 'Oral Film-Coated Tablet',
      plant: newPlant,
      lotSize: newLotSize,
      qpName: 'Dr. Aris Thorne (QP #US-FDA-8821)',
      releaseDate: 'Just now',
      status: 'RELEASED',
      assayPercent: parseFloat(newAssay) || 99.8,
      dissolutionPercent: parseFloat(newDissolution) || 94.0,
      impuritiesPercent: 0.06,
      heavyMetalsPpm: 3.8,
      sterilityStatus: 'Pass (USP <71>)',
      coaNumber: `COA-CPL-2026-${Math.floor(100 + Math.random() * 900)}-AB`,
    };

    setBatches([newRecord, ...batches]);
    setShowNewBatchModal(false);
    onShowToast(`New manufacturing lot ${newBatchNum} successfully certified and released.`);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c1c7cf] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#00334f] tracking-tight">
              Batch Release &amp; QA Audits
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#003825] border border-[#a2b5cc] text-xs font-bold font-mono">
              cGMP 21 CFR Part 211
            </span>
          </div>
          <p className="text-xs text-[#41474e] mt-1">
            Electronic Batch Records (eBR), real-time dissolution testing profiles, and Qualified Person (QP) release ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowToast('Exported 148 batch release audit trails to FDA eCTD v4.0 format.')}
            className="h-8 px-3 bg-white border border-[#c1c7cf] hover:bg-[#eff4ff] text-[#00334f] text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#006398]" />
            <span>Export Audit Ledger</span>
          </button>

          <button
            onClick={() => setShowNewBatchModal(true)}
            className="h-8 px-3.5 bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Release New Batch</span>
          </button>
        </div>
      </div>

      {/* 4 Clean KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#005137] shadow-xs">
          <div className="flex items-center justify-between text-[#72787f] text-[11px] font-semibold uppercase tracking-wider">
            <span>Total Batches Released</span>
            <CheckCircle2 className="w-4 h-4 text-[#005137]" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#00334f] tabular-nums">148</span>
            <span className="text-xs text-[#005137] font-semibold">100% Pass Rate</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">0 Recalls in 24 months</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#006398] shadow-xs">
          <div className="flex items-center justify-between text-[#72787f] text-[11px] font-semibold uppercase tracking-wider">
            <span>In QA Review</span>
            <Clock className="w-4 h-4 text-[#006398]" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#00334f] tabular-nums">
              {batches.filter((b) => b.status === 'IN QA AUDIT').length} Lots
            </span>
            <span className="text-xs text-[#006398] font-semibold">Pending Sign-off</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">Dissolution profiling in progress</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#00334f] shadow-xs">
          <div className="flex items-center justify-between text-[#72787f] text-[11px] font-semibold uppercase tracking-wider">
            <span>Stability Testing</span>
            <ShieldCheck className="w-4 h-4 text-[#00334f]" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#00334f] tabular-nums">100%</span>
            <span className="text-xs text-[#005137] font-semibold">ICH Q1A(R2)</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">Accelerated &amp; real-time chambers</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 border-t-2 border-t-[#41474e] shadow-xs">
          <div className="flex items-center justify-between text-[#72787f] text-[11px] font-semibold uppercase tracking-wider">
            <span>Quarantine Clearance</span>
            <Clock className="w-4 h-4 text-[#41474e]" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#00334f] tabular-nums">14.2 hrs</span>
            <span className="text-xs text-[#72787f] font-mono">SLA &lt; 24 hrs</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">Fast-track automated release pipeline</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#c1c7cf] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#72787f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Batch #, Molecule, Plant, CoA ID..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#f8f9ff] border border-[#c1c7cf] rounded-md focus:outline-none focus:border-[#006398]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#72787f] font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f8f9ff] border border-[#c1c7cf] text-[#00334f] text-xs rounded px-2.5 py-1 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="RELEASED">Released (QP Cleared)</option>
              <option value="IN QA AUDIT">In QA Audit</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#72787f] font-medium">Facility:</span>
            <select
              value={plantFilter}
              onChange={(e) => setPlantFilter(e.target.value)}
              className="bg-[#f8f9ff] border border-[#c1c7cf] text-[#00334f] text-xs rounded px-2.5 py-1 font-medium"
            >
              <option value="ALL">All Manufacturing Plants</option>
              <option value="Goa Plant Unit 3">Goa Plant Unit 3</option>
              <option value="Indore SEZ Unit 1">Indore SEZ Unit 1</option>
              <option value="Kurkumbh API Unit 2">Kurkumbh API Unit 2</option>
              <option value="Goa Plant Unit 1">Goa Plant Unit 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Audit Ledger Table */}
      <div className="bg-white border border-[#c1c7cf] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c1c7cf] text-[#41474e] uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-4">Batch # &amp; Lot</th>
                <th className="py-3 px-4">Formulation &amp; Strength</th>
                <th className="py-3 px-4">Manufacturing Facility</th>
                <th className="py-3 px-4">Assay &amp; Dissolution</th>
                <th className="py-3 px-4">Qualified Person (QP)</th>
                <th className="py-3 px-4">QA Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff]">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#f8f9ff] transition group">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-[#00334f]">{batch.batchNumber}</div>
                    <div className="text-[10px] text-[#72787f] font-mono">{batch.lotSize}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0b1c30]">{batch.molecule}</div>
                    <div className="text-[10px] text-[#72787f]">{batch.dosage}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-[#0b1c30] font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#006398]" />
                      <span>{batch.plant}</span>
                    </div>
                    <div className="text-[10px] text-[#72787f] font-mono mt-0.5">{batch.releaseDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#0b1c30] font-medium">
                        Assay: <strong className="font-mono text-[#005137]">{batch.assayPercent}%</strong>
                      </span>
                      <span className="text-[#72787f]">•</span>
                      <span className="text-[#0b1c30] font-medium">
                        Q: <strong className="font-mono text-[#006398]">{batch.dissolutionPercent}%</strong>
                      </span>
                    </div>
                    <div className="text-[10px] text-[#72787f] font-mono mt-0.5">{batch.coaNumber}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[#0b1c30] font-medium">{batch.qpName}</div>
                    <div className="text-[10px] text-[#005137] font-semibold flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3 text-[#005137]" />
                      21 CFR Part 11 Verified
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        batch.status === 'RELEASED'
                          ? 'bg-[#dce9ff] text-[#003825] border border-[#a2b5cc]'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          batch.status === 'RELEASED' ? 'bg-[#005137]' : 'bg-amber-600'
                        }`}
                      ></span>
                      {batch.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBatchForCoA(batch)}
                        className="px-2.5 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00334f] rounded font-semibold text-[11px] transition flex items-center gap-1 cursor-pointer border border-[#c1c7cf]"
                      >
                        <FileText className="w-3 h-3 text-[#006398]" />
                        <span>Inspect CoA</span>
                      </button>

                      {batch.status === 'IN QA AUDIT' && (
                        <button
                          onClick={() => handleSignOffBatch(batch.id)}
                          className="px-2.5 py-1 bg-[#005137] hover:bg-[#003825] text-white rounded font-semibold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#85f8c4]" />
                          <span>Sign-Off &amp; Release</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-[#c1c7cf] bg-[#f8f9ff] flex items-center justify-between text-xs text-[#72787f]">
          <span>
            Showing <strong className="text-[#00334f]">{filteredBatches.length}</strong> batches in cGMP regulatory custody
          </span>
          <span className="font-mono text-[11px]">Next Automated Batch Ingest: 48 mins</span>
        </div>
      </div>

      {/* Certificate of Analysis (CoA) Modal */}
      {selectedBatchForCoA && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c1c7cf] rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-[#0b1c30] space-y-4">
            <div className="flex items-start justify-between border-b border-[#c1c7cf] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#00334f]">Certificate of Analysis (CoA)</h3>
                  <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#003825] font-mono font-bold text-xs border border-[#a2b5cc]">
                    {selectedBatchForCoA.coaNumber}
                  </span>
                </div>
                <p className="text-xs text-[#72787f] mt-0.5">
                  Cipla Global Quality Assurance • Analytical Laboratory Certificate
                </p>
              </div>
              <button
                onClick={() => setSelectedBatchForCoA(null)}
                className="text-[#72787f] hover:text-[#0b1c30] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* General Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-[#f8f9ff] rounded-xl border border-[#c1c7cf] text-xs">
              <div>
                <span className="text-[10px] text-[#72787f] block">Batch Number</span>
                <strong className="text-[#00334f] font-mono">{selectedBatchForCoA.batchNumber}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#72787f] block">Manufacturing Plant</span>
                <strong className="text-[#00334f]">{selectedBatchForCoA.plant}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#72787f] block">Lot Quantity</span>
                <strong className="text-[#00334f] font-mono">{selectedBatchForCoA.lotSize}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#72787f] block">Release Date</span>
                <strong className="text-[#00334f]">{selectedBatchForCoA.releaseDate}</strong>
              </div>
            </div>

            {/* Test Specification & Results Table */}
            <div className="border border-[#c1c7cf] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#eff4ff] border-b border-[#c1c7cf] text-[#41474e] font-semibold text-[11px]">
                    <th className="py-2 px-3">Test Parameter</th>
                    <th className="py-2 px-3">Specification Limits</th>
                    <th className="py-2 px-3">Measured Result</th>
                    <th className="py-2 px-3 text-right">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eeff]">
                  <tr>
                    <td className="py-2 px-3 font-medium">Chemical Identification (HPLC)</td>
                    <td className="py-2 px-3 text-[#72787f]">Retention time matches reference standard</td>
                    <td className="py-2 px-3 font-mono">Conforms (tR = 4.21 min)</td>
                    <td className="py-2 px-3 text-right text-[#005137] font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Quantitative Assay (Active Ingredient)</td>
                    <td className="py-2 px-3 text-[#72787f]">98.0% - 102.0% of label claim</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#00334f]">
                      {selectedBatchForCoA.assayPercent}%
                    </td>
                    <td className="py-2 px-3 text-right text-[#005137] font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">In-Vitro Dissolution (Q at 30 min)</td>
                    <td className="py-2 px-3 text-[#72787f]">Q &gt; 80% (USP Apparatus 2)</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#006398]">
                      {selectedBatchForCoA.dissolutionPercent}%
                    </td>
                    <td className="py-2 px-3 text-right text-[#005137] font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Organic Related Substances</td>
                    <td className="py-2 px-3 text-[#72787f]">Individual &lt; 0.2%, Total &lt; 0.5%</td>
                    <td className="py-2 px-3 font-mono">{selectedBatchForCoA.impuritiesPercent}%</td>
                    <td className="py-2 px-3 text-right text-[#005137] font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Elemental Impurities (ICP-MS)</td>
                    <td className="py-2 px-3 text-[#72787f]">Lead, Arsenic, Cadmium &lt; 10 ppm</td>
                    <td className="py-2 px-3 font-mono">{selectedBatchForCoA.heavyMetalsPpm} ppm</td>
                    <td className="py-2 px-3 text-right text-[#005137] font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Microbiological Purity</td>
                    <td className="py-2 px-3 text-[#72787f]">Total Aerobic Microbial Count &lt; 100 CFU/g</td>
                    <td className="py-2 px-3">{selectedBatchForCoA.sterilityStatus}</td>
                    <td className="py-2 px-3 text-right text-[#005137] font-bold">PASSED</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cryptographic Footnote */}
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#a2b5cc] text-[11px] text-[#00334f] flex items-center justify-between">
              <div>
                <span className="font-bold block">Cryptographic Digest &amp; Signature:</span>
                <span className="font-mono text-[10px] text-[#41474e]">
                  SHA256: 9b2d88fae120147c8702aa8941f... (US-FDA 21 CFR Part 11 compliant)
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#005137] block">Certified by Qualified Person:</span>
                <span className="text-[10px] text-[#41474e]">{selectedBatchForCoA.qpName}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#c1c7cf]">
              <button
                onClick={() => {
                  onShowToast(`Downloaded signed PDF for ${selectedBatchForCoA.coaNumber}.`);
                  setSelectedBatchForCoA(null);
                }}
                className="px-4 py-2 bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed PDF</span>
              </button>
              <button
                onClick={() => setSelectedBatchForCoA(null)}
                className="px-4 py-2 bg-white border border-[#c1c7cf] hover:bg-[#eff4ff] text-[#41474e] text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Release New Batch Modal */}
      {showNewBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c1c7cf] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-[#0b1c30] space-y-4">
            <div className="flex items-center justify-between border-b border-[#c1c7cf] pb-3">
              <h3 className="text-base font-bold text-[#00334f] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#006398]" />
                Release New Manufacturing Batch Lot
              </h3>
              <button onClick={() => setShowNewBatchModal(false)} className="text-[#72787f] hover:text-[#0b1c30]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBatch} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">Batch Number:</label>
                  <input
                    type="text"
                    required
                    value={newBatchNum}
                    onChange={(e) => setNewBatchNum(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">Lot Size:</label>
                  <input
                    type="text"
                    required
                    value={newLotSize}
                    onChange={(e) => setNewLotSize(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#41474e] mb-1 font-medium">Formulation &amp; Strength:</label>
                <select
                  value={newMolecule}
                  onChange={(e) => setNewMolecule(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-medium"
                >
                  <option value="Atorvastatin Calcium 20mg">Atorvastatin Calcium 20mg (Film-Coated Tablet)</option>
                  <option value="Metformin Hydrochloride 500mg ER">Metformin Hydrochloride 500mg ER</option>
                  <option value="Azithromycin Monohydrate 250mg">Azithromycin Monohydrate 250mg</option>
                  <option value="Rosuvastatin Calcium 10mg">Rosuvastatin Calcium 10mg</option>
                  <option value="Amlodipine Besylate 5mg">Amlodipine Besylate 5mg</option>
                </select>
              </div>

              <div>
                <label className="block text-[#41474e] mb-1 font-medium">Manufacturing Plant:</label>
                <select
                  value={newPlant}
                  onChange={(e) => setNewPlant(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-medium"
                >
                  <option value="Goa Plant Unit 3">Goa Plant Unit 3 (FDA Inspected #FEI-300291)</option>
                  <option value="Indore SEZ Unit 1">Indore SEZ Unit 1 (WHO-GMP Certified)</option>
                  <option value="Kurkumbh API Unit 2">Kurkumbh API Unit 2 (High Potency Facility)</option>
                  <option value="Goa Plant Unit 1">Goa Plant Unit 1</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">Assay Result (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newAssay}
                    onChange={(e) => setNewAssay(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#41474e] mb-1 font-medium">Dissolution Q (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newDissolution}
                    onChange={(e) => setNewDissolution(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#a2b5cc] text-[11px] text-[#00334f]">
                <strong>Qualified Person (QP) Authorization:</strong> Submitting will apply cryptographic timestamp and immediately sign off this lot for wholesale distribution.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c1c7cf]">
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-[#c1c7cf] bg-white text-xs hover:bg-[#eff4ff] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Confirm QP Batch Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
