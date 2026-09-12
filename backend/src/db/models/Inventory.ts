import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  pharmacyId: mongoose.Types.ObjectId;
  medicineId: mongoose.Types.ObjectId;
  price: number;
  stock: number;
  status: 'AVAILABLE' | 'UNAVAILABLE';
}

const InventorySchema: Schema = new Schema({
  pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['AVAILABLE', 'UNAVAILABLE'], default: 'AVAILABLE' }
}, { timestamps: true });

// Prevent duplicate inventory entries for the same medicine in the same pharmacy
InventorySchema.index({ pharmacyId: 1, medicineId: 1 }, { unique: true });

export default mongoose.model<IInventory>('Inventory', InventorySchema);
