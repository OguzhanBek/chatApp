import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const JWT_SECRET = "benim-cok-gizli-jwt-sifrem-1234";

export const uploadUserPhoto = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("userıd : ", userId);
    const photoPath = "/uploads/" + req.file?.filename;

    await User.findByIdAndUpdate(userId, { profilePhoto: photoPath });

    res.json({ message: "Fotoğraf yüklendi" });
  } catch (err) {
    res.status(500).json({ error: "Fotoğraf yüklenemedi" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, kullanıcı adı ve şifre zorunludur" });
    }

    // 1. Find user by both email AND username
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    // 2. Compare passwords

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    // 3. Create token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    const userResponse = {
      token: token,
      id: user._id,
    };

    // 4. Return response
    console.log("Login successful for:", email);
    res.status(200).json({
      message: "Giriş başarılı",
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const signUpUser = async (req, res) => {
  try {
    const { email, username, password, profilePhoto } = req.body;

    // 1. Validation
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, şifre ve kullanıcı adı zorunludur" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Şifre en az 6 karakter olmalıdır" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Geçerli bir email adresi giriniz" });
    }

    const existingEmail = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({ error: "Bu email adresi zaten kayıtlı" });
    }

    const existingUsername = await User.findOne({
      username: username.trim().toLowerCase(),
    });

    if (existingUsername) {
      return res.status(409).json({ error: "Bu kullanıcı adı zaten kayıtlı" });
    }

    // 4. Hash password

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Password hashed successfully");

    // 5. Create new user
    const newUser = new User({
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
      password: hashedPassword,
      profilePhoto: profilePhoto || "",
    });

    // 6. Save user to database

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser.email);

    // 7. Create token and return response
    const token = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    const userResponse = {
      token: token,
      id: savedUser._id,
    };

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        error: `Bu ${
          field === "email" ? "email adresi" : "kullanıcı adı"
        } zaten kayıtlı`,
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ error: validationErrors.join(", ") });
    }

    res.status(500).json({ error: "Sunucu hatası" });
  }
};
