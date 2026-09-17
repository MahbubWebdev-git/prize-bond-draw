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
  const [menuOpen, setMenuOpen] = useState(false);

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
    <main className="w-full min-h-screen bg-slate-50 overflow-x-clip">
      {/* Disclaimer Banner */}
      <div className="bg-amber-100 text-amber-900 text-center px-3 py-2.5 text-xs sm:text-[13px] font-semibold border-b border-amber-200 leading-relaxed">
        ⚠️ <strong>Portfolio Demo Project:</strong> Built by{" "}
        <strong>Mahbub Webdev</strong> using sample draw data for demonstration purposes.
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="no-underline text-slate-900 text-lg sm:text-xl font-bold whitespace-nowrap">
            <i className="fa-solid fa-trophy" style={{ color: "#d97706", marginRight: "8px" }}></i>
            <span>PrizeBond</span><span style={{ color: "#d97706" }}>Check</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            <a href="#features" className="no-underline text-slate-600 font-medium text-sm">Features</a>
            <a href="#how-it-works" className="no-underline text-slate-600 font-medium text-sm">How It Works</a>
            <Link to="/draws" className="no-underline text-slate-600 font-medium text-sm">Draw Archive</Link>
            <Link to="/login" className="px-4 py-2 border border-slate-300 rounded-md no-underline text-slate-700 text-sm font-medium">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-amber-600 text-white rounded-md no-underline text-sm font-medium">Get Started</Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-slate-200 rounded-lg bg-white text-lg"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden border-t border-slate-100 px-4 py-3 flex flex-col gap-1 bg-white">
            <a href="#features" onClick={() => setMenuOpen(false)} className="no-underline text-slate-700 font-medium px-3 py-2.5 rounded-lg">Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="no-underline text-slate-700 font-medium px-3 py-2.5 rounded-lg">How It Works</a>
            <Link to="/draws" onClick={() => setMenuOpen(false)} className="no-underline text-slate-700 font-medium px-3 py-2.5 rounded-lg">Draw Archive</Link>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 border border-slate-300 rounded-md no-underline text-slate-700 text-sm font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 bg-amber-600 text-white rounded-md no-underline text-sm font-medium">Get Started</Link>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="px-4 py-10 sm:px-5 sm:py-14 md:py-16 bg-gradient-to-b from-sky-50 to-sky-100 border-b border-slate-300">
        <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-10 items-center">
          {/* Left Side: SVG Vector Art 1 (Trophy & Gift) */}
          <div className="hidden sm:flex justify-center order-2 md:order-1 w-full">
            <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 sm:w-52 sm:h-44 md:w-56 md:h-44 mx-auto">
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
          <div className="text-center order-1 md:order-2 w-full">
            <span className="inline-block bg-blue-100 text-blue-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
              Full-Stack Showcase Project
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] leading-tight sm:leading-[1.25] m-0 mb-4 text-slate-900 font-extrabold">
              Check Your Prize Bond <br />
              <span style={{ color: "#d97706" }}>In Seconds</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed my-0 mx-auto max-w-md">
              Secure, fast, and automated prize bond matching system. Upload
              your CSV/Excel files or search single numbers instantly with
              protected API security.
            </p>
          </div>

          {/* Right Side: SVG Vector Art 2 (Ticket & Lottery Balls) */}
          <div className="hidden sm:flex justify-center order-3 w-full">
            <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 sm:w-52 sm:h-44 md:w-56 md:h-44 mx-auto">
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
      <section className="my-6 sm:my-10 mx-auto max-w-3xl px-4 w-full">
        <Gate>
          <SearchForm onSearch={handleSearch} loading={loading} />
          {errorMsg && <p className="form-error">{errorMsg}</p>}
          <ResultCard result={result} />
        </Gate>
      </section>
    </main>
  );
}