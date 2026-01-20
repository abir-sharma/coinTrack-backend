import mongoose from "mongoose";
import { User } from "../models/User";
import { IUser } from "../types/user";
import { deleteCache } from "../utils/cache";

// CREATE USER
export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  return await User.create(data);
};

// GET USERS WITH FILTERS
interface UserFilters {
  name?: string;
  email?: string; // Optional: only if your User has email
}

export const getUsers = async (filters: UserFilters = {}): Promise<IUser[]> => {
  const query: any = {};

  if (filters.name) {
    query.name = { $regex: filters.name, $options: "i" };
  }

  if (filters.email) {
    query.email = { $regex: filters.email, $options: "i" };
  }

  return await User.find(query).sort({ createdAt: -1 });
};

// GET SINGLE USER BY ID
export const getUserById = async (id: string): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// DELETE USER BY ID
export const deleteUserById = async (id: string): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error("User not found");
  }

  // await deleteCache(`me:${authId}`);

  return user;
};
