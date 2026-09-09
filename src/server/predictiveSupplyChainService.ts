import type {
  PatentCliffEvent,
  PredictiveShortageAlert,
  DemandForecastDataPoint,
  InventoryForecastResult,
} from '../types';

// Baseline Patent Cliff Events
const INITIAL_PATENT_CLIFFS: PatentCliffEvent[] = [
  {
    id: 'pc-01',
    brandDrug: 'Keytruda®',
    genericMolecule: 'Pembrolizumab Biosimilar',
    primaryManufacturer: 'Merck & Co.',
    patentExpiryDate: '2028-06-15',
    daysUntilExpiry: 645,
    marketSizeUsdBillion: 25.0,
    projectedGenericPriceDropPercent: 68,
    pipelineGenericMfrCount: 7,
    currentBrandPrice: 10850.0,
    expectedGenericEntryPrice: 3470.0,
    therapeuticClass: 'Oncology / PD-1 Inhibitor',
    riskTier: 'HIGH_DEMAND_SURGE',
  },
  {
    id: 'pc-02',
    brandDrug: 'Eliquis®',
    genericMolecule: 'Apixaban',
    primaryManufacturer: 'Bristol Myers Squibb / Pfizer',
    patentExpiryDate: '2027-11-20',
    daysUntilExpiry: 438,
    marketSizeUsdBillion: 18.2,
    projectedGenericPriceDropPercent: 88,
    pipelineGenericMfrCount: 14,
    currentBrandPrice: 562.0,
    expectedGenericEntryPrice: 67.4,
    therapeuticClass: 'Cardiovascular / Direct Oral Anticoagulant',
    riskTier: 'HIGH_DEMAND_SURGE',
  },
  {
    id: 'pc-03',
    brandDrug: 'Entresto®',
    genericMolecule: 'Sacubitril / Valsartan',
    primaryManufacturer: 'Novartis',
    patentExpiryDate: '2027-08-10',
    daysUntilExpiry: 336,
    marketSizeUsdBillion: 6.4,
    projectedGenericPriceDropPercent: 82,
    pipelineGenericMfrCount: 9,
    currentBrandPrice: 645.0,
    expectedGenericEntryPrice: 116.1,
    therapeuticClass: 'Cardiology / ARNI Heart Failure',
    riskTier: 'HIGH_DEMAND_SURGE',
  },
  {
    id: 'pc-04',
    brandDrug: 'Biktarvy®',
    genericMolecule: 'Bictegravir / Emtricitabine / Tenofovir Alafenamide',
    primaryManufacturer: 'Gilead Sciences',
    patentExpiryDate: '2029-03-30',
    daysUntilExpiry: 934,
    marketSizeUsdBillion: 11.8,
    projectedGenericPriceDropPercent: 79,
    pipelineGenericMfrCount: 5,
    currentBrandPrice: 3840.0,
    expectedGenericEntryPrice: 806.4,
    therapeuticClass: 'Antiviral / HIV-1 Triple Regimen',
    riskTier: 'MODERATE_SURGE',
  },
  {
    id: 'pc-05',
    brandDrug: 'Ozempic® / Wegovy®',
    genericMolecule: 'Semaglutide Bio-Generic',
    primaryManufacturer: 'Novo Nordisk',
    patentExpiryDate: '2031-12-05',
    daysUntilExpiry: 1914,
    marketSizeUsdBillion: 28.5,
    projectedGenericPriceDropPercent: 74,
    pipelineGenericMfrCount: 16,
    currentBrandPrice: 968.0,
    expectedGenericEntryPrice: 251.6,
    therapeuticClass: 'Endocrinology / GLP-1 Receptor Agonist',
    riskTier: 'HIGH_DEMAND_SURGE',
  },
];

// Baseline Active Shortage Alerts
let activeShortageAlerts: PredictiveShortageAlert[] = [
  {
    id: 'psa-101',
    molecule: 'Amoxicillin + Clavulanate Potassium 875/125mg',
    brandEquivalents: ['Augmentin® 875mg', 'GlaxoSmithKline Augmentin'],
    currentDispensaryStock: 420,
    predictedDemandNext30d: 1850,
    projectedStockoutDays: 6,
    confidenceScore: 0.96,
    rootCause: 'SEASONAL_EPIDEMIOLOGICAL_SURGE',
    recommendedReorderQuantity: 2500,
    suggestedB2BSupplier: 'Cipla Global API Division (Plant #2)',
    estimatedLeadTimeDays: 2,
    savingsVsSpotPrice: 42.5,
    isAutoReordered: false,
  },
  {
    id: 'psa-102',
    molecule: 'Atorvastatin Calcium 20mg Oral Tab',
    brandEquivalents: ['Lipitor® 20mg'],
    currentDispensaryStock: 1200,
    predictedDemandNext30d: 4800,
    projectedStockoutDays: 8,
    confidenceScore: 0.94,
    rootCause: 'PATIENT_EXPIRY_CLIFF',
    recommendedReorderQuantity: 6000,
    suggestedB2BSupplier: 'Sun Pharma B2B Direct Hub',
    estimatedLeadTimeDays: 1,
    savingsVsSpotPrice: 38.0,
    isAutoReordered: true,
  },
  {
    id: 'psa-103',
    molecule: 'Albuterol Sulfate HFA Inhalation Aerosol 90mcg',
    brandEquivalents: ['ProAir® HFA', 'Ventolin® HFA'],
    currentDispensaryStock: 180,
    predictedDemandNext30d: 940,
    projectedStockoutDays: 5,
    confidenceScore: 0.91,
    rootCause: 'API_MANUFACTURING_BOTTLENECK',
    recommendedReorderQuantity: 1500,
    suggestedB2BSupplier: 'Dr. Reddy’s Global Formulation Hub',
    estimatedLeadTimeDays: 3,
    savingsVsSpotPrice: 49.2,
    isAutoReordered: false,
  },
  {
    id: 'psa-104',
    molecule: 'Semaglutide Peptide Solution 2mg/1.5mL',
    brandEquivalents: ['Ozempic® 2mg'],
    currentDispensaryStock: 45,
    predictedDemandNext30d: 380,
    projectedStockoutDays: 3,
    confidenceScore: 0.98,
    rootCause: 'SEASONAL_EPIDEMIOLOGICAL_SURGE',
    recommendedReorderQuantity: 600,
    suggestedB2BSupplier: 'Biocon Biologics Cold-Chain Depot',
    estimatedLeadTimeDays: 2,
    savingsVsSpotPrice: 65.0,
    isAutoReordered: false,
  },
];

// Time Series 12-Month Demand Curve
const DEMAND_CURVE_DATA: DemandForecastDataPoint[] = [
  { month: 'Oct 2026', baselineDemandUnits: 12400, aiPredictedDemandUnits: 12900, projectedShortageRiskPercent: 12, safetyStockRecommendedUnits: 2500, patentCliffSurgeMultiplier: 1.04 },
  { month: 'Nov 2026', baselineDemandUnits: 13100, aiPredictedDemandUnits: 14200, projectedShortageRiskPercent: 18, safetyStockRecommendedUnits: 2800, patentCliffSurgeMultiplier: 1.08 },
  { month: 'Dec 2026', baselineDemandUnits: 14800, aiPredictedDemandUnits: 16900, projectedShortageRiskPercent: 34, safetyStockRecommendedUnits: 3400, patentCliffSurgeMultiplier: 1.14 },
  { month: 'Jan 2027', baselineDemandUnits: 15200, aiPredictedDemandUnits: 18100, projectedShortageRiskPercent: 41, safetyStockRecommendedUnits: 3800, patentCliffSurgeMultiplier: 1.19 },
  { month: 'Feb 2027', baselineDemandUnits: 13900, aiPredictedDemandUnits: 15600, projectedShortageRiskPercent: 22, safetyStockRecommendedUnits: 3100, patentCliffSurgeMultiplier: 1.12 },
  { month: 'Mar 2027', baselineDemandUnits: 14200, aiPredictedDemandUnits: 16800, projectedShortageRiskPercent: 27, safetyStockRecommendedUnits: 3300, patentCliffSurgeMultiplier: 1.18 },
  { month: 'Apr 2027', baselineDemandUnits: 14600, aiPredictedDemandUnits: 18900, projectedShortageRiskPercent: 48, safetyStockRecommendedUnits: 4100, patentCliffSurgeMultiplier: 1.29 },
  { month: 'May 2027', baselineDemandUnits: 15000, aiPredictedDemandUnits: 20400, projectedShortageRiskPercent: 55, safetyStockRecommendedUnits: 4600, patentCliffSurgeMultiplier: 1.36 },
  { month: 'Jun 2027', baselineDemandUnits: 15500, aiPredictedDemandUnits: 22800, projectedShortageRiskPercent: 68, safetyStockRecommendedUnits: 5200, patentCliffSurgeMultiplier: 1.47 },
  { month: 'Jul 2027', baselineDemandUnits: 15800, aiPredictedDemandUnits: 24100, projectedShortageRiskPercent: 72, safetyStockRecommendedUnits: 5600, patentCliffSurgeMultiplier: 1.52 },
  { month: 'Aug 2027', baselineDemandUnits: 16200, aiPredictedDemandUnits: 26500, projectedShortageRiskPercent: 81, safetyStockRecommendedUnits: 6200, patentCliffSurgeMultiplier: 1.63 },
  { month: 'Sep 2027', baselineDemandUnits: 16700, aiPredictedDemandUnits: 28900, projectedShortageRiskPercent: 89, safetyStockRecommendedUnits: 7000, patentCliffSurgeMultiplier: 1.73 },
];

/**
 * Retrieves the comprehensive predictive supply chain analysis
 */
export async function getPredictiveSupplyChainReport(): Promise<InventoryForecastResult> {
  return {
    generatedAt: new Date().toISOString(),
    forecastHorizonMonths: 12,
    totalMonitoredSkus: 842,
    imminentShortageCount: activeShortageAlerts.filter((a) => !a.isAutoReordered && a.projectedStockoutDays <= 7).length,
    patentCliffEvents: INITIAL_PATENT_CLIFFS,
    shortageAlerts: activeShortageAlerts,
    demandCurve: DEMAND_CURVE_DATA,
    aggregateCapitalOptimizedUsd: 1428500.0,
  };
}

/**
 * Executes automated or manual B2B bulk reordering for an at-risk molecule
 */
export async function triggerBulkReorder(
  alertId: string,
  reorderQuantity?: number
): Promise<{ success: boolean; alert: PredictiveShortageAlert; poNumber: string; deliveryEtaDays: number }> {
  const alert = activeShortageAlerts.find((a) => a.id === alertId);
  if (!alert) {
    throw new Error(`Shortage alert "${alertId}" not found.`);
  }

  alert.isAutoReordered = true;
  if (reorderQuantity) {
    alert.recommendedReorderQuantity = reorderQuantity;
  }
  alert.currentDispensaryStock += alert.recommendedReorderQuantity;
  alert.projectedStockoutDays = Math.round((alert.currentDispensaryStock / alert.predictedDemandNext30d) * 30);

  const poNumber = `B2B-PO-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    alert,
    poNumber,
    deliveryEtaDays: alert.estimatedLeadTimeDays,
  };
}
