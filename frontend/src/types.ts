export type AppScreen =
  | 'drug-directory'
  | 'super-admin'
  | 'b2b-pharma'
  | 'tenant-admin'
  | 'pharmacy-partner'
  | 'customer-mobile'
  | 'architecture'
  | 'phase-4-engine'
  | 'phase-5-mobile'
  | 'phase-6-global';


export type MobileSubScreen = 'discover' | 'scan' | 'checkout' | 'profile';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'pharmacy_partner' | 'pharma_b2b' | 'tenant_admin' | 'super_admin';
  organization?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  insuranceProvider?: string;
  memberId?: string;
  hsaFsaBalance?: number;
  isVerified?: boolean;
}

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
  // Phase 1 Core Directory Clinical Metadata
  brandName?: string;
  dosageStrengths?: string[];
  indications?: string[];
  fdaTeCode?: 'AB' | 'AB1' | 'AB2' | 'AP' | 'BX' | 'OTC';
  activeIngredients?: string;
  sideEffects?: string[];
  bioequivalencePercent?: number;
  description?: string;
}

export interface SavingsCalculationItem {
  medicineId: string;
  quantityMonthly: number;
}

export interface SavingsCalculationRequest {
  items: SavingsCalculationItem[];
}

export interface SavingsCalculationResult {
  totalBrandMonthly: number;
  totalGenericMonthly: number;
  monthlySavings: number;
  annualSavings: number;
  averageSavingsPercent: number;
  itemizedSavings: {
    medicineId: string;
    name: string;
    brandName: string;
    brandCost: number;
    genericCost: number;
    monthlySavings: number;
    annualSavings: number;
    savingsPercent: number;
  }[];
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
  dosageForm?: string;
  innovatorBrand?: string;
  innovatorMfg?: string;
  bioequivalenceRating?: string;
  wholesalePackPrice?: number;
  retailDispensePrice?: number;
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

// ---------------------------------------------------------------------------
// Phase 4: Live AI Multimodal OCR & Production Data Tier (v3.3 - v3.5) Types
// ---------------------------------------------------------------------------

export interface ExtractedMedication {
  brandName: string;
  genericName: string;
  dosage: string;
  form: string;
  frequency: string;
  sigInstructions: string;
  quantityPrescribed: number;
  refillsAllowed: number;
  fdaOrangeBookCode: 'AB' | 'AB1' | 'AB2' | 'AP' | 'BX' | 'OTC';
  genericSubstitutionAllowed: boolean;
  estimatedGenericPrice: number;
  estimatedBrandPrice: number;
  potentialSavingsPercent: number;
  confidenceScore: number;
}

export interface PrescriberInfo {
  name: string;
  npi: string;
  dea: string;
  clinic: string;
  signatureDetected: boolean;
  prescribedDate: string;
}

export interface ClinicalGuardrailCheck {
  id: string;
  rule: string;
  status: 'passed' | 'flagged' | 'warning';
  severity: 'low' | 'moderate' | 'critical';
  details: string;
}

export interface PrescriptionOcrResult {
  scanId: string;
  timestamp: string;
  imageThumbnailUrl?: string;
  modelUsed: string;
  latencyMs: number;
  prescriber: PrescriberInfo;
  patientNameSnippet?: string;
  extractedMedications: ExtractedMedication[];
  guardrails: ClinicalGuardrailCheck[];
  overallConfidence: number;
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'REJECTED';
}

export interface TenantSchemaPoolStatus {
  tenantId: string;
  tenantName: string;
  schemaName: string;
  activeConnections: number;
  idleConnections: number;
  maxPoolSize: number;
  searchPathVerified: boolean;
  lastMigrationVersion: string;
  isolationMode: 'SCHEMA_PER_TENANT_SEARCH_PATH';
  crossTenantLeakageCheckPassed: boolean;
  totalRecordsInScope: number;
  healthStatus: 'HEALTHY' | 'SYNCHRONIZING' | 'RECONNECTING';
}

export interface TenantSchemaLeakageTest {
  testId: string;
  timestamp: string;
  sourceTenant: string;
  targetQuery: string;
  crossTenantRowsReturned: number;
  leakageDetected: boolean;
  enforcedSearchPath: string;
  pgPoolLatencyMs: number;
}

export interface ColdChainTelemetryPacket {
  sensorId: string;
  orderId: string;
  batchId: string;
  medicineName: string;
  temperatureCelsius: number;
  humidityPercent: number;
  batteryPercent: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  isBreached: boolean;
  breachType?: 'COLD_SHOCK' | 'WARM_EXCURSION' | 'CRITICAL_HUMIDITY';
  courierName: string;
}

export interface ColdChainLockEvent {
  eventId: string;
  orderId: string;
  sensorId: string;
  triggeredAt: string;
  temperature: number;
  actionTaken: 'DISPENSARY_LOCK' | 'RETURN_TO_DEPOT' | 'AUTO_REORDER';
  reason: string;
  clearedByPharmD?: string;
}

export interface FeeSplitBreakdown {
  grossTotal: number;
  pharmacyPayout: number;
  genMedicinePlatformFee: number;
  courierShare: number;
  insuranceRebateEstimate: number;
}

export interface EscrowTransaction {
  escrowId: string;
  orderId: string;
  patientName: string;
  stripePaymentIntentId: string;
  connectedAccountId: string;
  status: 'FUNDS_HELD' | 'PHARMD_REVIEW' | 'DISBURSED' | 'REFUNDED_BREACH';
  amount: number;
  feeSplit: FeeSplitBreakdown;
  holdTimestamp: string;
  releasedTimestamp?: string;
  pharmdSignOffId?: string;
}

export interface CoaTestResult {
  parameter: string;
  specification: string;
  observedResult: string;
  status: 'PASSED' | 'OUT_OF_SPEC';
  analyticalMethod: string;
}

export interface CryptographicCoa {
  certificateId: string;
  batchNumber: string;
  medicineName: string;
  manufacturerName: string;
  manufacturingDate: string;
  expirationDate: string;
  inspectionFacility: string;
  sha256Hash: string;
  tamperProofQrData: string;
  pharmDApprover: string;
  licenseNumber: string;
  timestamp: string;
  signatureAlgorithm: 'SHA-256-RSA-4096' | 'ECDSA-SECP256K1';
  tests: CoaTestResult[];
  status: 'VALIDATED_IMMUTABLE' | 'REVOKED';
}

// ---------------------------------------------------------------------------
// Phase 5: Native Mobile Ecosystem & Health Integrations (v4.0) Types
// ---------------------------------------------------------------------------

export interface HealthKitAdherenceRecord {
  scheduleId: string;
  medicineName: string;
  dosage: string;
  timeSlot: 'Morning (08:00)' | 'Afternoon (13:00)' | 'Evening (20:00)' | 'Bedtime (22:00)';
  status: 'TAKEN' | 'SKIPPED' | 'PENDING';
  takenTimestamp?: string;
  streakDays: number;
}

export interface HealthKitVitalsData {
  lastSyncTimestamp: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodPressureStatus: 'Normal (118/76)' | 'Elevated' | 'Stage 1 Hypertension';
  restingHeartRateBpm: number;
  bloodGlucoseMgDl: number;
  glucoseMeasurementType: 'Fasting' | 'Post-Prandial' | 'Continuous CGM';
  bodyWeightLbs: number;
  stepCountToday: number;
}

export interface DrugAllergyProfile {
  id: string;
  allergen: string;
  category: 'Antibiotic' | 'NSAID' | 'Sulfonamide' | 'ACE Inhibitor' | 'Contrast Dye';
  severity: 'Severe (Anaphylaxis)' | 'Moderate (Urticaria / Rash)' | 'Mild (GI Upset)';
  verifiedByProvider: string;
  diagnosedYear: number;
}

export interface GoogleHealthConnectSync {
  isConnected: boolean;
  sourceApp: 'Google Health Connect' | 'Apple HealthKit' | 'Epic MyChart' | 'Dexcom CGM';
  lastSyncTime: string;
  recordsSyncedCount: number;
  adherenceRatePercent: number;
  activeAllergies: DrugAllergyProfile[];
  vitals: HealthKitVitalsData;
  adherenceSchedule: HealthKitAdherenceRecord[];
}

export type PushNotificationType =
  | 'DOSE_REMINDER'
  | 'REFILL_AVAILABLE'
  | 'COURIER_DISPATCHED'
  | 'COURIER_ARRIVED'
  | 'COLD_CHAIN_ALERT'
  | 'SAVINGS_ALERT';

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: PushNotificationType;
  orderId?: string;
  actionUrl?: string;
  isRead: boolean;
  priority: 'HIGH' | 'NORMAL';
}

export interface HardwareScanResult {
  scanId: string;
  barcodeData: string;
  symbology: 'GS1_DATAMATRIX' | 'NDC_11_CODE128' | 'UPC_A' | 'EAN_13';
  medicineMatched: string;
  genericSalt: string;
  lotNumber: string;
  expirationDate: string;
  inventoryVerified: boolean;
  orderMatchId?: string;
  dispenseStatus: 'VERIFIED_READY_FOR_PACK' | 'INVALID_LOT' | 'EXPIRED_LOT' | 'MISMATCH';
  latencyMs: number;
}

export interface EnterpriseScannerConfig {
  deviceModel: 'Zebra TC58 Enterprise Touch' | 'Honeywell CT40 Healthcare' | 'CipherLab RS35';
  laserAimingBeam: boolean;
  hapticFeedback: boolean;
  beepVolumeLevel: number;
  continuousScanMode: boolean;
  totalScannedToday: number;
  activeBatchQueue: string;
}

export interface BiometricAuthStatus {
  isEnabled: boolean;
  type: 'FaceID' | 'TouchID' | 'Android BiometricPrompt';
  lastAuthenticated?: string;
  securityEnclaveVerified: boolean;
}

// ---------------------------------------------------------------------------
// Phase 6: Global Trials & Predictive Supply Chain Network (v5.0) Types
// ---------------------------------------------------------------------------

export interface PatentCliffEvent {
  id: string;
  brandDrug: string;
  genericMolecule: string;
  primaryManufacturer: string;
  patentExpiryDate: string;
  daysUntilExpiry: number;
  marketSizeUsdBillion: number;
  projectedGenericPriceDropPercent: number;
  pipelineGenericMfrCount: number;
  currentBrandPrice: number;
  expectedGenericEntryPrice: number;
  therapeuticClass: string;
  riskTier: 'HIGH_DEMAND_SURGE' | 'MODERATE_SURGE' | 'LOW_IMPACT';
}

export interface DemandForecastDataPoint {
  month: string;
  baselineDemandUnits: number;
  aiPredictedDemandUnits: number;
  projectedShortageRiskPercent: number;
  safetyStockRecommendedUnits: number;
  patentCliffSurgeMultiplier: number;
}

export interface PredictiveShortageAlert {
  id: string;
  molecule: string;
  brandEquivalents: string[];
  currentDispensaryStock: number;
  predictedDemandNext30d: number;
  projectedStockoutDays: number;
  confidenceScore: number;
  rootCause: 'PATIENT_EXPIRY_CLIFF' | 'SEASONAL_EPIDEMIOLOGICAL_SURGE' | 'API_MANUFACTURING_BOTTLENECK' | 'RECALL_INSPECTION';
  recommendedReorderQuantity: number;
  suggestedB2BSupplier: string;
  estimatedLeadTimeDays: number;
  savingsVsSpotPrice: number;
  isAutoReordered: boolean;
}

export interface InventoryForecastResult {
  generatedAt: string;
  forecastHorizonMonths: number;
  totalMonitoredSkus: number;
  imminentShortageCount: number;
  patentCliffEvents: PatentCliffEvent[];
  shortageAlerts: PredictiveShortageAlert[];
  demandCurve: DemandForecastDataPoint[];
  aggregateCapitalOptimizedUsd: number;
}

export interface ClinicalTrialProtocol {
  protocolId: string;
  nctNumber: string;
  title: string;
  sponsor: string;
  phase: 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Expanded Access';
  therapeuticArea: string;
  conditionTarget: string;
  investigationalMolecule: string;
  standardOfCareGenericDisplaced?: string;
  studyType: 'Interventional Decentralized' | 'Observational' | 'Bioequivalence Registry';
  patientStipendUsd: number;
  sitesCount: number;
  virtualVisitsSupported: boolean;
  enrollmentTarget: number;
  currentEnrolled: number;
  eligibilityCriteria: {
    minAge: number;
    maxAge: number;
    gender: 'All' | 'Female' | 'Male';
    requiredBiomarkers: string[];
    excludedMedications: string[];
    requiredPriorTherapies: string[];
    targetIndications: string[];
  };
  matchingMatchPercent?: number;
  status: 'RECRUITING' | 'ACTIVE_NOT_RECRUITING' | 'COMPLETED';
}

export interface PatientTrialMatchResult {
  matchId: string;
  patientId: string;
  protocolId: string;
  nctNumber: string;
  trialTitle: string;
  sponsor: string;
  phase: string;
  matchScorePercent: number;
  zeroKnowledgeProofHash: string;
  matchedBiomarkers: string[];
  contraindicationFlags: string[];
  estimatedPatientStipend: number;
  decentralizedHomeVisits: boolean;
  status: 'MATCHED_PENDING_CONSENT' | 'PATIENT_CONSENTED' | 'SCREENING_FAILED' | 'ENROLLED';
}

export interface ConsentLedgerRecord {
  ledgerId: string;
  patientIdSnippet: string;
  trialNct: string;
  timestamp: string;
  zkpVerificationSignature: string;
  smartContractAddress: string;
  stipendEscrowTxId: string;
  consentVersion: string;
  revocationAllowed: boolean;
}

export type RegulatoryJurisdiction = 'US_FDA' | 'EU_EMA' | 'WHO_PQ' | 'INDIA_CDSCO';

export interface HarmonizedPharmacopeiaRecord {
  jurisdiction: RegulatoryJurisdiction;
  regulatoryBody: string;
  dossierType: string;
  filingNumber: string;
  gmpComplianceStandard: string;
  stabilityTestingStandard: string;
  bioequivalenceRequirement: string;
  status: 'APPROVED' | 'IN_REVIEW' | 'MUTUAL_RECOGNITION_ELIGIBLE';
}

export interface CrossBorderArbitrageOpportunity {
  id: string;
  genericMolecule: string;
  dosageStrength: string;
  usFdaNdc: string;
  usRetailPrice: number;
  sourceJurisdiction: RegulatoryJurisdiction;
  sourceManufacturer: string;
  sourceExFactoryPrice: number;
  tariffsAndFreight: number;
  landedCostUsd: number;
  netPatientSavingsUsd: number;
  savingsSpreadPercent: number;
  regulatoryReadiness: 'IMMEDIATE_US_IMPORT_READY' | 'FAST_TRACK_ANDA' | 'SECTION_804_ELIGIBLE';
  harmonizedRecords: HarmonizedPharmacopeiaRecord[];
}

export interface RegulatoryComplianceCheck {
  queryMolecule: string;
  harmonizationIndexPercent: number;
  fdaOrangeBookRated: boolean;
  emaSmPcHooksValid: boolean;
  whoPrequalified: boolean;
  cdscoSugamRegistered: boolean;
  importParityViable: boolean;
  notes: string;
}
export interface DdiCheckResult {
  hasContraindication: boolean;
  severeInteractionsCount: number;
  overallRiskLevel: 'SAFE' | 'MODERATE' | 'CRITICAL';
  interactions: {
    id: string;
    drugA: string;
    drugB: string;
    severity: 'High' | 'Moderate' | 'Minor';
    mechanism: string;
    clinicalEffect: string;
    pharmacistRecommendation: string;
  }[];
  cyp450EnzymeConflicts: string[];
  foodAlcoholWarnings: string[];
}

export interface TenantMigrationJob {
  migrationId: string;
  name: string;
  appliedAt: string;
  appliedSchemas: string[];
  status: 'SUCCESS' | 'FAILED';
  executionTimeMs: number;
}

export interface TenantQueryResult {
  tenantId: string;
  resolvedSearchPath: string;
  executedSql: string;
  rowCount: number;
  rows: any[];
  executionTimeMs: number;
  rowLevelSecurityEnforced: boolean;
  isolationGuarantee: string;
}
