import { NextFunction } from "express";
import loginLimiter from "../rateLimiters/loginLimiter";

module.exports = async function loginRateLimit(req, res, next) {
  const key = req.ip;
  try {
    await loginLimiter.consume(key);
    next();
  } catch (rateLimiterRes) {
    res.status(429).json({
      message: "Too many login attempts. Try again later."
    });
  }
};
