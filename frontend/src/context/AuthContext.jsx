import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

function readStoredUser() {
  const stored = localStorage.getItem("ld_user");
  if (!stored || stored === "undefined" || stored === "null") {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    // Corrupted value from an earlier bug/session — clear it instead of crashing.
    localStorage.removeItem("ld_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  function persist(token, user) {
    if (!token || !user) {
      // Never store an undefined/empty value — that's what caused the crash.
      return;
    }
    localStorage.setItem("ld_token", token);
    localStorage.setItem("ld_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post("/login", { email, password });
      // Backend returns 403 + pending message when not approved (no token).
      if (!data?.token || !data?.user) {
        const err = new Error(data?.message || "Your account is pending admin approval.");
        err.response = { data };
        throw err;
      }
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
      // New users are NOT auto-logged in anymore — they need admin approval.
      // Do NOT persist anything; return the pending message for the UI.
      return data;
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
      if (data) {
        localStorage.setItem("ld_user", JSON.stringify(data));
        setUser(data);
      }
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
