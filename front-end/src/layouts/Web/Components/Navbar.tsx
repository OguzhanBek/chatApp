import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useStore } from "../../../stores/store";

import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { socket } from "../../../AppProvider";

function Navbar() {
  const { user, userChats } = useStore();
  const { chat_id } = useParams();
  const myid = user?.user.id;
  const [onlineUserIds, setOnlineUserIds] = useState<any>("");

  const icons = [{ component: PiDotsThreeOutlineVerticalFill, key: "more" }];

  const currentChat = userChats.find((chat) => chat._id === chat_id); //tek bir kullanıcıyı buluyom sonra participants'ına bakıcam aşağıda.

  const otherUser = currentChat?.participants.find((p) => p._id !== myid); // participiants'ındaki id benim id'me eşit değilse sadece onun bilgfilierni alıyorum.
  const isOnline = onlineUserIds?.includes(otherUser?._id);
  useEffect(() => {
    socket.emit("userOnline", myid);

    socket.on("onlineUsers", (onlineIds: string[]) => {
      setOnlineUserIds(onlineIds); // State'e kaydet
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  return (
    <>
      <div className="flex-col flex flex-1 navbar bg-white navbar">
        <div
          className={`navbar flex items-center justify-between  ${
            !otherUser ? "hidden" : ""
          }`}
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
            marginLeft: "1rem",
          }}
        >
          <div className="flex flex-col">
            <div className="flex items-center">
              <img
                src={
                  otherUser?.profilePhoto
                    ? `http://localhost:3000${otherUser.profilePhoto}`
                    : "/default.png"
                }
                alt=""
                className="w-[40px] select-none h-[40px] object-cover rounded-sm"
                style={{ marginRight: "1rem" }}
              />
              <h1 className="text-start text-xl md:text-lg lg:text-2xl text-[#000000]">
                {otherUser?.username}
              </h1>
            </div>
            <div className="flex items-center">
              <span
                className="text-gray-500 text-sm lg:text-md"
                style={{ marginRight: "0.4rem", marginTop: "0.4rem" }}
              >
                {isOnline ? "🟢 online" : "🔴 offline"}
              </span>
            </div>
          </div>

          {/* Navbar sağ taraf ikonları */}
          <div
            className="flex justify-center gap-2"
            style={{ marginRight: "0.8rem" }}
          >
            {icons.map(({ component: Icon, key }) => (
              <div
                key={key}
                className="w-[28px] h-[28px] hover:bg-[#e0e0e6] flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
