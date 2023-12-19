import { Button, Card, Input, Link } from "@nextui-org/react";
import { FirebaseError, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appStore } from "../../AppStore";

const app = initializeApp(appStore.config);
export const storage = getStorage(app);
const Profile: React.FC = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    if (appStore.currentUserEmail) {
      navigate("/");
    }
  }, [appStore.currentUserEmail, navigate]);
  const [selected, setSelected] = useState("login");
  const [activeTab, setActiveTab] = useState("login");
  const auth = getAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleLogin = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert("登入成功!");
          console.log("登入成功：", user);
        })
        .catch((error) => {
          alert("登入失敗!");
          console.error("登入失敗：", error);
        });
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImageFile = e.target.files[0];
      setImageUpload(newImageFile);
      const imageUrl = URL.createObjectURL(newImageFile);
      setCurrentImageUrl(imageUrl);
    } else {
      setImageUpload(null);
      setCurrentImageUrl("");
    }
  };
  const handleRegister = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (imageUpload) {
        await appStore.addUser(user.uid, email, name, imageUpload);
      } else {
        await appStore.addUser(user.uid, email, name, new File([], ""));
      }
      alert("註冊成功!");
      console.log("註冊成功：", user);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/email-already-in-use") {
        alert("該電子郵件地址已被使用!");
      } else {
        alert("註冊失敗!");
      }
      console.error("註冊失敗：", firebaseError);
    }
  };
  const handleTabChange = (tabKey: any) => {
    setActiveTab(tabKey);
  };
  return (
    <div className="flex h-[100vh] pt-20">
      <div className=" w-1/3">
        <img src="/profile.jpg" className="h-full w-full object-cover " />
      </div>
      <div className="flex w-2/3 items-center justify-center bg-white">
        <div>
          <Card className="w-[400px]">
            <div className="mb-6 rounded-lg p-4">
              <div className="mb-6 flex  justify-center">
                <button
                  className={`mt-4 px-2 py-2 ${
                    activeTab === "login"
                      ? "tab-border-left h-auto w-1/2 bg-yellow text-white"
                      : "tab-border-left w-1/2 border-1 border-yellow"
                  }`}
                  onClick={() => handleTabChange("login")}
                >
                  <p className="leading-none">登入</p>
                </button>
                <button
                  className={`mt-4 px-2 py-2 ${
                    activeTab === "signup"
                      ? "tab-border-right h-auto w-1/2 bg-yellow  text-white"
                      : "tab-border-right w-1/2 border-1 border-yellow"
                  }`}
                  onClick={() => handleTabChange("signup")}
                >
                  <p className="leading-none">註冊</p>
                </button>
              </div>

              {activeTab === "login" && (
                <form className="flex flex-col gap-4 ">
                  <Input
                    type="email"
                    label="帳號"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <Input
                    type="password"
                    label="密碼"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <p className="text-center text-small">
                    尚未創建帳號?
                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                      <p className="cursor-pointer text-green">註冊</p>
                    </Link>
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      fullWidth
                      className="bg-green"
                      onClick={handleLogin}
                    >
                      <p className="text-white">登入</p>
                    </Button>
                  </div>
                </form>
              )}
              {activeTab === "signup" && (
                <form className="flex flex-col gap-4 ">
                  <Input
                    type="name"
                    label="暱稱"
                    value={name}
                    onChange={handleNameChange}
                  />
                  <Input
                    type="email"
                    label="請輸入email作為帳號"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <Input
                    type="password"
                    label="請輸入6字以上密碼"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <div className="container mx-auto mt-2 flex justify-center ">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <label
                      htmlFor="file-upload"
                      className="fc-today-button cursor-pointer rounded-lg bg-brown px-4 py-2 font-bold text-white hover:bg-darkYellow"
                    >
                      選擇頭貼
                    </label>
                  </div>
                  <div
                    className={`${
                      currentImageUrl
                        ? "mx-auto my-4 flex h-28 w-28 justify-center overflow-hidden rounded-full border"
                        : ""
                    }`}
                  >
                    {currentImageUrl && (
                      <img
                        src={currentImageUrl}
                        alt="Current Activity"
                        className="mb-2 h-full w-full  object-cover"
                      />
                    )}
                  </div>
                  <p className="text-center text-small">
                    已經有帳號了嗎?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                      <p className="cursor-pointer text-green">登入</p>
                    </Link>
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      fullWidth
                      className=" bg-green"
                      onClick={() => handleRegister(email, password)}
                    >
                      <p className="text-white">註冊</p>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default Profile;
