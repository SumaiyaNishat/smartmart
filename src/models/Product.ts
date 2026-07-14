import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  discount: number;
  featured: boolean;
  rating: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  category: { type: String, required: true, index: true },
  stock: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
