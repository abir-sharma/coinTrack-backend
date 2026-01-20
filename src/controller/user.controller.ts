import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUserById,
} from "../services/user.service";

/* CREATE USER */
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

/* GET ALL USERS */
export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsers(req.query);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/* GET USER BY ID */
export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* DELETE USER */
export const deleteUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await deleteUserById(req.params.id);
    res.json({ message: "User deleted successfully", user });
  } catch (err) {
    next(err);
  }
};
