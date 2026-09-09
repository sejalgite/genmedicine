import React, { useState } from 'react';
import { AppScreen, MedicineOffer, FormulationDossier, DispenseOrder, TenantUser, DispensaryOutlet, AuditEvent, RankingWeights, UserAccount } from './types';
import {
  initialMedicineOffers,
  initialFormulationDossiers,
  initialDispenseOrders,
  initialTenantUsers,
  initialDispensaryOutlets,
  initialAuditEvents,
  initialRankingWeights,
} from './data/mockData';
import { NavigationBanner } from './components/NavigationBanner';
import { SuperAdminConsole } from './components/SuperAdminConsole';
import { PharmaB2BPortal } from './components/PharmaB2BPortal';
import { TenantAdminPortal } from './components/TenantAdminPortal';
import { PharmacyPartnerPortal } from './components/PharmacyPartnerPortal';
import { CustomerMobileApp } from './components/CustomerMobileApp';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { AuthScreen } from './components/AuthScreen';
import { GenericDrugDirectory } from './components/GenericDrugDirectory';
import { Phase4EngineDashboard } from './components/Phase4EngineDashboard';
import { Phase5MobileHealthSuite } from './components/Phase5MobileHealthSuite';
import { Phase6GlobalTrialsAndSupplyChain } from './components/Phase6GlobalTrialsAndSupplyChain';

const DEFAULT_USER: UserAccount = {
  id: 'usr-customer-01',
  email: 'alex.morgan@healthmail.com',
  name: 'Alex Morgan',
  role: 'customer',
  phone: '+1 (555) 234-5678',
  address: '452 Broadway, Apt 4B, New York, NY 10013',
  insuranceProvider: 'BlueCross Anthem Select',
  memberId: 'BC-99420-ALEX',
  hsaFsaBalance: 840.5,
  isVerified: true,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('super-admin');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(DEFAULT_USER);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Shared platform state
  const [rankingWeights, setRankingWeights] = useState<RankingWeights>(initialRankingWeights);
  const [medicineOffers, setMedicineOffers] = useState<MedicineOffer[]>(initialMedicineOffers);
  const [dossiers, setDossiers] = useState<FormulationDossier[]>(initialFormulationDossiers);
  const [dispenseOrders, setDispenseOrders] = useState<DispenseOrder[]>(initialDispenseOrders);
  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>(initialTenantUsers);
  const [dispensaryOutlets, setDispensaryOutlets] = useState<DispensaryOutlet[]>(initialDispensaryOutlets);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAuditEvents);

  // Cross-screen actions
  const handleApproveOrder = (orderId: string) => {
    let approvedOrderNumber = '#GEN-ORD-88219';
    setDispenseOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          approvedOrderNumber = ord.orderNumber;
          return {
            ...ord,
            status: 'Dispatched',
            courier: {
              ...ord.courier,
              status: 'Dispatched',
              etaMinutes: 12,
            },
          };
        }
        return ord;
      })
    );

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      time: timeStr,
      type: 'RBAC_AUDIT',
      tenant: 'apollo_downtown_104',
      description: `Order ${approvedOrderNumber} signed off by Dr. Michael Chen (PharmD). Escrow released & courier dispatched.`,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const handleOrderPlacedFromCustomer = (orderData: any) => {
    const orderId = orderData.id || `ord-${Date.now()}`;
    const orderNum = orderData.orderNumber || `#GEN-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: DispenseOrder = {
      id: orderId,
      orderNumber: orderNum,
      patientName: orderData.patientName || currentUser?.name || 'Alex Morgan',
      patientAddress: orderData.patientAddress || currentUser?.address || '452 Broadway, Apt 4B, New York, NY 10013',
      rxNumber: `#RX-${Math.floor(10000 + Math.random() * 90000)}-B`,
      prescriber: 'Dr. Sarah Jenkins, MD',
      prescriberNpi: '#1982348102',
      timestamp: 'Today, Just now',
      timeAgo: 'Just now',
      slaMinutesRemaining: 45,
      items: [
        {
          name: orderData.medicineName || 'Generic Atorvastatin 20mg',
          genericSalt: 'Atorvastatin Calcium',
          dosage: '20mg Oral Tab',
          quantity: '30 Tabs',
          barcode: `CP-ATC-${Math.floor(100 + Math.random() * 900)}`,
          lotNumber: 'CP-2026-99A',
          expiryDate: 'Exp 08/2029',
          brandDisplaced: orderData.brandDisplaced || 'Pfizer Lipitor® 20mg',
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
      escrowValue: orderData.total || 15.2,
      status: 'Sign-Off Required',
      isColdChain: true,
    };

    setDispenseOrders((prev) => [newOrder, ...prev]);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      time: timeStr,
      type: 'SCHEMA_SYNC',
      tenant: 'apollo_downtown_104',
      description: `New customer Rx order ${orderNum} (${newOrder.patientName}) routed to Apollo Care #104 with $${orderData.total.toFixed(2)} escrow hold.`,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const handleSyncToConsumer = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      time: timeStr,
      type: 'CONFIG_CHANGE',
      tenant: 'cipla_b2b',
      description: 'Cipla Global B2B synchronized 52 FDA Orange Book canonical generic formulations with consumer discovery engine.',
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const handleRefreshFeed = () => {
    setMedicineOffers((prev) =>
      prev.map((o) => ({
        ...o,
        freshnessStatus: 'fresh',
        freshness: 'Updated just now',
      }))
    );
  };

  const handleLoginSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    setShowAuthModal(false);

    // Auto navigate to role workspace
    if (account.role === 'customer') setCurrentScreen('customer-mobile');
    else if (account.role === 'pharmacy_partner') setCurrentScreen('pharmacy-partner');
    else if (account.role === 'pharma_b2b') setCurrentScreen('b2b-pharma');
    else if (account.role === 'tenant_admin') setCurrentScreen('tenant-admin');
    else if (account.role === 'super_admin') setCurrentScreen('super-admin');

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      time: timeStr,
      type: 'RBAC_AUDIT',
      tenant: account.organization || 'global_auth',
      description: `User ${account.name} (${account.role}) authenticated via Auth Gateway. Session token granted.`,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const dispatchedCount = dispenseOrders.filter((o) => o.status === 'Dispatched').length;

  return (
    <div className="min-h-screen bg-[#06090e] flex flex-col font-sans selection:bg-cyan-900 selection:text-cyan-200">
      {/* Top Universal Persona Switcher */}
      <NavigationBanner
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        dispatchedCount={dispatchedCount}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Screen Views */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'drug-directory' && (
          <GenericDrugDirectory
            currentUser={currentUser}
            onOrderPlaced={handleOrderPlacedFromCustomer}
            onNavigateToMobileApp={() => setCurrentScreen('customer-mobile')}
            onNavigateToPharmacy={() => setCurrentScreen('pharmacy-partner')}
          />
        )}

        {currentScreen === 'super-admin' && (
          <SuperAdminConsole
            offers={medicineOffers}
            auditEvents={auditEvents}
            rankingWeights={rankingWeights}
            onUpdateWeights={setRankingWeights}
            onRefreshFeed={handleRefreshFeed}
          />
        )}

        {currentScreen === 'b2b-pharma' && (
          <PharmaB2BPortal
            dossiers={dossiers}
            onSyncToConsumer={handleSyncToConsumer}
          />
        )}

        {currentScreen === 'tenant-admin' && (
          <TenantAdminPortal
            users={tenantUsers}
            outlets={dispensaryOutlets}
            onAddUser={(newUser) => setTenantUsers((prev) => [newUser, ...prev])}
            onAddOutlet={(newOutlet) => setDispensaryOutlets((prev) => [...prev, newOutlet])}
          />
        )}

        {currentScreen === 'pharmacy-partner' && (
          <PharmacyPartnerPortal
            orders={dispenseOrders}
            onApproveOrder={handleApproveOrder}
          />
        )}

        {currentScreen === 'customer-mobile' && (
          <CustomerMobileApp
            currentUser={currentUser}
            onOrderPlaced={handleOrderPlacedFromCustomer}
            onNavigateToPharmacy={() => setCurrentScreen('pharmacy-partner')}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {currentScreen === 'phase-4-engine' && <Phase4EngineDashboard />}

        {currentScreen === 'phase-5-mobile' && <Phase5MobileHealthSuite />}

        {currentScreen === 'phase-6-global' && <Phase6GlobalTrialsAndSupplyChain />}

        {currentScreen === 'architecture' && <ArchitectureVisualizer />}
      </main>

      {/* Login & Registration Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <AuthScreen
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
