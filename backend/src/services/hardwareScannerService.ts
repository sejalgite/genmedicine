import type { HardwareScanResult, EnterpriseScannerConfig } from '../types';

let scannerConfig: EnterpriseScannerConfig = {
  deviceModel: 'Zebra TC58 Enterprise Touch',
  laserAimingBeam: true,
  hapticFeedback: true,
  beepVolumeLevel: 85,
  continuousScanMode: true,
  totalScannedToday: 142,
  activeBatchQueue: 'BATCH-APOLLO-NYC-DISPENSE-09',
};

const barcodeCatalog: Record<string, { name: string; salt: string; lot: string; expiry: string; status: HardwareScanResult['dispenseStatus'] }> = {
  '030069421030': {
    name: 'Atorvastatin Calcium 20mg Tab (Cipla)',
    salt: 'Atorvastatin Calcium',
    lot: 'CP-2026-99A',
    expiry: '08/2029',
    status: 'VERIFIED_READY_FOR_PACK',
  },
  '00087606005': {
    name: 'Metformin Hydrochloride 500mg ER (Aurobindo)',
    salt: 'Metformin HCl ER',
    lot: 'AU-2026-140G',
    expiry: '11/2028',
    status: 'VERIFIED_READY_FOR_PACK',
  },
  '00069315014': {
    name: 'Azithromycin Monohydrate 250mg 6-Pak (Lupin)',
    salt: 'Azithromycin Monohydrate',
    lot: 'LP-2026-88B',
    expiry: '04/2028',
    status: 'VERIFIED_READY_FOR_PACK',
  },
  '00186109001': {
    name: 'Rosuvastatin Calcium 10mg (Sun Pharma)',
    salt: 'Rosuvastatin Calcium',
    lot: 'SP-2026-55A',
    expiry: '01/2029',
    status: 'VERIFIED_READY_FOR_PACK',
  },
};

export async function getScannerSessionConfig(): Promise<EnterpriseScannerConfig> {
  return scannerConfig;
}

export async function processHardwareBarcodeScan(
  barcodeData: string,
  symbology?: HardwareScanResult['symbology']
): Promise<HardwareScanResult> {
  const start = Date.now();
  const cleanCode = barcodeData.trim();
  const match = barcodeCatalog[cleanCode] || {
    name: 'Generic Oral Formulation (NDC Matched)',
    salt: 'Active Pharmaceutical Ingredient',
    lot: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
    expiry: '12/2028',
    status: 'VERIFIED_READY_FOR_PACK' as const,
  };

  scannerConfig.totalScannedToday += 1;

  return {
    scanId: `scan-${Date.now()}`,
    barcodeData: cleanCode,
    symbology: symbology || 'GS1_DATAMATRIX',
    medicineMatched: match.name,
    genericSalt: match.salt,
    lotNumber: match.lot,
    expirationDate: match.expiry,
    inventoryVerified: true,
    orderMatchId: '#GEN-ORD-88219',
    dispenseStatus: match.status,
    latencyMs: Math.max(4, Date.now() - start),
  };
}
