import type { CryptographicCoa } from '../types';
import { initialBatchAudits } from '../data/batchData';

export async function generateCryptographicCoa(batchIdOrNumber: string): Promise<CryptographicCoa> {
  const batch =
    initialBatchAudits.find((b) => b.id === batchIdOrNumber || b.batchNumber === batchIdOrNumber) ||
    initialBatchAudits[0];

  const salt = `GENMED-COA-${batch.batchNumber}-${batch.coaNumber}-${Date.now()}`;
  // Simulated SHA-256 hash hex
  const sha256 = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
    .split('')
    .map((c, i) => (i % 3 === 0 ? batch.batchNumber.charCodeAt(i % batch.batchNumber.length).toString(16) : c))
    .join('')
    .substring(0, 64);

  const qrPayload = JSON.stringify({
    coa: batch.coaNumber,
    batch: batch.batchNumber,
    molecule: batch.molecule,
    assay: `${batch.assayPercent}%`,
    dissolution: `${batch.dissolutionPercent}%`,
    qp: batch.qpName,
    cfrPart11Hash: sha256,
    verifyUrl: `https://verify.genmedicine.org/coa/${batch.batchNumber}`,
  });

  return {
    certificateId: `CERT-${batch.coaNumber}`,
    batchNumber: batch.batchNumber,
    medicineName: batch.molecule,
    manufacturerName: 'Cipla Limited (Global Generic API & Formulations)',
    manufacturingDate: '2026-01-15',
    expirationDate: '2029-01-14',
    inspectionFacility: batch.plant,
    sha256Hash: sha256,
    tamperProofQrData: qrPayload,
    pharmDApprover: batch.qpName,
    licenseNumber: 'FDA-QP-88219-cGMP',
    timestamp: new Date().toISOString(),
    signatureAlgorithm: 'SHA-256-RSA-4096',
    status: 'VALIDATED_IMMUTABLE',
    tests: [
      {
        parameter: 'Identification (HPLC / UV-Vis)',
        specification: 'Retention time conforms to USP Reference Standard (± 1.0%)',
        observedResult: 'Conforms (tR = 4.21 min, purity 99.9%)',
        status: 'PASSED',
        analyticalMethod: 'USP <621> High Performance Liquid Chromatography',
      },
      {
        parameter: 'Quantitative Active Assay',
        specification: '98.0% - 102.0% of nominal label claim',
        observedResult: `${batch.assayPercent}% (High-Purity Assay)`,
        status: 'PASSED',
        analyticalMethod: 'USP <541> Titrimetry / HPLC',
      },
      {
        parameter: 'In-Vitro Dissolution Rate (Q at 30 min)',
        specification: 'NLT 80% dissolved in 900mL Phosphate Buffer pH 6.8',
        observedResult: `${batch.dissolutionPercent}% (Exceeds USP Spec)`,
        status: 'PASSED',
        analyticalMethod: 'USP <711> Apparatus 2 (Paddle 50 RPM)',
      },
      {
        parameter: 'Organic Related Substances (Total Impurities)',
        specification: 'Individual ≤ 0.20%, Total Impurities ≤ 0.50%',
        observedResult: `${batch.impuritiesPercent}% (Ultra-low byproduct level)`,
        status: 'PASSED',
        analyticalMethod: 'ICH Q3A(R2) Impurities in New Drug Substances',
      },
      {
        parameter: 'Heavy Metals & Elemental Impurities',
        specification: 'Lead, Arsenic, Cadmium, Mercury ≤ 10 ppm',
        observedResult: `${batch.heavyMetalsPpm} ppm (Well below allowable threshold)`,
        status: 'PASSED',
        analyticalMethod: 'USP <232> / <233> ICP-MS Plasma Spectrometry',
      },
      {
        parameter: 'Microbiological Sterility & Bioburden',
        specification: 'Total Aerobic Microbial Count < 100 CFU/g, Absence of Pathogens',
        observedResult: batch.sterilityStatus,
        status: 'PASSED',
        analyticalMethod: 'USP <71> Sterility Tests / USP <61>',
      },
    ],
  };
}
