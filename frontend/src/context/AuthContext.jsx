// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const getApiBaseUrl = () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8000/api";
  }
  return "https://booking.dreamwebdev.com/prizebond_draw/backend/api";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Safe Catch: কোনো কারণে JSON ফরম্যাট ভুল থাকলে অটো ক্লিয়ার করবে
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${getApiBaseUrl()}/login`, {
      email,
      password,
    });

    if (res.data && res.data.token) {
      const userObj = res.data.user || {};

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userObj));

      setToken(res.data.token);
      setUser(userObj);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};