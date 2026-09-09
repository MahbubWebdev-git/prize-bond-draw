import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import SearchForm from "../components/SearchForm";
import ResultCard from "../components/ResultCard";
import Gate from "../components/Gate";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSearch(number) {
    setLoading(true);
    setErrorMsg("");
    setResult(null);
    try {
      const { data } = await api.post("/search", { number });
      setResult(data);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Disclaimer Banner */}
      <div
        style={{
          background: "#fef3c7",
          color: "#92400e",
          textAlign: "center",
          padding: "10px 16px",
          fontSize: "13px",
          fontWeight: "600",
          borderBottom: "1px solid #fde68a",
        }}
      >
        ⚠️ <strong>Portfolio Demo Project:</strong> Built by{" "}
        <strong>Mahbub Webdev</strong> using sample draw data for demonstration purposes.
      </div>

      {/* Navigation Header */}
      <header className="navbar" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
        <div className="container navbar-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1140px", margin: "0 auto", padding: "0 20px" }}>
          <Link className="link-btn logo" to="/" style={{ textDecoration: "none", color: "#0f172a", fontSize: "1.25rem", fontWeight: "700" }}>
            <i className="fa-solid fa-trophy logo-icon" style={{ color: "#d97706", marginRight: "8px" }}></i>
            <span>PrizeBond</span><span style={{ color: "#d97706" }}>Check</span>
          </Link>

          <nav className="nav-links" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a href="#features" style={{ textDecoration: "none", color: "#475569", fontWeight: "500" }}>Features</a>
            <a href="#how-it-works" style={{ textDecoration: "none", color: "#475569", fontWeight: "500" }}>How It Works</a>
            <Link to="/archive" style={{ textDecoration: "none", color: "#475569", fontWeight: "500" }}>Draw Archive</Link>
            <Link to="/login" className="btn-secondary" style={{ padding: "8px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", textDecoration: "none", color: "#334155" }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: "8px 16px", backgroundColor: "#d97706", color: "#fff", borderRadius: "6px", textDecoration: "none" }}>Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "60px 20px",
          background: "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)",
          borderBottom: "1px solid #cbd5e1",
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Left Side: SVG Vector Art 1 (Trophy & Gift) */}
          <div style={{ textAlign: "center" }}>
            <svg width="220" height="180" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="40" width="160" height="100" rx="12" fill="#3B82F6" opacity="0.1" />
              <circle cx="100" cy="80" r="45" fill="#F59E0B" />
              <path d="M100 50L106 68H125L110 80L115 98L100 86L85 98L90 80L75 68H94L100 50Z" fill="#FFFFFF" />
              <circle cx="45" cy="50" r="16" fill="#10B981" />
              <text x="45" y="55" fontSize="12" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">৳</text>
              <circle cx="155" cy="110" r="18" fill="#6366F1" />
              <text x="155" y="115" fontSize="12" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">#1</text>
            </svg>
          </div>

          {/* Middle: Content Banner */}
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                background: "#dbeafe",
                color: "#1e40af",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Full-Stack Showcase Project
            </span>
            <h1
              style={{
                fontSize: "2.5rem",
                lineHeight: "1.25",
                margin: "0 0 16px 0",
                color: "#0f172a",
                fontWeight: "800",
              }}
            >
              Check Your Prize Bond <br />
              <span style={{ color: "#d97706" }}>In Seconds</span>
            </h1>
            <p
              style={{
                color: "#475569",
                fontSize: "1rem",
                lineHeight: "1.6",
                margin: "0 auto",
                maxWidth: "480px",
              }}
            >
              Secure, fast, and automated prize bond matching system. Upload
              your CSV/Excel files or search single numbers instantly with
              protected API security.
            </p>
          </div>

          {/* Right Side: SVG Vector Art 2 (Ticket & Lottery Balls) */}
          <div style={{ textAlign: "center" }}>
            <svg width="220" height="180" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="30" width="140" height="70" rx="8" fill="#10B981" />
              <line x1="70" y1="30" x2="70" y2="100" stroke="#FFFFFF" strokeDasharray="4 4" strokeWidth="2" />
              <circle cx="50" cy="65" r="10" fill="#FFFFFF" opacity="0.3" />
              <rect x="85" y="50" width="70" height="8" rx="4" fill="#FFFFFF" />
              <rect x="85" y="66" width="45" height="8" rx="4" fill="#FFFFFF" opacity="0.7" />
              <circle cx="60" cy="120" r="18" fill="#EF4444" />
              <text x="60" y="125" fontSize="12" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">77</text>
              <circle cx="100" cy="130" r="16" fill="#F59E0B" />
              <text x="100" y="134" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">09</text>
              <circle cx="138" cy="118" r="20" fill="#8B5CF6" />
              <text x="138" y="123" fontSize="12" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">99</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Search Area */}
      <section style={{ margin: "40px auto", maxWidth: "800px", padding: "0 20px" }}>
        <Gate>
          <SearchForm onSearch={handleSearch} loading={loading} />
          {errorMsg && <p className="form-error" style={{ color: "#dc2626", marginTop: "10px" }}>{errorMsg}</p>}
          <ResultCard result={result} />
        </Gate>
      </section>
    </main>
  );
}