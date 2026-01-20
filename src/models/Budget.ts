import mongoose, { Schema, model } from "mongoose";
import { IBudget } from "../types/budget";

const BudgetSchema = new Schema<IBudget>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    month: { type: String, required: true }
  },
  { timestamps: true }
);

export const Budget = model<IBudget>("Budget", BudgetSchema);
