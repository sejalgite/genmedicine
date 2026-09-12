import React, { useState } from 'react';
import { Search, ShoppingBag, MapPin, Tag, User, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserAccount, Medicine, CustomerOrder } from '../unifiedTypes';

interface CustomerMobileAppProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const CustomerMobileApp: React.FC<CustomerMobileAppProps> = ({ currentUser, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile'>('home');

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to GenMedicine</h2>
        <p className="text-slate-600 mb-8 text-lg">Please log in to search for medicines, find nearby stores, and place orders.</p>
        <button 
          onClick={onOpenAuth}
          className="bg-emerald-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 max-w-md mx-auto w-full shadow-2xl relative overflow-hidden h-[calc(100vh-64px)]">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <div className="p-4 space-y-6">
            <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-md">
              <h1 className="text-3xl font-bold mb-2">Hello, {currentUser.name.split(' ')[0]}!</h1>
              <p className="text-emerald-100 text-lg">What medicine do you need today?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveTab('search')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow active:bg-slate-50"
              >
                <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                  <Search className="w-8 h-8" />
                </div>
                <span className="font-bold text-slate-700 text-lg">Search Medicine</span>
              </button>

              <button 
                onClick={() => setActiveTab('orders')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow active:bg-slate-50"
              >
                <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <span className="font-bold text-slate-700 text-lg">My Orders</span>
              </button>

              <button className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow active:bg-slate-50">
                <div className="bg-purple-100 p-4 rounded-full text-purple-600">
                  <MapPin className="w-8 h-8" />
                </div>
                <span className="font-bold text-slate-700 text-lg">Nearby Stores</span>
              </button>

              <button className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow active:bg-slate-50">
                <div className="bg-amber-100 p-4 rounded-full text-amber-600">
                  <Tag className="w-8 h-8" />
                </div>
                <span className="font-bold text-slate-700 text-lg">Offers</span>
              </button>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mt-6">
              <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle className="text-blue-500" /> Need Help?
              </h2>
              <p className="text-slate-600 text-lg">If you need assistance placing an order, our support team is ready to help you.</p>
              <button className="mt-4 w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl">Contact Support</button>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Search Medicine</h2>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Type medicine name here..."
                className="w-full bg-white border-2 border-emerald-500 rounded-xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-6 h-6" />
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Find Affordable Alternatives</h3>
              <p className="text-slate-500 mt-2 text-lg">Search for a brand name to find cheaper generic equivalents.</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">My Orders</h2>
            
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold">COMPLETED</span>
                  <p className="text-slate-500 text-sm mt-2">Ordered on 12 Sep 2026</p>
                </div>
                <span className="font-bold text-xl text-slate-800">$18.50</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Atorvastatin 20mg</h3>
              <p className="text-slate-600 mb-4 text-lg flex items-center gap-1">
                <Store className="w-4 h-4" /> Apollo Care #104
              </p>
              <button className="w-full bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl text-lg hover:bg-emerald-100">
                Order Again
              </button>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-slate-500 text-lg">You have no other recent orders.</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center mb-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{currentUser.name}</h3>
              <p className="text-slate-500 text-lg mt-1">{currentUser.email}</p>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-white p-5 text-left rounded-xl font-bold text-lg text-slate-700 shadow-sm border border-slate-100">Saved Addresses</button>
              <button className="w-full bg-white p-5 text-left rounded-xl font-bold text-lg text-slate-700 shadow-sm border border-slate-100">Help & Support</button>
              <button onClick={() => window.location.reload()} className="w-full bg-red-50 p-5 text-left rounded-xl font-bold text-lg text-red-600 border border-red-100 mt-8">Log Out</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-6">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'home' ? 'bg-emerald-50' : ''}`}>
            <Search className="w-7 h-7" />
          </div>
          <span className="text-sm font-medium">Home</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'search' ? 'bg-emerald-50' : ''}`}>
            <Search className="w-7 h-7" />
          </div>
          <span className="text-sm font-medium">Search</span>
        </button>

        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'orders' ? 'bg-emerald-50' : ''}`}>
            <ShoppingBag className="w-7 h-7" />
          </div>
          <span className="text-sm font-medium">Orders</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'profile' ? 'bg-emerald-50' : ''}`}>
            <User className="w-7 h-7" />
          </div>
          <span className="text-sm font-medium">Profile</span>
        </button>
      </div>

    </div>
  );
};
