import { useEffect, useRef } from "react";
import { IoMdAttach } from "react-icons/io";
import { BsSend } from "react-icons/bs";
import { useStore } from "../../../stores/store";
import { sendMessage } from "../../../utils/useHelper";
import type { sendMessages } from "../../../types/types";
import { useParams } from "react-router";
import { socket } from "../../../AppProvider";

function ChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { user, textAreaMessage, setTextAreaMessage } = useStore();
  const myid = user?.user.id;
  const { chat_id } = useParams();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaMessage(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `  ${newHeight}px`;
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (textAreaMessage.trim()) {
      const newMessage: sendMessages = {
        _id: "",
        sender_id: myid,
        chat_id: chat_id,
        message: textAreaMessage,
        seen: false,
        timestamp: Date.now(),
      };

      sendMessage(newMessage);
      // socket.emit("join_chat", chat_id);
      socket.emit("new_message", newMessage);

      setTextAreaMessage("");

      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
      }
    }
  };
  useEffect(() => {
    socket.emit("join_chat", chat_id);
    console.log("join chat : ", chat_id);
    return () => {
      socket.off("join_chat");
    };
  }, [chat_id]);

  return (
    <>
      <div className="flex justify-center " style={{ marginTop: "auto" }}>
        <div
          className="w-[95%] flex items-center justify-between gap-2 bg-[#EEEFFA] text-white"
          style={{ margin: "auto", marginBottom: "1rem" }}
        >
          <IoMdAttach className="cursor-pointer w-5 h-5 text-black" />
          <form
            className="w-[100%] flex items-center justify-between gap-2 bg-[#EEEFFA] text-white"
            onSubmit={handleSubmit}
          >
            <textarea
              ref={textareaRef}
              rows={textAreaMessage.length && 0}
              value={textAreaMessage}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="mesaj yazınız"
              className="flex-1 resize-none outline-none select-none text-black rounded-md bg-[#EEEFFA]"
              style={{
                height: "auto",
                padding: "8px",
                maxHeight: "120px",
              }}
            />
            <button type="submit">
              <BsSend size={18} className="cursor-pointer text-black" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatInput;
