import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRouter, router } from "./routes";
import { useStore } from "./stores/store";
import { io } from "socket.io-client";
export const socket = io("http://localhost:3000");
function AppProvider() {
  const { user } = useStore();

  return (
    <>
      <RouterProvider
        key={user ? "authenticated" : "unauthenticated"}
        router={user ? router : loginRouter}
      />
      <ToastContainer />
    </>
  );
}
export default AppProvider;
