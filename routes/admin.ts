import { Router } from "express";

import { assignAdmin, banUser, getUsers } from "../controllers/admin";
import { isAdmin, verifyToken } from "../middlewares/auth";

const router = Router();

router.use(verifyToken, isAdmin);

router.get("/users", getUsers);

router.put("/users/assign-admin/:id", assignAdmin);

router.put("/ban/:id", banUser);

export { router as adminRouter };
