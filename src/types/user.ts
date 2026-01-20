
import { Types, Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  accountId: Types.ObjectId;
  phone: string;
  upiId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

