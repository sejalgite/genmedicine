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
  try {
    const res = await fetch(`${API_BASE}/supply-chain/forecast`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local predictive supply chain calculation', err);
    const { getPredictiveSupplyChainReport } = await import('../server/predictiveSupplyChainService');
    return await getPredictiveSupplyChainReport();
  }
}

/**
 * Triggers automated B2B bulk reordering
 */
export async function requestBulkReorder(
  alertId: string,
  quantity?: number
): Promise<{ success: boolean; alert: PredictiveShortageAlert; poNumber: string; deliveryEtaDays: number }> {
  try {
    const res = await fetch(`${API_BASE}/supply-chain/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId, quantity }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local bulk reorder execution', err);
    const { triggerBulkReorder } = await import('../server/predictiveSupplyChainService');
    return await triggerBulkReorder(alertId, quantity);
  }
}

/**
 * Fetches active decentralized clinical trial protocols
 */
export async function fetchClinicalTrialProtocols(): Promise<ClinicalTrialProtocol[]> {
  try {
    const res = await fetch(`${API_BASE}/trials/protocols`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.protocols;
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local clinical trial protocols', err);
    const { getClinicalTrialProtocols } = await import('../server/clinicalTrialService');
    return await getClinicalTrialProtocols();
  }
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
  try {
    const res = await fetch(`${API_BASE}/trials/match-patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientProfile),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.matches;
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local ZKP patient matching', err);
    const { matchPatientToTrials } = await import('../server/clinicalTrialService');
    return await matchPatientToTrials(patientProfile);
  }
}

/**
 * Submits patient consent to the decentralized cryptographic ledger
 */
export async function submitTrialConsent(
  patientId: string,
  nctNumber: string,
  zkpProofHash: string
): Promise<{ success: boolean; ledgerRecord: ConsentLedgerRecord; escrowFunded: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/trials/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, nctNumber, zkpProofHash }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local trial consent submission', err);
    const { recordPatientTrialConsent } = await import('../server/clinicalTrialService');
    return await recordPatientTrialConsent(patientId, nctNumber, zkpProofHash);
  }
}

/**
 * Retrieves the cryptographic consent ledger records
 */
export async function fetchConsentLedger(): Promise<ConsentLedgerRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/trials/consent-ledger`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.ledger;
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local consent ledger retrieval', err);
    const { getConsentLedger } = await import('../server/clinicalTrialService');
    return await getConsentLedger();
  }
}

/**
 * Fetches cross-border generic arbitrage opportunities
 */
export async function fetchCrossBorderArbitrage(): Promise<CrossBorderArbitrageOpportunity[]> {
  try {
    const res = await fetch(`${API_BASE}/regulatory/cross-border-arbitrage`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.opportunities;
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local cross-border arbitrage data', err);
    const { getCrossBorderArbitrageOpportunities } = await import('../server/crossBorderRegulatoryService');
    return await getCrossBorderArbitrageOpportunities();
  }
}

/**
 * Checks regulatory compliance across international pharmacopeia
 */
export async function checkMoleculeCompliance(moleculeName: string): Promise<RegulatoryComplianceCheck> {
  try {
    const res = await fetch(`${API_BASE}/regulatory/check-compliance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moleculeName }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[Phase6ApiClient] Falling back to local regulatory compliance check', err);
    const { checkRegulatoryCompliance } = await import('../server/crossBorderRegulatoryService');
    return await checkRegulatoryCompliance(moleculeName);
  }
}
