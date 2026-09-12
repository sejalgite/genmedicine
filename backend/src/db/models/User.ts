import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../unifiedTypes';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string; // Hashed password
  role: UserRole;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  pharmacyId?: mongoose.Types.ObjectId; // Reference to Pharmacy if role = pharmacy_partner
  companyId?: mongoose.Types.ObjectId; // Reference to Company if role = pharma_b2b
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'pharmacy_partner', 'pharma_b2b', 'super_admin'], required: true },
  phone: { type: String },
  address: { type: String },
  avatarUrl: { type: String },
  pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy' },
  companyId: { type: Schema.Types.ObjectId, ref: 'MedicineCompany' },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'SUSPENDED'], default: 'ACTIVE' }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
