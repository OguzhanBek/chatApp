import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatSchema = new Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    chatName: { type: String },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "chats",
    versionKey: false
  }
);

const Chat = model("Chat", ChatSchema);

export default Chat;