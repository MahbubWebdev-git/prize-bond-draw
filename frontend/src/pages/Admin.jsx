import { useEffect, useState } from "react";
import api from "../api/client";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateUser(id, changes) {
    setSavingId(id);
    setError("");
    try {
      const { data } = await api.patch(`/admin/users/${id}`, changes);
      setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <main><p>Loading users...</p></main>;

  return (
    <main>
      <header className="site-header">
        <h1>Admin — Manage Users</h1>
        <p className="subtitle">Grant users permission to view draw results</p>
      </header>

      {error && <p className="form-error">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Can View Results</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  disabled={savingId === u.id}
                  onChange={(e) => updateUser(u.id, { role: e.target.value })}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={u.can_view_results}
                  disabled={savingId === u.id}
                  onChange={(e) => updateUser(u.id, { can_view_results: e.target.checked })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
