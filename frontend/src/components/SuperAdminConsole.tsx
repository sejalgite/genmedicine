import React, { useState } from 'react';
import { ShieldAlert, Users, Store, Building2, Pill, Activity, AlertTriangle, Search } from 'lucide-react';

export const SuperAdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pharmacies' | 'companies' | 'medicines' | 'complaints'>('overview');

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
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors ${activeTab === 'users' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('pharmacies')}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors ${activeTab === 'pharmacies' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Pharmacies
          </button>
          <button 
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors ${activeTab === 'companies' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Medicine Companies
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
            Complaints & Escalations
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
                  <Users className="w-5 h-5" /> Total Customers
                </div>
                <div className="text-3xl font-bold text-white">1,204</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Store className="w-5 h-5" /> Pharmacies
                </div>
                <div className="text-3xl font-bold text-white">42</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Building2 className="w-5 h-5" /> Med Companies
                </div>
                <div className="text-3xl font-bold text-white">8</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Pill className="w-5 h-5" /> Approved Medicines
                </div>
                <div className="text-3xl font-bold text-white">356</div>
              </div>
            </div>

            <div className="mt-8 bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-emerald-500" /> Platform Activity Stream
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-900 rounded-lg">
                  <div className="bg-emerald-900/50 p-2 rounded text-emerald-400 font-mono text-xs">ORDER</div>
                  <div>
                    <p className="text-slate-300">New order #ORD-9912 placed by customer <span className="text-white font-bold">Alex Customer</span>.</p>
                    <p className="text-slate-500 text-xs mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'pharmacies' || activeTab === 'companies' || activeTab === 'medicines') && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white capitalize">{activeTab} Directory</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-500 text-white w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 text-sm border-b border-slate-700">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Details</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <td className="p-4 font-medium text-white">Sample Record</td>
                    <td className="p-4 text-slate-400">NY-123456</td>
                    <td className="p-4">
                      <span className="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-900">APPROVED</span>
                    </td>
                    <td className="p-4">
                      <button className="text-sm font-bold text-red-400 hover:text-red-300">Suspend / Ban</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === 'users' || activeTab === 'complaints') && (
          <div className="max-w-6xl mx-auto text-center py-20">
            <AlertTriangle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-400">Section Under Maintenance</h2>
            <p className="text-slate-500 mt-2">Data is being migrated to the new schema.</p>
          </div>
        )}
      </div>
    </div>
  );
};
