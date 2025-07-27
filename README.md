# ChatApp

## Genel Bakış

ChatApp, gerçek zamanlı mesajlaşma ve kullanıcı yönetimi özelliklerine sahip, modern bir tam yığın (full-stack) sohbet uygulamasıdır. Proje iki ana bölümden oluşur:

- **Backend:** Node.js, Express, MongoDB, Socket.io
- **Frontend:** React, TypeScript, Vite, Zustand, TailwindCSS

## Özellikler

- Gerçek zamanlı mesajlaşma (Socket.io ile)
- Kullanıcı kaydı, giriş ve profil fotoğrafı yükleme
- Kullanıcı arama ve sohbet başlatma
- Modern ve responsive arayüz
- JWT tabanlı kimlik doğrulama
- Sohbet ve mesaj yönetimi

## Klasör Yapısı

```
chatApp/
  backend/
    src/
      controllers/
      models/
      routes/
      middleware/
      ...
    assets/profilePhoto/
    package.json
  front-end/
    src/
      components/
      layouts/
      pages/
      routes/
      stores/
      ...
    public/
    package.json
```

## Kurulum

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

- `.env` dosyası oluşturup gerekli ortam değişkenlerini ekleyin (ör: MongoDB bağlantı adresi, port).
- Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.

### 2. Frontend

```bash
cd front-end
npm install
npm run dev
```

- Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Kullanım

1. Kayıt olun veya giriş yapın.
2. Profil fotoğrafı yükleyin.
3. Kullanıcı arayarak yeni sohbet başlatın.
4. Gerçek zamanlı mesajlaşmaya başlayın.

## Ana Teknolojiler

- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, JWT, Multer
- **Frontend:** React, TypeScript, Vite, Zustand, TailwindCSS, React Router, React Toastify

## Geliştirici Notları

- Gerçek zamanlı iletişim için hem backend hem frontend aynı anda çalışıyor olmalı.
- Profil fotoğrafları backend'de `assets/profilePhoto` klasöründe saklanır.
- API endpointleri `/api` ile başlar (ör: `/api/auth/login`, `/api/users`).

