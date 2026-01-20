import { Types } from "mongoose";

export interface IPayment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  category: string;
  method: "CASH" | "UPI" | "CARD" | "BANK";
  description?: string;
  date: Date;
  createdAt: Date;
}
