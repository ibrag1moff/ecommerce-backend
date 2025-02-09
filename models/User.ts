import mongoose from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string | undefined;
  isVerified: boolean;
  role: string;
  lastLogin: Date;
  verificationToken: string | undefined;
  verificationTokenExpiresAt: Date | undefined;
  resetPasswordToken: string | undefined;
  resetPasswordTokenExpiresAt: Date | undefined;
  _doc: any;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    banned: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("auth", userSchema);
