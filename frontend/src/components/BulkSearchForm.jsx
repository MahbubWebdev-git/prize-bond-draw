import { useState, useRef } from "react";

export default function BulkSearchForm({ onUpload, loading }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];

    if (!file) {
      setError("Please choose a CSV or Excel file first.");
      return;
    }

    const okExt = /\.(csv|xlsx|xls)$/i.test(file.name);
    if (!okExt) {
      setError("Only .csv, .xlsx, or .xls files are allowed.");
      return;
    }

    setError("");
    onUpload(file);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="bulk-file">Upload CSV / Excel (numbers in first column)</label>
      <div className="search-row">
        <input
          id="bulk-file"
          type="file"
          accept=".csv,.xlsx,.xls"
          ref={inputRef}
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check Numbers"}
        </button>
      </div>
      {fileName && <p className="hint">Selected: {fileName}</p>}
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
