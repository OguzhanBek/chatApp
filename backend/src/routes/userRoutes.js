// routes/userRoutes.js/api/users istekleri burada.
import express from "express";
import {
  getUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
  updateUserProfile,
} from "../controllers/userController.js";
import { upload } from "../config/index.js";

const userRoutes = express.Router();

userRoutes.get("/by-email", getUserByEmail);
userRoutes.get("/", getUsers);
userRoutes.get("/userName", getUserByName);
userRoutes.get("/:id", getUserById);
userRoutes.put("/:userId", upload.single("profilePhoto"), updateUserProfile);

export default userRoutes;
