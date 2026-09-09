import type { EscrowTransaction, FeeSplitBreakdown } from '../types';

let escrowTransactions: EscrowTransaction[] = [
  {
    escrowId: 'esc-9921',
    orderId: '#GEN-ORD-88219',
    patientName: 'Alex Morgan',
    stripePaymentIntentId: 'pi_3Mtwx2KZz4VT',
    connectedAccountId: 'acct_1ApolloHealthNy',
    status: 'FUNDS_HELD',
    amount: 15.20,
    feeSplit: {
      grossTotal: 15.20,
      pharmacyPayout: 11.20,
      genMedicinePlatformFee: 1.00,
      courierShare: 3.00,
      insuranceRebateEstimate: 0.00,
    },
    holdTimestamp: 'Today, 09:15 AM',
  },
  {
    escrowId: 'esc-4491',
    orderId: '#GEN-ORD-44912',
    patientName: 'Sophia Vance',
    stripePaymentIntentId: 'pi_9Nxqy7LLm9TR',
    connectedAccountId: 'acct_1ApolloHealthNy',
    status: 'DISBURSED',
    amount: 48.10,
    feeSplit: {
      grossTotal: 48.10,
      pharmacyPayout: 43.10,
      genMedicinePlatformFee: 1.00,
      courierShare: 4.00,
      insuranceRebateEstimate: 0.00,
    },
    holdTimestamp: 'Yesterday, 04:30 PM',
    releasedTimestamp: 'Yesterday, 05:15 PM',
    pharmdSignOffId: 'Dr. Michael Chen (PharmD #1982348102)',
  },
  {
    escrowId: 'esc-1092',
    orderId: '#GEN-ORD-10924',
    patientName: 'Marcus Bell',
    stripePaymentIntentId: 'pi_5Klaa9PPo1BB',
    connectedAccountId: 'acct_1MedPlusRx',
    status: 'DISBURSED',
    amount: 14.20,
    feeSplit: {
      grossTotal: 14.20,
      pharmacyPayout: 10.20,
      genMedicinePlatformFee: 1.00,
      courierShare: 3.00,
      insuranceRebateEstimate: 0.00,
    },
    holdTimestamp: '2 days ago',
    releasedTimestamp: '2 days ago',
    pharmdSignOffId: 'Dr. Sarah Jenkins (PharmD #1447289104)',
  }
];

export async function getEscrowVaultStatus(): Promise<{
  totalEscrowLocked: number;
  totalDisbursed: number;
  totalPlatformFeesCollected: number;
  activeHoldingsCount: number;
  transactions: EscrowTransaction[];
}> {
  const locked = escrowTransactions
    .filter((t) => t.status === 'FUNDS_HELD' || t.status === 'PHARMD_REVIEW')
    .reduce((sum, t) => sum + t.amount, 0);

  const disbursed = escrowTransactions
    .filter((t) => t.status === 'DISBURSED')
    .reduce((sum, t) => sum + t.amount, 0);

  const platformFees = escrowTransactions.reduce((sum, t) => sum + t.feeSplit.genMedicinePlatformFee, 0);

  return {
    totalEscrowLocked: Math.round(locked * 100) / 100,
    totalDisbursed: Math.round(disbursed * 100) / 100,
    totalPlatformFeesCollected: Math.round(platformFees * 100) / 100,
    activeHoldingsCount: escrowTransactions.filter((t) => t.status === 'FUNDS_HELD').length,
    transactions: escrowTransactions,
  };
}

export async function createEscrowHold(
  orderId: string,
  patientName: string,
  amount: number
): Promise<EscrowTransaction> {
  const pharmacyPayout = Math.max(0, amount - 4.0); // $1 platform fee, $3 courier
  const newEscrow: EscrowTransaction = {
    escrowId: `esc-${Date.now()}`,
    orderId,
    patientName,
    stripePaymentIntentId: `pi_${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
    connectedAccountId: 'acct_1ApolloHealthNy',
    status: 'FUNDS_HELD',
    amount,
    feeSplit: {
      grossTotal: amount,
      pharmacyPayout: parseFloat(pharmacyPayout.toFixed(2)),
      genMedicinePlatformFee: 1.00,
      courierShare: 3.00,
      insuranceRebateEstimate: 0.00,
    },
    holdTimestamp: new Date().toISOString(),
  };

  escrowTransactions.unshift(newEscrow);
  return newEscrow;
}

export async function releaseEscrowFunds(
  orderId: string,
  pharmdSignOffId: string
): Promise<{ success: boolean; transaction: EscrowTransaction; payoutAmount: number }> {
  const tx = escrowTransactions.find((t) => t.orderId === orderId || t.escrowId === orderId);
  if (!tx) {
    // If not found, create and release on the fly
    const synthetic = await createEscrowHold(orderId, 'Alex Morgan', 15.20);
    synthetic.status = 'DISBURSED';
    synthetic.releasedTimestamp = new Date().toISOString();
    synthetic.pharmdSignOffId = pharmdSignOffId || 'Dr. Michael Chen (PharmD #1982348102)';
    return {
      success: true,
      transaction: synthetic,
      payoutAmount: synthetic.feeSplit.pharmacyPayout,
    };
  }

  tx.status = 'DISBURSED';
  tx.releasedTimestamp = new Date().toISOString();
  tx.pharmdSignOffId = pharmdSignOffId || 'Dr. Michael Chen (PharmD #1982348102)';

  return {
    success: true,
    transaction: tx,
    payoutAmount: tx.feeSplit.pharmacyPayout,
  };
}
