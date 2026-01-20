import jwt, { SignOptions } from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const generateToken = (authId: mongoose.Types.ObjectId, role: string): string => {
  const payload = { authId: authId, role: role };
  console.log("authIdId", authId)
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};
