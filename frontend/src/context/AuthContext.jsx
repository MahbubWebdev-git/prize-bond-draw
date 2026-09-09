import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ld_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  function persist(token, user) {
    localStorage.setItem("ld_token", token);
    localStorage.setItem("ld_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post("/login", { email, password });
      persist(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password, password_confirmation) {
    setLoading(true);
    try {
      const { data } = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      persist(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch (e) {
      // ignore — clear local state regardless
    }
    localStorage.removeItem("ld_token");
    localStorage.removeItem("ld_user");
    setUser(null);
  }

  async function refreshMe() {
    try {
      const { data } = await api.get("/me");
      localStorage.setItem("ld_user", JSON.stringify(data));
      setUser(data);
    } catch (e) {
      localStorage.removeItem("ld_token");
      localStorage.removeItem("ld_user");
      setUser(null);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("ld_token")) {
      refreshMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
