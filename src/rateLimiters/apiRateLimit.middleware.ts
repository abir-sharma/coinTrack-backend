// src/middleware/apiRateLimit.middleware.ts
import { redisClient } from "../config/redis";

export const apiRateLimit = async (req: any, res: any, next: any) => {
  const apiKey = req.apiClient;

  const key = `api_rl:${apiKey.key}`;
  const limit = apiKey.rateLimit; // e.g. 60/min

  const current = await redisClient.incr(key);

  if (current === 1) {
    await redisClient.expire(key, 60); // 60 secondsn
  }

  if (current > limit) {
    return res.status(429).json({ message: "API rate limit exceeded" });
  }

  next();
};
