import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../unifiedTypes';

export interface IComplaint extends Document {
  reporterId: mongoose.Types.ObjectId;
  reporterRole: UserRole;
  targetEntityId: mongoose.Types.ObjectId; // Pharmacy, Company, Medicine, or Order
  targetEntityType: 'PHARMACY' | 'COMPANY' | 'MEDICINE' | 'ORDER';
  description: string;
  status: 'OPEN' | 'RESOLVED' | 'ESCALATED';
}

const ComplaintSchema: Schema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reporterRole: { type: String, enum: ['customer', 'pharmacy_partner', 'pharma_b2b', 'super_admin'], required: true },
  targetEntityId: { type: Schema.Types.ObjectId, required: true },
  targetEntityType: { type: String, enum: ['PHARMACY', 'COMPANY', 'MEDICINE', 'ORDER'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'RESOLVED', 'ESCALATED'], default: 'OPEN' }
}, { timestamps: true });

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
