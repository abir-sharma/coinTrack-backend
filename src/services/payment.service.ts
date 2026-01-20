import { Payment } from "../models/Payment";
import { Types } from "mongoose";
import { IPayment } from "../types/payment";
import { CreatePaymentDTO, UpdatePaymentDTO } from "../types/payment.dto";

/* CREATE */
export const createPayment = async (
  userId: Types.ObjectId,
  data: CreatePaymentDTO
): Promise<IPayment> => {
  return Payment.create({
    ...data,
    date: new Date(data.date),
    userId
  });
};

/* GET ALL */
export const getPayments = async (
  userId: Types.ObjectId,
  filters: Partial<Pick<IPayment, "category" | "method">> = {}
): Promise<IPayment[]> => {
  return Payment.find({ userId, ...filters }).sort({ date: -1 });
};

/* GET ONE */
export const getPaymentById = async (
  id: string
): Promise<IPayment | null> => {
  return Payment.findById(id);
};

/* UPDATE */
export const updatePayment = async (
  id: string,
  data: UpdatePaymentDTO
): Promise<IPayment | null> => {
  return Payment.findByIdAndUpdate(
    id,
    { ...data, ...(data.date && { date: new Date(data.date) }) },
    { new: true }
  );
};

/* DELETE */
export const deletePayment = async (
  id: string
): Promise<IPayment | null> => {
  return Payment.findByIdAndDelete(id);
};
