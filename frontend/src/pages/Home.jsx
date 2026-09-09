import { useState } from "react";
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
      setErrorMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <h1>Lottery Draw Result Inquiry</h1>
        <p className="subtitle">Draw Result Search</p>
      </header>

      <Gate>
        <SearchForm onSearch={handleSearch} loading={loading} />
        {errorMsg && <p className="form-error">{errorMsg}</p>}
        <ResultCard result={result} />
      </Gate>
    </main>
  );
}
