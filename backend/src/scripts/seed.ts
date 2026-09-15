import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../db/models/User';
import MedicineCompany from '../db/models/MedicineCompany';
import Pharmacy from '../db/models/Pharmacy';
import Medicine from '../db/models/Medicine';
import Inventory from '../db/models/Inventory';
import Order from '../db/models/Order';
import Complaint from '../db/models/Complaint';

dotenv.config();

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await mongoose.connection.db?.dropDatabase();
  console.log('Dropped database to clear old data');

  // --- 1. SUPER ADMIN ---
  console.log('Seeding Super Admin...');
  const admin = new User({
    name: 'Super Admin',
    email: 'admin@genmedicine.io',
    passwordHash: 'password', // Unhashed for demo
    role: 'super_admin',
  });
  await admin.save();

  // --- 2. CUSTOMERS ---
  console.log('Seeding Customers...');
  const customerNames = [
    'Rahul Sharma', 'Priya Patil', 'Amit Joshi', 'Sneha Kulkarni', 'Neha Deshmukh',
    'Vikram Singh', 'Riya Verma', 'Arjun Nair', 'Pooja Reddy', 'Karan Gupta'
  ];
  const customers = await User.insertMany(customerNames.map((name, i) => ({
    name,
    email: `customer${i + 1}@example.com`,
    passwordHash: 'password',
    role: 'customer',
    address: `Apt ${i + 10}, Green Park, Mumbai`,
    phone: `987654321${i}`,
  })));

  // --- 3. MEDICINE COMPANIES ---
  console.log('Seeding Medicine Companies...');
  const companyData = [
    { name: 'Cipla Global', address: 'Mumbai Central', phone: '1800111222' },
    { name: 'Sun Pharma', address: 'Goregaon East', phone: '1800222333' },
    { name: 'Dr. Reddys', address: 'Hyderabad', phone: '1800333444' },
    { name: 'Torrent Pharma', address: 'Ahmedabad', phone: '1800444555' },
    { name: 'Lupin', address: 'Pune', phone: '1800555666' },
    { name: 'Zydus Cadila', address: 'Gujarat', phone: '1800666777' }
  ];
  
  const companies = await MedicineCompany.insertMany(companyData.map((c, i) => ({
    ...c,
    registrationNumber: `REG-COMP-${i}`,
    status: 'APPROVED'
  })));

  // Create Company Users
  await User.insertMany(companies.map((comp, i) => ({
    name: `Admin ${comp.name}`,
    email: `company${i + 1}@example.com`,
    passwordHash: 'password',
    role: 'pharma_b2b',
    companyId: comp._id,
  })));

  // --- 4. PHARMACIES ---
  console.log('Seeding Pharmacies...');
  const pharmacyData = [
    { name: 'MedPlus Pharmacy', address: 'Andheri West', lat: 19.1136, lng: 72.8697 },
    { name: 'HealthCare Medical', address: 'Bandra', lat: 19.0596, lng: 72.8295 },
    { name: 'City Generic Pharmacy', address: 'Juhu', lat: 19.1075, lng: 72.8263 },
    { name: 'LifeCare Medical Store', address: 'Dadar', lat: 19.0178, lng: 72.8478 },
    { name: 'Wellness Pharmacy', address: 'Borivali', lat: 19.2307, lng: 72.8567 },
    { name: 'Jan Aushadhi Store', address: 'Malad', lat: 19.1809, lng: 72.8449 },
    { name: 'Apollo Care', address: 'Powai', lat: 19.1176, lng: 72.9060 },
    { name: 'Noble Chemist', address: 'Chembur', lat: 19.0522, lng: 72.9005 },
    { name: 'Global Pharma', address: 'Vashi', lat: 19.0771, lng: 72.9986 },
    { name: 'Carewell Pharmacy', address: 'Thane', lat: 19.2183, lng: 72.9781 },
  ];
  
  const pharmacies = await Pharmacy.insertMany(pharmacyData.map((p, i) => ({
    name: p.name,
    address: p.address,
    location: { type: 'Point', coordinates: [p.lng, p.lat] },
    phone: `888888888${i}`,
    licenseNumber: `LIC-PHARM-${i}`,
    status: 'APPROVED',
    rating: 4.0 + (i % 5) * 0.2
  })));

  // Create Pharmacy Users
  await User.insertMany(pharmacies.map((pharm, i) => ({
    name: `Manager ${pharm.name}`,
    email: `pharmacy${i + 1}@example.com`,
    passwordHash: 'password',
    role: 'pharmacy_partner',
    pharmacyId: pharm._id,
  })));

  // --- 5. MEDICINES ---
  console.log('Seeding Medicines...');
  const medData = [
    { name: 'Paracetamol 500 mg', composition: 'Paracetamol', category: 'Fever', price: 20 },
    { name: 'Calpol 500 mg', composition: 'Paracetamol', category: 'Fever', price: 25 },
    { name: 'Dolo 650 mg', composition: 'Paracetamol', category: 'Fever', price: 30 },
    { name: 'Cetirizine 10 mg', composition: 'Cetirizine', category: 'Allergy', price: 15 },
    { name: 'Alerid 10 mg', composition: 'Cetirizine', category: 'Allergy', price: 18 },
    { name: 'Aspirin 75 mg', composition: 'Aspirin', category: 'Pain relief', price: 10 },
    { name: 'Ecosprin 75 mg', composition: 'Aspirin', category: 'Pain relief', price: 12 },
    { name: 'Metformin 500 mg', composition: 'Metformin', category: 'Diabetes', price: 50 },
    { name: 'Glycomet 500 mg', composition: 'Metformin', category: 'Diabetes', price: 55 },
    { name: 'Amlodipine 5 mg', composition: 'Amlodipine', category: 'Blood pressure', price: 40 },
    { name: 'Amlovas 5 mg', composition: 'Amlodipine', category: 'Blood pressure', price: 45 },
    { name: 'Omeprazole 20 mg', composition: 'Omeprazole', category: 'Digestive health', price: 30 },
    { name: 'Omez 20 mg', composition: 'Omeprazole', category: 'Digestive health', price: 35 },
    { name: 'Vitamin C 500 mg', composition: 'Ascorbic Acid', category: 'Vitamins', price: 25 },
    { name: 'Limcee 500 mg', composition: 'Ascorbic Acid', category: 'Vitamins', price: 28 },
    { name: 'Azithromycin 500 mg', composition: 'Azithromycin', category: 'Antibiotics', price: 60 },
    { name: 'Azee 500 mg', composition: 'Azithromycin', category: 'Antibiotics', price: 65 },
    { name: 'Ibuprofen 400 mg', composition: 'Ibuprofen', category: 'Pain relief', price: 20 },
    { name: 'Brufen 400 mg', composition: 'Ibuprofen', category: 'Pain relief', price: 22 },
    { name: 'Pantoprazole 40 mg', composition: 'Pantoprazole', category: 'Digestive health', price: 40 },
    { name: 'Pan 40 mg', composition: 'Pantoprazole', category: 'Digestive health', price: 45 },
    { name: 'Levocetirizine 5 mg', composition: 'Levocetirizine', category: 'Allergy', price: 25 },
  ];

  const medicines = await Medicine.insertMany(medData.map((m, i) => ({
    name: m.name,
    composition: m.composition,
    strength: m.name.split(' ').slice(-2).join(' '),
    dosageForm: 'Tablet',
    packaging: '10 tabs/strip',
    manufacturerId: companies[i % companies.length]._id,
    category: m.category,
    description: `Effective for ${m.category.toLowerCase()}`,
    status: 'APPROVED',
    price: m.price
  })));

  // --- 6. INVENTORY ---
  console.log('Seeding Inventory...');
  const inventoryToInsert = [];
  for (let m = 0; m < medicines.length; m++) {
    const numPharmacies = 4 + Math.floor(Math.random() * 3);
    const shuffledPharm = [...pharmacies].sort(() => 0.5 - Math.random()).slice(0, numPharmacies);
    
    for (const pharm of shuffledPharm) {
      const priceVariation = medicines[m].price + (Math.random() * 10 - 5);
      inventoryToInsert.push({
        pharmacyId: pharm._id,
        medicineId: medicines[m]._id,
        price: Math.max(5, Math.round(priceVariation)),
        stock: Math.floor(Math.random() * 100) + 10,
        status: 'AVAILABLE'
      });
    }
  }
  await Inventory.insertMany(inventoryToInsert);

  // --- 7. ORDERS (Customer to Pharmacy) ---
  console.log('Seeding Customer Orders...');
  const allInventory = await Inventory.find();
  const customerOrdersToInsert = [];
  for (let i = 0; i < 15; i++) {
    const customer = customers[i % customers.length];
    const pharmacy = pharmacies[i % pharmacies.length];
    const inv = allInventory.find(inv => inv.pharmacyId.toString() === pharmacy._id.toString());
    
    if (!inv) continue;
    
    const qty = Math.floor(Math.random() * 5) + 1;
    customerOrdersToInsert.push({
      customerId: customer._id,
      pharmacyId: pharmacy._id,
      type: 'CUSTOMER',
      items: [{
        medicineId: inv.medicineId,
        quantity: qty,
        price: inv.price
      }],
      totalAmount: inv.price * qty,
      status: i % 3 === 0 ? 'DELIVERED' : i % 2 === 0 ? 'ACCEPTED' : 'PLACED'
    });
  }
  await Order.insertMany(customerOrdersToInsert);

  // --- 8. ORDERS (Pharmacy to Company) ---
  console.log('Seeding B2B Orders...');
  const b2bOrdersToInsert = [];
  for (let i = 0; i < 10; i++) {
    const pharmacy = pharmacies[i % pharmacies.length];
    const company = companies[i % companies.length];
    const med = medicines.find(m => m.manufacturerId.toString() === company._id.toString());
    if (!med) continue;

    const qty = Math.floor(Math.random() * 100) + 50;
    b2bOrdersToInsert.push({
      pharmacyId: pharmacy._id,
      companyId: company._id,
      type: 'B2B',
      items: [{
        medicineId: med._id,
        quantity: qty,
        price: med.price
      }],
      totalAmount: med.price * qty,
      status: i % 2 === 0 ? 'DISPATCHED' : 'PROCESSING'
    });
  }
  await Order.insertMany(b2bOrdersToInsert);

  console.log('====================================');
  console.log('Database Seeding Complete!');
  console.log('====================================');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
