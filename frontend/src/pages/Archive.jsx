import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import Gate from "../components/Gate";

export default function Archive() {
  const { user } = useAuth();
  const allowed = !!user && (user.role === "admin" || user.can_view_results);

  const [page, setPage] = useState(1);
  const [draws, setDraws] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!allowed) {
      setLoading(false);
      return;
    }
    let ignore = false;
    setLoading(true);
    setError("");

    api
      .get("/draws", { params: { page } })
      .then(({ data }) => {
        if (ignore) return;
        setDraws(data.data);
        setMeta(data);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err?.response?.data?.message || "Failed to load draws.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, allowed]);

  return (
    <main>
      <header className="site-header">
        <h1>Draw Results Archive</h1>
        <p className="subtitle">All past lottery / prize bond draws</p>
      </header>

      <Gate>
        {error && <p className="form-error">{error}</p>}
        {loading && <p>Loading...</p>}
        {!loading && draws.length === 0 && !error && <p>No draws found.</p>}

        {!loading && draws.length > 0 && (
          <div className="result-card">
            <table>
              <thead>
                <tr>
                  <th>Draw No.</th>
                  <th>Draw Date</th>
                  <th>Bond Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {draws.map((d) => (
                  <tr key={d.id}>
                    <td>{d.draw_number}</td>
                    <td>{d.draw_date}</td>
                    <td>{d.bond_price}</td>
                    <td>
                      <Link to={`/draws/${d.id}`}>View results →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="pagination">
            <button disabled={!meta.prev_page_url} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <span>
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button disabled={!meta.next_page_url} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        )}
      </Gate>
    </main>
  );
}
