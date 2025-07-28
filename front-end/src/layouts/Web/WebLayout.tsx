import { Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { getMessages, signupInfo } from "../../types/types";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import TextArea from "./Components/TextArea";
import UserProfile from "../../pages/userPage"; 
import { IoMdSettings } from "react-icons/io";
import { FaAddressBook } from "react-icons/fa";
import { useStore } from "../../stores/store";
import {
  findUserById,
  getUserChats,
  getUserMessages,
} from "../../utils/useHelper";
import background from "../../assets/istockphoto-1945538809-612x612.jpg";
import AddUserPage from "../../pages/addUserPage";

function WebLayout() {
  const { user, setUserChats } = useStore();
  const [_personelUser, setPersonelUser] = useState<signupInfo[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const myid = user?.user.id;
  const myToken = user?.user.token;
  const { chat_id } = useParams();
  const [messages, setMessages] = useState<getMessages[]>([]);
  useEffect(() => {
    const fetcMyself = async () => {
      if (!myid) return;
      const foundUser = await findUserById(myid);
      if (foundUser) {
        setPersonelUser([foundUser]);
      }
    };
    fetcMyself();
  }, [myid]);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (myid && myToken) {
        try {
          const chatsFromDb = await getUserChats(myid, myToken);
          setUserChats(chatsFromDb);
        } catch (error: any) {
          toast.error(
            "Sohbetler yüklenirken bir hata oluştu: " + error.message
          );
        }
      }
    };
    fetchUserChats();
  }, [myid, myToken, setUserChats]);
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getUserMessages(myid, chat_id);
      setMessages(data);
    };
    if (myid && chat_id) fetchMessages();
  }, [chat_id, myid]);
  return (
    <>
      <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
        <button
          onClick={() => setOpenAddUser(true)}
          className=" text-white font-bold rounded-lg cursor-pointer hover:opacity-40 transition"
          style={{ padding: "0.1rem" }}
        >
          <FaAddressBook size={24} />
        </button>
        <button
          onClick={() => setIsProfileOpen(true)}
          className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer hover:bg-sky-600 transition"
          style={{ padding: "0.1rem" }}
        >
          <IoMdSettings size={24} />
        </button>
      </div>

      <div
        className="flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="w-[95%] sm:w-[80%] flex bg-[#F9FBFC]/90 h-[90vh] text-center rounded-2xl shadow-2xl overflow-hidden">
          <div className="sidebar-kapsayıcı md:w-fit w-12 bg-[#F9FBFC]/90">
            <Sidebar  />
          </div>
          <div className="flex-col flex flex-1  ">
            <Navbar />

            <Outlet context={{ messages, setMessages }} />

            <TextArea />
          </div>
        </div>
      </div>

      {isProfileOpen && <UserProfile onClose={() => setIsProfileOpen(false)} />}
      {openAddUser && <AddUserPage onClose={() => setOpenAddUser(false)} />}
    </>
  );
}
export default WebLayout;
