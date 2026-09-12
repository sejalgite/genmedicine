import { Medicine, Pharmacy, CustomerOrder, Complaint } from '../unifiedTypes';

const API_BASE = import.meta.env.VITE_APP_URL || 'http://localhost:5000/api/v1';

// Internal helper for auth requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'API Request Failed');
  }
  return data;
};

export const apiClient = {
  // Auth
  login: async (email: string) => {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'password' })
    });
    // Save token to localStorage for subsequent requests
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  // Medicines
  getMedicines: async (): Promise<Medicine[]> => {
    const data = await fetchWithAuth('/medicines');
    return data.medicines || [];
  },

  searchMedicines: async (query: string): Promise<Medicine[]> => {
    const data = await fetchWithAuth(`/medicines/search?q=${encodeURIComponent(query)}`);
    return data.medicines || [];
  },

  // Pharmacies & Inventory
  getPharmacies: async (): Promise<Pharmacy[]> => {
    const data = await fetchWithAuth('/pharmacies');
    return data.pharmacies || [];
  },

  getNearbyPharmacies: async (lat: number, lng: number): Promise<Pharmacy[]> => {
    const data = await fetchWithAuth(`/pharmacies/nearby?lat=${lat}&lng=${lng}`);
    return data.pharmacies || [];
  },

  getInventoryForMedicine: async (medicineId: string): Promise<any[]> => {
    const data = await fetchWithAuth(`/inventory?medicineId=${medicineId}`);
    return data.inventory || [];
  },

  // Orders
  getOrders: async (): Promise<CustomerOrder[]> => {
    const data = await fetchWithAuth('/orders');
    return data.orders || [];
  },

  placeOrder: async (order: Partial<CustomerOrder>): Promise<CustomerOrder> => {
    const data = await fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(order)
    });
    return data.order;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<CustomerOrder> => {
    const data = await fetchWithAuth(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return data.order;
  },

  // Complaints
  getComplaints: async (): Promise<Complaint[]> => {
    const data = await fetchWithAuth('/complaints');
    return data.complaints || [];
  }
};
