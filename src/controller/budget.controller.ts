import { Request, Response } from "express";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../services/budget.service";
import { User } from "../models/User";

/* CREATE */
export const createBudgetController = async (req: Request, res: Response) => {
  const authId = req.user!.authId; // from JWT

  const user = await User.findOne({ accountId: authId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const budget = await createBudget(user._id, req.body);
  res.status(201).json(budget);
};

/* GET SUMMARY (API KEY BASED) */
export const getBudgetSummaryController = async (req: Request, res: Response) => {
  const data = { total: 12345 }; // example
  res.json(data);
};

/* GET ALL */
export const getBudgetsController = async (req: Request, res: Response) => {
  const authId = req.user!.authId;

  const user = await User.findOne({ accountId: authId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const budgets = await getBudgets(user._id, req.query);
  res.json(budgets);
};

/* GET ONE */
export const getBudgetByIdController = async (req: Request, res: Response) => {
  const budget = await getBudgetById(req.params.id);
  res.json(budget);
};

/* UPDATE */
export const updateBudgetController = async (req: Request, res: Response) => {
  const budget = await updateBudget(req.params.id, req.body);
  res.json(budget);
};

/* DELETE */
export const deleteBudgetController = async (req: Request, res: Response) => {
  await deleteBudget(req.params.id);
  res.json({ message: "Budget deleted" });
};
