import React, { useState } from 'react';
import { Package, ShoppingCart, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const PharmacyPartnerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'complaints'>('orders');

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-800">Pharmacy Store Dashboard</h1>
        <p className="text-slate-500">Manage your inventory, process customer orders, and order from medicine companies.</p>
        
        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Customer Orders
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Inventory & B2B Orders
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'complaints' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Complaints
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'orders' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Customer Orders</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-700">#ORD-9912</td>
                    <td className="p-4 text-slate-600">Alex Customer</td>
                    <td className="p-4 text-slate-600">1x Atorvastatin 20mg</td>
                    <td className="p-4 font-medium text-emerald-600">$18.50</td>
                    <td className="p-4">
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">PLACED</span>
                    </td>
                    <td className="p-4">
                      <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Accept Order</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">My Inventory</h2>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">
                Order from Medicine Company
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="p-4 font-medium">Medicine</th>
                    <th className="p-4 font-medium">Manufacturer</th>
                    <th className="p-4 font-medium">My Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-700">Atorvastatin 20mg</td>
                    <td className="p-4 text-slate-600">Cipla Global Therapeutics</td>
                    <td className="p-4 font-medium text-emerald-600">$18.50</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">100 available</span>
                    </td>
                    <td className="p-4">
                      <button className="text-sm font-bold text-slate-600 hover:text-slate-800">Edit Price/Stock</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="max-w-5xl mx-auto text-center py-12">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700">No Complaints</h2>
            <p className="text-slate-500">You currently have no open complaints from customers.</p>
          </div>
        )}
      </div>
    </div>
  );
};
