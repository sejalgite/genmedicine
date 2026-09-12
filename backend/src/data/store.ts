import {
  UserAccount,
  Medicine,
  Pharmacy,
  MedicineCompany,
  PharmacyInventory,
  CustomerOrder,
  B2BOrder,
  Complaint,
  Notification
} from '../unifiedTypes';

// Initial Seed Data
export const users: UserAccount[] = [
  { id: 'usr-admin', name: 'Super Admin', email: 'admin@genmedicine.io', role: 'super_admin' },
  { id: 'usr-cust1', name: 'Alex Customer', email: 'alex@example.com', role: 'customer' },
  { id: 'usr-pharm1', name: 'Apollo Pharmacy Admin', email: 'pharm@apollo.com', role: 'pharmacy_partner', pharmacyId: 'pharm-1' },
  { id: 'usr-comp1', name: 'Cipla Admin', email: 'admin@cipla.com', role: 'pharma_b2b', companyId: 'comp-1' }
];

export const medicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Atorvastatin 20mg',
    composition: 'Atorvastatin Calcium Trihydrate',
    strength: '20mg',
    dosageForm: 'Tablet',
    packaging: '30 tabs',
    manufacturerId: 'comp-1',
    category: 'Cardiovascular',
    description: 'Gold-standard HMG-CoA reductase inhibitor for aggressive LDL-C reduction.',
    status: 'APPROVED',
    price: 14.2
  }
];

export const pharmacies: Pharmacy[] = [
  {
    id: 'pharm-1',
    name: 'Apollo Care #104',
    address: '123 Health Ave, NY',
    phone: '555-1234',
    licenseNumber: 'NY-PHARM-123',
    status: 'APPROVED',
    rating: 4.8
  }
];

export const companies: MedicineCompany[] = [
  {
    id: 'comp-1',
    name: 'Cipla Global Therapeutics',
    address: '456 Pharma Blvd, NJ',
    phone: '555-9876',
    registrationNumber: 'FDA-REG-9988',
    status: 'APPROVED'
  }
];

export const inventory: PharmacyInventory[] = [
  {
    id: 'inv-1',
    pharmacyId: 'pharm-1',
    medicineId: 'med-1',
    price: 18.5,
    stock: 100,
    status: 'AVAILABLE'
  }
];

export const customerOrders: CustomerOrder[] = [];
export const b2bOrders: B2BOrder[] = [];
export const complaints: Complaint[] = [];
export const notifications: Notification[] = [];

// Helper functions for data access
export const store = {
  getUsers: () => users,
  getMedicines: () => medicines,
  getPharmacies: () => pharmacies,
  getCompanies: () => companies,
  getInventory: () => inventory,
  getCustomerOrders: () => customerOrders,
  getB2BOrders: () => b2bOrders,
  getComplaints: () => complaints,
  getNotifications: () => notifications
};
