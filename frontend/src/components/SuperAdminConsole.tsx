import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Store, Building2, Pill, Activity, AlertTriangle, Search } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export const SuperAdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pharmacies' | 'companies' | 'medicines' | 'complaints'>('overview');
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'pharmacies') loadPharmacies();
    if (activeTab === 'medicines') loadMedicines();
    if (activeTab === 'complaints') loadComplaints();
  }, [activeTab]);

  const loadPharmacies = async () => {
    try {
      const data = await apiClient.getPharmacies();
      setPharmacies(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMedicines = async () => {
    try {
      const data = await apiClient.getMedicines();
      setMedicines(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadComplaints = async () => {
    try {
      const data = await apiClient.getComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 bg-slate-900 flex flex-col h-[calc(100vh-64px)] overflow-hidden text-slate-300">
      <div className="bg-slate-950 border-b border-slate-800 px-8 py-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="text-red-500" /> Super Admin Console
        </h1>
        <p className="text-slate-400 mt-1">Platform moderation, compliance control, and global oversight.</p>
        
        <div className="flex flex-wrap gap-2 mt-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors ${activeTab === 'overview' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Platform Overview
          </button>
          <button 
            onClick={() => setActiveTab('pharmacies')}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors ${activeTab === 'pharmacies' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Pharmacies
          </button>
          <button 
            onClick={() => setActiveTab('medicines')}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors ${activeTab === 'medicines' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Medicines Catalog
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors ${activeTab === 'complaints' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Complaints
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Platform Metrics</h2>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Users className="w-5 h-5" /> Total Users
                </div>
                <div className="text-3xl font-bold text-white">System Live</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pharmacies' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Pharmacies Directory</h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 text-sm border-b border-slate-700">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacies.map(p => (
                    <tr key={p.id} className="border-b border-slate-700/50">
                      <td className="p-4 font-medium text-white">{p.name}</td>
                      <td className="p-4">
                        <span className="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-900">{p.status || 'APPROVED'}</span>
                      </td>
                    </tr>
                  ))}
                  {pharmacies.length === 0 && (<tr><td colSpan={2} className="p-4 text-center text-slate-500">No pharmacies found</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'medicines' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Medicines Directory</h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 text-sm border-b border-slate-700">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Composition</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(m => (
                    <tr key={m.id} className="border-b border-slate-700/50">
                      <td className="p-4 font-medium text-white">{m.name}</td>
                      <td className="p-4 text-slate-400">{m.composition}</td>
                    </tr>
                  ))}
                  {medicines.length === 0 && (<tr><td colSpan={2} className="p-4 text-center text-slate-500">No medicines found</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Complaints</h2>
            {complaints.length === 0 ? (
              <p className="text-slate-500">No complaints registered.</p>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-2">
                  <p className="text-white font-bold">{c.description}</p>
                  <p className="text-slate-500 text-sm mt-1">Status: {c.status}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
