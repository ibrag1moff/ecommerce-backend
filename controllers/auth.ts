import type { Request, Response } from "express-serve-static-core";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { IUser, User } from "../models/User";

import {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
} from "../types/request";

import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies";

import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { sendWelcomeEmail } from "../emails/sendWelcomeEmail";
import { sendResetPasswordEmail } from "../emails/sendResetPasswordEmail";
import { sendSuccessResetEmail } from "../emails/sendSuccessResetMail";

interface JwtPayload {
  userId: string;
}

export const signup: (
  req: Request<{}, {}, SignUpRequest>,
  res: Response
) => void = async (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    throw new Error("All fields are required");
  }

  // Check if password's length is four letters or more
  if (password.length < 4) {
    throw new Error("Password must contain at least 4 symbols");
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification code
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Create new user
  const user = new User({
    email,
    name,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  await user.save();

  // jwt
  const token = generateTokenAndSetCookies(res, user.id);

  // Send verification email
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    token,
  });

  try {
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const verifyEmail: (
  req: Request<{}, {}, {}, { code: string }>,
  res: Response
) => void = async (
  req: Request<{}, {}, {}, { code: string }>,
  res: Response
) => {
  // Accessing the code from query parameters for GET request
  const { code } = req.query;
  try {
    // Find the user by verification token and check if it's not expired
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });

    // Mark the user as verified and clean up the token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    // Send welcome email upon successful verification
    await sendWelcomeEmail(user.email, user.name);

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const login: (
  req: Request<{}, {}, LoginRequest>,
  res: Response
) => void = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateTokenAndSetCookies(res, user.id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const forgotPassword: (
  req: Request<{}, {}, ForgotPasswordRequest>,
  res: Response
) => void = async (
  req: Request<{}, {}, ForgotPasswordRequest>,
  res: Response
) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new Error("Invalid email");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordToken = otpCode;
    user.resetPasswordTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await user.save();

    // Send reset password email
    await sendResetPasswordEmail(user.email, otpCode);

    res.status(200).json({
      success: true,
      message: "OTP Code sent to your email",
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const resetPassword: (
  req: Request<{}, {}, ResetPasswordRequest>,
  res: Response
) => void = async (
  req: Request<{}, {}, ResetPasswordRequest>,
  res: Response
) => {
  const { otpCode, password } = req.body;

  try {
    if (!otpCode || !password) {
      return res
        .status(400)
        .json({ success: false, message: "OTP and password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: otpCode,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired OTP code" });

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 4 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    await sendSuccessResetEmail(user.email, user.name);

    res
      .status(200)
      .json({ success: true, message: "Password successfully changed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const deleteUser: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { userId } = decoded;

    const user = await User.findByIdAndDelete(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "Account was successfully deleted" });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getUser: (req: Request, res: Response) => void = async (
  req: Request,
  res: Response
) => {
const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { userId } = decoded;

    const user = await User.findById(userId).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};
