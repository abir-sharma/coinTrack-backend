// src/utils/apiKey.ts
import crypto from "crypto";

export const generateApiKey = () => {
  return "pw_live_" + crypto.randomBytes(24).toString("hex");
};
