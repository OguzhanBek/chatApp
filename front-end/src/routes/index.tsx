import { createBrowserRouter } from "react-router-dom";
import WebLayout from "../layouts/Web/WebLayout";
import LoginLayout from "../layouts/loginLayout/LoginLayout";

import Home from "../pages/Home";
import Messages from "../pages/userMessages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <WebLayout />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: "chats/:chat_id",
        element: <Messages />,
      },
      { path: "*", element: <Home /> },
    ],
  },
]);

export const loginRouter = createBrowserRouter([
  {
    path: "/", 
    element: <LoginLayout />,
  },
  {
    path: "*",
    element: <LoginLayout />,
  },
]);
