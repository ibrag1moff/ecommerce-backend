import { Router } from "express";

import {
  deleteUser,
  forgotPassword,
  getUser,
  login,
  signup,
  verifyEmail,
  resetPassword,
} from "../controllers/auth";

const router = Router();

router.post("/signup", signup);
router.get("/verify-email", verifyEmail);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.delete("/delete", deleteUser);

router.get("/me", getUser);

export { router as authRouter };
