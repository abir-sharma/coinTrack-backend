import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  signUpController,
  loginController,
  meController,
  refreshController,
  logoutController,
  logoutAllController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController
} from "../controller/auth.controller";
import { loginRateLimiter } from "../rateLimiters/loginLimiter";
import { meRateLimiter } from "../rateLimiters/meLimiter";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/login",loginRateLimiter, loginController);
router.get("/me", authMiddleware,meRateLimiter, meController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.post("/logout-all", authMiddleware, logoutAllController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/change-password", authMiddleware, changePasswordController);

export default router;
