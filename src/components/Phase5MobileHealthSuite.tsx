import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Heart,
  Activity,
  Bell,
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Sparkles,
  Camera,
  Check,
  X,
  Play,
  Flame,
  UserCheck,
  Radio,
  Sliders,
  Clock,
  Pill,
  Send,
  Eye,
  QrCode,
  Fingerprint,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type {
  GoogleHealthConnectSync,
  HealthKitAdherenceRecord,
  PushNotificationPayload,
  HardwareScanResult,
  EnterpriseScannerConfig,
  BiometricAuthStatus,
} from '../types';

export const Phase5MobileHealthSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'healthkit' | 'push' | 'hardware'>('simulator');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Chassis State
  const [deviceChassis, setDeviceChassis] = useState<'ios' | 'android'>('ios');
  const [isFaceIdLocked, setIsFaceIdLocked] = useState(false);
  const [isAuthenticatingFaceId, setIsAuthenticatingFaceId] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [edgeDetected, setEdgeDetected] = useState(false);

  // HealthKit & Health Connect State
  const [healthSync, setHealthSync] = useState<GoogleHealthConnectSync | null>(null);
  const [allergyCheckDrug, setAllergyCheckDrug] = useState('Amoxicillin 500mg');
  const [allergyResult, setAllergyResult] = useState<any>(null);

  // Push Notifications State
  const [notifications, setNotifications] = useState<PushNotificationPayload[]>([]);
  const [activeBanner, setActiveBanner] = useState<PushNotificationPayload | null>(null);
  const [customPushTitle, setCustomPushTitle] = useState('⏰ Take Evening Dose');
  const [customPushBody, setCustomPushBody] = useState('Metformin 500mg ER with your evening meal to maintain glycemic balance.');

  // Enterprise Hardware Scanner State
  const [scannerConfig, setScannerConfig] = useState<EnterpriseScannerConfig | null>(null);
  const [selectedBarcode, setSelectedBarcode] = useState('030069421030');
  const [lastScanResult, setLastScanResult] = useState<HardwareScanResult | null>(null);
  const [isScanningLaser, setIsScanningLaser] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    loadPhase5Data();
  }, []);

  const loadPhase5Data = async () => {
    setLoading(true);
    try {
      const [syncRes, notifRes, scanConf] = await Promise.all([
        apiClient.getHealthSyncStatus(),
        apiClient.getPushNotificationQueue(),
        apiClient.getHardwareScannerConfig(),
      ]);
      setHealthSync(syncRes);
      setNotifications(notifRes.notifications);
      setScannerConfig(scanConf);
    } catch (e) {
      console.warn('Phase 5 load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncHealth = async (source: 'Apple HealthKit' | 'Google Health Connect') => {
    setLoading(true);
    try {
      const res = await apiClient.syncHealthKitData(source);
      setHealthSync(res);
      showToast(`Successfully synchronized vitals & adherence with ${source}.`);
    } catch (e) {
      showToast('Health sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdherenceToggle = async (scheduleId: string, status: 'TAKEN' | 'SKIPPED') => {
    try {
      await apiClient.updateAdherenceStatus(scheduleId, status);
      const updated = await apiClient.getHealthSyncStatus();
      setHealthSync(updated);
      showToast(`Medication dose marked ${status}. Adherence streak updated!`);
    } catch (e) {
      showToast('Adherence update failed.');
    }
  };

  const handleTestAllergy = async () => {
    try {
      const res = await apiClient.checkAllergyConflict(allergyCheckDrug);
      setAllergyResult(res);
      if (res.hasConflict) {
        showToast(`CRITICAL ALLERGY CONFLICT DETECTED FOR ${allergyCheckDrug.toUpperCase()}`);
      } else {
        showToast(`No verified allergy conflicts detected for ${allergyCheckDrug}. Safe to substitute.`);
      }
    } catch (e) {
      showToast('Allergy check failed.');
    }
  };

  const handleTriggerPush = async () => {
    try {
      const res = await apiClient.sendPushNotification(customPushTitle, customPushBody, 'DOSE_REMINDER');
      const updated = await apiClient.getPushNotificationQueue();
      setNotifications(updated.notifications);

      if (res.notification) {
        setActiveBanner(res.notification);
        setTimeout(() => setActiveBanner(null), 6000);
      }
      showToast('Push notification dispatched to native mobile chassis.');
    } catch (e) {
      showToast('Push dispatch failed.');
    }
  };

  const handleBiometricAuth = () => {
    setIsAuthenticatingFaceId(true);
    setTimeout(() => {
      setIsAuthenticatingFaceId(false);
      setIsFaceIdLocked(false);
      showToast('FaceID / TouchID biometric authenticated via Apple Secure Enclave.');
    }, 1200);
  };

  const handleHardwareScan = async (codeToScan: string) => {
    setIsScanningLaser(true);
    try {
      const res = await apiClient.scanHardwareBarcode(codeToScan, 'GS1_DATAMATRIX');
      setLastScanResult(res.scanResult);
      const conf = await apiClient.getHardwareScannerConfig();
      setScannerConfig(conf);
      showToast(`Barcode ${codeToScan} verified on Zebra TC58. Queue record ready for pack.`);
    } catch (e) {
      showToast('Barcode scan failed.');
    } finally {
      setTimeout(() => setIsScanningLaser(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-purple-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#130d24] to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-400 border border-purple-800/80 font-mono text-xs font-bold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                Phase 5 Milestone
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Native Mobile Ecosystem &amp; Health Integrations
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-mono font-semibold">
                v4.0 Native Suite
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Cross-platform mobile apps for iOS &amp; Android, bi-directional Apple HealthKit &amp; Google Health Connect adherence sync, Push Notification Engine, FaceID biometric security, and dedicated Zebra Android pharmacy hardware scanner.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={loadPhase5Data}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer border border-slate-700 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
              <span>Refresh Health Records</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-purple-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. Dual Native Mobile Simulator (iOS / Android)</span>
          </button>

          <button
            onClick={() => setActiveTab('healthkit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'healthkit'
                ? 'bg-purple-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>2. HealthKit &amp; Health Connect Sync Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('push')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'push'
                ? 'bg-purple-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>3. Push Notification Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'hardware'
                ? 'bg-purple-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>4. Enterprise Zebra Android Hardware Scanner</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DUAL NATIVE MOBILE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls & Simulator Settings */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Cross-Platform Device Target
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeviceChassis('ios')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    deviceChassis === 'ios'
                      ? 'bg-purple-950/50 border-purple-500 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span>Apple iOS</span>
                    <span className="text-[10px] font-mono text-purple-400">iPhone 16 Pro</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-normal">Dynamic Island &amp; FaceID</p>
                </button>

                <button
                  onClick={() => setDeviceChassis('android')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    deviceChassis === 'android'
                      ? 'bg-purple-950/50 border-purple-500 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span>Google Android</span>
                    <span className="text-[10px] font-mono text-cyan-400">Pixel 9 Pro</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-normal">Health Connect &amp; Biometrics</p>
                </button>
              </div>

              {/* Native Capabilities Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-purple-400" />
                    <span>Biometric FaceID / TouchID Lock:</span>
                  </div>
                  <button
                    onClick={() => setIsFaceIdLocked(!isFaceIdLocked)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                      isFaceIdLocked
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isFaceIdLocked ? 'Locked (Test Auth)' : 'Unlocked'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Native Camera Edge Detection:</span>
                  </div>
                  <button
                    onClick={() => {
                      setCameraActive(!cameraActive);
                      setEdgeDetected(true);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                      cameraActive
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {cameraActive ? 'Camera Live' : 'Start Camera'}
                  </button>
                </div>
              </div>
            </div>

            {/* HealthKit Quick Badge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Synced PHR Health Profile
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Active Link
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Resting BP:</span>
                  <strong className="text-white font-mono">118/76 mmHg</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Glucose (CGM):</span>
                  <strong className="text-emerald-400 font-mono">96 mg/dL</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Mobile Chassis Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              className={`w-full max-w-sm rounded-[42px] p-3 shadow-2xl border-4 transition-all relative overflow-hidden ${
                deviceChassis === 'ios'
                  ? 'bg-[#000000] border-slate-700 shadow-purple-950/20'
                  : 'bg-[#121212] border-slate-700 shadow-cyan-950/20'
              }`}
            >
              {/* Device Screen Body */}
              <div className="bg-slate-950 rounded-[34px] overflow-hidden min-h-[680px] flex flex-col text-slate-100 border border-slate-800 relative">
                {/* Dynamic Island / Punch Hole Notch */}
                {deviceChassis === 'ios' ? (
                  <div className="pt-2 px-6 flex items-center justify-between text-[11px] font-mono font-bold bg-slate-950 text-white z-30">
                    <span>9:41</span>
                    <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-inner border border-slate-800">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-[9px] text-cyan-300 font-mono">HealthKit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-cyan-400">5G</span>
                      <div className="w-4 h-2 border border-white rounded-xs p-0.5">
                        <div className="w-full h-full bg-emerald-400"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 px-6 flex items-center justify-between text-[11px] font-mono font-bold bg-slate-950 text-white z-30">
                    <span>9:41</span>
                    <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-700"></div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-emerald-400">LTE+</span>
                      <div className="w-4 h-2 border border-white rounded-xs p-0.5">
                        <div className="w-full h-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dropdown Push Notification Banner (Simulated) */}
                {activeBanner && (
                  <div className="absolute top-10 inset-x-3 z-40 bg-slate-900/95 border border-purple-500/80 p-3 rounded-2xl shadow-2xl backdrop-blur-md space-y-1 animate-slide-in-down">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-purple-400 flex items-center gap-1">
                        <Smartphone className="w-3 h-3" /> GenMedicine Native
                      </span>
                      <span className="text-slate-400">{activeBanner.timestamp}</span>
                    </div>
                    <div className="font-bold text-xs text-white">{activeBanner.title}</div>
                    <div className="text-[11px] text-slate-300">{activeBanner.body}</div>
                  </div>
                )}

                {/* Biometric Lock Screen Overlay */}
                {isFaceIdLocked ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950/95 backdrop-blur-md z-20">
                    <div className="w-20 h-20 rounded-full bg-purple-950/60 border-2 border-purple-500/60 flex items-center justify-center text-purple-400 shadow-xl">
                      {isAuthenticatingFaceId ? (
                        <RefreshCw className="w-10 h-10 animate-spin text-purple-400" />
                      ) : (
                        <Fingerprint className="w-10 h-10 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">GenMedicine Health Vault</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {isAuthenticatingFaceId
                          ? 'Verifying Secure Enclave...'
                          : 'FaceID / Biometric required to view prescription PHI.'}
                      </p>
                    </div>
                    <button
                      onClick={handleBiometricAuth}
                      disabled={isAuthenticatingFaceId}
                      className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
                    >
                      Authenticate with FaceID
                    </button>
                  </div>
                ) : (
                  /* Main Mobile Content */
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
                    {/* Native App Top Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                          {deviceChassis === 'ios' ? 'iOS 18 Native' : 'Android 15 Native'}
                        </span>
                        <h2 className="text-sm font-bold text-white">Alex Morgan</h2>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                        14-Day Adherence Streak 🔥
                      </span>
                    </div>

                    {/* Camera Edge Detection Scanner Simulation */}
                    {cameraActive ? (
                      <div className="relative bg-slate-900 rounded-2xl p-4 border border-cyan-500/80 overflow-hidden space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-cyan-400 font-bold flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" /> High-Resolution Lens Active
                          </span>
                          <span className="text-emerald-400 font-mono text-[10px]">Auto-Perspective Crop</span>
                        </div>

                        <div className="relative border-2 border-dashed border-cyan-400 rounded-xl p-4 bg-slate-950/80 text-center space-y-2">
                          <div className="w-full h-24 bg-slate-900 rounded-lg flex items-center justify-center font-mono text-[11px] text-cyan-300 border border-cyan-800/40">
                            [ Dr. Sarah Jenkins Rx Document in Focus ]
                          </div>
                          <div className="text-[10px] text-slate-400 flex justify-between">
                            <span>Resolution: 48MP HDR</span>
                            <span className="text-emerald-400 font-bold">Document Edges Locked</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setCameraActive(false);
                            showToast('Prescription captured & submitted to Gemini OCR endpoint.');
                          }}
                          className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
                        >
                          Capture &amp; Extract Generic Substitutes
                        </button>
                      </div>
                    ) : (
                      /* Daily Adherence Schedule Card */
                      <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Pill className="w-4 h-4 text-purple-400" />
                            Today's Adherence Plan
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Synced Apple Health</span>
                        </div>

                        <div className="space-y-2">
                          {healthSync?.adherenceSchedule.map((adh) => (
                            <div
                              key={adh.scheduleId}
                              className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-bold text-white text-[11px]">{adh.medicineName}</div>
                                <div className="text-[10px] text-slate-400">{adh.timeSlot} • {adh.dosage}</div>
                              </div>

                              <div>
                                {adh.status === 'TAKEN' ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold font-mono">
                                    ✓ Taken
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleAdherenceToggle(adh.scheduleId, 'TAKEN')}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold transition cursor-pointer shadow-xs"
                                  >
                                    Mark Dose
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vitals Summary Card */}
                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          Continuous Health Vitals
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">Dexcom CGM Linked</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-400 block">BP</span>
                          <strong className="text-white text-xs font-mono">118/76</strong>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-400 block">Glucose</span>
                          <strong className="text-emerald-400 text-xs font-mono">96 mg/dL</strong>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-400 block">Heart Rate</span>
                          <strong className="text-cyan-400 text-xs font-mono">68 bpm</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Home Indicator Bar */}
                <div className="p-2 bg-slate-950 flex justify-center border-t border-slate-900">
                  <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEALTHKIT & GOOGLE HEALTH CONNECT SYNC HUB */}
      {activeTab === 'healthkit' && healthSync && (
        <div className="space-y-6">
          {/* Top Sync Source Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center font-bold text-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Bi-Directional PHR Sync Engine</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connected: <strong className="text-white">{healthSync.sourceApp}</strong> • Records: <span className="font-mono text-cyan-400">{healthSync.recordsSyncedCount} items</span> • Adherence Rate: <span className="font-mono text-emerald-400">{healthSync.adherenceRatePercent}%</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSyncHealth('Apple HealthKit')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-700"
              >
                Sync with Apple HealthKit
              </button>
              <button
                onClick={() => handleSyncHealth('Google Health Connect')}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
              >
                Sync with Google Health Connect
              </button>
            </div>
          </div>

          {/* Vitals Grid & Allergy Safety Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Vitals Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Synced Physiological Biomarkers
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Blood Pressure</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {healthSync.vitals.bloodPressureSystolic}/{healthSync.vitals.bloodPressureDiastolic} mmHg
                    </div>
                    <span className="text-emerald-400 text-[10px]">{healthSync.vitals.bloodPressureStatus}</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Blood Glucose (CGM)</span>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {healthSync.vitals.bloodGlucoseMgDl} mg/dL
                    </div>
                    <span className="text-slate-400 text-[10px]">{healthSync.vitals.glucoseMeasurementType}</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Resting Heart Rate</span>
                    <div className="text-lg font-bold text-cyan-400 font-mono">
                      {healthSync.vitals.restingHeartRateBpm} BPM
                    </div>
                    <span className="text-slate-400 text-[10px]">Apple Watch Series 9</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Today's Step Activity</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {healthSync.vitals.stepCountToday.toLocaleString()} steps
                    </div>
                    <span className="text-emerald-400 text-[10px]">Goal: 10,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drug Allergy Safety Engine */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    Verified Drug Allergy Cross-Check
                  </h3>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                    2 Active Allergies
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {healthSync.activeAllergies.map((alg) => (
                    <div key={alg.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{alg.allergen}</span>
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono text-[10px] font-bold">
                          {alg.severity}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Category: {alg.category} • Verified by: {alg.verifiedByProvider}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Allergy Tester */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Test Drug Allergy Safety Checker:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={allergyCheckDrug}
                      onChange={(e) => setAllergyCheckDrug(e.target.value)}
                      placeholder="e.g. Amoxicillin, Ibuprofen, Atorvastatin"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white"
                    />
                    <button
                      onClick={handleTestAllergy}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Screen Allergy
                    </button>
                  </div>

                  {allergyResult && (
                    <div
                      className={`p-2.5 rounded-lg text-[11px] font-mono mt-2 border ${
                        allergyResult.hasConflict
                          ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                          : 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
                      }`}
                    >
                      {allergyResult.warningMessage || 'Allergy screening passed with zero contraindications.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUSH NOTIFICATION ENGINE */}
      {activeTab === 'push' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Dispatcher Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" />
                Dispatch Native Push Notification
              </h3>
              <p className="text-xs text-slate-400">
                Send real-time alerts to registered iOS and Android client tokens (APNs / FCM).
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Notification Title:</label>
                  <input
                    type="text"
                    value={customPushTitle}
                    onChange={(e) => setCustomPushTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Notification Body:</label>
                  <textarea
                    rows={3}
                    value={customPushBody}
                    onChange={(e) => setCustomPushBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setCustomPushTitle('🚚 SwiftRx Courier Arrived');
                      setCustomPushBody('Marcus Vance has arrived with your insulated cold-chain prescription (#GEN-ORD-88219).');
                    }}
                    className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[10px] hover:bg-slate-700 cursor-pointer"
                  >
                    Courier Arrived Preset
                  </button>
                  <button
                    onClick={() => {
                      setCustomPushTitle('💊 Refill Ready (Save 74%)');
                      setCustomPushBody('Your 90-day supply of generic Atorvastatin 20mg is ready. Tap to confirm delivery.');
                    }}
                    className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[10px] hover:bg-slate-700 cursor-pointer"
                  >
                    Refill Preset
                  </button>
                </div>

                <button
                  onClick={handleTriggerPush}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Native Push Notification</span>
                </button>
              </div>
            </div>
          </div>

          {/* Push Queue Feed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  Live Device Notification Stream ({notifications.length})
                </h3>
                <span className="text-xs font-mono text-slate-400">APNs / FCM Bridge</span>
              </div>

              <div className="space-y-2.5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{notif.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{notif.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{notif.body}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>Type: <strong className="text-purple-400 font-mono">{notif.type}</strong></span>
                      <span className="text-emerald-400">Delivered</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENTERPRISE ZEBRA ANDROID HARDWARE SCANNER */}
      {activeTab === 'hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Device Chassis */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#111622] border-4 border-slate-700 rounded-[32px] p-5 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <strong className="text-white font-mono">{scannerConfig?.deviceModel || 'Zebra TC58'}</strong>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold">
                  SE5500 Imager
                </span>
              </div>

              {/* Laser Beam Viewfinder */}
              <div className="relative bg-black rounded-2xl p-6 border border-slate-800 text-center space-y-3 overflow-hidden min-h-[220px] flex flex-col items-center justify-center">
                {isScanningLaser && (
                  <div className="absolute inset-x-0 h-1 bg-red-500 shadow-[0_0_15px_red] top-1/2 -translate-y-1/2 animate-bounce z-20"></div>
                )}

                <div className="border-2 border-dashed border-red-500/60 rounded-xl p-4 w-full bg-slate-950/60">
                  <QrCode className="w-12 h-12 text-slate-400 mx-auto" />
                  <div className="text-[11px] font-mono text-slate-300 mt-2">
                    Scan Target: <strong className="text-cyan-400">{selectedBarcode}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  1D/2D Omnidirectional Decoder • Rapid Scan Ready
                </div>
              </div>

              {/* Barcode Presets & Trigger */}
              <div className="space-y-2 text-xs">
                <label className="block text-slate-400 font-medium">Select Barcode Preset to Scan:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedBarcode('030069421030')}
                    className={`p-2 rounded-lg border text-left text-[11px] ${
                      selectedBarcode === '030069421030'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Atorvastatin 20mg
                  </button>
                  <button
                    onClick={() => setSelectedBarcode('00087606005')}
                    className={`p-2 rounded-lg border text-left text-[11px] ${
                      selectedBarcode === '00087606005'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Metformin 500mg ER
                  </button>
                  <button
                    onClick={() => setSelectedBarcode('00069315014')}
                    className={`p-2 rounded-lg border text-left text-[11px] ${
                      selectedBarcode === '00069315014'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Azithromycin 250mg
                  </button>
                  <button
                    onClick={() => setSelectedBarcode('00186109001')}
                    className={`p-2 rounded-lg border text-left text-[11px] ${
                      selectedBarcode === '00186109001'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Rosuvastatin 10mg
                  </button>
                </div>

                <button
                  onClick={() => handleHardwareScan(selectedBarcode)}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg mt-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Pull Hardware Scanner Trigger</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scanner Batch Ledger Display */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Scan className="w-4 h-4 text-emerald-400" />
                    Dispense Queue Verification Record
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Batch: <strong className="text-cyan-400 font-mono">{scannerConfig?.activeBatchQueue}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Scanned Today:</span>
                  <span className="text-xl font-bold text-white font-mono">{scannerConfig?.totalScannedToday} Units</span>
                </div>
              </div>

              {lastScanResult && (
                <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {lastScanResult.dispenseStatus}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">{lastScanResult.latencyMs}ms decode</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Matched Molecule:</span>
                      <strong className="text-white">{lastScanResult.medicineMatched}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Lot &amp; Expiry:</span>
                      <strong className="text-cyan-400 font-mono">{lastScanResult.lotNumber} (Exp: {lastScanResult.expirationDate})</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-300 flex justify-between">
                    <span>Order: {lastScanResult.orderMatchId}</span>
                    <span className="text-emerald-400">Inventory Deducted</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
