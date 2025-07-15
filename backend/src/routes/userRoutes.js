// routes/userRoutes.js/api/users istekleri burada.
import express from "express";
import {
  getUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/by-email", getUserByEmail);
userRoutes.get("/", getUsers);
userRoutes.get("/userName", getUserByName);
userRoutes.get("/:id", getUserById);

export default userRoutes;
