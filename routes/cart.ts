import { Router } from "express";

import { getCart, addToCart, removeFromCart } from "../controllers/cart";

import { verifyToken } from "../middlewares/auth";

const router = Router();

router.use(verifyToken);

router.get("/:userId", getCart);

router.post("/:userId/add", addToCart);

router.delete("/:userId/remove/:productId", removeFromCart);

export { router as cartRouter };
