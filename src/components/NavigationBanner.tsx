import React from 'react';
import {
  ShieldCheck,
  Building2,
  Store,
  Smartphone,
  Network,
  Activity,
  Layers,
  Sparkles,
  User,
  LogIn,
} from 'lucide-react';
import { AppScreen, UserAccount } from '../types';

interface NavigationBannerProps {
  currentScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  dispatchedCount: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const NavigationBanner: React.FC<NavigationBannerProps> = ({
  currentScreen,
  onScreenChange,
  dispatchedCount,
  currentUser,
  onOpenAuth,
}) => {
  const screens = [
    {
      id: 'super-admin' as AppScreen,
      name: 'Super Admin Console',
      role: 'Platform Ops [Super]',
      badge: 'Dark Mode',
      icon: ShieldCheck,
      color: 'text-cyan-400',
    },
    {
      id: 'b2b-pharma' as AppScreen,
      name: 'Medicine Company B2B',
      role: 'Cipla Global API',
      badge: 'FDA Orange Book',
      icon: Building2,
      color: 'text-sky-600',
    },
    {
      id: 'tenant-admin' as AppScreen,
      name: 'Tenant Admin Portal',
      role: 'Apollo Health Group',
      badge: 'RLS Sandbox',
      icon: Layers,
      color: 'text-indigo-600',
    },
    {
      id: 'pharmacy-partner' as AppScreen,
      name: 'Pharmacy Dispense Hub',
      role: 'Apollo Care #104',
      badge: dispatchedCount > 0 ? `${dispatchedCount} Dispatched` : 'Cold-Chain Live',
      icon: Store,
      color: 'text-emerald-600',
    },
    {
      id: 'customer-mobile' as AppScreen,
      name: 'Customer Mobile App',
      role: 'Rx Discovery & Checkout',
      badge: '3 Step Flow',
      icon: Smartphone,
      color: 'text-purple-600',
    },
    {
      id: 'architecture' as AppScreen,
      name: 'SaaS Architecture Map',
      role: 'Multi-Tenant Blueprint',
      badge: '13-Layer Spec',
      icon: Network,
      color: 'text-amber-500',
    },
  ];

  return (
    <nav className="bg-[#070b12] border-b border-slate-800/90 text-slate-300 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-bold text-sm tracking-tight text-white flex items-center">
            gen<span className="text-cyan-400">medicine</span>
          </span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-medium text-[10px] tracking-wide">
          <Sparkles className="w-2.5 h-2.5" />
          Production Multi-Tenant Ecosystem
        </span>
      </div>

      {/* Screen Switcher Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {screens.map((s) => {
          const Icon = s.icon;
          const isActive = currentScreen === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onScreenChange(s.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/50 shadow-sm font-semibold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{s.name}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-mono hidden sm:inline ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                    : 'bg-slate-950 text-slate-400'
                }`}
              >
                {s.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* User Session & Auth Action */}
      <div className="flex items-center gap-2">
        {currentUser ? (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1">
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center font-bold text-[10px] font-mono">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-[11px] font-semibold text-slate-200">{currentUser.name}</span>
              <span className="text-[9px] text-cyan-400 font-mono capitalize">{currentUser.role}</span>
            </div>
            <button
              onClick={onOpenAuth}
              title="Switch Account / Login"
              className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition cursor-pointer"
            >
              Switch
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-md shadow-xs transition cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}

        <div className="hidden 2xl:flex items-center gap-2 text-[11px] text-slate-400 border-l border-slate-800 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>RLS Active</span>
        </div>
      </div>
    </nav>
  );
};
