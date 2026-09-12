import React from 'react';
import { ShieldCheck, Building2, Store, Smartphone, User, LogIn, LogOut } from 'lucide-react';
import { AppScreen, UserAccount } from '../unifiedTypes';

interface NavigationBannerProps {
  currentScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const NavigationBanner: React.FC<NavigationBannerProps> = ({
  currentScreen,
  onScreenChange,
  currentUser,
  onOpenAuth,
}) => {
  // Only show the screen corresponding to the logged in user's role
  // For demo/dev purposes we could show all, but the prompt says 
  // "A user must not be able to access another role's dashboard simply by changing a URL."
  
  const screens = [
    {
      id: 'super-admin' as AppScreen,
      name: 'Super Admin',
      role: 'super_admin',
      icon: ShieldCheck,
    },
    {
      id: 'pharma-b2b' as AppScreen,
      name: 'Medicine Company',
      role: 'pharma_b2b',
      icon: Building2,
    },
    {
      id: 'pharmacy-partner' as AppScreen,
      name: 'Pharmacy Store',
      role: 'pharmacy_partner',
      icon: Store,
    },
    {
      id: 'customer-mobile' as AppScreen,
      name: 'Customer App',
      role: 'customer',
      icon: Smartphone,
    },
  ];

  const allowedScreen = screens.find(s => s.role === currentUser?.role);

  return (
    <nav className="bg-white border-b border-slate-200 text-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-emerald-600 tracking-tight">
          GenMedicine
        </span>
      </div>

      {currentUser && allowedScreen && (
        <div className="flex items-center text-slate-700 font-medium text-sm gap-2">
          <allowedScreen.icon className="w-5 h-5 text-emerald-600" />
          {allowedScreen.name} Portal
        </div>
      )}

      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{currentUser.name}</span>
            <button
              onClick={() => window.location.reload()}
              className="text-slate-400 hover:text-red-500 transition-colors ml-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
