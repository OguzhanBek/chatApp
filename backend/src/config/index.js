import mongoose from "mongoose";
import multer from "multer";
import path from "path";
const db_url =
  "mongodb+srv://oguzhannbek2000:Babam.19701995@cluster0.mjfdony.mongodb.net/ChatApp?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {

    if (!db_url) {
      console.log("DB_URL bulunamadı. Lütfen .env dosyanızı kontrol edin.");
      process.exit(1); 
    }
    const conn = await mongoose.connect(db_url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, path.resolve("assets/profilePhoto"));
  },
  filename: (req, file, cb) => {

    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage: storage,

});
