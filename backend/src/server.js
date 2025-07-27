import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; 
import { Server } from "socket.io";
import { createServer } from "http";
import { connectDB } from "./config/index.js";
import authRouter from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env._PORT_ || 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL'inizi buraya yazın
    methods: ["GET", "POST"],
  },
});
connectDB();

app.use(express.json());
app.use(cors());

const onlineUsers = new Map(); // userId -> socket.id

io.on("connection", (socket) => {
  console.log("Kullanıcı şu soket id ile  bağlandı:", socket.id);

  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys())); // herkese yay
  });

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`Soket ${socket.id}, oda ${chatId}'ye katıldı`);
  });

  socket.on("new_message", (message) => {
    if (!message.chat_id) {
      console.error("Geçersiz mesaj: chat_id eksik");
      return;
    }

    // Mesajı alan diğer kullanıcılara gönder
    io.to(message.chat_id).emit("receive_message", message);

    // Sidebar'ı güncellemek için lastMessageUpdate olayını yayınla
    // Bu sefer mesaj nesnesinin tamamını gönderiyoruz
    io.to(message.chat_id).emit("lastMessageUpdate", {
      chatId: message.chat_id,
      lastMessage: message, // <-- Manuel nesne yerine gelen mesajın kendisini gönderin
    });

    console.log(`Mesaj yayınlandı: ${message.chat_id} odasına`, message);
  });

  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log("Bağlantı kesildi:", socket.id);
  });
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../assets/profilePhoto"))
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/messages/sender", messageRouter);
app.use("/api/chats", chatRoutes);

server.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});

export { io };
