import { Schema, model, Document } from "mongoose";
import { IApiKey } from "../types/ApiKey";
import { API_PERMISSIONS } from "../utils/constants";



const ApiKeySchema = new Schema<IApiKey>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true
  },

  permissions: {
    type: [String],
    enum: [API_PERMISSIONS.READ_BUDGET,API_PERMISSIONS.READ_USER,API_PERMISSIONS.WRITE_BUDGET],
    default: []
  },

  rateLimit: {
    type: Number,
    default: 60 // 60 req/min by default
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastUsedAt: {
    type: Date
  }
}, { timestamps: true });

export const ApiKeyModel = model<IApiKey>("ApiKey", ApiKeySchema);