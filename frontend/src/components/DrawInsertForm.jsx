import { useState } from "react";
import api from "../api/client";

export default function DrawInsertForm() {
  const [form, setForm] = useState({ draw_number: "", draw_date: "", bond_price: "100" });
  const [rowsText, setRowsText] = useState("5th, 123456, 2000");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      const numbers = rowsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split(",").map((s) => s.trim());
          return {
            prize_category: parts[0] || "5th",
            number: parts[1] || "",
            prize_amount: Number(parts[2]) || 0,
          };
        });
      const { data } = await api.post("/admin/draws", { ...form, numbers });
      setMsg(`Draw #${data.draw_number} saved with ${data.winning_numbers?.length ?? numbers.length} number(s).`);
      setForm({ draw_number: "", draw_date: "", bond_price: "100" });
      setRowsText("");
    } catch (err) {
      const m = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err?.response?.data?.message || "Save failed.";
      setMsg(m);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="result-card">
      <h3 className="text-base sm:text-lg font-bold">Manually insert lottery numbers</h3>
      <p className="hint">One per line: <code>prize_category, number, prize_amount</code> — e.g. <code>1st, 123456, 600000</code></p>
      <form className="auth-form" style={{ boxShadow: "none", padding: 0, marginTop: "12px" }} onSubmit={handleSubmit}>
        <div className="search-row">
          <input placeholder="Draw number (e.g. 106)" required value={form.draw_number} onChange={(e) => setForm({ ...form, draw_number: e.target.value })} />
          <input type="date" required value={form.draw_date} onChange={(e) => setForm({ ...form, draw_date: e.target.value })} />
          <input placeholder="Bond price" value={form.bond_price} onChange={(e) => setForm({ ...form, bond_price: e.target.value })} />
        </div>
        <label style={{ marginTop: "10px" }}>Winning numbers</label>
        <textarea rows={4} style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", width: "100%" }} value={rowsText} onChange={(e) => setRowsText(e.target.value)} />
        <button type="submit" disabled={saving} style={{ marginTop: "10px", padding: "12px", border: "none", borderRadius: "8px", background: "#d97706", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          {saving ? "Saving..." : "Save draw"}
        </button>
      </form>
      {msg && <p className="hint" style={{ marginTop: "8px" }}>{msg}</p>}
    </div>
  );
}
