import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { USER_ROLES } from "../utils/constants";

const WINDOW_SECONDS = 60;


export const meRateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const MAX_REQUESTS = req.user?.role === USER_ROLES.ADMIN ? 100 : 1;

    try {
        const userId = req.user?.authId;
        const ip = req.ip;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const key = `rate:me:${userId}:${ip}`;

        const current = await redisClient.incr(key);

        if (current === 1) {
            await redisClient.expire(key, WINDOW_SECONDS);
        }

        if (current > MAX_REQUESTS) {
            return res.status(429).json({
                message: "Too many requests. Please slow down."
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};
