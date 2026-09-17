import { useState } from "react";
import api from "../api/client";

export default function DrawImportForm() {
  const [form, setForm] = useState({ draw_number: "", draw_date: "", bond_price: "100", default_prize_category: "5th", default_prize_amount: 2000 });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!file) {
      setMsg("Please choose a CSV or Excel file first.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("draw_number", form.draw_number);
      fd.append("draw_date", form.draw_date);
      fd.append("bond_price", form.bond_price || "100");
      fd.append("default_prize_category", form.default_prize_category || "5th");
      fd.append("default_prize_amount", form.default_prize_amount ?? 0);
      fd.append("file", file);
      const { data } = await api.post("/admin/draws/import", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(`${data.message} (${data.imported} number(s)).`);
      setForm({ draw_number: "", draw_date: "", bond_price: "100", default_prize_category: "5th", default_prize_amount: 2000 });
      setFile(null);
    } catch (err) {
      const m = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err?.response?.data?.message || "Import failed.";
      setMsg(m);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="result-card">
      <h3 className="text-base sm:text-lg font-bold">Bulk upload — CSV/XLS for a new draw</h3>
      <p className="hint">File first column = number, optional 2nd = category, 3rd = amount.</p>
      <form className="auth-form" style={{ boxShadow: "none", padding: 0, marginTop: "12px" }} onSubmit={handleSubmit}>
        <div className="search-row">
          <input placeholder="Draw number" required value={form.draw_number} onChange={(e) => setForm({ ...form, draw_number: e.target.value })} />
          <input type="date" required value={form.draw_date} onChange={(e) => setForm({ ...form, draw_date: e.target.value })} />
        </div>
        <div className="search-row" style={{ marginTop: "10px" }}>
          <input placeholder="Bond price" value={form.bond_price} onChange={(e) => setForm({ ...form, bond_price: e.target.value })} />
          <input placeholder="Default category" value={form.default_prize_category} onChange={(e) => setForm({ ...form, default_prize_category: e.target.value })} />
          <input type="number" placeholder="Default amount" value={form.default_prize_amount} onChange={(e) => setForm({ ...form, default_prize_amount: e.target.value })} />
        </div>
        <input type="file" accept=".csv,.xlsx,.xls" style={{ marginTop: "10px" }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit" disabled={saving} style={{ marginTop: "10px", padding: "12px", border: "none", borderRadius: "8px", background: "#d97706", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          {saving ? "Importing..." : "Import CSV/XLS"}
        </button>
      </form>
      {msg && <p className="hint" style={{ marginTop: "8px" }}>{msg}</p>}
    </div>
  );
}
