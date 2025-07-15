import express from "express";
import {
  loginUser,
  signUpUser,
  uploadUserPhoto,
} from "../controllers/authController.js";

import { upload } from "../config/index.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signUpUser);
authRouter.post("/:id/profile-photo", upload.single("photo"), uploadUserPhoto);
export default authRouter;
