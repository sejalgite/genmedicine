import React, { useState, useEffect } from 'react';
import { AppScreen, UserAccount, Medicine, CustomerOrder } from './unifiedTypes';
import { NavigationBanner } from './components/NavigationBanner';
import { SuperAdminConsole } from './components/SuperAdminConsole';
import { PharmaB2BPortal } from './components/PharmaB2BPortal';
import { PharmacyPartnerPortal } from './components/PharmacyPartnerPortal';
import { CustomerMobileApp } from './components/CustomerMobileApp';
import { AuthScreen } from './components/AuthScreen';

const DEFAULT_USER: UserAccount | null = null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('customer-mobile');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(DEFAULT_USER);
  const [showAuthModal, setShowAuthModal] = useState(!DEFAULT_USER);

  const handleLoginSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    setShowAuthModal(false);

    // Auto navigate to role workspace
    if (account.role === 'customer') setCurrentScreen('customer-mobile');
    else if (account.role === 'pharmacy_partner') setCurrentScreen('pharmacy-partner');
    else if (account.role === 'pharma_b2b') setCurrentScreen('pharma-b2b');
    else if (account.role === 'super_admin') setCurrentScreen('super-admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Universal Persona Switcher */}
      <NavigationBanner
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Screen Views */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'super-admin' && (
          <SuperAdminConsole />
        )}

        {currentScreen === 'pharma-b2b' && (
          <PharmaB2BPortal />
        )}

        {currentScreen === 'pharmacy-partner' && (
          <PharmacyPartnerPortal />
        )}

        {currentScreen === 'customer-mobile' && (
          <CustomerMobileApp
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}
      </main>

      {/* Login & Registration Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md my-8 bg-white rounded-xl shadow-2xl p-6">
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
