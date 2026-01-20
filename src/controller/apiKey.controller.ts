// src/controller/apiKey.controller.ts
import { Request, Response, NextFunction } from "express";
import { createApiKey } from "../services/apiKey.service";

export const createApiKeyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = await createApiKey(req.body);

    return res.status(201).json({
      message: "API key created successfully",
      apiKey: {
        id: apiKey._id,
        key: apiKey.key,              // show only once
        name: apiKey.name,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit
      }
    });
  } catch (error) {
    next(error);
  }
};
