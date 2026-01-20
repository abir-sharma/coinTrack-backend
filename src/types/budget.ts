import { Types } from "mongoose";

export interface IBudget {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  month: string;      // "2025-01"
  createdAt: Date;
}
