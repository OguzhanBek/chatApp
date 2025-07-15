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
export type SidebarProps = {
  setUserChat: React.Dispatch<React.SetStateAction<chatUser[]>>;
  userChat: chatUser[]; 
};
export type chatUser = {
  _id: string;
  isGroupChat: boolean;
  chatName?: string;
  participants: User[]; 
  lastMessage: string; 
  updatedAt: Date;
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
