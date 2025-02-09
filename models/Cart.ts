import mongoose from "mongoose";

interface CartItem {
  productId: string;
  quantity: number;
}

interface Cart extends Document {
  userId: string;
  items: CartItem[];
}

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<Cart>("Cart", cartSchema);
