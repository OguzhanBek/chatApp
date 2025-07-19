import { toast } from "react-toastify";
import type { chatUser, sendMessages, User } from "../types/types";
const API_URL = "http://localhost:3000/api";
//kullanıcı adına göre user buluyor. Buna ellemeyecem sorun yapmıyor.

export const findUserByName = async (userName: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users/userName?username=${userName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Kullanıcı bulunamadı");
    }
    const data = await response.json();
    // console.log("User found:", data);
    return data;
  } catch (error) {
    console.log("Error adding user:", error);
    return null;
  }
};

//id'ye göre kullanıcıyı buluyor. Buna de ellemicem sorun yapmıyor sidebar için.
export const findUserById = async (
  id: string | undefined
): Promise<User | undefined> => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const startChat = async (
  targetUserId: string | undefined,
  token: string | undefined,
  userchats: chatUser[],
  myid: string | undefined
) => {
  try {
    if (!targetUserId || !token || !myid) {
      throw new Error("Eksik parametreler");
    }

    if (targetUserId === myid) {
      toast.warn("Kendinizle sohbet başlatamazsınız!");
      return null;
    }

    const existingChat = userchats.find((chat) =>
      chat.participants.some((p) => p._id === targetUserId)
    );

    if (existingChat) {
      toast.error("Bu kullanıcı zaten sohbet listenizde!");
      return null;
    }

    const res = await fetch("http://localhost:3000/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Sunucu hatası: ${res.status}`);
    }

    const chat = await res.json();
    console.log("Yeni chat:", chat);
    return chat;
  } catch (error: any) {
    console.error("startChat servisinde hata:", error.message);
    toast.error(error.message || "Sohbet başlatılırken bir hata oluştu");
    throw error;
  }
};
export const getUserChats = async (
  userId: string,
  token: string | undefined
) => {
  if (!token) {
    throw new Error("Yetkilendirme token'ı bulunamadı.");
  }
  try {
    const res = await fetch(`http://localhost:3000/api/chats/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Sunucu hatası: ${res.status}`);
    }

    const chats = await res.json();

    return chats;
  } catch (error: any) {
    console.error("Kullanıcı sohbetleri getirilirken hata:", error.message);
    throw error;
  }
};
export const getOtherUsersFromChat = async (
  chat_id: string | undefined,
  my_id: string | undefined
) => {
  try {
    console.log(
      "getOtherUsersFromChat chat_id : ",
      chat_id,
      "getOtherUsersFromChat my id :",
      my_id
    );
    const response = await fetch(`http://localhost:3000/api/chats/${chat_id}`, {
      method: "POST", // veya GET ise body gönderemezsin, buna göre backend'i ayarla
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ my_id }),
    });

    if (!response.ok) {
      throw new Error("Karşı kullanıcı bilgisi alınamadı.");
    }

    const data = await response.json();
    console.log("chatuserid : ");
    return data; // bu bir user array olabilir
  } catch (error) {
    console.error("Hata:", error);
    return null;
  }
};

export const getUserMessages = async (
  sender_id: string | undefined,
  chat_id: string | undefined
) => {
  if (!sender_id || !chat_id) {
    console.log(sender_id, chat_id);
    throw new Error("kullanıcı id'si bulunamadı");
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/messages/sender/${sender_id}/${chat_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Sunucu hatası: ${res.status}`);
    }

    const chats = await res.json();
    return chats;
  } catch (error: any) {
    console.error("Kullanıcı sohbetleri getirilirken hata:", error.message);
    throw error;
  }
};

export const sendMessage = async (message: sendMessages) => {
  if (!message.chat_id || !message.sender_id)
    console.log(
      "reciever id :",
      message.chat_id,
      "sedner id : ",
      message.sender_id
    );
  try {
    const res = await fetch(
      `http://localhost:3000/api/messages/sender/${message.sender_id}/${message.chat_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      }
    );
    if (!res.ok) {
      throw new Error("mesaj gönderilirken hata oldu");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("sohbet mesajı gönderilirken hata oldu");
    throw error;
  }
};

export const updateUserProfileApi = async (userId :string , profileData) => {
  try {

    const formData = new FormData();

    formData.append("username", profileData.username);
    formData.append("email", profileData.email);

    if (profileData.password) {
      formData.append("password", profileData.password);
    }

    if (profileData.profilePhotoFile) {
      formData.append("profilePhoto", profileData.profilePhotoFile);
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {

      const errorData = await response.json();

      throw new Error(errorData.message || "Profil güncellenirken bir hata oluştu.");
    }

    const data = await response.json();
    return data;

  } catch (error : any) {
    console.error("Profil güncelleme API hatası:", error.message);
    throw error;
  }
};