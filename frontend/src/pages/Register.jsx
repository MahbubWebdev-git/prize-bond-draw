import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err?.response?.data?.message || "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
        <label>Confirm Password</label>
        <input
          type="password"
          required
          value={form.password_confirmation}
          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="hint">
        Registration করার পর একজন admin আপনাকে draw results দেখার permission দেবে।
      </p>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </main>
  );
}
