import { Budget } from "../models/Budget";
import { Types } from "mongoose";
import { IBudget } from "../types/budget";
import { CreateBudgetDTO, UpdateBudgetDTO } from "../types/budget.dto";

/* CREATE */
export const createBudget = async (
  userId: Types.ObjectId,
  data: CreateBudgetDTO
): Promise<IBudget> => {
  return Budget.create({ ...data, userId });
};

/* GET ALL */
export const getBudgets = async (
  userId: Types.ObjectId,
  filters: Partial<Pick<IBudget, "category" | "month">> = {}
): Promise<IBudget[]> => {
  return Budget.find({ userId, ...filters });
};

/* GET ONE */
export const getBudgetById = async (
  id: string
): Promise<IBudget | null> => {
  return Budget.findById(id);
};

/* UPDATE */
export const updateBudget = async (
  id: string,
  data: UpdateBudgetDTO
): Promise<IBudget | null> => {
  return Budget.findByIdAndUpdate(id, data, { new: true });
};

/* DELETE */
export const deleteBudget = async (
  id: string
): Promise<IBudget | null> => {
  return Budget.findByIdAndDelete(id);
};
