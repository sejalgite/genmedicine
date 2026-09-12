import React, { useState } from 'react';
import { Building2, Package, Inbox, CheckCircle2, TrendingUp } from 'lucide-react';

export const PharmaB2BPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'complaints'>('catalog');

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-800">Medicine Company Portal</h1>
        <p className="text-slate-500">Manage your global medicine catalog, fulfill B2B orders from pharmacies, and handle complaints.</p>
        
        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'catalog' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Medicine Catalog
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            B2B Pharmacy Orders
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'complaints' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Complaints
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'catalog' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Global Medicine Catalog</h2>
              <button className="bg-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700">
                + List New Medicine
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="p-4 font-medium">Medicine Name</th>
                    <th className="p-4 font-medium">Composition</th>
                    <th className="p-4 font-medium">Packaging</th>
                    <th className="p-4 font-medium">Wholesale Price</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-700">Atorvastatin 20mg</td>
                    <td className="p-4 text-slate-600">Atorvastatin Calcium Trihydrate</td>
                    <td className="p-4 text-slate-600">30 tabs</td>
                    <td className="p-4 font-medium text-sky-600">$14.20</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">APPROVED</span>
                    </td>
                    <td className="p-4">
                      <button className="text-sm font-bold text-slate-600 hover:text-slate-800">Edit Info</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-800">B2B Pharmacy Orders</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-center py-12">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No Orders Yet</h3>
              <p className="text-slate-500">You currently have no pending orders from pharmacies.</p>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="max-w-5xl mx-auto text-center py-12">
            <h2 className="text-xl font-bold text-slate-700">No Complaints</h2>
            <p className="text-slate-500">There are no complaints regarding your listed medicines.</p>
          </div>
        )}
      </div>
    </div>
  );
};
