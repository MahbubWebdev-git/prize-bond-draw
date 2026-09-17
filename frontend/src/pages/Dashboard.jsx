import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import SearchForm from "../components/SearchForm";
import ResultCard from "../components/ResultCard";
import BulkSearchForm from "../components/BulkSearchForm";
import BulkResultsTable from "../components/BulkResultsTable";
import DrawInsertForm from "../components/DrawInsertForm"; // গিট পুলে আসা নতুন কম্পোনেন্ট

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("single");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [bulkResult, setBulkResult] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");

  if (!user) {
    return (
      <main>
        <header className="site-header">
          <h1>Dashboard</h1>
        </header>
        <div className="result-card no-win">
          <p>Please login first.</p>
          <p><Link to="/login">Go to Login →</Link></p>
        </div>
      </main>
    );
  }

  const isAdmin = user.role === "admin";
  const isApproved = isAdmin || !!user.is_approved;
  const canView = isAdmin || (isApproved && user.can_view_results);
  const canImport = isAdmin;

  async function handleSearch(number) {
    setLoading(true);
    setErrorMsg("");
    setResult(null);
    try {
      const { data } = await api.post("/dashboard/search", { number });
      setResult(data);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkUpload(file) {
    setBulkLoading(true);
    setBulkError("");
    setBulkResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/dashboard/bulk-search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBulkResult(data);
    } catch (err) {
      setBulkError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <main className="w-full">
      <header className="site-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome, {user.name}</p>
      </header>

      <div className="tabs flex flex-col sm:flex-row gap-2 mb-4">
        <button className={tab === "single" ? "tab active" : "tab"} onClick={() => setTab("single")}>
          Single Search
        </button>
        {canImport && (
          <>
            <button className={tab === "bulk" ? "tab active" : "tab"} onClick={() => setTab("bulk")}>
              Bulk Upload
            </button>
            <button className={tab === "insert" ? "tab active" : "tab"} onClick={() => setTab("insert")}>
              Insert New Number
            </button>
          </>
        )}
      </div>

      {!isApproved && (
        <div className="result-card no-win">
          <p>Your account is pending admin approval.</p>
        </div>
      )}

      {tab === "single" &&
        (canView ? (
          <>
            <SearchForm onSearch={handleSearch} loading={loading} />
            {errorMsg && <p className="form-error">{errorMsg}</p>}
            <ResultCard result={result} />
          </>
        ) : isApproved ? (
          <div className="result-card no-win">
            <p>Your account is awaiting admin approval to view draw results.</p>
          </div>
        ) : null)}

      {tab === "bulk" && canImport && (
        <>
          <BulkSearchForm onUpload={handleBulkUpload} loading={bulkLoading} />
          {bulkError && <p className="form-error">{bulkError}</p>}
          <BulkResultsTable data={bulkResult} />
        </>
      )}

      {tab === "insert" && canImport && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Add Winning Number Manually</h2>
          <DrawInsertForm />
        </div>
      )}
    </main>
  );
}
