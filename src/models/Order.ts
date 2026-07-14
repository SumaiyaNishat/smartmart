import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  address: string;
  thana: string;
  district: string;
  product: mongoose.Types.ObjectId;
  quantity: number;
  deliveryCharge: number;
  totalPrice: number;
  deliveryStatus: "pending" | "delivered";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  thana: { type: String, required: true },
  district: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
  deliveryCharge: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  deliveryStatus: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
