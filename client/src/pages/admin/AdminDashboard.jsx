import React, { useEffect, useState } from "react";
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { fetchAdminStats } from "../../utils/api";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const CARDS = stats
    ? [
        { label: "Total Users",    value: stats.totalUsers,    icon: <FiUsers />,       color: "#2563eb", bg: "#eff6ff" },
        { label: "Total Products", value: stats.totalProducts, icon: <FiBox />,         color: "#7c3aed", bg: "#f5f3ff" },
        { label: "Total Orders",   value: stats.totalOrders,   icon: <FiShoppingBag />, color: "#f97316", bg: "#fff7ed" },
        { label: "Total Revenue",  value: `₹${stats.totalRevenue?.toFixed(0)}`, icon: <FiDollarSign />, color: "#16a34a", bg: "#f0fdf4" },
      ]
    : [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <>
          <div style={styles.statsGrid}>
            {CARDS.map((card) => (
              <div key={card.label} style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: card.bg, color: card.color }}>{card.icon}</div>
                <div>
                  <p style={styles.statValue}>{card.value}</p>
                  <p style={styles.statLabel}>{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📌 Quick Actions</h3>
              <ul style={styles.quickList}>
                <li><a href="/admin/products" style={styles.quickLink}>➕ Add New Product</a></li>
                <li><a href="/admin/orders"   style={styles.quickLink}>📦 Manage Orders</a></li>
                <li><a href="/admin/users"    style={styles.quickLink}>👥 View All Users</a></li>
              </ul>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>ℹ️ System Info</h3>
              <p style={styles.infoText}>Database: MongoDB Atlas</p>
              <p style={styles.infoText}>Framework: MERN Stack</p>
              <p style={styles.infoText}>Auth: JWT + bcrypt</p>
              <p style={styles.infoText}>Status: <span style={{ color: "#16a34a", fontWeight: 700 }}>● Online</span></p>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

const styles = {
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 20, marginBottom: 28 },
  statCard:  { background: "#fff", borderRadius: 12, padding: "20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  statIcon:  { width: 52, height: 52, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
  statValue: { fontSize: 26, fontWeight: 800, color: "#111827" },
  statLabel: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  infoGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  infoCard:  { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  infoTitle: { fontSize: 16, fontWeight: 700, marginBottom: 14 },
  quickList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 10 },
  quickLink: { fontSize: 14, color: "#2563eb", fontWeight: 500 },
  infoText:  { fontSize: 13, color: "#374151", marginBottom: 8 },
};