// src/helpers/uploadProfilePhoto.ts

export async function uploadProfilePhoto(
  userId: string | undefined,
  file: File | undefined
): Promise<string | null> {

  console.log("uploadProfilePhoto id'si : ", userId);
  if (!userId || !file) {
    console.error(
      "Kullanıcı ID'si veya dosya eksik. Yükleme işlemi iptal edildi."
    );
    return null;
  }

  try {

    const formData = new FormData();
    formData.append("photo", file); // Backend'de multer'ın beklediği alan adı ("photo")

    const res = await fetch(
      `http://localhost:3000/api/auth/${userId}/profile-photo`,
      {
        method: "POST",
        body: formData,
        // Form data varsa "Content-Type"'a gerek yokmuş
      }
    );

    if (!res.ok) {
      throw new Error(
        `Yükleme başarısız. Sunucu yanıtı: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data.profilePhoto; // "/uploads/foto.jpg"
  } catch (error) {
    console.error("Profil fotoğrafı yüklenemedi:", error);
    return null;
  }
}
