import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useStore } from "../../../stores/store";
import { socket } from "../../../AppProvider";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userChats, setUserChats } = useStore();

  const myid = user?.user.id;
  const [searchUser, setSearchUser] = useState("");
  console.log(user);
  const filteredChats = Array.isArray(userChats)
    ? userChats.filter((chat) => {
        const otherUser = chat.participants.find((p) => p._id !== myid);

        if (!otherUser) {
          return false;
        }

        if (!searchUser.trim()) {
          return true;
        }

        return otherUser.username
          .toLowerCase()
          .includes(searchUser.toLowerCase());
      })
    : [];

  useEffect(() => {
    const handleLastMessageUpdate = ({
      chatId,
      lastMessage, // Bu artık tam bir mesaj nesnesi
    }: {
      chatId: string;
      lastMessage: { _id: string; message: string /* diğer alanlar */ };
    }) => {
      const updatedChats = userChats.map((chat) =>
        // lastMessage'ın kendisini ata
        chat._id === chatId ? { ...chat, lastMessage: lastMessage } : chat
      );

      setUserChats(updatedChats);
    };

    socket.on("lastMessageUpdate", handleLastMessageUpdate);

    return () => {
      socket.off("lastMessageUpdate", handleLastMessageUpdate);
    };
  }, [userChats, setUserChats]);

  return (
    <>
      <div className="md:hidden  flex items-center justify-center h-16">
        <GiHamburgerMenu
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="cursor-pointer hover:opacity-70 text-2xl"
        />
      </div>

      <div
        className={`sidebar w-52 lg:w-60 bg-[#F9FBFC] h-full absolute top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out 
 
 md:static md:translate-x-0  
 
 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col items-center">
          {/* Search bar */}
          <div
            className="search-input rounded-lg w-[80%] flex items-center bg-[#DBDCFE] select-none"
            style={{ marginTop: "2rem" }}
          >
            <CiSearch size={24} style={{ marginLeft: "0.5rem" }} />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              name="input"
              id="searchbar"
              placeholder="search"
              className="h-10 w-full bg-transparent rounded-lg outline-none placeholder:text-gray-600"
            />
          </div>

          <div
            className="chats flex flex-col w-[80%]"
            style={{ marginTop: "1rem" }}
          >
            {filteredChats.map((chat) => {
              const otherUser = chat.participants.find((p) => p._id !== myid);
              console.log("last message :  ", chat.lastMessage?.message);
              return (
                <Link to={`/chats/${chat._id}`} key={chat._id}>
                  <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="single-chat flex h-20 select-none bg-[#F9FBFD] rounded-2xl hover:bg-[#EEEFFA] hover:cursor-pointer"
                  >
                    <div
                      className="flex items-center w-[90%] gap-2"
                      style={{ margin: "auto" }}
                    >
                      <img
                        src={
                          otherUser?.profilePhoto
                            ? `http://localhost:3000${otherUser.profilePhoto}`
                            : "/default.png"
                        }
                        alt="Profile"
                        className="w-[40px] h-[40px] object-cover rounded-sm"
                      />

                      <div className="flex flex-col w-full items-baseline">
                        <div className="flex w-full justify-between">
                          <span className="font-medium text-sm">
                            {otherUser?.username}
                          </span>
                        </div>

                        <span className="text-sm text-left line-clamp-1   text-[#A19CD3]">
                          {chat.lastMessage?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed top-0 left-0 w-full h-full bg-black opacity-50"
        ></div>
      )}
    </>
  );
}
export default Sidebar;
