// src/routes/admin.routes.ts
import express from "express";
import { createApiKeyController } from "../controller/apiKey.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowedRole } from "../middleware/roleAuth.middleware";
import { USER_ROLES } from "../utils/constants";

const router = express.Router();

// Only ADMIN can create API keys

router.post(
  "/api-keys",
  authMiddleware, 
  allowedRole(USER_ROLES.ADMIN),
  createApiKeyController
);

export default router;
