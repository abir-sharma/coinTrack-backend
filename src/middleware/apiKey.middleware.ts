// src/middleware/apiKey.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiKeyModel } from "../models/ApiKey";
import { ApiError } from "../utils/ApiError";

export const apiKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.headers["x-api-key"] as string;

  if (!key) {
    // return res.status(401).json({ message: "API key missing" });
    throw new ApiError(401,"API key missing")
  }

  const apiKey = await ApiKeyModel.findOne({
    key,
    isActive: true
  });

  if (!apiKey) {
    return res.status(403).json({ message: "Invalid or inactive API key" });
  }

  // Attach to request
  (req as any).apiClient = apiKey;

  // Update last used time (optional)
  apiKey.lastUsedAt = new Date();
  await apiKey.save();

  next();
};
