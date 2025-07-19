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

    const newMessage = await Message.create({
      sender_id: sender_id,
      receiver_id: receiver_id,
      message: message,
      seen: seen ?? false,
      timestamp: Date.now(),
    });

    // ================= THE FIX IS HERE ===================
    // We must save the entire message's ID (an ObjectId) so that .populate() can work.
    await Chat.findByIdAndUpdate(chat_id, {
      lastMessage: newMessage._id, // CORRECTED LINE ✅
      updatedAt: Date.now(),
    });
    // =====================================================

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

export const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username profilePhoto")
      .populate("lastMessage") // This will now work correctly
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error("Kullanıcı sohbetleri getirilirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};

export const findChatuser = async (req, res) => {
  try {
    const chat_id = req.params.id;
    const my_id = req.body.my_id;

    const chat = await Chat.findById(chat_id).populate("participants");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const otherUsers = chat.participants.filter((user) => user._id !== my_id);

    return res.status(200).json(otherUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createOrGetChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId gereklidir." });
    }

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [userId, targetUserId], $size: 2 },
    }).populate("participants", "username");

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChatData = new Chat({
      participants: [userId, targetUserId],
      isGroupChat: false,
    });

    let newChat = await newChatData.save();

    newChat = await newChat.populate("participants", "username");

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Chat oluşturma/getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};
