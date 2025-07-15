import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  createOrGetChat,
  findChatuser,
  getUserChats,
} from "../controllers/chatController.js";

const chatRoutes = express.Router();
chatRoutes.post("/", authenticateUser, createOrGetChat);

chatRoutes.get("/:userId", getUserChats);
chatRoutes.post("/:userId", findChatuser);
export default chatRoutes;
