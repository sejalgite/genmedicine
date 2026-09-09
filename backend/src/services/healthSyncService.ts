import type {
  GoogleHealthConnectSync,
  HealthKitAdherenceRecord,
  HealthKitVitalsData,
  DrugAllergyProfile,
} from '../types';

let healthSyncState: GoogleHealthConnectSync = {
  isConnected: true,
  sourceApp: 'Apple HealthKit',
  lastSyncTime: 'Just now (Automated Background Sync)',
  recordsSyncedCount: 482,
  adherenceRatePercent: 94,
  activeAllergies: [
    {
      id: 'alg-1',
      allergen: 'Amoxicillin / Penicillin Class',
      category: 'Antibiotic',
      severity: 'Severe (Anaphylaxis)',
      verifiedByProvider: 'Dr. Sarah Jenkins, MD',
      diagnosedYear: 2021,
    },
    {
      id: 'alg-2',
      allergen: 'Ibuprofen / NSAIDs',
      category: 'NSAID',
      severity: 'Moderate (Urticaria / Rash)',
      verifiedByProvider: 'Metropolitan Health Records',
      diagnosedYear: 2023,
    },
  ],
  vitals: {
    lastSyncTimestamp: new Date().toISOString(),
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    bloodPressureStatus: 'Normal (118/76)',
    restingHeartRateBpm: 68,
    bloodGlucoseMgDl: 96,
    glucoseMeasurementType: 'Continuous CGM',
    bodyWeightLbs: 168.4,
    stepCountToday: 8420,
  },
  adherenceSchedule: [
    {
      scheduleId: 'adh-1',
      medicineName: 'Atorvastatin Calcium 20mg',
      dosage: '1 tab daily with dinner',
      timeSlot: 'Evening (20:00)',
      status: 'TAKEN',
      takenTimestamp: 'Today, 20:05',
      streakDays: 14,
    },
    {
      scheduleId: 'adh-2',
      medicineName: 'Metformin Hydrochloride 500mg ER',
      dosage: '1 tab BID with meals',
      timeSlot: 'Morning (08:00)',
      status: 'TAKEN',
      takenTimestamp: 'Today, 08:12',
      streakDays: 14,
    },
    {
      scheduleId: 'adh-3',
      medicineName: 'Metformin Hydrochloride 500mg ER',
      dosage: '1 tab BID with meals',
      timeSlot: 'Evening (20:00)',
      status: 'PENDING',
      streakDays: 13,
    },
  ],
};

export async function getHealthSyncStatus(): Promise<GoogleHealthConnectSync> {
  // Add subtle micro-fluctuation to vitals for realism
  const glucoseJitter = Math.floor((Math.random() - 0.5) * 4);
  healthSyncState.vitals.bloodGlucoseMgDl = Math.min(115, Math.max(88, healthSyncState.vitals.bloodGlucoseMgDl + glucoseJitter));
  healthSyncState.vitals.lastSyncTimestamp = new Date().toISOString();
  healthSyncState.lastSyncTime = 'Just now (Bi-directional Link Active)';
  return healthSyncState;
}

export async function syncHealthKitData(source: 'Apple HealthKit' | 'Google Health Connect'): Promise<GoogleHealthConnectSync> {
  healthSyncState.sourceApp = source;
  healthSyncState.isConnected = true;
  healthSyncState.recordsSyncedCount += 6;
  healthSyncState.lastSyncTime = 'Just now (Synchronized)';
  return healthSyncState;
}

export async function markAdherenceStatus(
  scheduleId: string,
  status: 'TAKEN' | 'SKIPPED'
): Promise<HealthKitAdherenceRecord> {
  const item = healthSyncState.adherenceSchedule.find((s) => s.scheduleId === scheduleId);
  if (!item) {
    throw new Error(`Schedule item ${scheduleId} not found.`);
  }

  item.status = status;
  if (status === 'TAKEN') {
    item.takenTimestamp = 'Just now';
    item.streakDays += 1;
  } else {
    item.takenTimestamp = undefined;
  }

  const takenCount = healthSyncState.adherenceSchedule.filter((s) => s.status === 'TAKEN').length;
  healthSyncState.adherenceRatePercent = Math.round((takenCount / healthSyncState.adherenceSchedule.length) * 100);

  return item;
}

export async function checkAllergyConflict(drugName: string): Promise<{
  hasConflict: boolean;
  allergyMatch?: DrugAllergyProfile;
  warningMessage?: string;
}> {
  const lower = drugName.toLowerCase();
  for (const allergy of healthSyncState.activeAllergies) {
    if (
      (allergy.category === 'Antibiotic' && (lower.includes('amox') || lower.includes('penicillin') || lower.includes('augmentin'))) ||
      (allergy.category === 'NSAID' && (lower.includes('ibuprofen') || lower.includes('naproxen') || lower.includes('advil')))
    ) {
      return {
        hasConflict: true,
        allergyMatch: allergy,
        warningMessage: `CRITICAL ALLERGY ALERT: Patient has a verified ${allergy.severity} to ${allergy.allergen} (Diagnosed ${allergy.diagnosedYear}). Substitution / dispense blocked.`,
      };
    }
  }

  return { hasConflict: false };
}
