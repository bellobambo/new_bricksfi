import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "16px",
          },
        }}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
