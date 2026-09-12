import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  composition: string;
  strength: string;
  dosageForm: string;
  packaging: string;
  manufacturerId: mongoose.Types.ObjectId; // Reference to MedicineCompany
  category: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';
  price: number; // Base wholesale/MSRP price
}

const MedicineSchema: Schema = new Schema({
  name: { type: String, required: true },
  composition: { type: String, required: true },
  strength: { type: String, required: true },
  dosageForm: { type: String, required: true },
  packaging: { type: String, required: true },
  manufacturerId: { type: Schema.Types.ObjectId, ref: 'MedicineCompany', required: true },
  category: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'BANNED'], default: 'PENDING' },
  price: { type: Number, required: true }
}, { timestamps: true });

// Text index for search
MedicineSchema.index({ name: 'text', composition: 'text', category: 'text' });

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
