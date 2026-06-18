import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiHome } from "react-icons/fi";

const NAV = [
  { to: "/admin",          icon: <FiGrid />,       label: "Dashboard" },
  { to: "/admin/products", icon: <FiBox />,        label: "Products" },
  { to: "/admin/orders",   icon: <FiShoppingBag />, label: "Orders" },
  { to: "/admin/users",    icon: <FiUsers />,      label: "Users" },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();

  return (
    <div style={styles.wrap}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.logo}>Shop<span style={{ color: "#f97316" }}>EZ</span></span>
          <span style={styles.adminTag}>Admin Panel</span>
        </div>
        <nav style={styles.nav}>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} style={{ ...styles.navItem, ...(pathname === n.to ? styles.navActive : {}) }}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/" style={styles.backLink}><FiHome /> Back to Store</Link>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.mainHeader}>
          <h1 style={styles.pageTitle}>{title}</h1>
        </div>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles = {
  wrap:         { display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 64px)" },
  sidebar:      { background: "#111827", color: "#9ca3af", padding: "24px 0", display: "flex", flexDirection: "column" },
  sidebarHeader:{ padding: "0 20px 24px", borderBottom: "1px solid #1f2937" },
  logo:         { fontSize: 22, fontWeight: 900, color: "#fff" },
  adminTag:     { display: "block", fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 },
  nav:          { flex: 1, padding: "16px 0" },
  navItem:      { display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", fontSize: 14, fontWeight: 500, color: "#9ca3af", transition: "all .15s" },
  navActive:    { background: "#1f2937", color: "#fff", borderRight: "3px solid #f97316" },
  backLink:     { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 13, color: "#6b7280", borderTop: "1px solid #1f2937" },
  main:         { background: "#f3f4f6", overflow: "auto" },
  mainHeader:   { background: "#fff", padding: "16px 28px", borderBottom: "1px solid #e5e7eb" },
  pageTitle:    { fontSize: 22, fontWeight: 700, color: "#111827" },
  content:      { padding: 28 },
};