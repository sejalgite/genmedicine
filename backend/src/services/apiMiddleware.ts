import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../db/models/User';
import Medicine from '../db/models/Medicine';
import Pharmacy from '../db/models/Pharmacy';
import MedicineCompany from '../db/models/MedicineCompany';
import Inventory from '../db/models/Inventory';
import Order from '../db/models/Order';
import Complaint from '../db/models/Complaint';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key';

// ---------------------------------------------------------
// Middleware
// ---------------------------------------------------------
export interface AuthRequest extends Request {
  user?: any;
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
      return;
    }
    next();
  };
};

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------
router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    // Real implementation would compare hashed password. 
    // Here we just find the user to simulate login.
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------------------------------------------
// MEDICINES (Global Catalog)
// ---------------------------------------------------------
router.get('/medicines', async (req: Request, res: Response): Promise<void> => {
  try {
    const medicines = await Medicine.find().populate('manufacturerId');
    res.json({ medicines });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

router.post('/medicines', requireAuth, requireRole(['pharma_b2b', 'super_admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const med = new Medicine({ ...req.body, manufacturerId: req.user.id }); // simplified for now
    await med.save();
    res.status(201).json({ medicine: med });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create medicine' });
  }
});

// ---------------------------------------------------------
// SEARCH ENDPOINT
// ---------------------------------------------------------
router.get('/medicines/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string;
    if (!q) {
      res.json({ medicines: [] });
      return;
    }
    // Simple regex search (in production we would use text indexes)
    const regex = new RegExp(q, 'i');
    const medicines = await Medicine.find({
      $or: [{ name: regex }, { composition: regex }, { category: regex }]
    });
    res.json({ medicines });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// ---------------------------------------------------------
// PHARMACIES & INVENTORY
// ---------------------------------------------------------
router.get('/pharmacies', async (req: Request, res: Response): Promise<void> => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json({ pharmacies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pharmacies' });
  }
});

router.get('/pharmacies/nearby', async (req: Request, res: Response): Promise<void> => {
  try {
    // Expected query: ?lat=...&lng=...&maxDist=... (in meters)
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const maxDist = parseInt(req.query.maxDist as string) || 10000;

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ error: 'Invalid coordinates' });
      return;
    }

    const pharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: maxDist
        }
      }
    });
    res.json({ pharmacies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find nearby pharmacies' });
  }
});

router.get('/inventory', async (req: Request, res: Response): Promise<void> => {
  try {
    const medId = req.query.medicineId as string;
    const filter = medId ? { medicineId: medId } : {};
    const inventory = await Inventory.find(filter).populate('pharmacyId').populate('medicineId');
    res.json({ inventory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// ---------------------------------------------------------
// ORDERS
// ---------------------------------------------------------
router.get('/orders', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let filter: any = {};
    if (req.user.role === 'customer') filter.customerId = req.user.id;
    if (req.user.role === 'pharmacy_partner') filter.pharmacyId = req.user.id;
    if (req.user.role === 'pharma_b2b') filter.companyId = req.user.id;

    const orders = await Order.find(filter)
      .populate('items.medicineId')
      .populate('pharmacyId')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/orders', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderData = req.body;
    orderData.customerId = req.user.id;
    orderData.type = 'CUSTOMER';
    orderData.status = 'PLACED';

    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/orders/:id/status', requireAuth, requireRole(['pharmacy_partner', 'pharma_b2b', 'super_admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// ---------------------------------------------------------
// COMPLAINTS
// ---------------------------------------------------------
router.get('/complaints', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let filter: any = {};
    if (req.user.role !== 'super_admin') {
      filter.$or = [{ reporterId: req.user.id }, { targetEntityId: req.user.id }];
    }
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// ---------------------------------------------------------
// USERS (Admin only)
// ---------------------------------------------------------
router.get('/users', requireAuth, requireRole(['super_admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/status', requireAuth, requireRole(['super_admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// ---------------------------------------------------------
// MEDICINES EXTENDED
// ---------------------------------------------------------
router.get('/medicines/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('manufacturerId');
    if (!medicine) {
      res.status(404).json({ error: 'Medicine not found' });
      return;
    }
    res.json({ medicine });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicine' });
  }
});

// ---------------------------------------------------------
// PHARMACIES EXTENDED
// ---------------------------------------------------------
router.get('/pharmacies/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      res.status(404).json({ error: 'Pharmacy not found' });
      return;
    }
    res.json({ pharmacy });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pharmacy' });
  }
});

// ---------------------------------------------------------
// ORDERS EXTENDED
// ---------------------------------------------------------
router.post('/orders/b2b', requireAuth, requireRole(['pharmacy_partner']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderData = req.body;
    // req.user.pharmacyId might be set. Assuming pharmacyId is passed or taken from user.
    orderData.pharmacyId = req.user.pharmacyId || orderData.pharmacyId; 
    orderData.type = 'B2B';
    orderData.status = 'PLACED';

    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create B2B order' });
  }
});

// ---------------------------------------------------------
// COMPLAINTS EXTENDED
// ---------------------------------------------------------
router.post('/complaints', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const complaintData = req.body;
    complaintData.reporterId = req.user.id;
    complaintData.status = 'OPEN';
    
    const complaint = new Complaint(complaintData);
    await complaint.save();
    res.status(201).json({ complaint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});

router.patch('/complaints/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ complaint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

export function createApiMiddleware() {
  return router;
}
