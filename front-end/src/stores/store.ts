import { create } from "zustand";
import type { chatUser, userinfo } from "../types/types";

type Store = {
  user: userinfo | null;
  setUserToLocaleStorage: (userInfo: userinfo) => void;
  removeUserFromLocaleStorage: () => void;
  textAreaMessage: string;
  setTextAreaMessage: (message: string) => void;

  userChats: chatUser[];
  setUserChats: (chats: chatUser[]) => void;
};

export const useStore = create<Store>()((set) => ({
  textAreaMessage: "",
  setTextAreaMessage: (message: string) => set({ textAreaMessage: message }),

  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : null,

  setUserToLocaleStorage: (userInfo: userinfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    set({ user: userInfo });
  },

  userChats: [],
  setUserChats: (chats) => set({ userChats: chats }),

  removeUserFromLocaleStorage: () => {
    localStorage.removeItem("user"); // yine string key
    set({ user: null });
  },
}));
