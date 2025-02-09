import type { Request, Response } from "express";

import { Cart } from "../models/Cart";

import { AddToCartRequest } from "../types/request";

export const getCart: (
  req: Request<{ userId: string }>,
  res: Response
) => void = async (req: Request<{ userId: string }>, res: Response) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    if (!cart.items.length) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }

    res.status(200).json({ success: true, cart });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const addToCart: (
  req: Request<{ userId: string }, {}, AddToCartRequest>,
  res: Response
) => void = async (
  req: Request<{ userId: string }, {}, AddToCartRequest>,
  res: Response
) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the cart doesn't exist, create one
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // If cart exists, check if the product is already in the cart
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const removeFromCart: (
  req: Request<{ userId: string; productId: string }>,
  res: Response
) => void = async (
  req: Request<{ userId: string; productId: string }>,
  res: Response
) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};
