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
      // AuthContext এর মাধ্যমে লগইন সম্পন্ন করা
      await login(form.email, form.password);

      // Full page reload না দিয়ে React Router দিয়ে রিডাইরেক্ট করা
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message || "";
      // Pending-approval logins return 403 with that exact message.
      if (status === 403 && /pending admin approval/i.test(serverMsg)) {
        setError("Your account is pending admin approval.");
      } else {
        setError(serverMsg || "The provided credentials are incorrect.");
      }
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

        {/* ভুল পাসওয়ার্ড বা ইমেইল দিলে এই মেসেজটি আসবে */}
        {error && <p className="form-error" style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: "15px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}