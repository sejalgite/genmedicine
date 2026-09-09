import type {
  ClinicalTrialProtocol,
  PatientTrialMatchResult,
  ConsentLedgerRecord,
} from '../types';

// Global Sponsored Clinical Trial Protocols
const INITIAL_TRIAL_PROTOCOLS: ClinicalTrialProtocol[] = [
  {
    protocolId: 'prot-novartis-01',
    nctNumber: 'NCT06182931',
    title: 'Decentralized Phase III Efficacy Study of Novel SGLT2/DPP-4 Combination vs Generic Metformin Monotherapy',
    sponsor: 'Novartis Pharma Global',
    phase: 'Phase III',
    therapeuticArea: 'Endocrinology / Type 2 Diabetes',
    conditionTarget: 'Type 2 Diabetes with Inadequate Glycemic Control (HbA1c 7.5% - 10.0%)',
    investigationalMolecule: 'Novartis NVP-DPP99 + Empagliflozin Bioequivalent',
    standardOfCareGenericDisplaced: 'Metformin HCl 1000mg ER',
    studyType: 'Interventional Decentralized',
    patientStipendUsd: 2800.0,
    sitesCount: 42,
    virtualVisitsSupported: true,
    enrollmentTarget: 1200,
    currentEnrolled: 890,
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 75,
      gender: 'All',
      requiredBiomarkers: ['HbA1c >= 7.5%', 'eGFR >= 45 mL/min/1.73m2'],
      excludedMedications: ['GLP-1 Receptor Agonists (within 90 days)', 'Systemic Corticosteroids'],
      requiredPriorTherapies: ['Metformin Stable Dose >= 3 months'],
      targetIndications: ['Type 2 Diabetes Mellitus', 'Diabetic Microvascular Risk'],
    },
    status: 'RECRUITING',
  },
  {
    protocolId: 'prot-astrazeneca-02',
    nctNumber: 'NCT05994820',
    title: 'Decentralized Hybrid Trial of Next-Gen PCSK9 Small Molecule Inhibitor in Primary Hypercholesterolemia',
    sponsor: 'AstraZeneca R&D',
    phase: 'Phase II',
    therapeuticArea: 'Cardiovascular / Lipid Metabolism',
    conditionTarget: 'Heterozygous Familial Hypercholesterolemia / Statin Intolerant',
    investigationalMolecule: 'AZD-8233 Oral PCSK9 Inhibitor',
    standardOfCareGenericDisplaced: 'Atorvastatin 40mg / Rosuvastatin 20mg',
    studyType: 'Interventional Decentralized',
    patientStipendUsd: 3500.0,
    sitesCount: 28,
    virtualVisitsSupported: true,
    enrollmentTarget: 600,
    currentEnrolled: 412,
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 80,
      gender: 'All',
      requiredBiomarkers: ['LDL-C >= 130 mg/dL', 'Documented Statin Resistance / Intolerance'],
      excludedMedications: ['Injectable Monoclonal PCSK9 antibodies (within 180 days)'],
      requiredPriorTherapies: ['High-intensity statin trial with confirmed myopathy or elevation'],
      targetIndications: ['Hypercholesterolemia', 'Atherosclerotic Cardiovascular Disease (ASCVD)'],
    },
    status: 'RECRUITING',
  },
  {
    protocolId: 'prot-roche-03',
    nctNumber: 'NCT06220194',
    title: 'Observational Real-World Biomarker Registry of Generic Biosimilar Switching in Rheumatoid Arthritis',
    sponsor: 'F. Hoffmann-La Roche Ltd',
    phase: 'Phase IV',
    therapeuticArea: 'Immunology / Rheumatology',
    conditionTarget: 'Moderate-to-Severe Active Rheumatoid Arthritis',
    investigationalMolecule: 'Adalimumab Biosimilar (FDA Interchangeable AB-Rating)',
    standardOfCareGenericDisplaced: 'Humira® 40mg/0.8mL Pen',
    studyType: 'Bioequivalence Registry',
    patientStipendUsd: 1450.0,
    sitesCount: 65,
    virtualVisitsSupported: true,
    enrollmentTarget: 2500,
    currentEnrolled: 2180,
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      requiredBiomarkers: ['Anti-CCP Positive', 'Rheumatoid Factor >= 20 IU/mL'],
      excludedMedications: ['JAK Inhibitors (Upadacitinib, Tofacitinib)'],
      requiredPriorTherapies: ['Methotrexate Monotherapy Failure >= 6 months'],
      targetIndications: ['Rheumatoid Arthritis', 'Psoriatic Arthritis'],
    },
    status: 'RECRUITING',
  },
  {
    protocolId: 'prot-cipla-04',
    nctNumber: 'NCT06319802',
    title: 'Phase I Pharmacokinetic & Steady-State Bioequivalence Study of Triple Fixed-Dose Inhalation Aero-Sol',
    sponsor: 'Cipla Biopharma Clinical Research',
    phase: 'Phase I',
    therapeuticArea: 'Pulmonology / COPD & Asthma',
    conditionTarget: 'Moderate to Severe Chronic Obstructive Pulmonary Disease',
    investigationalMolecule: 'Glycopyrrolate / Formoterol / Budesonide Inhalation MDI',
    standardOfCareGenericDisplaced: 'Trelegy® Ellipta®',
    studyType: 'Interventional Decentralized',
    patientStipendUsd: 1950.0,
    sitesCount: 15,
    virtualVisitsSupported: true,
    enrollmentTarget: 300,
    currentEnrolled: 180,
    eligibilityCriteria: {
      minAge: 40,
      maxAge: 75,
      gender: 'All',
      requiredBiomarkers: ['FEV1/FVC < 0.70 Post-Bronchodilator', 'Smoking History >= 10 pack-years'],
      excludedMedications: ['Oral Corticosteroids > 10mg prednisone equivalent'],
      requiredPriorTherapies: ['Prior LABA/LAMA maintenance'],
      targetIndications: ['COPD Gold Stage II-III', 'Chronic Bronchitis'],
    },
    status: 'RECRUITING',
  },
];

// In-Memory Consent Ledger (Simulating On-Chain Decentralized Ledger)
let consentLedgerState: ConsentLedgerRecord[] = [
  {
    ledgerId: 'zkp-led-8812',
    patientIdSnippet: 'usr-customer-01 (Alex Morgan)',
    trialNct: 'NCT05994820',
    timestamp: '2026-09-02T14:22:10Z',
    zkpVerificationSignature: '0x8f2c3b8901e4a938c821fd91024849102948201948203810294830192849102a',
    smartContractAddress: '0x71C8fb96262a420bB0255c4d0585D9652a215B80',
    stipendEscrowTxId: 'esc_zkp_3500_az02',
    consentVersion: 'v2.4-HIPAA-FDA-21CFR11',
    revocationAllowed: true,
  },
  {
    ledgerId: 'zkp-led-8809',
    patientIdSnippet: 'usr-customer-09 (Elena Rostov)',
    trialNct: 'NCT06182931',
    timestamp: '2026-08-28T09:15:33Z',
    zkpVerificationSignature: '0x3a92f01948201948203810294830192849102a8f2c3b8901e4a938c821fd9102',
    smartContractAddress: '0x71C8fb96262a420bB0255c4d0585D9652a215B80',
    stipendEscrowTxId: 'esc_zkp_2800_nv01',
    consentVersion: 'v2.4-HIPAA-FDA-21CFR11',
    revocationAllowed: true,
  },
];

/**
 * Retrieves all active clinical trial protocols
 */
export async function getClinicalTrialProtocols(): Promise<ClinicalTrialProtocol[]> {
  return INITIAL_TRIAL_PROTOCOLS;
}

/**
 * Executes a Zero-Knowledge Match against active trial protocols without exposing PHI
 */
export async function matchPatientToTrials(patientProfile: {
  patientId?: string;
  age?: number;
  gender?: string;
  diagnoses?: string[];
  activeMedications?: string[];
  allergies?: string[];
  biomarkers?: Record<string, any>;
}): Promise<PatientTrialMatchResult[]> {
  const patientId = patientProfile.patientId || 'usr-customer-01';
  const age = patientProfile.age || 42;
  const diagnoses = patientProfile.diagnoses || ['Hypercholesterolemia', 'Hypertension', 'Type 2 Diabetes'];
  const activeMeds = patientProfile.activeMedications || ['Atorvastatin 20mg', 'Metformin 500mg', 'Lisinopril 10mg'];

  const results: PatientTrialMatchResult[] = [];

  for (const protocol of INITIAL_TRIAL_PROTOCOLS) {
    let matchScore = 0;
    const matchedBiomarkers: string[] = [];
    const contraindicationFlags: string[] = [];

    // Age validation
    if (age >= protocol.eligibilityCriteria.minAge && age <= protocol.eligibilityCriteria.maxAge) {
      matchScore += 25;
    }

    // Indication validation
    const hasIndication = protocol.eligibilityCriteria.targetIndications.some((ind) =>
      diagnoses.some((d) => d.toLowerCase().includes(ind.toLowerCase()) || ind.toLowerCase().includes(d.toLowerCase()))
    );
    if (hasIndication) {
      matchScore += 35;
      matchedBiomarkers.push(`Confirmed Diagnosis: ${protocol.conditionTarget.split('/')[0].trim()}`);
    }

    // Medication & Biomarker checks
    const hasExcludedMed = protocol.eligibilityCriteria.excludedMedications.some((exMed) =>
      activeMeds.some((m) => m.toLowerCase().includes(exMed.toLowerCase()))
    );

    if (hasExcludedMed) {
      contraindicationFlags.push('Concurrent prohibited medication detected in active pharmacy dispensing history');
      matchScore = Math.max(0, matchScore - 30);
    } else {
      matchScore += 20;
    }

    if (protocol.virtualVisitsSupported) {
      matchScore += 15;
      matchedBiomarkers.push('Home Decentralized Visits & Digital Biomarker App Eligible');
    }

    // Final score capped at 98%
    const finalScore = Math.min(98, Math.max(45, matchScore));

    // Simulated cryptographic Zero-Knowledge Proof hash (SHA-256 equivalent)
    const zkpHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    results.push({
      matchId: `match-${protocol.nctNumber}-${Date.now().toString(36)}`,
      patientId,
      protocolId: protocol.protocolId,
      nctNumber: protocol.nctNumber,
      trialTitle: protocol.title,
      sponsor: protocol.sponsor,
      phase: protocol.phase,
      matchScorePercent: finalScore,
      zeroKnowledgeProofHash: zkpHash,
      matchedBiomarkers,
      contraindicationFlags,
      estimatedPatientStipend: protocol.patientStipendUsd,
      decentralizedHomeVisits: protocol.virtualVisitsSupported,
      status: 'MATCHED_PENDING_CONSENT',
    });
  }

  // Sort descending by match score
  results.sort((a, b) => b.matchScorePercent - a.matchScorePercent);
  return results;
}

/**
 * Records patient consent into the cryptographic decentralized ledger
 */
export async function recordPatientTrialConsent(
  patientId: string,
  nctNumber: string,
  zkpProofHash: string
): Promise<{ success: boolean; ledgerRecord: ConsentLedgerRecord; escrowFunded: boolean }> {
  const protocol = INITIAL_TRIAL_PROTOCOLS.find((p) => p.nctNumber === nctNumber);
  const stipend = protocol ? protocol.patientStipendUsd : 2500;

  const newRecord: ConsentLedgerRecord = {
    ledgerId: `zkp-led-${Math.floor(1000 + Math.random() * 9000)}`,
    patientIdSnippet: patientId.includes('Alex') ? patientId : `${patientId} (Verified Patient)`,
    trialNct: nctNumber,
    timestamp: new Date().toISOString(),
    zkpVerificationSignature: zkpProofHash.startsWith('0x') ? zkpProofHash : `0x${zkpProofHash}`,
    smartContractAddress: '0x71C8fb96262a420bB0255c4d0585D9652a215B80',
    stipendEscrowTxId: `esc_zkp_${stipend}_${nctNumber.toLowerCase()}`,
    consentVersion: 'v2.4-HIPAA-FDA-21CFR11',
    revocationAllowed: true,
  };

  consentLedgerState.unshift(newRecord);

  return {
    success: true,
    ledgerRecord: newRecord,
    escrowFunded: true,
  };
}

/**
 * Retrieves the cryptographic consent ledger registry
 */
export async function getConsentLedger(): Promise<ConsentLedgerRecord[]> {
  return consentLedgerState;
}
