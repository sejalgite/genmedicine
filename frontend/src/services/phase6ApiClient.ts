import type {
  InventoryForecastResult,
  PredictiveShortageAlert,
  ClinicalTrialProtocol,
  PatientTrialMatchResult,
  ConsentLedgerRecord,
  CrossBorderArbitrageOpportunity,
  RegulatoryComplianceCheck,
} from '../types';

const API_BASE = '/api/v1';

/**
 * Fetches the predictive supply chain & patent cliff analysis
 */
export async function fetchPredictiveSupplyChainReport(): Promise<InventoryForecastResult> {
  const res = await fetch(`${API_BASE}/supply-chain/forecast`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch supply chain report`);
  return await res.json();
}

/**
 * Triggers automated B2B bulk reordering
 */
export async function requestBulkReorder(
  alertId: string,
  quantity?: number
): Promise<{ success: boolean; alert: PredictiveShortageAlert; poNumber: string; deliveryEtaDays: number }> {
  const res = await fetch(`${API_BASE}/supply-chain/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertId, quantity }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to trigger bulk reorder`);
  return await res.json();
}

/**
 * Fetches active decentralized clinical trial protocols
 */
export async function fetchClinicalTrialProtocols(): Promise<ClinicalTrialProtocol[]> {
  const res = await fetch(`${API_BASE}/trials/protocols`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch trial protocols`);
  const data = await res.json();
  return data.protocols;
}

/**
 * Matches patient profile to trials using Zero-Knowledge matching
 */
export async function runPatientTrialMatch(patientProfile: {
  patientId?: string;
  age?: number;
  gender?: string;
  diagnoses?: string[];
  activeMedications?: string[];
  allergies?: string[];
}): Promise<PatientTrialMatchResult[]> {
  const res = await fetch(`${API_BASE}/trials/match-patient`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientProfile),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to run patient trial match`);
  const data = await res.json();
  return data.matches;
}

/**
 * Submits patient consent to the decentralized cryptographic ledger
 */
export async function submitTrialConsent(
  patientId: string,
  nctNumber: string,
  zkpProofHash: string
): Promise<{ success: boolean; ledgerRecord: ConsentLedgerRecord; escrowFunded: boolean }> {
  const res = await fetch(`${API_BASE}/trials/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, nctNumber, zkpProofHash }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to submit trial consent`);
  return await res.json();
}

/**
 * Retrieves the cryptographic consent ledger records
 */
export async function fetchConsentLedger(): Promise<ConsentLedgerRecord[]> {
  const res = await fetch(`${API_BASE}/trials/consent-ledger`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch consent ledger`);
  const data = await res.json();
  return data.ledger;
}

/**
 * Fetches cross-border generic arbitrage opportunities
 */
export async function fetchCrossBorderArbitrage(): Promise<CrossBorderArbitrageOpportunity[]> {
  const res = await fetch(`${API_BASE}/regulatory/cross-border-arbitrage`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch cross-border arbitrage data`);
  const data = await res.json();
  return data.opportunities;
}

/**
 * Checks regulatory compliance across international pharmacopeia
 */
export async function checkMoleculeCompliance(moleculeName: string): Promise<RegulatoryComplianceCheck> {
  const res = await fetch(`${API_BASE}/regulatory/check-compliance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moleculeName }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to check regulatory compliance`);
  return await res.json();
}
