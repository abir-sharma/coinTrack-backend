import { Schema, model } from "mongoose";
import { IPayment } from "../types/payment";

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    method: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "BANK"],
      required: true
    },
    description: String,
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", PaymentSchema);
