import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </main>
  );
}
