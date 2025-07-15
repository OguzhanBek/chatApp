import { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router";

import { useStore } from "../stores/store";
import { findUserById } from "../utils/useHelper";
import { socket } from "../AppProvider";
import type { getMessages } from "../types/types";

type ContextType = {
  messages: getMessages[];
  setMessages: React.Dispatch<React.SetStateAction<getMessages[]>>;
};

function UserMessages() {
  const scrollToBottomRef = useRef<HTMLDivElement | null>(null);
  const { user, userChats } = useStore();
  const { chat_id } = useParams();
  const myid = user?.user.id;
  const { messages, setMessages } = useOutletContext<ContextType>();
  const [myProfilePhoto, setMyProfilePhoto] = useState<string>("");

  const currentChat = userChats.find((chat) => chat._id === chat_id);
  const otherUser = currentChat?.participants.find((p) => p._id !== myid);

  useEffect(() => {
    const fetchMyPhoto = async () => {
      if (myid) {
        const me = await findUserById(myid);
        if (me?.profilePhoto) {
          setMyProfilePhoto(me.profilePhoto);
        }
      }
    };
    fetchMyPhoto();
  }, [myid]);

  useEffect(() => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (newMessage) => {
      if (newMessage.chat_id === chat_id) {
        // Sadece bu sohbete ait mesajları ekle
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, chat_id]); // chat_id'yi dependency array'e eklemek önemli

  return (
    <div
      className="flex-col justify-between h-full  overflow-y-scroll"
      style={{ marginBottom: "2rem" }}
    >
      <div className="flex-1 ">
        {messages.map((message) => (
          <div key={message._id} className="w-[95%]" style={{ margin: "auto" }}>
            {message.sender_id !== myid ? (
              // Diğer kişinin mesajı
              <div
                className={`flex max-w-[500px] gap-2`}
                style={{ marginTop: "1rem" }}
              >
                <img
                  src={
                    otherUser?.profilePhoto
                      ? `http://localhost:3000${otherUser.profilePhoto}`
                      : "/default.png"
                  }
                  alt=""
                  className="w-[40px] select-none h-[40px] object-cover rounded-sm self-end"
                />

                <div
                  className="messagebox  break-all bg-[#EEEFFA] rounded-2xl text-left"
                  style={{
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <p>{message.message}</p>
                </div>
              </div>
            ) : (
              // Benim mesajım
              <div
                className="me flex max-w-[700px] gap-2 flex-row-reverse"
                style={{ marginTop: "1rem", marginLeft: "auto" }}
              >
                <img
                  src={
                    myProfilePhoto
                      ? `http://localhost:3000${myProfilePhoto}`
                      : "/default.png"
                  }
                  alt=""
                  className="w-[40px] h-[40px] object-cover select-none rounded-sm self-end"
                />

                <div
                  className="messagebox  break-all bg-[#EEEFFA] rounded-2xl text-left"
                  style={{
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <p>{message.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={scrollToBottomRef} />
      </div>
    </div>
  );
}

export default UserMessages;
