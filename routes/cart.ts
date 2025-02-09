import { Router } from "express";

import { getCart, addToCart, removeFromCart } from "../controllers/cart";

const router = Router();

router.get("/:userId", getCart);

router.post("/:userId/add", addToCart);

router.delete("/:userId/remove/:productId", removeFromCart);

export { router as cartRouter };
