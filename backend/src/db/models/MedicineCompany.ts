import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicineCompany extends Document {
  name: string;
  address: string;
  phone: string;
  registrationNumber: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
}

const MedicineCompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'SUSPENDED'], default: 'PENDING' }
}, { timestamps: true });

export default mongoose.model<IMedicineCompany>('MedicineCompany', MedicineCompanySchema);
