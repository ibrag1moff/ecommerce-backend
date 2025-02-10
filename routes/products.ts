import { Router } from "express";

import {
  addProducts,
  deleteProducts,
  getPopularProducts,
  getProducts,
  toggleIsPopular,
  updateProducts,
} from "../controllers/products";

import { isAdmin, verifyToken } from "../middlewares/auth";

const router = Router();

router.get("/", getProducts);

router.get("/popular", getPopularProducts);

router.post("/add", verifyToken, isAdmin, addProducts);

router.delete("/delete/:id", verifyToken, isAdmin, deleteProducts);

router.put("/update/:id", verifyToken, isAdmin, updateProducts);

router.get("/toggle-popular/:id", verifyToken, isAdmin, toggleIsPopular);

export { router as productRouter };
