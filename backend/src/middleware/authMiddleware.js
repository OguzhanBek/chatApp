import { JWT_SECRET } from "../controllers/authController.js";
import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Yetkilendirme başarısız: Token bulunamadı." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // req.user'a { id: '...', iat: ..., exp: ... } gibi bir obje atanır
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Yetkilendirme başarısız: Geçersiz token." });
  }
};
