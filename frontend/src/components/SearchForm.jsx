import { useState } from "react";

export default function SearchForm({ onSearch, loading }) {
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = number.trim();

    if (!trimmed) {
      setError("Please enter a prize bond number.");
      return;
    }
    if (!/^[0-9]+$/.test(trimmed)) {
      setError("Only digits are allowed.");
      return;
    }

    setError("");
    onSearch(trimmed);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="bond-number">Enter Lottery / Prize Bond Number</label>
      <div className="search-row">
        <input
          id="bond-number"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 123456"
          value={number}
          maxLength={10}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
