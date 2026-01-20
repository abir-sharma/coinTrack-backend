import express from "express";
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  deleteUserByIdController,
} from "../controller/user.controller";

const router = express.Router();

// POST /api/users
router.post("/", createUserController);

// GET /api/users?name=&email=
router.get("/", getUsersController);

// GET /api/users/:id
router.get("/:id", getUserByIdController);

// DELETE /api/users/:id
router.delete("/:id", deleteUserByIdController);

export default router;
