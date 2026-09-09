export default function ResultCard({ result }) {
  if (!result) return null;

  if (!result.won) {
    return (
      <div className="result-card no-win">
        <h3>Number: {result.number}</h3>
        <p>{result.message}</p>
      </div>
    );
  }

  return (
    <div className="result-card win">
      <h3>Number: {result.number}</h3>
      <p className="win-message">{result.message}</p>
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
          {result.results.map((r, idx) => (
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
  );
}
