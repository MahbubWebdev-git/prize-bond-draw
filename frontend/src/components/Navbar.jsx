import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  function close() {
    setOpen(false);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={close}>
        🎟️ Lottery Draw
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "☰"}
      </button>

      <div className={`nav-links${open ? " open" : ""}`}>
        <Link to="/" onClick={close}>Public Search</Link>
        <Link to="/draws" onClick={close}>Draw Archive</Link>
        {user ? (
          <>
            <Link to="/dashboard" onClick={close}>Dashboard</Link>
            {user.role === "admin" && <Link to="/admin" onClick={close}>Admin</Link>}
            <button onClick={handleLogout} className="link-button">
              Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={close}>Login</Link>
            <Link to="/register" onClick={close}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
