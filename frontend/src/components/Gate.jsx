import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Gate({ children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="result-card no-win">
        <p>Please login first to view draw results.</p>
        <p><Link className="link-btn" to="/login">Go to Login →</Link></p>
      </div>
    );
  }

  const allowed = user.role === "admin" || user.can_view_results;

  if (!allowed) {
    return (
      <div className="result-card no-win">
        <p>Your account is awaiting admin approval to view draw results.</p>
      </div>
    );
  }

  return children;
}
