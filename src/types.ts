export type AppScreen =
  | 'super-admin'
  | 'b2b-pharma'
  | 'tenant-admin'
  | 'pharmacy-partner'
  | 'customer-mobile'
  | 'architecture';

export type MobileSubScreen = 'discover' | 'scan' | 'checkout';

export interface MedicineOffer {
  id: string;
  name: string;
  salt: string;
  category: string;
  therapeuticClass: string;
  schedule: 'Schedule H' | 'Schedule H1' | 'Schedule X' | 'OTC Safe';
  manufacturer: string;
  qaCert: string;
  bestPrice: number;
  marketPrice: number;
  unit: string;
  savingsSpreadPercent: number;
  partnerName: string;
  partnerType: string;
  freshness: string;
  freshnessStatus: 'fresh' | 'warning' | 'stale';
  isRxRequired: boolean;
  offersCount: number;
  rankScore: number;
}

export interface FormulationDossier {
  id: string;
  molecule: string;
  formulation: string;
  ndc: string;
  rldReference: string;
  nda: string;
  wholesalePrice: number;
  dispensePrice: number;
  activeBatch: string;
  freshnessPercent: number;
  expiryYear: number;
  rating: string;
  anda: string;
  regulatoryClearance: string;
}

export interface DispenseOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  patientAddress: string;
  rxNumber: string;
  prescriber: string;
  prescriberNpi: string;
  timestamp: string;
  timeAgo: string;
  slaMinutesRemaining: number;
  items: {
    name: string;
    genericSalt: string;
    dosage: string;
    quantity: string;
    barcode: string;
    lotNumber: string;
    expiryDate: string;
    brandDisplaced: string;
    price: number;
    savings: number;
  }[];
  packagingColdChain: {
    sensorTag: string;
    tempRange: string;
    isLocked: boolean;
    isVerified: boolean;
  };
  ddiCheck: {
    status: 'Passed' | 'Flagged';
    severeCount: number;
    pharmacistSignOff: string;
    hash: string;
  };
  courier: {
    company: string;
    driverName: string;
    driverPhone: string;
    vehicleType: string;
    etaMinutes: number;
    status: 'En Route to Store' | 'Dispatched' | 'Scheduled' | 'Awaiting Pickup';
    isColdCarrier: boolean;
  };
  escrowValue: number;
  status: 'Packing In-Progress' | 'Sign-Off Required' | 'Awaiting Pickup' | 'Dispatched' | 'Completed';
  isColdChain: boolean;
}

export interface TenantUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  scope: string;
  location: string;
  mfaMethod: string;
  mfaType: 'passkey' | 'totp' | 'hardware' | 'sms-degraded';
  lastActive: string;
  status: 'Active' | 'Invited' | 'Suspended';
}

export interface DispensaryOutlet {
  id: string;
  outletCode: string;
  name: string;
  address: string;
  dea: string;
  skuCount: number;
  status: 'LIVE SYNC' | 'OFFLINE';
}

export interface AuditEvent {
  id: string;
  time: string;
  type: 'SCHEMA_SYNC' | 'MODERATION_FLAG' | 'STALENESS_GUARD' | 'RBAC_AUDIT' | 'CONFIG_CHANGE';
  tenant: string;
  description: string;
}

export interface RankingWeights {
  priceTransparency: number;
  partnerReliability: number;
  manufacturerTrust: number;
  userSentiment: number;
  freshnessDecay: number;
}
