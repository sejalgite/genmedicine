import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, X } from 'lucide-react';
import { UserAccount, AppScreen } from '../unifiedTypes';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  onClose: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hardcoded Demo Accounts for the 4 roles
  const demoAccounts: { label: string; user: UserAccount; desc: string; icon: any }[] = [
    {
      label: 'Alex Morgan',
      desc: 'Customer Mobile App',
      icon: User,
      user: {
        id: 'usr-cust1',
        name: 'Alex Morgan',
        email: 'alex.morgan@healthmail.com',
        role: 'customer',
        address: '452 Broadway, NY',
      },
    },
    {
      label: 'Apollo Care #104',
      desc: 'Pharmacy Partner',
      icon: ShieldCheck,
      user: {
        id: 'usr-pharm1',
        name: 'Dr. Michael Chen',
        email: 'm.chen@apollocare.com',
        role: 'pharmacy_partner',
        pharmacyId: 'pharm-1',
      },
    },
    {
      label: 'Cipla Global',
      desc: 'Medicine Company',
      icon: ShieldCheck,
      user: {
        id: 'usr-comp1',
        name: 'Dr. Aris Thorne',
        email: 'aris@cipla.com',
        role: 'pharma_b2b',
        companyId: 'comp-1',
      },
    },
    {
      label: 'Platform Admin',
      desc: 'Super Admin',
      icon: ShieldCheck,
      user: {
        id: 'usr-admin',
        name: 'Marcus Vance',
        email: 'admin@genmedicine.io',
        role: 'super_admin',
      },
    },
  ];

  const handleQuickLogin = (user: UserAccount) => {
    onLoginSuccess(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    // Simulate finding user
    const foundUser = demoAccounts.find((d) => d.user.email === email)?.user;
    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      setErrorMsg('Invalid credentials. Try a demo account.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Login</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {errorMsg}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors">
          Sign In
        </button>
      </form>

      <div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-slate-500">Or use demo accounts</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {demoAccounts.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickLogin(demo.user)}
              className="text-left p-3 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <div className="font-bold text-slate-800 text-sm truncate">{demo.label}</div>
              <div className="text-xs text-slate-500 truncate mt-0.5">{demo.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
