import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Building,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Stethoscope,
  Store,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { UserAccount, AppScreen } from '../types';

interface AuthScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserAccount, targetScreen?: AppScreen) => void;
  initialMode?: 'login' | 'register';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  isOpen = true,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserAccount['role']>('customer');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Quick Demo Logins
  const demoAccounts: { label: string; user: UserAccount; screen: AppScreen; icon: string; desc: string }[] = [
    {
      label: 'Alex Morgan',
      desc: 'Consumer / Patient',
      icon: '👤',
      screen: 'customer-mobile',
      user: {
        id: 'usr-alex',
        name: 'Alex Morgan',
        email: 'alex.morgan@healthmail.com',
        role: 'customer',
        address: '452 Broadway, Apt 4B, New York, NY 10013',
        phone: '+1 (555) 234-5678',
        insuranceProvider: 'BlueCross Anthem Select',
        memberId: 'BC-99420-ALEX',
        hsaFsaBalance: 840.5,
      },
    },
    {
      label: 'Dr. Michael Chen',
      desc: 'Licensed Pharmacist (Apollo #104)',
      icon: '💊',
      screen: 'pharmacy-partner',
      user: {
        id: 'usr-chen',
        name: 'Dr. Michael Chen, PharmD',
        email: 'm.chen@apollocare.com',
        role: 'pharmacy_partner',
        organization: 'Apollo Care Pharmacy #104',
        licenseNumber: 'NY-PHARM-440291',
      } as any,
    },
    {
      label: 'Dr. Aris Thorne',
      desc: 'Head of Formulations (Cipla B2B)',
      icon: '🔬',
      screen: 'b2b-pharma',
      user: {
        id: 'usr-thorne',
        name: 'Dr. Aris Thorne',
        email: 'aris.thorne@ciplaglobal.com',
        role: 'pharma_b2b',
        organization: 'Cipla Global Therapeutics',
      },
    },
    {
      label: 'Elena Rostova',
      desc: 'Tenant Admin (Apollo Health Group)',
      icon: '🏢',
      screen: 'tenant-admin',
      user: {
        id: 'usr-elena',
        name: 'Elena Rostova',
        email: 'e.rostova@apollohealth.org',
        role: 'tenant_admin',
        organization: 'Apollo Health Group',
      },
    },
    {
      label: 'System Admin',
      desc: 'Super Admin Ops Console',
      icon: '⚡',
      screen: 'super-admin',
      user: {
        id: 'usr-super',
        name: 'Marcus Vance',
        email: 'admin@genmedicine.io',
        role: 'super_admin',
        organization: 'genmedicine Infrastructure',
      },
    },
  ];

  const handleQuickLogin = (demo: typeof demoAccounts[0]) => {
    setErrorMsg(null);
    setSuccessMsg(`Welcome back, ${demo.user.name}!`);
    setTimeout(() => {
      onLoginSuccess(demo.user, demo.screen);
      if (onClose) onClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'login') {
      if (!email || !password) {
        setErrorMsg('Please enter both your email address and password.');
        return;
      }

      // Default logged in user
      const user: UserAccount = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email,
        role: selectedRole,
        organization: organization || (selectedRole === 'pharmacy_partner' ? 'Apollo Care' : undefined),
        hsaFsaBalance: 500,
      };

      const targetScreen: AppScreen =
        selectedRole === 'customer'
          ? 'customer-mobile'
          : selectedRole === 'pharmacy_partner'
          ? 'pharmacy-partner'
          : selectedRole === 'pharma_b2b'
          ? 'b2b-pharma'
          : selectedRole === 'tenant_admin'
          ? 'tenant-admin'
          : 'super-admin';

      setSuccessMsg(`Logged in successfully as ${user.name}`);
      setTimeout(() => {
        onLoginSuccess(user, targetScreen);
        if (onClose) onClose();
      }, 500);
    } else {
      // Register
      if (!name || !email || !password) {
        setErrorMsg('Please complete all required fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }

      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: selectedRole,
        organization,
        hsaFsaBalance: 1200,
      };

      const targetScreen: AppScreen =
        selectedRole === 'customer'
          ? 'customer-mobile'
          : selectedRole === 'pharmacy_partner'
          ? 'pharmacy-partner'
          : selectedRole === 'pharma_b2b'
          ? 'b2b-pharma'
          : selectedRole === 'tenant_admin'
          ? 'tenant-admin'
          : 'super-admin';

      setSuccessMsg(`Account created! Welcome to genmedicine, ${newUser.name}.`);
      setTimeout(() => {
        onLoginSuccess(newUser, targetScreen);
        if (onClose) onClose();
      }, 600);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#0b1017] border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-auto animate-in fade-in duration-200">
        {/* Close Button if modal */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition z-10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800/80 p-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              💊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">genmedicine</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono uppercase font-bold">
                  Unified Auth
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Tenant Access: Consumer, Pharmacy Partner, B2B Pharma &amp; Administration
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 mt-5 p-1 bg-slate-950/70 border border-slate-800 rounded-xl max-w-xs">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                mode === 'login'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                mode === 'register'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Persona Demo Logins */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Instant Demo Access (1-Click Switch):
              </span>
              <span className="text-[11px] text-slate-400">Pre-seeded test credentials</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.user.id}
                  onClick={() => handleQuickLogin(demo)}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition text-left cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{demo.icon}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {demo.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{demo.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-[#0b1017] px-3 text-[11px] text-slate-400 uppercase font-mono tracking-wider absolute">
              Or {mode === 'login' ? 'enter credentials' : 'register new profile'}
            </span>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-none text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-none text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Type &amp; Access Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { role: 'customer', label: 'Customer / Patient', icon: User },
                  { role: 'pharmacy_partner', label: 'Pharmacy Partner', icon: Store },
                  { role: 'pharma_b2b', label: 'Pharmaceutical B2B', icon: Briefcase },
                  { role: 'tenant_admin', label: 'Tenant Organization Admin', icon: Building },
                  { role: 'super_admin', label: 'Super Admin Ops', icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role as any)}
                      className={`p-2 rounded-xl border text-xs flex items-center gap-2 transition cursor-pointer text-left ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Registration specific fields */}
            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name / Legal Entity</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan or Apollo Pharmacy LLC"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {selectedRole !== 'customer' && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Organization / Store Name</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Cipla Global Therapeutics"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@healthdomain.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-[11px] text-slate-400">
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>{mode === 'login' ? 'Sign In to Portal' : 'Create & Launch'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
