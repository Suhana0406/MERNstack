import React, { useEffect, useState } from "react";
import { FiTrash2, FiUser, FiShield } from "react-icons/fi";
import { fetchAllUsers, deleteUser } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import AdminLayout from "./AdminLayout";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const { data } = await fetchAllUsers(); setUsers(Array.isArray(data) ? data : []); }
    catch { toast.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, username) => {
    if (id === currentUser?.id) { toast.error("You cannot delete your own account."); return; }
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try { await deleteUser(id); toast.success("User deleted."); load(); }
    catch { toast.error("Failed to delete user."); }
  };

  return (
    <AdminLayout title="Users Management">
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: "#6b7280", fontSize: 14 }}>{users.length} registered user{users.length !== 1 && "s"}</p>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : users.length === 0 ? (
        <div className="empty-state"><h3>No users found</h3></div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u._id} style={styles.tr}>
                  <td style={{ ...styles.td, color: "#9ca3af" }}>{idx + 1}</td>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {u.usertype === "ADMIN" ? <FiShield size={14} /> : <FiUser size={14} />}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.username}</span>
                      {u._id === currentUser?.id && <span style={styles.youTag}>You</span>}
                    </div>
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span className={`badge ${u.usertype === "ADMIN" ? "badge-warn" : "badge-info"}`}>
                      {u.usertype}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: "#6b7280" }}>
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.delBtn, opacity: u._id === currentUser?.id ? 0.4 : 1 }}
                      onClick={() => handleDelete(u._id, u.username)}
                      disabled={u._id === currentUser?.id}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

const styles = {
  tableWrap: { background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  table:     { width: "100%", borderCollapse: "collapse" },
  thead:     { background: "#f9fafb" },
  th:        { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 },
  tr:        { borderTop: "1px solid #f3f4f6" },
  td:        { padding: "12px 16px", fontSize: 14, color: "#374151" },
  userCell:  { display: "flex", alignItems: "center", gap: 10 },
  avatar:    { width: 32, height: 32, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" },
  youTag:    { fontSize: 10, background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: 999, fontWeight: 700 },
  delBtn:    { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, background: "#fef2f2", color: "#dc2626", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 },
};