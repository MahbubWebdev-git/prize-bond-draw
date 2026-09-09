import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Lottery Draw</Link>
      <div className="nav-links">
        <Link to="/">Public Search</Link>
        <Link to="/draws">Draw Archive</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="link-button">
              Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
