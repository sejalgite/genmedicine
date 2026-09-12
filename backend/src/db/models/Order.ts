import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  medicineId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Price at the time of order
}

export interface IOrder extends Document {
  customerId?: mongoose.Types.ObjectId; // For Customer Orders
  pharmacyId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId; // For B2B Orders
  type: 'CUSTOMER' | 'B2B';
  items: IOrderItem[];
  totalAmount: number;
  status: 'PLACED' | 'ACCEPTED' | 'REJECTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'ORDERED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED';
  rejectionReason?: string;
}

const OrderItemSchema = new Schema({
  medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const OrderSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User' },
  pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'MedicineCompany' },
  type: { type: String, enum: ['CUSTOMER', 'B2B'], required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: [
      'PLACED', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY', 'COMPLETED',
      'ORDERED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'
    ],
    required: true 
  },
  rejectionReason: { type: String }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
