import React from "react";

export type signupInfo = {
  username: string;
  profilePhoto?: string;
  email: string;
  password: string;
};

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
}

export type userinfo = {
  user: { id: string; token: string };
};

// 💡 NEW: A dedicated type for a single message object.
// This is what `lastMessage` becomes after being populated.
export interface MessageType {
  _id: string;
  sender_id: string; // Or could be a populated User object: sender: User;
  message: string;
  seen: boolean;
  timestamp: number; // Or Date
  // ...any other fields a message has
}

// ✅ CORRECTED: `chatUser` now uses `MessageType`.
export type chatUser = {
  _id: string;
  isGroupChat: boolean;
  chatName?: string;
  participants: User[];
  lastMessage?: MessageType; // Changed from 'string' to 'MessageType' and made optional
  updatedAt: Date;
};

export type SidebarProps = {
  setUserChat: React.Dispatch<React.SetStateAction<chatUser[]>>;
  userChat: chatUser[];
};

export type sendMessages = {
  _id: string;
  sender_id: string | undefined;
  chat_id: string | undefined;
  message: string;
  seen: boolean;
  timestamp: number;
};

export type getMessages = {
  _id: string;
  sender_id: string | undefined;
  receiver_id: string | undefined;
  message: string;
  seen: boolean;
  timestamp: number;
};
