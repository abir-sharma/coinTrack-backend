import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../types/user";



const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    phone: { type: String, required: true, trim: true, unique: true },
    upiId: { type: String, trim: true, match: [/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


export const User = mongoose.model<IUser>("User", userSchema);
