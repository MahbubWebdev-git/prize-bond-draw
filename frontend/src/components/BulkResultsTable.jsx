export default function BulkResultsTable({ data }) {
  if (!data) return null;

  return (
    <div className="result-card">
      <h3>
        Checked {data.total_checked} number(s) — {data.total_won} won
      </h3>
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Status</th>
            <th>Draw No.</th>
            <th>Prize Category</th>
            <th>Amount (Tk.)</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((r, idx) =>
            r.won ? (
              r.results.map((win, i) => (
                <tr key={`${idx}-${i}`} className="row-win">
                  <td>{r.number}</td>
                  <td>Won 🎉</td>
                  <td>{win.draw_number}</td>
                  <td>{win.prize_category}</td>
                  <td>{Number(win.prize_amount).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr key={idx}>
                <td>{r.number}</td>
                <td>No prize</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
