import { User } from "../models/User";
import crypto from "crypto";
import { hashPassword, comparePassword } from "../utils/hash";
import { LoginDTO, SignUpDTO } from "../types/auth.dto";
import { IUser } from "../types/user";
import { AuthModel } from "../models/Auth";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { getCache, setCache } from "../utils/cache";

/* ================= SIGN UP ================= */
export const signUp = async ({
  email,
  password,
  name,
  phone,
  upiId,
}: SignUpDTO): Promise<IUser> => {

  if (!name || !phone) {
    throw new ApiError(400, "Name and phone are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingAuth = await AuthModel.findOne({ email }).session(session);
    if (existingAuth) {
      throw new ApiError(409, "Email already registered");
    }

    const hashed = await hashPassword(password);

    const auth = await AuthModel.create(
      [{ email, password: hashed }],
      { session }
    );

    const user = await User.create(
      [{
        name,
        phone,
        upiId,
        accountId: auth[0]._id,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return user[0];

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


/* ================= LOGIN ================= */
export const login = async (
  { email, password }: LoginDTO,
  meta: { userAgent?: string; ip?: string }
): Promise<{ accessToken: string; refreshToken: string }> => {
  const auth = await AuthModel.findOne({ email }).select("+password");
  if (!auth) throw new ApiError(400, "User not found!");

  const isMatch = await comparePassword(password, auth.password);
  if (!isMatch) throw new ApiError(409, "Password not matched!");

  // 🔐 Access Token (short-lived)
  const accessToken = jwt.sign(
    { authId: auth._id, role: auth.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  // 🔁 Refresh Token (long-lived)
  const refreshToken = crypto.randomBytes(40).toString("hex");

  auth.sessions.push({
    refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: meta.userAgent,
    ip: meta.ip
  });

  await auth.save();

  return { accessToken, refreshToken };
};


// services/auth.service.ts
export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Not logged in");
  }

  const auth = await AuthModel.findOne({
    "sessions.refreshToken": refreshToken,
    "sessions.expiresAt": { $gt: new Date() }
  });

  if (!auth) {
    throw new ApiError(401, "Session expired. Please login again.");
  }

  const sessionIndex = auth.sessions.findIndex(
    s => s.refreshToken === refreshToken
  );

  if (sessionIndex === -1) {
    throw new ApiError(401, "Invalid session");
  }

  const newRefreshToken = crypto.randomBytes(40).toString("hex");

  auth.sessions[sessionIndex].refreshToken = newRefreshToken;
  auth.sessions[sessionIndex].expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await auth.save();

  const newAccessToken = jwt.sign(
    { authId: auth._id, role: auth.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};


/* ================= LOGOUT ================= */
export const logout = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }

  await AuthModel.updateOne(
    { "sessions.refreshToken": refreshToken },
    { $pull: { sessions: { refreshToken } } }
  );

  return { message: "Logged out successfully" };
};

// services/auth.service.ts
export const logoutAllDevices = async (authId: string) => {
  if (!authId) {
    throw new ApiError(401, "Unauthorized");
  }

  await AuthModel.updateOne(
    { _id: authId },
    { $set: { sessions: [] } }
  );

  return { message: "Logged out from all devices" };
};

export const getMe = async (authId: string) => {
  const cacheKey = `me:${authId}`;

  // 1️⃣ Check cache
  const cachedUser = await getCache<any>(cacheKey);
  if (cachedUser) {
    return cachedUser;
  }

  // 2️⃣ Fetch from DB
  const user = await User.findOne({ accountId: authId })
    .select("-__v")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3️⃣ Store in cache
  await setCache(cacheKey, user, 300); // 5 minutes

  return user;
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (email: string): Promise<string> => {
  const auth = await AuthModel.findOne({ email });
  if (!auth) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit

  auth.resetPasswordOTP = otp;
  auth.resetPasswordOTPExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await auth.save();

  return otp; // send via email
};


/* ================= RESET PASSWORD ================= */
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  const auth = await AuthModel.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpiresAt: { $gt: new Date() },
  }).select("+password");

  if (!auth) throw new Error("Invalid or expired OTP");

  auth.password = await hashPassword(newPassword);
  auth.resetPasswordOTP = undefined;
  auth.resetPasswordOTPExpiresAt = undefined;

  await auth.save();
};



/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (
  authId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const auth = await AuthModel.findById(authId).select("+password");
  if (!auth) throw new Error("User not found");

  const isMatch = await comparePassword(oldPassword, auth.password);
  if (!isMatch) throw new Error("Old password incorrect");

  auth.password = await hashPassword(newPassword);
  await auth.save();
};

