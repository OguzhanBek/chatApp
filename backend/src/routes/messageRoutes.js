// routes/userRoutes.js
import express from "express";
import {
  getUserMessages,
  postMessagebyUserId,
} from "../controllers/messageController.js";

const messageRoutes = express.Router();

messageRoutes.get("/:sender_id/:chat_id", getUserMessages);
messageRoutes.post("/:sender_id/:chat_id", postMessagebyUserId);

export default messageRoutes;