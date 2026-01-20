import mongoose from "mongoose";
import { USER_ROLES } from "../utils/constants";

const AuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 never return password by default
    },

    role: {
      type: String,
      enum: [USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT, USER_ROLES.PARENT],
      required: true,
      default: USER_ROLES.STUDENT,
      index: true,
    },
    
    sessions: [
      {
        refreshToken: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        userAgent: String,
        ip: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],


    /* ---------------- OTP RESET PASSWORD ---------------- */
    resetPasswordOTP: {
      type: String,
      select: false,
    },

    resetPasswordOTPExpiresAt: {
      type: Date,
      select: false,
    },

    /* ---------------- ACCOUNT STATUS ---------------- */
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ---------------- INDEXES ---------------- */
AuthSchema.index({ email: 1 });

export const AuthModel = mongoose.model("Auth", AuthSchema);
