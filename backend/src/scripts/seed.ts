import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../db/models/User';
import MedicineCompany from '../db/models/MedicineCompany';
import Pharmacy from '../db/models/Pharmacy';
import Medicine from '../db/models/Medicine';
import Inventory from '../db/models/Inventory';

dotenv.config();

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data and old indexes
  await mongoose.connection.db?.dropDatabase();
  console.log('Dropped database to clear old indexes');

  // 1. Create Medicine Company
  const company = new MedicineCompany({
    name: 'Cipla Global Therapeutics',
    address: '123 Pharma Hub, NY',
    phone: '1-800-555-0199',
    registrationNumber: 'REG-CIPLA-001',
    status: 'APPROVED'
  });
  await company.save();

  // 2. Create Pharmacy
  const pharmacy = new Pharmacy({
    name: 'Apollo Care #104',
    address: '452 Broadway, NY',
    location: { type: 'Point', coordinates: [-74.000, 40.712] },
    phone: '212-555-0199',
    licenseNumber: 'LIC-APOLLO-104',
    status: 'APPROVED',
    rating: 4.8
  });
  await pharmacy.save();

  // 3. Create Demo Users
  const users = [
    {
      name: 'Alex Morgan',
      email: 'alex.morgan@healthmail.com',
      passwordHash: 'password', // Unhashed for demo simplicity
      role: 'customer',
      address: '452 Broadway, NY',
    },
    {
      name: 'Dr. Michael Chen',
      email: 'm.chen@apollocare.com',
      passwordHash: 'password',
      role: 'pharmacy_partner',
      pharmacyId: pharmacy._id,
    },
    {
      name: 'Dr. Aris Thorne',
      email: 'aris@cipla.com',
      passwordHash: 'password',
      role: 'pharma_b2b',
      companyId: company._id,
    },
    {
      name: 'Marcus Vance',
      email: 'admin@genmedicine.io',
      passwordHash: 'password',
      role: 'super_admin',
    },
  ];

  await User.insertMany(users);
  console.log('Inserted Demo Users');

  // 4. Create Medicine
  const med = new Medicine({
    name: 'Atorvastatin 20mg',
    composition: 'Atorvastatin Calcium Trihydrate',
    strength: '20mg',
    dosageForm: 'Tablet',
    packaging: '30 tabs/bottle',
    manufacturerId: company._id,
    category: 'Statins',
    description: 'Used to treat high cholesterol and lower the risk of stroke.',
    status: 'APPROVED',
    price: 14.20
  });
  await med.save();

  const med2 = new Medicine({
    name: 'Amoxicillin 500mg',
    composition: 'Amoxicillin trihydrate',
    strength: '500mg',
    dosageForm: 'Capsule',
    packaging: '21 caps/bottle',
    manufacturerId: company._id,
    category: 'Antibiotics',
    description: 'Penicillin antibiotic used to treat bacterial infections.',
    status: 'APPROVED',
    price: 8.50
  });
  await med2.save();

  // 5. Create Inventory
  const inv = new Inventory({
    pharmacyId: pharmacy._id,
    medicineId: med._id,
    price: 18.50,
    stock: 100,
    status: 'AVAILABLE'
  });
  await inv.save();

  const inv2 = new Inventory({
    pharmacyId: pharmacy._id,
    medicineId: med2._id,
    price: 12.00,
    stock: 50,
    status: 'AVAILABLE'
  });
  await inv2.save();

  console.log('Database Seeding Complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
