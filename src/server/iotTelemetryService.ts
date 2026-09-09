import type { ColdChainTelemetryPacket, ColdChainLockEvent } from '../types';

let telemetryPackets: ColdChainTelemetryPacket[] = [
  {
    sensorId: 'BLE-CC-8821',
    orderId: '#GEN-ORD-88219',
    batchId: 'CP-2026-99A',
    medicineName: 'Atorvastatin Calcium 20mg (Cold Carrier)',
    temperatureCelsius: 4.2,
    humidityPercent: 44,
    batteryPercent: 96,
    latitude: 40.7128,
    longitude: -74.0060,
    timestamp: new Date().toISOString(),
    isBreached: false,
    courierName: 'Marcus Vance (SwiftRx)',
  },
  {
    sensorId: 'BLE-CC-9940',
    orderId: '#GEN-ORD-44912',
    batchId: 'CP-2026-140G',
    medicineName: 'Metformin Hydrochloride 500mg ER',
    temperatureCelsius: 5.1,
    humidityPercent: 41,
    batteryPercent: 92,
    latitude: 40.7589,
    longitude: -73.9851,
    timestamp: new Date().toISOString(),
    isBreached: false,
    courierName: 'Marcus Vance (SwiftRx)',
  },
  {
    sensorId: 'NFC-TAG-1044',
    orderId: '#GEN-ORD-10924',
    batchId: 'CP-2026-88B',
    medicineName: 'Rosuvastatin Calcium 10mg',
    temperatureCelsius: 3.8,
    humidityPercent: 46,
    batteryPercent: 88,
    latitude: 40.7829,
    longitude: -73.9654,
    timestamp: new Date().toISOString(),
    isBreached: false,
    courierName: 'Elena Rostova (Courier Lead)',
  }
];

let lockEvents: ColdChainLockEvent[] = [];

export async function getLiveTelemetry(): Promise<{
  activeSensors: number;
  compliantCount: number;
  breachedCount: number;
  ambientTempAvgCelsius: number;
  packets: ColdChainTelemetryPacket[];
  lockEvents: ColdChainLockEvent[];
}> {
  // Add subtle realistic micro-fluctuation (+/- 0.05°C) to active unbreached sensors
  telemetryPackets = telemetryPackets.map((pkt) => {
    if (pkt.isBreached) return pkt;
    const jitter = (Math.random() - 0.5) * 0.1;
    const newTemp = Math.round((pkt.temperatureCelsius + jitter) * 10) / 10;
    return {
      ...pkt,
      temperatureCelsius: Math.min(7.9, Math.max(2.1, newTemp)),
      timestamp: new Date().toISOString(),
    };
  });

  const breached = telemetryPackets.filter((p) => p.isBreached).length;
  const compliant = telemetryPackets.length - breached;
  const sumTemp = telemetryPackets.reduce((sum, p) => sum + p.temperatureCelsius, 0);

  return {
    activeSensors: telemetryPackets.length,
    compliantCount: compliant,
    breachedCount: breached,
    ambientTempAvgCelsius: Math.round((sumTemp / (telemetryPackets.length || 1)) * 10) / 10,
    packets: telemetryPackets,
    lockEvents: lockEvents,
  };
}

export async function simulateSensorBreach(
  sensorId: string,
  targetTemp: number
): Promise<{ success: boolean; packet: ColdChainTelemetryPacket; alertTriggered: boolean }> {
  const index = telemetryPackets.findIndex((p) => p.sensorId === sensorId);
  if (index === -1) {
    throw new Error(`Sensor tag ${sensorId} not found.`);
  }

  const current = telemetryPackets[index];
  const isBreached = targetTemp > 8.0 || targetTemp < 2.0;

  const updated: ColdChainTelemetryPacket = {
    ...current,
    temperatureCelsius: targetTemp,
    isBreached: isBreached,
    breachType: targetTemp > 8.0 ? 'WARM_EXCURSION' : targetTemp < 2.0 ? 'COLD_SHOCK' : undefined,
    timestamp: new Date().toISOString(),
  };

  telemetryPackets[index] = updated;

  if (isBreached) {
    lockEvents.unshift({
      eventId: `lock-${Date.now()}`,
      orderId: updated.orderId,
      sensorId: updated.sensorId,
      triggeredAt: new Date().toISOString(),
      temperature: targetTemp,
      actionTaken: 'DISPENSARY_LOCK',
      reason: `Temperature excursion detected: ${targetTemp}°C (Exceeds 2°C - 8°C strict cGMP safety boundary). Dispatch automatically locked.`,
    });
  }

  return {
    success: true,
    packet: updated,
    alertTriggered: isBreached,
  };
}

export async function resetSensorToCompliant(sensorId: string): Promise<ColdChainTelemetryPacket> {
  const index = telemetryPackets.findIndex((p) => p.sensorId === sensorId);
  if (index === -1) {
    throw new Error(`Sensor tag ${sensorId} not found.`);
  }

  const restored: ColdChainTelemetryPacket = {
    ...telemetryPackets[index],
    temperatureCelsius: 4.5,
    isBreached: false,
    breachType: undefined,
    timestamp: new Date().toISOString(),
  };

  telemetryPackets[index] = restored;

  lockEvents.unshift({
    eventId: `unlock-${Date.now()}`,
    orderId: restored.orderId,
    sensorId: restored.sensorId,
    triggeredAt: new Date().toISOString(),
    temperature: 4.5,
    actionTaken: 'DISPENSARY_LOCK',
    reason: `Temperature normalized (4.5°C). Qualified Pharmacist (PharmD) cleared cold-chain safety latch.`,
    clearedByPharmD: 'Dr. Michael Chen, PharmD (#1982348102)',
  });

  return restored;
}
