import { useEffect, useState } from "react";
import api from "../api/client";
import DrawInsertForm from "../components/DrawInsertForm";
import DrawImportForm from "../components/DrawImportForm";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function loadUsers(showSpinner = true) {
    if (showSpinner) setLoading(true);
    try {
      const response = await api.get("/admin/users");
      console.log("API Response (loadUsers):", response.data);
      const list = Array.isArray(response.data) ? response.data : response.data?.data ?? response.data?.users ?? [];
      setUsers(list);
      console.log("loadUsers: total =", list.length);
      return list;
    } catch (err) {
      console.error("loadUsers failed:", err?.response?.status, err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Failed to load users.");
      throw err;
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateUser(id, changes) {
    setSavingId(id);
    setError("");
    setNotice("");
    try {
      const response = await api.patch(`/admin/users/${id}`, changes);
      console.log("API Response:", response.data);
      // Backend returns the fresh user object directly (not wrapped in {user}).
      // But handle both shapes defensively.
      const updated = response.data?.user ?? response.data?.data ?? response.data;
      console.log("Parsed updated user:", updated);
      setUsers((prev) => {
        const exists = prev.some((u) => u.id === id);
        const next = exists ? prev.map((u) => (u.id === id ? updated : u)) : [...prev, updated];
        console.log("State update: users =", next.length, "updated id =", id, "is_approved =", updated?.is_approved, "role =", updated?.role);
        return next;
      });
      if ("is_approved" in changes) {
        setNotice(changes.is_approved ? "User approved — search access granted." : "User approval revoked.");
      }
      // Re-fetch from server so the User/Admin role sections always
      // reflect the exact DB values (protects against stale local state).
      try {
        await loadUsers(false);
        console.log("loadUsers() re-fetch OK after approve");
      } catch (refetchErr) {
        // loadUsers already logged + set error; keep optimistic state.
        console.error("loadUsers() re-fetch failed, keeping optimistic state:", refetchErr?.message);
      }
    } catch (err) {
      console.error("updateUser PATCH failed:", err?.response?.status, err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSavingId(null);
    }
  }

  async function rejectUser(id) {
    if (!window.confirm("Reject and remove this user?")) return;
    setSavingId(id);
    setError("");
    setNotice("");
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setNotice("User rejected and removed.");
    } catch (err) {
      setError(err?.response?.data?.message || "Reject failed.");
    } finally {
      setSavingId(null);
    }
  }

  const normRole = (r) => String(r ?? "").trim().toLowerCase();
  // API may return is_approved as true/1/"1" — accept all truthy forms.
  const isApprovedFlag = (u) => {
    const v = u?.is_approved;
    return v === true || v === 1 || v === "1" || v === "true";
  };
  const pending = users.filter((u) => normRole(u.role) !== "admin" && !isApprovedFlag(u));
  // Separate role sections: approved normal users go to the User table,
  // admins stay in their own Admin table.
  const roleUsers = users.filter((u) => normRole(u.role) === "user" && isApprovedFlag(u));
  const adminUsers = users.filter((u) => normRole(u.role) === "admin");

  if (loading) return <main><p>Loading users...</p></main>;

  return (
    <main className="w-full">
      <header className="site-header">
        <h1>Admin — Manage Users</h1>
        <p className="subtitle">Approve users, change roles, insert draws</p>
      </header>

      {error && <p className="form-error">{error}</p>}
      {notice && <p className="hint" style={{ color: "#15803d", fontWeight: 600 }}>{notice}</p>}

      <div className="result-card">
        <h3 className="text-base sm:text-lg font-bold">Pending approval ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="hint">No pending users.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button className="tab active" style={{ minWidth: 0, flex: "0 0 auto" }} disabled={savingId === u.id} onClick={() => updateUser(u.id, { is_approved: true })}>
                        {savingId === u.id ? "Saving..." : "Approve"}
                      </button>
                      <button className="tab" style={{ minWidth: 0, flex: "0 0 auto" }} disabled={savingId === u.id} onClick={() => updateUser(u.id, { role: "admin" })}>
                        Make admin
                      </button>
                      <button className="tab" style={{ minWidth: 0, flex: "0 0 auto", borderColor: "#fecaca", color: "#b91c1c" }} disabled={savingId === u.id} onClick={() => rejectUser(u.id)}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-table" style={{ marginTop: "20px" }}>
        <h3 className="text-base sm:text-lg font-bold" style={{ padding: "12px 12px 0" }}>User role section ({roleUsers.length})</h3>
        {roleUsers.length === 0 ? (
          <p className="hint" style={{ padding: "0 12px 12px" }}>No approved users yet. Approve someone above and they will appear here.</p>
        ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Approved</th>
              <th>Search</th>
              <th>Import</th>
            </tr>
          </thead>
          <tbody>
            {roleUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} disabled={savingId === u.id} onChange={(e) => updateUser(u.id, { role: e.target.value })}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  <input type="checkbox" checked={!!u.is_approved} disabled={savingId === u.id} onChange={(e) => updateUser(u.id, { is_approved: e.target.checked })} />
                </td>
                <td>
                  <input type="checkbox" checked={!!u.can_view_results} disabled={savingId === u.id} onChange={(e) => updateUser(u.id, { can_view_results: e.target.checked })} />
                </td>
                <td><span className="hint">admin-only</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <div className="admin-table" style={{ marginTop: "20px" }}>
        <h3 className="text-base sm:text-lg font-bold" style={{ padding: "12px 12px 0" }}>Admin role section ({adminUsers.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Approved</th>
              <th>Search</th>
              <th>Import</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} disabled={savingId === u.id} onChange={(e) => updateUser(u.id, { role: e.target.value })}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td><span className="hint">✓</span></td>
                <td><span className="hint">✓</span></td>
                <td><span className="hint">admin ✓</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DrawInsertForm />
      <DrawImportForm />
    </main>
  );
}
