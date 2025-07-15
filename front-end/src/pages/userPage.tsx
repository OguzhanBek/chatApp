import { useEffect, useState } from "react";

import { Camera, Eye, EyeOff, Edit3, X, Save, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import type { User } from "../types/types";
import { findUserById } from "../utils/useHelper";
import { useStore } from "../stores/store";

type UserProfileProps = {
  onClose: () => void;
};

function UserProfile({ onClose }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [personelInfo, setPersonelInfo] = useState<User>();
  const [editProfile, setEditProfile] = useState({
    avatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    name: "Kullanıcı Adı",
    email: "kullanici@email.com",
    password: "",
  });
  const { user, removeUserFromLocaleStorage } = useStore();
  const myid = user?.user.id;
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log("Kaydedilen Veri:", editProfile);
    toast.success("Profil başarıyla güncellendi!");
    setIsEditing(false);
  };
  useEffect(() => {
    const myinfo = async () => {
      const info = await findUserById(myid);
      setPersonelInfo(info);
    };

    myinfo();
  }, []);
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
            <h1 className="text-4xl font-bold">Profil</h1>
            <p className="text-purple-200">Hesap bilgilerinizi yönetin</p>
          </div>

          <div
            className="relative flex justify-center "
            style={{ marginBottom: "2rem" }}
          >
            <div className="relative group">
              <img
                src={
                  personelInfo?.profilePhoto
                    ? `http://localhost:3000${personelInfo?.profilePhoto}`
                    : "default/png"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                className="block text-white/80 text-sm font-medium "
                style={{ marginBottom: "0.5rem" }}
              >
                İsim
              </label>
              <input
                type="text"
                value={personelInfo?.username ?? ""}
                onChange={(e) =>
                  setEditProfile({ ...editProfile, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                style={{
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                }}
              />
            </div>

            <div>
              <label
                className="block text-white/80 text-sm font-medium "
                style={{ marginBottom: "0.5rem" }}
              >
                E-posta
              </label>
              <input
                type="email"
                value={personelInfo?.email ?? ""}
                onChange={(e) =>
                  setEditProfile({ ...editProfile, email: e.target.value })
                }
                disabled={!isEditing}
                className="w-full  bg-white/10 border border-white/20 rounded-2xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                style={{
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                }}
              />
            </div>

            {isEditing && (
              <div>
                <label
                  className="block text-white/80 text-sm font-medium "
                  style={{ marginBottom: "0.5rem" }}
                >
                  Yeni Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                    value={editProfile.password}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-2xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    style={{
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      paddingTop: "0.75rem",
                      paddingBottom: "0.75rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 " style={{ marginTop: "2rem" }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r rounded-2xl from-purple-500 to-pink-500 
             hover:from-purple-600 hover:to-pink-600 
             font-semibold flex items-center justify-center gap-2  
             transition-transform duration-300 shadow-lg"
              >
                <Edit3 size={20} />
                Düzenle
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500  rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300 shadow-lg"
                  style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
                >
                  <Save size={20} />
                  Kaydet
                </button>
              </>
            )}
          </div>

          {/* YENİ EKLENEN ÇIKIŞ YAP BUTONU */}
          <div
            className="mt-6 border-t border-white/20 pt-6"
            style={{ marginTop: "1.5rem" }}
          >
            <button
              onClick={() => removeUserFromLocaleStorage()}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-lg"
            >
              <LogOut size={20} />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
