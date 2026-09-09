import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <footer className="site-footer">
            <p>Sample lottery draw result inquiry project.</p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
