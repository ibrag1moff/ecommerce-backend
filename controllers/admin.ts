import type { Request, Response } from "express";

import { User } from "../models/User";

export const getUsers: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find({});

    if (!users.length) {
      return res.status(404).json({ success: false, message: "No users" });
    }

    res.status(200).json({ success: true, users });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const assignAdmin: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true }
    );

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User assigned as admin" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const banUser: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (user?.role === "owner") {
      return res
        .status(400)
        .json({ success: false, message: "Owner cannot be banned" });
    }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await User.findByIdAndUpdate(id, { banned: true }, { new: true });

    res
      .status(200)
      .json({ success: true, message: "User banned successfully" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};
