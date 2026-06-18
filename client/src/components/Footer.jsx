import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.logo}>Shop<span style={{ color: "#f97316" }}>EZ</span></span>
          <p style={styles.tagline}>Your one-stop online shopping destination.</p>
        </div>
        <div style={styles.links}>
          <h4 style={styles.heading}>Quick Links</h4>
          <Link to="/"         style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/cart"     style={styles.link}>Cart</Link>
          <Link to="/profile"  style={styles.link}>My Orders</Link>
        </div>
        <div style={styles.links}>
          <h4 style={styles.heading}>Account</h4>
          <Link to="/login"    style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>© {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer:  { background: "#111827", color: "#9ca3af", marginTop: 60 },
  inner:   { maxWidth: 1200, margin: "0 auto", padding: "40px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 32 },
  brand:   { display: "flex", flexDirection: "column", gap: 8 },
  logo:    { fontSize: 24, fontWeight: 800, color: "#fff" },
  tagline: { fontSize: 13, lineHeight: 1.6 },
  links:   { display: "flex", flexDirection: "column", gap: 8 },
  heading: { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  link:    { fontSize: 13, color: "#9ca3af", transition: "color .15s" },
  bottom:  { borderTop: "1px solid #1f2937", textAlign: "center", padding: "16px 20px", fontSize: 12 },
};