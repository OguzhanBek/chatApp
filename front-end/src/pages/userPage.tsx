import { useEffect, useState } from "react";
import {
  Camera,
  Eye,
  EyeOff,
  Edit3,
  X,
  Save,
  LogOut,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import type { User } from "../types/types";
import { findUserById, updateUserProfileApi } from "../utils/useHelper";
import { useStore } from "../stores/store";

type UserProfileProps = {
  onClose: () => void;
};

function UserProfile({ onClose }: UserProfileProps) {
  const { user, removeUserFromLocaleStorage } = useStore();
  const myid = user?.user.id;


  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [personelInfo, setPersonelInfo] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  // Düzenleme için state'ler
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- FONKSİYONLAR ---
  useEffect(() => {
    if (!myid) return;
    const myinfo = async () => {
      setIsLoading(true);
      try {
        const info = await findUserById(myid);
        if (info) {
          setPersonelInfo(info);
          setFormData({
            username: info.username,
            email: info.email,
            password: "",
          });
        }
      } catch (error) {
        toast.error("Kullanıcı bilgileri getirilemedi.");
      } finally {
        setIsLoading(false);
      }
    };
    myinfo();
  }, [myid]);

  const handleEditClick = () => {
    if (personelInfo) {
      setFormData({
        username: personelInfo.username,
        email: personelInfo.email,
        password: "",
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfilePhotoFile(null);
    setImagePreview(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!myid) return;
    setIsLoading(true);
    try {
      const result = await updateUserProfileApi(myid, {
        ...formData,
        profilePhotoFile,
      });
      if (result.user) {
        setPersonelInfo((prev) => ({ ...prev!, ...result.user }));
      }
      toast.success(result.message || "Profil başarıyla güncellendi!");
      setIsEditing(false);
      setProfilePhotoFile(null);
      setImagePreview(null);
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
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
          <X size={28} />
        </button>

        <div style={{ padding: "2rem" }}>
          <div className="text-center" style={{ marginBottom: "2rem" }}>
            <h1 className="text-4xl font-bold">Profil</h1>
            <p className="text-purple-200">Hesap bilgilerinizi yönetin</p>
          </div>

          <div
            className="relative flex justify-center"
            style={{ marginBottom: "2rem" }}
          >
            <div className="relative group">
              <img
                src={
                  imagePreview ||
                  (personelInfo?.profilePhoto
                    ? `http://localhost:3000${personelInfo.profilePhoto}`
                    : "/default.png")
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl"
              />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-container">
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                className="block text-white/80 text-sm font-medium"
                style={{ marginBottom: "0.5rem" }}
              >
                İsim
              </label>
              <input
                type="text"
                name="username"
                value={
                  isEditing ? formData.username : personelInfo?.username ?? ""
                }
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className="w-full bg-white/10 border border-white/20 rounded-2xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                style={{ padding: "0.75rem 1rem" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                className="block text-white/80 text-sm font-medium"
                style={{ marginBottom: "0.5rem" }}
              >
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={isEditing ? formData.email : personelInfo?.email ?? ""}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className="w-full bg-white/10 border border-white/20 rounded-2xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                style={{ padding: "0.75rem 1rem" }}
              />
            </div>

            {isEditing && (
              <div>
                <label
                  className="block text-white/80 text-sm font-medium"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Yeni Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    style={{ padding: "0.75rem 3rem 0.75rem 1rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex" style={{ gap: "1rem", marginTop: "2rem" }}>
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold flex items-center justify-center transition hover:opacity-90 shadow-lg"
                style={{
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  gap: "0.5rem",
                }}
              >
                <Edit3 size={20} /> Düzenle
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl font-semibold flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
                  style={{
                    paddingTop: "0.75rem",
                    paddingBottom: "0.75rem",
                    gap: "0.5rem",
                  }}
                >
                  <X size={20} /> İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl font-semibold flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:scale-100"
                  style={{
                    paddingTop: "0.75rem",
                    paddingBottom: "0.75rem",
                    gap: "0.5rem",
                  }}
                >
                  {isLoading ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  Kaydet
                </button>
              </>
            )}
          </div>

          <div
            className="border-t border-white/20"
            style={{ marginTop: "1.5rem", paddingTop: "1.5rem" }}
          >
            <button
              onClick={removeUserFromLocaleStorage}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl font-semibold flex items-center justify-center hover:opacity-90 transition shadow-lg"
              style={{
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                gap: "0.5rem",
              }}
            >
              <LogOut size={20} /> Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;