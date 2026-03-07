import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, signInWithGoogle, signOutUser } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import BookSearch from "./BookSearch";
import BookDetail from "./BookDetail";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <div style={{ maxWidth: "680px", margin: "100px auto", padding: "0 24px", fontFamily: "Noto Serif JP, serif", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "16px" }}>読書離脱率記録</h1>
        <p style={{ color: "#888", marginBottom: "32px" }}>ログインして読書記録をはじめよう</p>
        <button
          onClick={signInWithGoogle}
          style={{
            padding: "12px 32px",
            background: "#2c2c2c",
            color: "#fff",
            border: "none",
            borderRadius: "2px",
            fontSize: "1rem",
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          Googleでログイン
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "0.85rem", color: "#888", marginRight: "12px" }}>{user.displayName}</span>
        <button
          onClick={signOutUser}
          style={{
            padding: "4px 12px",
            background: "transparent",
            border: "1px solid #ccc",
            borderRadius: "2px",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          ログアウト
        </button>
      </div>
      <Routes>
        <Route path="/" element={<BookSearch user={user} />} />
        <Route path="/book/:bookId" element={<BookDetail user={user} />} />
      </Routes>
    </div>
  );
}

export default App;