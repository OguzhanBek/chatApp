import { useState } from "react";

import { toast } from "react-toastify";
import type { signupInfo, userinfo } from "../types/types";
import { uploadProfilePhoto } from "../utils/helper";

import { useStore } from "../stores/store";

function LoginPage() {
  const { setUserToLocaleStorage } = useStore();

  const [selectedLogin, setSelectedLogin] = useState("login");
  const [formData, setFormData] = useState<signupInfo>({
    email: "",
    username: "",
    password: "",
    profilePhoto: "", // Sadece signup için
  });

  const [photoShowToUser, setPhotoShowToUser] = useState<string | undefined>(
    undefined
  );
  const [photoToUploadsEndPoint, setPhotoToUploadsEndPoint] = useState<
    File | undefined
  >(undefined);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; //burda iki değeri birden aldım. e.target.value gibi kalsik işlem yapamdım dimanik veri alımı için name'i de aldım.
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      return newFormData;
    });
  };
  const handleVisiblePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setPhotoShowToUser(photoUrl);
      setFormData((prev) => ({
        ...prev,
        profilePhoto: photoUrl,
      }));
    }
  };
  const handleUploadsEndPoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoToUploadsEndPoint(e.target.files?.[0]);
  };
  const handleSignUpAndLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData);

    if (selectedLogin === "login") {
      try {
        const loginData = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        };

        console.log("Sending login data:", loginData); // Debug için

        const res = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Giriş işlemi başarısız");
        }
        toast.success("Giriş Başarılı");
        console.log("Giriş başarılı:", data);
        // localStorage'a kaydetme işlemi buraya
        setUserToLocaleStorage(data);
      } catch (error: any) {
        console.error("Login error:", error);
        toast.error(error.message);
      }
    } else if (selectedLogin === "sign up") {
      try {
        const signupData = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          profilePhoto: formData.profilePhoto,
        };

        // Use the correct endpoint
        const res = await fetch("http://localhost:3000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Kayıt işlemi başarısız");
        }
        const userResponse: userinfo = {
          user: { id: data.user.id, token: data.token },
        };
        console.log("data : ", data);
        console.log("data.user_id : " , data.user.id);
        console.log("userresponse user id : " , userResponse.user.id);
        toast.success("Kayıt başarıyla tamamlandı!");

        try {
          await uploadProfilePhoto(
            userResponse.user.id,
            photoToUploadsEndPoint
          );
        } catch (uploadErr: any) {
          console.error("Fotoğraf yükleme hatası:", uploadErr);
          toast.warning("Kayıt başarılı ama fotoğraf yüklenemedi.");
        }
        setSelectedLogin("login");
      } catch (error: any) {
        console.error("Signup error:", error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        background:
          "linear-gradient(180deg, rgba(155, 42, 76, 1) 0%, rgba(184, 87, 199, 1) 37%, rgba(237, 83, 83, 1) 100%)",
      }}
    >
      <div className="bg-[#FFFFFF] sm:w-100 flex sm:h-140 h-120 rounded-3xl w-80">
        <div
          className="w-[65%] h-full flex flex-col gap-6 items-center"
          style={{ margin: "auto", marginTop: "3rem" }}
        >
          <div className="flex bg-amber-400" style={{ marginBottom: "2rem" }}>
            <h1
              onClick={() => setSelectedLogin("login")}
              className={`text-xl select-none sm:text-2xl transition-all duration-300 hover:opacity-80 font-bold cursor-pointer ${
                selectedLogin === "login"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{ padding: "1rem" }}
            >
              Login
            </h1>
            <h1
              onClick={() => setSelectedLogin("sign up")}
              className={`text-xl select-none sm:text-2xl transition-all duration-300 hover:opacity-80 font-bold cursor-pointer ${
                selectedLogin === "sign up"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{ padding: "1rem" }}
            >
              Sign Up
            </h1>
          </div>
          {/* Form kısmı burası */}
          <form
            onSubmit={handleSignUpAndLogin}
            className="flex gap-6 w-[100%] flex-col"
          >
            {/* Foto yükleme yeri burası*/}
            {selectedLogin === "sign up" && (
              <div className="flex items-center justify-center gap-4 w-full">
                <label
                  htmlFor="avatar"
                  className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300"
                  style={{
                    paddingTop: "0.5rem ",
                    paddingBottom: "0.5rem ",
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                  }}
                >
                  Fotoğraf Seç
                </label>

                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    handleVisiblePhotoChange(e);
                    handleUploadsEndPoint(e);
                  }}
                />

                {photoShowToUser && (
                  <img
                    src={photoShowToUser}
                    alt="Profile photo"
                    className="h-20 w-20 rounded-full object-cover border-2 border-indigo-200"
                  />
                )}
              </div>
            )}

            <input
              type="email"
              value={formData.email}
              name="email"
              id="email"
              className="w-full bg-[#E5E5E5] outline-none text-black placeholder-[#7D7D7D]"
              style={{
                padding: "0.5rem",
                fontFamily: "'Roboto', sans-serif",
              }}
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              value={formData.username}
              name="username"
              id="username"
              className="w-full bg-[#E5E5E5] outline-none text-black placeholder-[#7D7D7D]"
              style={{
                padding: "0.5rem",
                fontFamily: "'Roboto', sans-serif",
              }}
              placeholder="kullanıcı adı"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              value={formData.password}
              name="password"
              id="password"
              className="w-full bg-[#E5E5E5] outline-none text-black placeholder-[#7D7D7D]"
              style={{
                padding: "0.5rem",
                fontFamily: "'Roboto', sans-serif",
              }}
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="bg-[#D4408C] text-white text-lg cursor-pointer outline-none hover:opacity-70 w-full"
              style={{
                padding: "0.7rem",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {selectedLogin === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
