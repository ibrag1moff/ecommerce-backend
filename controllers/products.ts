import type { Request, Response } from "express";

import { Product } from "../models/Product";

import { AddProductRequest, UpdateProductRequest } from "../types/request";

export const getProducts: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await Product.find({});

    if (!products.length)
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });

    res.status(200).json({ success: true, products });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const addProducts: (
  req: Request<{}, {}, AddProductRequest>,
  res: Response
) => void = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      images,
      isPopular,
      createdAt,
      updatedAt,
    } = req.body;

    if (!name || !price || !category || !images) {
      throw new Error("All fields are required");
    }

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      images,
      isPopular,
      createdAt,
      updatedAt,
    });

    await product.save();

    res.status(201).json({ success: false, product });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const deleteProducts: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product successfully deleted" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateProducts: (
  req: Request<{}, {}, UpdateProductRequest>,
  res: Response
) => void = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const toggleIsPopular: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.isPopular = !product.isPopular;

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};
