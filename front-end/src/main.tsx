import { createRoot } from "react-dom/client";
import "./index.css";
import AppProvider from "./AppProvider.tsx";

createRoot(document.getElementById("root")!).render(<AppProvider />);
