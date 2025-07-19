import User from "../models/UserModel.js";

// Tüm kullanıcıları getir
export async function getUsers(_req, res) {
  try {
    const users = await User.find(); // Tüm kullanıcıları getirir
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
}

// ID ile kullanıcı getir
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
}

// İsim ile kullanıcı getir
export async function getUserByName(req, res) {
  try {
    const user = await User.findOne({ username: req.query.username });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
}

// Yeni kullanıcı oluştur

export async function getUserByEmail(req, res) {
  try {
    // 1. URL'in query parametresinden 'email' bilgisini al
    const { email } = req.query;

    // 2. Email parametresi gönderilmemişse hata döndür
    if (!email) {
      return res
        .status(400)
        .json({ error: "Lütfen bir email adresi belirtin" });
    }

    // 3. Veritabanında email alanına göre kullanıcıyı bul
    const user = await User.findOne({ email: email });

    // 4. Kullanıcı bulunamazsa 404 hatası döndür
    if (!user) {
      return res
        .status(404)
        .json({ error: "Bu email ile kayıtlı kullanıcı bulunamadı" });
    }

    // 5. Kullanıcı bulunduysa bilgileri döndür
    res.status(200).json(user);
  } catch (err) {
    console.error("Email ile kullanıcı arama hatası:", err);
    res.status(500).json({ error: "Sunucu tarafında bir hata oluştu" });
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }


    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }


    if (req.file) {

      if (user.profilePhoto && user.profilePhoto !== "/default.png") {
        fs.unlink(`assets/profilePhoto/${user.profilePhoto.split("/").pop()}`, (err) => {
          if (err) console.log("Eski fotoğraf silinirken hata oluştu:", err);
        });
      }

      user.profilePhoto = `/uploads/${req.file.filename}`;
    }


    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profil başarıyla güncellendi.",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};