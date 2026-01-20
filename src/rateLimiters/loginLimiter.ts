import { Request, Response, NextFunction } from "express";
import {redisClient} from "../config/redis";

export const loginRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip = req.ip;
    const email = req.body.email || "unknown";

    const key = `login:${ip}:${email}`;
    const MAX_REQUESTS = 3;
    const WINDOW = 60; // seconds

    const current = await redisClient.incr(key);
    const ttl = await redisClient.ttl(key);

    if (current === 1) {
      await redisClient.expire(key, WINDOW);
    }

    if (current > MAX_REQUESTS) {
      return res.status(429).json({
        message: `Too many attempts. Try again in ${ttl} seconds.`,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
