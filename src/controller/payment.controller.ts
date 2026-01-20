import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../services/payment.service";

/* CREATE */
export const createPaymentController = async (req: Request, res: Response) => {
  const authId = new Types.ObjectId(req.user!.authId);

  const payment = await createPayment(authId, req.body);
  res.status(201).json(payment);
};

/* GET ALL */
export const getPaymentsController = async (req: Request, res: Response) => {
  const authId = new Types.ObjectId(req.user!.authId);

  const payments = await getPayments(authId, req.query);
  res.json(payments);
};

/* GET ONE */
export const getPaymentByIdController = async (req: Request, res: Response) => {
  const payment = await getPaymentById(req.params.id);
  res.json(payment);
};

/* UPDATE */
export const updatePaymentController = async (req: Request, res: Response) => {
  const payment = await updatePayment(req.params.id, req.body);
  res.json(payment);
};

/* DELETE */
export const deletePaymentController = async (req: Request, res: Response) => {
  await deletePayment(req.params.id);
  res.json({ message: "Payment deleted" });
};
