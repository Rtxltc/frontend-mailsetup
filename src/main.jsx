import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import "./styles/variables.css";
import "./styles/animations.css";
import "./styles/globals.css";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#131722",
            color: "#fff",
            border: "1px solid rgba(255,255,255,.08)",
            backdropFilter: "blur(12px)"
          }
        }}
      />
      <App />
    </>
  </StrictMode>
);