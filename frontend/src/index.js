import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./state/AuthContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  //開発モードでのみ動作(異常を検出)
  <React.StrictMode>
    {/* 認証情報を提供（ログインuser） */}
    <AuthContextProvider>
      {/* メインコンポーネント（App.js） */}
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
