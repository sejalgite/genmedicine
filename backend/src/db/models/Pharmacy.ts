import mongoose, { Schema, Document } from 'mongoose';

export interface IPharmacy extends Document {
  name: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  phone: string;
  licenseNumber: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  rating: number;
}

const PharmacySchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'SUSPENDED'], default: 'PENDING' },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

// Geospatial index for nearby store queries
PharmacySchema.index({ location: '2dsphere' });

export default mongoose.model<IPharmacy>('Pharmacy', PharmacySchema);
