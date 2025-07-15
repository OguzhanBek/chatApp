import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { findUserByName, startChat } from "../utils/useHelper";
import type { User } from "../types/types";
import { useStore } from "../stores/store";

type UserProfileProps = {
  onClose: () => void;
};

function AddUserPage({ onClose }: UserProfileProps) {
  const { userChats, user } = useStore();
  const [adduser, setAdduser] = useState("");
  const [foundUser, setFoundUser] = useState<User>();
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const myid = user?.user.id;

  const handleAddUser = async () => {
    if (!foundUser || !user?.user.token || !myid) return;

    setIsAdding(true);
    try {
      await startChat(foundUser._id, user.user.token, userChats, myid);
      setFoundUser(undefined);
      setAdduser("");
    } catch (error) {
    } finally {
      setIsAdding(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const user = await findUserByName(adduser);
      setFoundUser(user);
      if (!user) {
        toast.error("Kullanıcı bulunamadı");
      }
    } catch (error) {
      toast.error("Kullanıcı aranırken bir hata oluştu");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 "
      style={{ padding: "1rem" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl shadow-2xl border border-white/20 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        >
          <X size={28} className="cursor-pointer" />
        </button>

        <div style={{ padding: "2rem" }}>
          <div className="text-center " style={{ marginBottom: "2rem" }}>
            <h1 className="text-4xl font-bold">Kullanıcı ekleme</h1>
            <p className="text-purple-200">
              Kullanıcı ekelmek için kullanıcı ismi giriniz.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={adduser}
                onChange={(e) => setAdduser(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                style={{
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                }}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !adduser.trim()}
                className="bg-white/10 border border-white/20 rounded-2xl cursor-pointer hover:bg-white/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Aranıyor..." : "Kullanıcı ara"}
              </button>
            </div>

            {isSearching && (
              <div className="text-center py-4 text-purple-200">
                Kullanıcı aranıyor...
              </div>
            )}

            {foundUser && !isSearching && (
              <div
                className=" bg-white/10 rounded-2xl border border-white/20 animate-fade-in"
                style={{ marginTop: "1rem", padding: "1rem" }}
              >
                <div className="flex items-center gap-4">
                  {foundUser.profilePhoto && (
                    <img
                      src={`http://localhost:3000${foundUser.profilePhoto}`}
                      alt={foundUser.username}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{foundUser.username}</h3>
                    <p className="text-purple-200 text-sm">{foundUser.email}</p>
                  </div>
                </div>
                <div className=" flex flex-end" style={{ marginTop: "1rem" }}>
                  <button
                    onClick={handleAddUser}
                    disabled={isAdding}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    {isAdding ? "Ekleniyor..." : "Ekle"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddUserPage;
