// src/main.jsx

import React, { StrictMode } from "react"; // <-- Tambahkan 'React' di sini
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from './utils/context/AuthContext.jsx'; 

// Path ini
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
