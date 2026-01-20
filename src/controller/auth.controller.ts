import { Request, Response, NextFunction } from "express";
import {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshAccessToken,
  getMe,
  logoutAllDevices,
} from "../services/auth.service";
import { success } from "../utils/apiResponse";
import { AuthModel } from "../models/Auth";

/* ================= SIGN UP ================= */
export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await signUp(req.body);
    return success(res, user, "Account created", 201);
  } catch (error) {
    next(error);
  }
};

/* ================= LOGIN ================= */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = await login(req.body, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    const clientType = req.headers["x-client-type"]; // 'web' | 'mobile'

    // 🌐 WEB → HttpOnly Cookie
    if (clientType === "web") {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken });
    }

    // 📱 MOBILE → JSON
    return res.json({
      accessToken,
      refreshToken,
    });

  } catch (error) {
    next(error);
  }
};


/* ================= ME ================= */
// controller/auth.controller.ts
export const meController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authId = req.user!.authId;
    const user = await getMe(authId);

    return res.json(user);
  } catch (error) {
    next(error);
  }
};


/* ================= REFRESH ================= */
export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientType = req.headers["x-client-type"];
    const oldRefreshToken =
      clientType === "mobile"
        ? req.body.refreshToken
        : req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      await refreshAccessToken(oldRefreshToken);

    // 🌐 WEB
    if (clientType === "web") {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken });
    }

    // 📱 MOBILE
    return res.json({ accessToken, refreshToken });

  } catch (error) {
    next(error);
  }
};


/* ================= LOGOUT ================= */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientType = req.headers["x-client-type"];
    const refreshToken =
      clientType === "mobile"
        ? req.body.refreshToken
        : req.cookies.refreshToken;

    const result = await logout(refreshToken);

    if (clientType === "web") {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
      });
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


/* ================= LOGOUT ALL ================= */
export const logoutAllController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authId = req.user?.authId;

    if (!authId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await logoutAllDevices(authId);

    // 🌐 WEB → clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await forgotPassword(req.body.email);
    return res.json({ message: "Reset token sent" });
  } catch (error) {
    next(error);
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await resetPassword(
      req.body.email,
      req.body.OTP,
      req.body.newPassword
    );
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await changePassword(
      req.user!.authId,
      req.body.oldPassword,
      req.body.newPassword
    );
    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
