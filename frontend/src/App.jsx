import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home";
import Loader from "./components/Loader.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // @ts-ignore
        setUser(authUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <main>
      {loading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login user={user} />} />
            <Route path="/login" element={<Login user={user} />} />
            <Route path="/register" element={<Register user={user} />} />
            <Route
              path="/home"
              element={<ProtectedRoute user={user} children={<Home />} />}
            />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      )}
    </main>
  );
}

export default App;
