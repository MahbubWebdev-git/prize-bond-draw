import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import Gate from "../components/Gate";

const CATEGORY_ORDER = ["1st", "2nd", "3rd", "4th", "5th"];

export default function DrawDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const allowed = !!user && (user.role === "admin" || user.can_view_results);

  const [draw, setDraw] = useState(null);
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
      .get(`/draws/${id}`)
      .then(({ data }) => {
        if (!ignore) setDraw(data);
      })
      .catch((err) => {
        if (!ignore) setError(err?.response?.data?.message || "Draw not found.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, allowed]);

  const sortedNumbers = draw
    ? [...draw.winning_numbers].sort(
        (a, b) => CATEGORY_ORDER.indexOf(a.prize_category) - CATEGORY_ORDER.indexOf(b.prize_category)
      )
    : [];

  return (
    <main>
      <header className="site-header">
        <h1>Draw Details</h1>
      </header>

      <Gate>
        {loading && <p>Loading...</p>}
        {error && <p className="form-error">{error}</p>}

        {draw && (
          <>
            <p><Link to="/draws">← Back to archive</Link></p>
            <div className="result-card">
              <h3>
                Draw #{draw.draw_number} — {draw.draw_date} (Bond price: {draw.bond_price} Tk.)
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Prize Category</th>
                    <th>Winning Number</th>
                    <th>Amount (Tk.)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNumbers.map((w) => (
                    <tr key={w.id}>
                      <td>{w.prize_category}</td>
                      <td>{w.number}</td>
                      <td>{Number(w.prize_amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Gate>
    </main>
  );
}
