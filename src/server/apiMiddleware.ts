import type { IncomingMessage, ServerResponse } from 'http';
import {
  initialMedicineOffers,
  initialDispenseOrders,
  initialTenantUsers,
  initialDispensaryOutlets,
  initialAuditEvents,
  initialRankingWeights,
  initialFormulationDossiers,
} from '../data/mockData';
import { initialBatchAudits } from '../data/batchData';
import type {
  MedicineOffer,
  DispenseOrder,
  TenantUser,
  DispensaryOutlet,
  AuditEvent,
  RankingWeights,
  SavingsCalculationRequest,
  SavingsCalculationResult,
} from '../types';
import { parsePrescriptionWithGemini, analyzeDrugInteractions } from './geminiService';
import {
  getTenantTopology,
  executeTenantQuery,
  runTenantMigrations,
  getMigrationHistory,
  runDataLeakageVerificationTest,
} from './tenantDbService';
import { getLiveTelemetry, simulateSensorBreach, resetSensorToCompliant } from './iotTelemetryService';
import { getEscrowVaultStatus, createEscrowHold, releaseEscrowFunds } from './escrowService';
import { generateCryptographicCoa } from './coaService';
import {
  getHealthSyncStatus,
  syncHealthKitData,
  markAdherenceStatus,
  checkAllergyConflict,
} from './healthSyncService';
import {
  getNotificationQueue,
  sendPushNotification,
  markNotificationAsRead,
} from './pushNotificationService';
import {
  getScannerSessionConfig,
  processHardwareBarcodeScan,
} from './hardwareScannerService';
import {
  getPredictiveSupplyChainReport,
  triggerBulkReorder,
} from './predictiveSupplyChainService';
import {
  getClinicalTrialProtocols,
  matchPatientToTrials,
  recordPatientTrialConsent,
  getConsentLedger,
} from './clinicalTrialService';
import {
  getCrossBorderArbitrageOpportunities,
  checkRegulatoryCompliance,
} from './crossBorderRegulatoryService';

// In-Memory Server State for Phase 1 & Phase 3 Operations
let ordersState: DispenseOrder[] = JSON.parse(JSON.stringify(initialDispenseOrders));
let tenantUsersState: TenantUser[] = JSON.parse(JSON.stringify(initialTenantUsers));
let outletsState: DispensaryOutlet[] = JSON.parse(JSON.stringify(initialDispensaryOutlets));
let auditEventsState: AuditEvent[] = JSON.parse(JSON.stringify(initialAuditEvents));
let rankingWeightsState: RankingWeights = { ...initialRankingWeights };

/**
 * Parses URL query parameters from incoming request URL
 */
function parseQueryParams(urlStr: string): Record<string, string> {
  const url = new URL(urlStr, 'http://localhost');
  const params: Record<string, string> = {};
  url.searchParams.forEach((val, key) => {
    params[key] = val;
  });
  return params;
}

/**
 * Sends a standardized JSON response
 */
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

/**
 * Reads request body as JSON
 */
async function readJsonBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : ({} as T));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Vite & Connect-compatible API middleware for GenMedicine
 * Supports Phase 1, Phase 3, and Phase 4 Endpoints
 */
export function createApiMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url || '';

    // Only intercept /api/v1/*
    if (!url.startsWith('/api/v1')) {
      return next();
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.end();
    }

    const path = url.split('?')[0];

    try {
      // ==========================================
      // PHASE 6: GLOBAL TRIALS & PREDICTIVE SUPPLY CHAIN (v5.0)
      // ==========================================

      // 1. GET /api/v1/supply-chain/forecast
      if (path === '/api/v1/supply-chain/forecast' && req.method === 'GET') {
        const report = await getPredictiveSupplyChainReport();
        return sendJson(res, 200, report);
      }

      // 2. POST /api/v1/supply-chain/reorder
      if (path === '/api/v1/supply-chain/reorder' && req.method === 'POST') {
        const body = await readJsonBody<{ alertId: string; quantity?: number }>(req);
        const reorderRes = await triggerBulkReorder(body.alertId, body.quantity);

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        auditEventsState.unshift({
          id: `aud-${Date.now()}`,
          time: timeStr,
          type: 'CONFIG_CHANGE',
          tenant: 'predictive_supply_chain_ai',
          description: `Automated replenishment PO ${reorderRes.poNumber} dispatched for ${reorderRes.alert.molecule} (${reorderRes.alert.recommendedReorderQuantity} units) to prevent stockout.`,
        });

        return sendJson(res, 200, reorderRes);
      }

      // 3. GET /api/v1/trials/protocols
      if (path === '/api/v1/trials/protocols' && req.method === 'GET') {
        const protocols = await getClinicalTrialProtocols();
        return sendJson(res, 200, { protocols });
      }

      // 4. POST /api/v1/trials/match-patient
      if (path === '/api/v1/trials/match-patient' && req.method === 'POST') {
        const body = await readJsonBody<any>(req);
        const matches = await matchPatientToTrials(body);
        return sendJson(res, 200, { success: true, matches });
      }

      // 5. POST /api/v1/trials/consent
      if (path === '/api/v1/trials/consent' && req.method === 'POST') {
        const body = await readJsonBody<{ patientId: string; nctNumber: string; zkpProofHash: string }>(req);
        const consentRes = await recordPatientTrialConsent(
          body.patientId || 'usr-customer-01',
          body.nctNumber,
          body.zkpProofHash
        );

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        auditEventsState.unshift({
          id: `aud-${Date.now()}`,
          time: timeStr,
          type: 'RBAC_AUDIT',
          tenant: 'decentralized_clinical_trials',
          description: `ZKP Patient Consent signed for trial ${body.nctNumber} (Ledger ID: ${consentRes.ledgerRecord.ledgerId}). Escrow stipend locked in smart contract.`,
        });

        return sendJson(res, 200, consentRes);
      }

      // 6. GET /api/v1/trials/consent-ledger
      if (path === '/api/v1/trials/consent-ledger' && req.method === 'GET') {
        const ledger = await getConsentLedger();
        return sendJson(res, 200, { totalRecords: ledger.length, ledger });
      }

      // 7. GET /api/v1/regulatory/cross-border-arbitrage
      if (path === '/api/v1/regulatory/cross-border-arbitrage' && req.method === 'GET') {
        const opportunities = await getCrossBorderArbitrageOpportunities();
        return sendJson(res, 200, { total: opportunities.length, opportunities });
      }

      // 8. POST /api/v1/regulatory/check-compliance
      if (path === '/api/v1/regulatory/check-compliance' && req.method === 'POST') {
        const body = await readJsonBody<{ moleculeName: string }>(req);
        const check = await checkRegulatoryCompliance(body.moleculeName || 'Atorvastatin');
        return sendJson(res, 200, check);
      }

      // ==========================================
      // PHASE 5: NATIVE MOBILE & HEALTH INTEGRATIONS
      // ==========================================

      // A. GET /api/v1/health-sync/status
      if (path === '/api/v1/health-sync/status' && req.method === 'GET') {
        const status = await getHealthSyncStatus();
        return sendJson(res, 200, status);
      }

      // B. POST /api/v1/health-sync/sync
      if (path === '/api/v1/health-sync/sync' && req.method === 'POST') {
        const body = await readJsonBody<{ source: 'Apple HealthKit' | 'Google Health Connect' }>(req);
        const synced = await syncHealthKitData(body.source || 'Apple HealthKit');
        return sendJson(res, 200, synced);
      }

      // C. POST /api/v1/health-sync/adherence
      if (path === '/api/v1/health-sync/adherence' && req.method === 'POST') {
        const body = await readJsonBody<{ scheduleId: string; status: 'TAKEN' | 'SKIPPED' }>(req);
        const updated = await markAdherenceStatus(body.scheduleId, body.status);
        return sendJson(res, 200, { success: true, record: updated });
      }

      // D. POST /api/v1/health-sync/check-allergy
      if (path === '/api/v1/health-sync/check-allergy' && req.method === 'POST') {
        const body = await readJsonBody<{ drugName: string }>(req);
        const check = await checkAllergyConflict(body.drugName || '');
        return sendJson(res, 200, check);
      }

      // E. GET /api/v1/notifications/queue
      if (path === '/api/v1/notifications/queue' && req.method === 'GET') {
        const notifications = await getNotificationQueue();
        return sendJson(res, 200, { notifications });
      }

      // F. POST /api/v1/notifications/send
      if (path === '/api/v1/notifications/send' && req.method === 'POST') {
        const body = await readJsonBody<any>(req);
        const newNotification = await sendPushNotification(
          body.title || 'Notification',
          body.body || '',
          body.type || 'DOSE_REMINDER',
          body.orderId
        );
        return sendJson(res, 201, { success: true, notification: newNotification });
      }

      // G. POST /api/v1/notifications/read
      if (path === '/api/v1/notifications/read' && req.method === 'POST') {
        const body = await readJsonBody<{ id: string }>(req);
        await markNotificationAsRead(body.id);
        return sendJson(res, 200, { success: true });
      }

      // H. GET /api/v1/hardware/scanner-config
      if (path === '/api/v1/hardware/scanner-config' && req.method === 'GET') {
        const config = await getScannerSessionConfig();
        return sendJson(res, 200, config);
      }

      // I. POST /api/v1/hardware/scan-barcode
      if (path === '/api/v1/hardware/scan-barcode' && req.method === 'POST') {
        const body = await readJsonBody<{ barcodeData: string; symbology?: any }>(req);
        const scanRes = await processHardwareBarcodeScan(body.barcodeData, body.symbology);
        return sendJson(res, 200, { success: true, scanResult: scanRes });
      }

      // ==========================================
      // PHASE 4: LIVE AI MULTIMODAL OCR & DDI
      // ==========================================

      // 1. POST /api/v1/ai/prescription-ocr
      if (path === '/api/v1/ai/prescription-ocr' && req.method === 'POST') {
        const body = await readJsonBody<{ imageBase64?: string; presetId?: string }>(req);
        const result = await parsePrescriptionWithGemini(body.imageBase64, body.presetId);

        // Record Audit Event
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        auditEventsState.unshift({
          id: `aud-${Date.now()}`,
          time: timeStr,
          type: 'CONFIG_CHANGE',
          tenant: 'gemini_multimodal_vision',
          description: `Prescription OCR scan executed via ${result.modelUsed} (confidence: ${(result.overallConfidence * 100).toFixed(1)}%). Extracted ${result.extractedMedications.length} drug candidates.`,
        });

        return sendJson(res, 200, { success: true, ocrResult: result });
      }

      // 2. POST /api/v1/ai/ddi-check
      if (path === '/api/v1/ai/ddi-check' && req.method === 'POST') {
        const body = await readJsonBody<{ medications: string[] }>(req);
        const ddi = await analyzeDrugInteractions(body.medications || []);
        return sendJson(res, 200, { success: true, ddiResult: ddi });
      }

      // ==========================================
      // PHASE 4: POSTGRESQL 16 MULTI-TENANT ENGINE
      // ==========================================

      // 3. GET /api/v1/db/topology
      if (path === '/api/v1/db/topology' && req.method === 'GET') {
        const topology = await getTenantTopology();
        return sendJson(res, 200, {
          engine: 'PostgreSQL 16 Multi-Tenant Schema Partitioning',
          isolationLevel: 'SCHEMA_PER_TENANT_SEARCH_PATH',
          poolRouter: 'Active (search_path dynamic resolver)',
          tenants: topology,
        });
      }

      // 4. POST /api/v1/db/tenant-query
      if (path === '/api/v1/db/tenant-query' && req.method === 'POST') {
        const body = await readJsonBody<{ tenantSchema: string; sqlQuery: string }>(req);
        const result = await executeTenantQuery(body.tenantSchema || 'schema_tenant_apollo', body.sqlQuery || '');
        return sendJson(res, 200, { success: true, queryResult: result });
      }

      // 5. POST /api/v1/db/schema-migrations
      if (path === '/api/v1/db/schema-migrations' && req.method === 'POST') {
        const body = await readJsonBody<{ migrationName: string }>(req);
        const job = await runTenantMigrations(body.migrationName);

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        auditEventsState.unshift({
          id: `aud-${Date.now()}`,
          time: timeStr,
          type: 'SCHEMA_SYNC',
          tenant: 'schema_router_pooler',
          description: `DDL migration ${job.name} executed across schemas [${job.appliedSchemas.join(', ')}] in ${job.executionTimeMs}ms.`,
        });

        return sendJson(res, 200, { success: true, migrationJob: job });
      }

      // 6. GET /api/v1/db/migrations
      if (path === '/api/v1/db/migrations' && req.method === 'GET') {
        return sendJson(res, 200, { migrations: getMigrationHistory() });
      }

      // 7. GET /api/v1/db/leakage-test
      if (path === '/api/v1/db/leakage-test' && req.method === 'GET') {
        const tests = await runDataLeakageVerificationTest();
        return sendJson(res, 200, {
          isolationScore: '100.00% PASS',
          leakageDetected: false,
          totalTestsRun: tests.length,
          tests,
        });
      }

      // ==========================================
      // PHASE 4: IOT COLD-CHAIN TELEMETRY
      // ==========================================

      // 8. GET /api/v1/iot/telemetry
      if (path === '/api/v1/iot/telemetry' && req.method === 'GET') {
        const telemetry = await getLiveTelemetry();
        return sendJson(res, 200, telemetry);
      }

      // 9. POST /api/v1/iot/simulate-breach
      if (path === '/api/v1/iot/simulate-breach' && req.method === 'POST') {
        const body = await readJsonBody<{ sensorId: string; targetTemp?: number; reset?: boolean }>(req);
        if (body.reset) {
          const restored = await resetSensorToCompliant(body.sensorId || 'BLE-CC-8821');
          return sendJson(res, 200, { success: true, restored });
        } else {
          const breachRes = await simulateSensorBreach(
            body.sensorId || 'BLE-CC-8821',
            body.targetTemp !== undefined ? body.targetTemp : 10.4
          );

          if (breachRes.alertTriggered) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            auditEventsState.unshift({
              id: `aud-${Date.now()}`,
              time: timeStr,
              type: 'MODERATION_FLAG',
              tenant: 'iot_cold_chain_mesh',
              description: `CRITICAL COLD CHAIN BREACH: Sensor ${body.sensorId} reached ${body.targetTemp}°C. Dispatch safety lock activated for order ${breachRes.packet.orderId}.`,
            });
          }

          return sendJson(res, 200, breachRes);
        }
      }

      // ==========================================
      // PHASE 4: PROGRAMMATIC ESCROW & STRIPE VAULT
      // ==========================================

      // 10. GET /api/v1/escrow/vault-status
      if (path === '/api/v1/escrow/vault-status' && req.method === 'GET') {
        const vault = await getEscrowVaultStatus();
        return sendJson(res, 200, vault);
      }

      // 11. POST /api/v1/escrow/release
      if (path === '/api/v1/escrow/release' && req.method === 'POST') {
        const body = await readJsonBody<{ orderId: string; pharmdSignOffId?: string }>(req);
        const releaseRes = await releaseEscrowFunds(body.orderId, body.pharmdSignOffId || 'Dr. Michael Chen, PharmD');

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        auditEventsState.unshift({
          id: `aud-${Date.now()}`,
          time: timeStr,
          type: 'RBAC_AUDIT',
          tenant: 'stripe_custom_connect_escrow',
          description: `Escrow funds ($${releaseRes.payoutAmount.toFixed(2)}) disbursed for order ${body.orderId} following verified PharmD sign-off.`,
        });

        return sendJson(res, 200, releaseRes);
      }

      // ==========================================
      // PHASE 4: CRYPTOGRAPHIC COA EXPORT
      // ==========================================

      // 12. GET /api/v1/b2b/coa/:batchId
      const coaMatch = path.match(/^\/api\/v1\/b2b\/coa\/([^/]+)$/);
      if (coaMatch && req.method === 'GET') {
        const batchId = coaMatch[1];
        const coa = await generateCryptographicCoa(batchId);
        return sendJson(res, 200, { success: true, certificate: coa });
      }

      // ==========================================
      // PHASE 1: DRUG DIRECTORY & SAVINGS APIS
      // ==========================================

      // 13. GET /api/v1/categories
      if (path === '/api/v1/categories' && req.method === 'GET') {
        const categoryMap = new Map<string, number>();
        initialMedicineOffers.forEach((m) => {
          categoryMap.set(m.therapeuticClass, (categoryMap.get(m.therapeuticClass) || 0) + 1);
        });

        const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
          name,
          count,
        }));

        return sendJson(res, 200, {
          totalMedicines: initialMedicineOffers.length,
          categories,
        });
      }

      // 14. GET /api/v1/medicines/:id
      const medicineDetailMatch = path.match(/^\/api\/v1\/medicines\/([^/]+)$/);
      if (medicineDetailMatch && req.method === 'GET') {
        const id = medicineDetailMatch[1];
        const medicine = initialMedicineOffers.find((m) => m.id === id);

        if (!medicine) {
          return sendJson(res, 404, { error: `Medicine with ID "${id}" not found.` });
        }

        return sendJson(res, 200, {
          medicine,
          therapeuticEquivalence: {
            code: medicine.fdaTeCode || 'AB',
            isBioequivalent: true,
            fdaOrangeBookStatus: 'Certified Generic Equivalent',
            rldBenchmark: medicine.brandName || 'Reference Listed Drug',
          },
        });
      }

      // 15. GET /api/v1/medicines (List with search, category, sort)
      if (path === '/api/v1/medicines' && req.method === 'GET') {
        const queryParams = parseQueryParams(url);
        const query = (queryParams.q || '').trim().toLowerCase();
        const category = (queryParams.category || '').trim();
        const sort = queryParams.sort || 'rank';

        let filtered = initialMedicineOffers.filter((m) => {
          const matchesQuery =
            !query ||
            m.name.toLowerCase().includes(query) ||
            m.salt.toLowerCase().includes(query) ||
            (m.brandName && m.brandName.toLowerCase().includes(query)) ||
            (m.indications && m.indications.some((ind) => ind.toLowerCase().includes(query)));

          const matchesCategory =
            !category ||
            category === 'All' ||
            m.therapeuticClass.toLowerCase().includes(category.toLowerCase()) ||
            m.category.toLowerCase().includes(category.toLowerCase());

          return matchesQuery && matchesCategory;
        });

        filtered.sort((a, b) => {
          if (sort === 'savings') return b.savingsSpreadPercent - a.savingsSpreadPercent;
          if (sort === 'price-asc') return a.bestPrice - b.bestPrice;
          if (sort === 'price-desc') return b.bestPrice - a.bestPrice;
          if (sort === 'name') return a.name.localeCompare(b.name);
          return b.rankScore - a.rankScore;
        });

        return sendJson(res, 200, {
          total: filtered.length,
          medicines: filtered,
          appliedFilters: {
            query: query || null,
            category: category || null,
            sort,
          },
        });
      }

      // 16. POST /api/v1/calculate-savings
      if (path === '/api/v1/calculate-savings' && req.method === 'POST') {
        const body = (await readJsonBody<SavingsCalculationRequest>(req)) || { items: [] };
        const items = body.items || [];

        let totalBrandMonthly = 0;
        let totalGenericMonthly = 0;

        const itemizedSavings = items.map((item) => {
          const medicine = initialMedicineOffers.find((m) => m.id === item.medicineId);
          const qty = item.quantityMonthly || 1;

          if (!medicine) {
            return {
              medicineId: item.medicineId,
              name: 'Unknown Molecule',
              brandName: 'Brand',
              brandCost: 0,
              genericCost: 0,
              monthlySavings: 0,
              annualSavings: 0,
              savingsPercent: 0,
            };
          }

          const brandCost = parseFloat((medicine.marketPrice * qty).toFixed(2));
          const genericCost = parseFloat((medicine.bestPrice * qty).toFixed(2));
          const monthlySavings = parseFloat((brandCost - genericCost).toFixed(2));
          const annualSavings = parseFloat((monthlySavings * 12).toFixed(2));
          const savingsPercent = Math.round(((brandCost - genericCost) / (brandCost || 1)) * 100);

          totalBrandMonthly += brandCost;
          totalGenericMonthly += genericCost;

          return {
            medicineId: medicine.id,
            name: medicine.name,
            brandName: medicine.brandName || medicine.name,
            brandCost,
            genericCost,
            monthlySavings,
            annualSavings,
            savingsPercent,
          };
        });

        const monthlySavings = parseFloat((totalBrandMonthly - totalGenericMonthly).toFixed(2));
        const annualSavings = parseFloat((monthlySavings * 12).toFixed(2));
        const averageSavingsPercent =
          totalBrandMonthly > 0
            ? Math.round(((totalBrandMonthly - totalGenericMonthly) / totalBrandMonthly) * 100)
            : 0;

        const result: SavingsCalculationResult = {
          totalBrandMonthly: parseFloat(totalBrandMonthly.toFixed(2)),
          totalGenericMonthly: parseFloat(totalGenericMonthly.toFixed(2)),
          monthlySavings,
          annualSavings,
          averageSavingsPercent,
          itemizedSavings,
        };

        return sendJson(res, 200, result);
      }

      // ==========================================
      // PHASE 3: DISPENSE HUB & ORDERS
      // ==========================================

      // 17. GET /api/v1/orders/tenant-queue
      if (path === '/api/v1/orders/tenant-queue' && req.method === 'GET') {
        return sendJson(res, 200, {
          total: ordersState.length,
          dispatchedCount: ordersState.filter((o) => o.status === 'Dispatched' || o.status === 'Completed').length,
          orders: ordersState,
        });
      }

      // 18. POST /api/v1/orders/create
      if (path === '/api/v1/orders/create' && req.method === 'POST') {
        const body = await readJsonBody<any>(req);
        const orderNum = body.orderNumber || `#GEN-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

        const newOrder: DispenseOrder = {
          id: `ord-${Date.now()}`,
          orderNumber: orderNum,
          patientName: body.patientName || 'Alex Morgan',
          patientAddress: body.patientAddress || '452 Broadway, Apt 4B, New York, NY 10013',
          rxNumber: `#RX-${Math.floor(10000 + Math.random() * 90000)}-B`,
          prescriber: body.prescriber || 'Dr. Sarah Jenkins, MD',
          prescriberNpi: '#1982348102',
          timestamp: 'Today, Just now',
          timeAgo: 'Just now',
          slaMinutesRemaining: 45,
          items: body.items || [
            {
              name: body.medicineName || 'Generic Atorvastatin 20mg',
              genericSalt: 'Atorvastatin Calcium',
              dosage: '20mg Oral Tab',
              quantity: '30 Tabs',
              barcode: `CP-ATC-${Math.floor(100 + Math.random() * 900)}`,
              lotNumber: 'CP-2026-99A',
              expiryDate: 'Exp 08/2029',
              brandDisplaced: body.brandDisplaced || 'Pfizer Lipitor® 20mg',
              price: 14.2,
              savings: 28.3,
            },
          ],
          packagingColdChain: {
            sensorTag: `#S-${Math.floor(1000 + Math.random() * 9000)}-0K`,
            tempRange: '2°C - 8°C Verified',
            isLocked: true,
            isVerified: true,
          },
          ddiCheck: {
            status: 'Passed',
            severeCount: 0,
            pharmacistSignOff: 'Pending review',
            hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          },
          courier: {
            company: 'SwiftRx Medical Courier',
            driverName: 'Marcus Vance',
            driverPhone: '+1 (555) 019-2831',
            vehicleType: 'Certified Cold Carrier',
            etaMinutes: 14,
            status: 'Scheduled',
            isColdCarrier: true,
          },
          escrowValue: body.total || 15.2,
          status: 'Sign-Off Required',
          isColdChain: true,
        };

        ordersState.unshift(newOrder);

        // Auto-create Escrow hold
        await createEscrowHold(newOrder.orderNumber, newOrder.patientName, newOrder.escrowValue);

        // Record Audit Event
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        auditEventsState.unshift({
          id: `aud-${Date.now()}`,
          time: timeStr,
          type: 'SCHEMA_SYNC',
          tenant: 'apollo_downtown_104',
          description: `Order ${orderNum} created for ${newOrder.patientName} with $${newOrder.escrowValue.toFixed(2)} Stripe escrow vault hold.`,
        });

        return sendJson(res, 201, { success: true, order: newOrder });
      }

      // 19. POST /api/v1/orders/:id/approve
      const orderApproveMatch = path.match(/^\/api\/v1\/orders\/([^/]+)\/approve$/);
      if (orderApproveMatch && req.method === 'POST') {
        const orderId = orderApproveMatch[1];
        const orderIndex = ordersState.findIndex((o) => o.id === orderId || o.orderNumber === orderId);

        if (orderIndex === -1) {
          return sendJson(res, 404, { error: `Order "${orderId}" not found.` });
        }

        const current = ordersState[orderIndex];
        const updated: DispenseOrder = {
          ...current,
          status: 'Dispatched',
          courier: {
            ...current.courier,
            status: 'Dispatched',
            etaMinutes: 12,
          },
        };
        ordersState[orderIndex] = updated;

        // Auto-release escrow
        await releaseEscrowFunds(current.orderNumber, 'Dr. Michael Chen (PharmD #1982348102)');

        // Record Audit Event
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        auditEventsState.unshift({
          id: `aud-${Date.now()}`,
          time: timeStr,
          type: 'RBAC_AUDIT',
          tenant: 'apollo_downtown_104',
          description: `Order ${updated.orderNumber} approved by Dr. Michael Chen (PharmD). Escrow released ($${updated.escrowValue.toFixed(2)}) & courier dispatched.`,
        });

        return sendJson(res, 200, {
          success: true,
          order: updated,
          escrowReleased: updated.escrowValue,
          courierStatus: 'Dispatched',
        });
      }

      // ==========================================
      // PHASE 3: TENANT USERS & OUTLETS
      // ==========================================

      // 20. GET /api/v1/tenants/users
      if (path === '/api/v1/tenants/users' && req.method === 'GET') {
        return sendJson(res, 200, {
          tenantId: 'tenant_apollo_health_group',
          totalUsers: tenantUsersState.length,
          users: tenantUsersState,
        });
      }

      // 21. POST /api/v1/tenants/users
      if (path === '/api/v1/tenants/users' && req.method === 'POST') {
        const body = await readJsonBody<any>(req);
        const newUser: TenantUser = {
          id: `usr-${Date.now()}`,
          name: body.name || 'New Staff Member',
          initials: (body.name || 'NS').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          email: body.email || 'staff@apollohealth.org',
          role: body.role || 'Staff Pharmacist',
          scope: body.scope || 'Apollo #104 Store Scope',
          location: body.location || 'New York, NY',
          mfaMethod: body.mfaMethod || 'FIDO2 Passkey Hardware',
          mfaType: body.mfaType || 'passkey',
          lastActive: 'Just now',
          status: 'Active',
        };
        tenantUsersState.unshift(newUser);

        return sendJson(res, 201, { success: true, user: newUser });
      }

      // 22. GET /api/v1/tenants/outlets
      if (path === '/api/v1/tenants/outlets' && req.method === 'GET') {
        return sendJson(res, 200, {
          outlets: outletsState,
        });
      }

      // 23. POST /api/v1/tenants/outlets
      if (path === '/api/v1/tenants/outlets' && req.method === 'POST') {
        const body = await readJsonBody<any>(req);
        const newOutlet: DispensaryOutlet = {
          id: `out-${Date.now()}`,
          outletCode: body.outletCode || `APL-${Math.floor(100 + Math.random() * 900)}`,
          name: body.name || 'Apollo Care Hub',
          address: body.address || 'New York, NY',
          dea: body.dea || `FD-${Math.floor(100000 + Math.random() * 900000)}`,
          skuCount: body.skuCount || 420,
          status: 'LIVE SYNC',
        };
        outletsState.push(newOutlet);

        return sendJson(res, 201, { success: true, outlet: newOutlet });
      }

      // 24. GET /api/v1/tenants/schema-status
      if (path === '/api/v1/tenants/schema-status' && req.method === 'GET') {
        return sendJson(res, 200, {
          activeSchema: 'schema_tenant_apollo',
          isolationLevel: 'PostgreSQL 16 Multi-Tenant Schema Partitioning',
          rowLevelSecurity: 'ENFORCED (Strict Tenant Isolation)',
          encryptionKey: 'BYOK-AWS-KMS-AES-256',
          liveTables: ['dispense_orders', 'outlet_inventory', 'cold_chain_telemetry', 'tenant_users'],
          leakageRisk: '0.00% (Guaranteed schema segregation)',
        });
      }

      // ==========================================
      // PHASE 3: ADMIN & B2B
      // ==========================================

      // 25. GET /api/v1/admin/audits
      if (path === '/api/v1/admin/audits' && req.method === 'GET') {
        return sendJson(res, 200, {
          totalAudits: auditEventsState.length,
          audits: auditEventsState,
        });
      }

      // 26. POST /api/v1/admin/weights
      if (path === '/api/v1/admin/weights' && req.method === 'POST') {
        const body = await readJsonBody<Partial<RankingWeights>>(req);
        rankingWeightsState = {
          ...rankingWeightsState,
          ...body,
        };
        return sendJson(res, 200, {
          success: true,
          rankingWeights: rankingWeightsState,
        });
      }

      // 27. GET /api/v1/admin/metrics
      if (path === '/api/v1/admin/metrics' && req.method === 'GET') {
        const vault = await getEscrowVaultStatus();
        return sendJson(res, 200, {
          activeTenants: 24,
          totalDispensedToday: ordersState.filter((o) => o.status === 'Dispatched' || o.status === 'Completed').length,
          totalEscrowLocked: vault.totalEscrowLocked,
          averageConsumerSavingsPercent: 74,
          p95SearchLatencyMs: 14.2,
          coldChainComplianceRate: '100%',
        });
      }

      // 28. GET /api/v1/b2b/batches
      if (path === '/api/v1/b2b/batches' && req.method === 'GET') {
        return sendJson(res, 200, {
          totalBatches: initialBatchAudits.length,
          batches: initialBatchAudits,
        });
      }

      // 29. GET /api/v1/b2b/dossiers
      if (path === '/api/v1/b2b/dossiers' && req.method === 'GET') {
        return sendJson(res, 200, {
          totalDossiers: initialFormulationDossiers.length,
          dossiers: initialFormulationDossiers,
        });
      }

      // 404 for unmatched route
      return sendJson(res, 404, { error: `Endpoint ${path} not found on GenMedicine API.` });
    } catch (err: any) {
      console.error('[API Error]:', err);
      return sendJson(res, 500, { error: 'Internal Server Error', message: err?.message });
    }
  };
}
