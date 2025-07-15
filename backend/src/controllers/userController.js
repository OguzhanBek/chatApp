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

