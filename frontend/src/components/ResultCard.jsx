export default function ResultCard({ result }) {
  if (!result) return null;

  const won = result.won === true || result.status === "win";
  const msg = result.message || (won ? "Congratulations, You Are a Win 🎉" : "No prize found for this number.");
  const rows = Array.isArray(result.results) ? result.results : [];

  if (!won) {
    return (
      <div className="result-card no-win">
        <h3>Number: {result.number}</h3>
        <p>{msg}</p>
      </div>
    );
  }

  return (
    <div className="result-card win">
      <h3 className="text-base sm:text-lg font-bold">Number: {result.number}</h3>
      <p className="win-message">{msg}</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Draw No.</th>
              <th>Draw Date</th>
              <th>Prize Category</th>
              <th>Amount (Tk.)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td>{r.draw_number}</td>
                <td>{r.draw_date}</td>
                <td>{r.prize_category}</td>
                <td>{Number(r.prize_amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
