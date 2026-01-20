import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowedRole } from "../middleware/roleAuth.middleware";
import { apiKeyMiddleware } from "../middleware/apiKey.middleware";
import { apiRateLimit } from "../rateLimiters/apiRateLimit.middleware";
import { requireApiPermission } from "../middleware/apiPermission.middleware";
import { API_PERMISSIONS, USER_ROLES } from "../utils/constants";

import {
  createBudgetController,
  getBudgetsController,
  getBudgetByIdController,
  updateBudgetController,
  deleteBudgetController,
  getBudgetSummaryController,
} from "../controller/budget.controller";

const router = express.Router();

/* CREATE */
router.post("/", authMiddleware, createBudgetController);

/* API KEY BASED SUMMARY */
router.get(
  "/summary",
  apiKeyMiddleware,
  apiRateLimit,
  requireApiPermission(API_PERMISSIONS.READ_BUDGET),
  getBudgetSummaryController
);

/* GET ALL */
router.get("/", authMiddleware, getBudgetsController);

/* GET ONE (ADMIN ONLY) */
router.get(
  "/:id",
  authMiddleware,
  allowedRole(USER_ROLES.ADMIN),
  getBudgetByIdController
);

/* UPDATE */
router.put("/:id", authMiddleware, updateBudgetController);

/* DELETE */
router.delete("/:id", authMiddleware, deleteBudgetController);

export default router;
