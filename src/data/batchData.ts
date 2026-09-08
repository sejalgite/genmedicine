export interface BatchAuditRecord {
  id: string;
  batchNumber: string;
  molecule: string;
  dosage: string;
  plant: string;
  lotSize: string;
  qpName: string;
  releaseDate: string;
  status: 'RELEASED' | 'IN QA AUDIT' | 'STABILITY HOLD';
  assayPercent: number;
  dissolutionPercent: number;
  impuritiesPercent: number;
  heavyMetalsPpm: number;
  sterilityStatus: string;
  coaNumber: string;
}

export const initialBatchAudits: BatchAuditRecord[] = [
  {
    id: 'batch-01',
    batchNumber: 'CP-2026-99A',
    molecule: 'Atorvastatin Calcium 20mg',
    dosage: 'Oral Film-Coated Tablet',
    plant: 'Goa Plant Unit 3',
    lotSize: '100,000 tablets',
    qpName: 'Dr. Aris Thorne (QP #US-FDA-8821)',
    releaseDate: 'Today, 09:15 UTC',
    status: 'RELEASED',
    assayPercent: 99.8,
    dissolutionPercent: 94.2,
    impuritiesPercent: 0.08,
    heavyMetalsPpm: 4.2,
    sterilityStatus: 'Pass (USP <71>)',
    coaNumber: 'COA-CPL-2026-099-AB',
  },
  {
    id: 'batch-02',
    batchNumber: 'CP-2026-102C',
    molecule: 'Metformin Hydrochloride 500mg ER',
    dosage: 'Extended-Release Matrix Tablet',
    plant: 'Indore SEZ Unit 1',
    lotSize: '250,000 tablets',
    qpName: 'Dr. Sunita Rao, PharmD',
    releaseDate: 'Today, 08:30 UTC',
    status: 'IN QA AUDIT',
    assayPercent: 100.1,
    dissolutionPercent: 88.6,
    impuritiesPercent: 0.12,
    heavyMetalsPpm: 6.0,
    sterilityStatus: 'Testing in Progress',
    coaNumber: 'COA-CPL-2026-102-AUD',
  },
  {
    id: 'batch-03',
    batchNumber: 'CP-2026-88B',
    molecule: 'Azithromycin Monohydrate 250mg',
    dosage: 'Hard Gelatin Capsule',
    plant: 'Kurkumbh API Unit 2',
    lotSize: '50,000 capsules',
    qpName: 'Dr. Aris Thorne (QP #US-FDA-8821)',
    releaseDate: 'Yesterday, 16:40 UTC',
    status: 'RELEASED',
    assayPercent: 99.4,
    dissolutionPercent: 92.8,
    impuritiesPercent: 0.05,
    heavyMetalsPpm: 3.5,
    sterilityStatus: 'Pass (USP <71>)',
    coaNumber: 'COA-CPL-2026-088-AB',
  },
  {
    id: 'batch-04',
    batchNumber: 'CP-2026-44D',
    molecule: 'Rosuvastatin Calcium 10mg',
    dosage: 'Film-Coated Tablet',
    plant: 'Goa Plant Unit 1',
    lotSize: '120,000 tablets',
    qpName: 'Dr. Sunita Rao, PharmD',
    releaseDate: 'Sep 06, 2026',
    status: 'RELEASED',
    assayPercent: 99.9,
    dissolutionPercent: 96.1,
    impuritiesPercent: 0.04,
    heavyMetalsPpm: 2.8,
    sterilityStatus: 'Pass (USP <71>)',
    coaNumber: 'COA-CPL-2026-044-AB',
  },
  {
    id: 'batch-05',
    batchNumber: 'CP-2026-115E',
    molecule: 'Amlodipine Besylate 5mg',
    dosage: 'Immediate Release Tablet',
    plant: 'Indore SEZ Unit 1',
    lotSize: '180,000 tablets',
    qpName: 'Dr. Aris Thorne (QP #US-FDA-8821)',
    releaseDate: 'Sep 05, 2026',
    status: 'RELEASED',
    assayPercent: 99.6,
    dissolutionPercent: 91.5,
    impuritiesPercent: 0.09,
    heavyMetalsPpm: 5.1,
    sterilityStatus: 'Pass (USP <71>)',
    coaNumber: 'COA-CPL-2026-115-AB',
  },
];
