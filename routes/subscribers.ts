import { Router } from "express";

import {
  getSubscribers,
  subscribe,
  unSubscribe,
} from "../controllers/subscribers";

const router = Router();

router.get("/", getSubscribers);

router.post("/subscribe", subscribe);

router.delete("/unsubscribe/:userId", unSubscribe);

export { router as subscribersRouter };
