import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: string[];
  brand?: string;
  images: string[];
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: [String], required: true },
    brand: { type: String },
    images: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("product", productSchema);
