import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import SearchForm from "../components/SearchForm";
import ResultCard from "../components/ResultCard";
import BulkSearchForm from "../components/BulkSearchForm";
import BulkResultsTable from "../components/BulkResultsTable";
import Gate from "../components/Gate";

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("single");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [bulkResult, setBulkResult] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");

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
    <main>
      <header className="site-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome, {user?.name}</p>
      </header>

      <Gate>
        <div className="tabs">
          <button
            className={tab === "single" ? "tab active" : "tab"}
            onClick={() => setTab("single")}
          >
            Single Search
          </button>
          <button
            className={tab === "bulk" ? "tab active" : "tab"}
            onClick={() => setTab("bulk")}
          >
            Bulk Upload
          </button>
        </div>

        {tab === "single" ? (
          <>
            <SearchForm onSearch={handleSearch} loading={loading} />
            {errorMsg && <p className="form-error">{errorMsg}</p>}
            <ResultCard result={result} />
          </>
        ) : (
          <>
            <BulkSearchForm onUpload={handleBulkUpload} loading={bulkLoading} />
            {bulkError && <p className="form-error">{bulkError}</p>}
            <BulkResultsTable data={bulkResult} />
          </>
        )}
      </Gate>
    </main>
  );
}
