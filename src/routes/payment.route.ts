import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  createPaymentController,
  getPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
} from "../controller/payment.controller";

const router = express.Router();

/* CREATE */
router.post("/", authMiddleware, createPaymentController);

/* GET ALL */
router.get("/", authMiddleware, getPaymentsController);

/* GET ONE */
router.get("/:id", authMiddleware, getPaymentByIdController);

/* UPDATE */
router.put("/:id", authMiddleware, updatePaymentController);

/* DELETE */
router.delete("/:id", authMiddleware, deletePaymentController);

export default router;
