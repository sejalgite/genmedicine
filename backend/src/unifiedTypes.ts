export type AppScreen =
  | 'super-admin'
  | 'pharma-b2b'
  | 'pharmacy-partner'
  | 'customer-mobile';

export type UserRole = 'customer' | 'pharmacy_partner' | 'pharma_b2b' | 'super_admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  pharmacyId?: string; // If pharmacy_partner
  companyId?: string; // If pharma_b2b
}

export interface Medicine {
  id: string;
  name: string;
  composition: string;
  strength: string;
  dosageForm: string;
  packaging: string;
  manufacturerId: string;
  category: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';
  price: number; // Base wholesale/MSRP price
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  licenseNumber: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  rating: number;
}

export interface MedicineCompany {
  id: string;
  name: string;
  address: string;
  phone: string;
  registrationNumber: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
}

export interface PharmacyInventory {
  id: string;
  pharmacyId: string;
  medicineId: string;
  price: number;
  stock: number;
  status: 'AVAILABLE' | 'UNAVAILABLE';
}

export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'REJECTED' | 'PREPARING' | 'READY' | 'COMPLETED';

export interface OrderItem {
  medicineId: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  pharmacyId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type B2BOrderStatus = 'ORDERED' | 'ACCEPTED' | 'REJECTED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED';

export interface B2BOrder {
  id: string;
  pharmacyId: string;
  companyId: string;
  items: OrderItem[];
  totalAmount: number;
  status: B2BOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  id: string;
  reporterId: string;
  reporterRole: UserRole;
  targetEntityId: string;
  targetEntityType: 'PHARMACY' | 'COMPANY' | 'MEDICINE' | 'ORDER';
  description: string;
  status: 'OPEN' | 'RESOLVED' | 'ESCALATED';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
