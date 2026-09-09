import type { PushNotificationPayload, PushNotificationType } from '../types';

let notificationQueue: PushNotificationPayload[] = [
  {
    id: 'push-1',
    title: '💊 Medication Refill Available',
    body: 'Your 90-day generic Atorvastatin 20mg supply is ready for auto-refill. Save $84.90 vs brand name.',
    timestamp: '10 mins ago',
    type: 'REFILL_AVAILABLE',
    isRead: false,
    priority: 'HIGH',
  },
  {
    id: 'push-2',
    title: '🚚 Courier Dispatched',
    body: 'Marcus Vance (SwiftRx Cold Carrier) is en route with your prescription. Estimated arrival: 14 mins.',
    timestamp: '25 mins ago',
    type: 'COURIER_DISPATCHED',
    orderId: '#GEN-ORD-88219',
    isRead: false,
    priority: 'HIGH',
  },
  {
    id: 'push-3',
    title: '⏰ Scheduled Evening Dose',
    body: 'Time to take Metformin 500mg ER (1 tablet) with dinner to maintain glycemic control.',
    timestamp: '2 hours ago',
    type: 'DOSE_REMINDER',
    isRead: true,
    priority: 'NORMAL',
  },
];

export async function getNotificationQueue(): Promise<PushNotificationPayload[]> {
  return notificationQueue;
}

export async function sendPushNotification(
  title: string,
  body: string,
  type: PushNotificationType,
  orderId?: string
): Promise<PushNotificationPayload> {
  const newNotification: PushNotificationPayload = {
    id: `push-${Date.now()}`,
    title,
    body,
    timestamp: 'Just now',
    type,
    orderId,
    isRead: false,
    priority: 'HIGH',
  };

  notificationQueue.unshift(newNotification);
  return newNotification;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const item = notificationQueue.find((n) => n.id === id);
  if (item) {
    item.isRead = true;
    return true;
  }
  return false;
}
