// src/services/apiKey.service.ts
import { ApiKeyModel } from "../models/ApiKey";
import { generateApiKey } from "../utils/apiKey";

export const createApiKey = async (data: {
  name: string;
  permissions: string[];
  rateLimit?: number;
}) => {
  const key = generateApiKey();

  const apiKey = await ApiKeyModel.create({
    key,
    name: data.name,
    permissions: data.permissions,
    rateLimit: data.rateLimit || 60
  });

  return apiKey;
};
