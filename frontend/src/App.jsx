import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Archive from "./pages/Archive";
import DrawDetail from "./pages/DrawDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy"; // 1. Privacy Policy Import
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="page">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/draws" element={<Archive />} />
            <Route path="/draws/:id" element={<DrawDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 2. Privacy Policy Route */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* 3. Updated SEO & AdSense Friendly Footer */}
          <footer className="site-footer" style={{ borderTop: "1px solid #e2e8f0", padding: "20px 0", textAlign: "center", backgroundColor: "#ffffff" }}>
            <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "14px" }}>
              © 2026 PrizeBondCheck — Full-Stack Portfolio Project by <strong>Mahbub Webdev</strong>.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px", fontSize: "13px" }}>
              <Link to="/privacy-policy" style={{ color: "#d97706", textDecoration: "none", fontWeight: "500" }}>
                Privacy Policy
              </Link>
              <span style={{ color: "#cbd5e1" }}>|</span>
              <a
                href="https://github.com/MahbubWebdev-git/prize-bond-draw.git"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#64748b", textDecoration: "none" }}
              >
                GitHub Repository
              </a>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}