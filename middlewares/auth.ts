import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";

import dotenv from "dotenv";

// Load enviroment variables
dotenv.config();

interface AuthRequest extends Request {
  user?: JwtPayload | { role?: string }; // Ensure role exists
}

// Middleware to verify JWT token
export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): any {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }
    req.user = decoded as JwtPayload; // Assign decoded token to req.user
    next();
  });
}

// Middleware to check if user is an admin
export function isAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  next();
}
