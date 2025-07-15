import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Bu satırı ekle
import { Server } from "socket.io";
import { createServer } from "http";
import { connectDB } from "./config/index.js";
import authRouter from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config({ path: "../.env" });

// ES Modules için __dirname alternatifi
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

io.on("connection", (socket) => {
  console.log("Kullanıcı şu soket id ile  bağlandı:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`Soket ${socket.id}, oda ${chatId}'ye katıldı`);
  });

  socket.on("new_message", (message) => {
    if (!message.chat_id) {
      console.error("Geçersiz mesaj: chat_id eksik");
      return;
    }

    io.to(message.chat_id).emit("receive_message", message);
    console.log(`Mesaj yayınlandı: ${message.chat_id} odasına`, message);
  });

  socket.on("disconnect", () => {
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
