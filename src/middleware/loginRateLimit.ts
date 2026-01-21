// import { Request,Response, NextFunction } from "express";
// import { loginRateLimiter } from "../rateLimiters/loginLimiter";

// module.exports = async function loginRateLimit(req:Request, res:Response, next:NextFunction) {
//   const key = req.ip;
//   try {
//     await loginRateLimiter.consume(key);
//     next();
//   } catch (rateLimiterRes) {
//     res.status(429).json({
//       message: "Too many login attempts. Try again later."
//     });
//   }
// };a
