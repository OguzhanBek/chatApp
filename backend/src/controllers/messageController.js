import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";

export const getOtherUserFromChat = async (chat_id, my_id) => {
  const chat = await Chat.findById(chat_id).populate("participants");

  if (!chat) {
    throw new Error("Chat not found");
  }

  const otherUsers = chat.participants.filter(
    (user) => user._id.toString() !== my_id
  );

  return otherUsers;
};

export const getAllMessagesByUserId = async (sender_id, chat_id) => {
  if (!sender_id || !chat_id) {
    console.log("sender_id:", sender_id, "chat_id:", chat_id);
    throw new Error("sender_id or chat_id is missing");
  }

  try {
    const otherUsers = await getOtherUserFromChat(chat_id, sender_id);

    if (!otherUsers || otherUsers.length === 0) {
      throw new Error("No other users found in chat");
    }

    const receiver_id = otherUsers[0]._id; // Get first user from array

    return await Message.find({
      $or: [
        { sender_id: sender_id, receiver_id: receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id },
      ],
    }).sort({ timestamp: 1 });
  } catch (error) {
    console.log(`Error in getAllMessagesByUserId:`, error.message);
    throw error;
  }
};

export const postMessagebyUserId = async (req, res) => {
  try {
    const { sender_id, chat_id } = req.params; 
    const { message, seen } = req.body;

    if (!sender_id || !chat_id || !message) {
      return res.status(400).json({
        error: "sender_id, chat_id, or message is missing",
      });
    }

    const otherUsers = await getOtherUserFromChat(chat_id, sender_id);

    if (!otherUsers || otherUsers.length === 0) {
      return res.status(400).json({
        error: "No other users found in chat",
      });
    }

    const receiver_id = otherUsers[0]._id;

    // 1. Create the new message AND store it in a variable
    const newMessage = await Message.create({
      sender_id: sender_id,
      receiver_id: receiver_id,
      message: message,
      seen: seen ?? false,
      timestamp: Date.now(),
    });

    // 2. Find the chat and update its lastMessage and updatedAt fields
    await Chat.findByIdAndUpdate(chat_id, {
      lastMessage: newMessage._id,
      updatedAt: Date.now(),
    });

    const returnMessages = await getAllMessagesByUserId(sender_id, chat_id);
    res.json(returnMessages);
  } catch (error) {
    console.error("Error in postMessagebyUserId:", error.message);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

export const getUserMessages = async (req, res) => {
  const { sender_id, chat_id } = req.params;

  try {
    if (!sender_id || !chat_id) {
      return res.status(400).json({
        error: "sender_id or chat_id is missing",
      });
    }

    const returnMessage = await getAllMessagesByUserId(sender_id, chat_id);
    res.json(returnMessage); 
  } catch (error) {
    console.error("Error in getUserMessages:", error.message);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
