import { UserAccount, Medicine, Pharmacy, CustomerOrder, Complaint } from '../unifiedTypes';

const API_BASE = 'http://localhost:5000/api/v1';

export const apiClient = {
  // Auth
  login: async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password' })
    });
    return res.json();
  },

  // Medicines
  getMedicines: async (): Promise<Medicine[]> => {
    const res = await fetch(`${API_BASE}/medicines`);
    const data = await res.json();
    return data.medicines || [];
  },

  // Pharmacies
  getPharmacies: async (): Promise<Pharmacy[]> => {
    const res = await fetch(`${API_BASE}/pharmacies`);
    const data = await res.json();
    return data.pharmacies || [];
  },

  // Orders
  getCustomerOrders: async (): Promise<CustomerOrder[]> => {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    return data.orders || [];
  },

  placeCustomerOrder: async (order: Partial<CustomerOrder>): Promise<CustomerOrder> => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    return data.order;
  },

  // Complaints
  getComplaints: async (): Promise<Complaint[]> => {
    const res = await fetch(`${API_BASE}/complaints`);
    const data = await res.json();
    return data.complaints || [];
  }
};
