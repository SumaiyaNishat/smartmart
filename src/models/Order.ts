import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId | null;
  isGuest: boolean;
  customerName: string;
  phone: string;
  optionalPhone?: string;
  address: string;
  thana: string;
  district: string;
  orderNote?: string;
  product: mongoose.Types.ObjectId;
  quantity: number;
  deliveryCharge: number;
  totalPrice: number;
  deliveryStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  isGuest: { type: Boolean, default: false },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  optionalPhone: { type: String, default: "" },
  address: { type: String, required: true },
  thana: { type: String, required: true },
  district: { type: String, required: true },
  orderNote: { type: String, default: "" },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
  deliveryCharge: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  deliveryStatus: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
