import mongoose from 'mongoose';
import { initialMedicineOffers, initialDispenseOrders, initialTenantUsers, initialAuditEvents } from '../data/mockData';

// Medicine Schema
const MedicineSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    salt: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    therapeuticClass: { type: String, required: true },
    schedule: { type: String, required: true },
    manufacturer: { type: String, required: true },
    qaCert: { type: String, required: true },
    bestPrice: { type: Number, required: true },
    marketPrice: { type: Number, required: true },
    unit: { type: String, required: true },
    savingsSpreadPercent: { type: Number, required: true },
    partnerName: { type: String, required: true },
    partnerType: { type: String, required: true },
    freshness: { type: String, required: true },
    freshnessStatus: { type: String, required: true },
    isRxRequired: { type: Boolean, default: true },
    offersCount: { type: Number, default: 1 },
    rankScore: { type: Number, default: 8.0 },
    dosageStrengths: [{ type: String }],
    indications: [{ type: String }],
    fdaTeCode: { type: String, default: 'AB' },
    activeIngredients: { type: String, required: true },
    sideEffects: [{ type: String }],
    bioequivalencePercent: { type: Number, default: 99.0 },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// Order Schema
const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    orderNumber: { type: String, required: true },
    patientName: { type: String, required: true },
    patientAddress: { type: String, required: true },
    rxNumber: { type: String, required: true },
    prescriber: { type: String, required: true },
    prescriberNpi: { type: String, required: true },
    timestamp: { type: String, required: true },
    timeAgo: { type: String, required: true },
    medicine: {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      qty: { type: Number, required: true },
      brandSubstituteFor: { type: String, required: true },
    },
    coldChain: {
      required: { type: Boolean, default: false },
      currentTempC: { type: Number, default: 4.0 },
      sensorTag: { type: String, default: '' },
      tempRange: { type: String, default: '2°C - 8°C' },
      isLocked: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: true },
    },
    escrowValue: { type: Number, required: true },
    status: { type: String, required: true },
    isColdChain: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Audit Event Schema
const AuditEventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    tenant: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// Tenant User Schema
const TenantUserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    initials: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    scope: { type: String, required: true },
    location: { type: String, required: true },
    mfaMethod: { type: String, required: true },
    mfaType: { type: String, required: true },
    lastActive: { type: String, required: true },
  },
  { timestamps: true }
);

export const MedicineModel = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const AuditEventModel = mongoose.models.AuditEvent || mongoose.model('AuditEvent', AuditEventSchema);
export const TenantUserModel = mongoose.models.TenantUser || mongoose.model('TenantUser', TenantUserSchema);

let isConnected = false;

/**
 * Initializes and manages MongoDB Atlas connection
 */
export async function connectMongo(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[MongoDB] MONGODB_URI environment variable is not defined.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('[MongoDB] Connected successfully to MongoDB Atlas (Cluster0).');

    // Automatically seed initial pharmaceutical records if database is empty
    await seedInitialDataIfEmpty();
    return true;
  } catch (error: any) {
    isConnected = false;
    console.error('[MongoDB] Connection error:', error.message);
    return false;
  }
}

/**
 * Seeds initial pharmaceutical data into MongoDB collections if empty
 */
async function seedInitialDataIfEmpty() {
  try {
    const medicineCount = await MedicineModel.countDocuments();
    if (medicineCount === 0) {
      console.log('[MongoDB] Seeding initial medicines into MongoDB...');
      await MedicineModel.insertMany(initialMedicineOffers as any[]);
      console.log(`[MongoDB] Successfully seeded ${initialMedicineOffers.length} medicines.`);
    }

    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      console.log('[MongoDB] Seeding initial dispense orders into MongoDB...');
      await OrderModel.insertMany(initialDispenseOrders as any[]);
      console.log(`[MongoDB] Successfully seeded ${initialDispenseOrders.length} orders.`);
    }

    const auditCount = await AuditEventModel.countDocuments();
    if (auditCount === 0) {
      console.log('[MongoDB] Seeding initial audit events into MongoDB...');
      await AuditEventModel.insertMany(initialAuditEvents as any[]);
      console.log(`[MongoDB] Successfully seeded ${initialAuditEvents.length} audit records.`);
    }

    const userCount = await TenantUserModel.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Seeding initial tenant users into MongoDB...');
      await TenantUserModel.insertMany(initialTenantUsers as any[]);
      console.log(`[MongoDB] Successfully seeded ${initialTenantUsers.length} tenant users.`);
    }
  } catch (err: any) {
    console.warn('[MongoDB] Seeding check encountered a non-fatal error:', err.message);
  }
}

/**
 * Retrieves current MongoDB connection and collection statistics
 */
export async function getMongoStats() {
  const state = mongoose.connection.readyState;
  const stateMap: Record<number, string> = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING',
  };

  const status = stateMap[state] || 'UNKNOWN';

  let counts = { medicines: 0, orders: 0, auditEvents: 0, users: 0 };
  if (state === 1) {
    try {
      counts = {
        medicines: await MedicineModel.countDocuments(),
        orders: await OrderModel.countDocuments(),
        auditEvents: await AuditEventModel.countDocuments(),
        users: await TenantUserModel.countDocuments(),
      };
    } catch {
      // ignore
    }
  }

  return {
    database: mongoose.connection.name || 'genmedicine',
    host: mongoose.connection.host || 'cluster0.c7bimng.mongodb.net',
    status,
    isConnected: state === 1,
    collections: counts,
  };
}
