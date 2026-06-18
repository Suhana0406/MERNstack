import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";
import { fetchProducts } from "../utils/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../utils/AuthContext.jsx";

const CATEGORIES = ["Electronics", "Clothing", "Footwear", "Accessories", "Home & Kitchen", "Books"];

export default function HomePage() {
 const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(({ data }) => setFeatured(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>🛍️ New Season Arrivals</p>
          <h1 style={styles.heroTitle}>Shop Smarter,<br />Live Better</h1>
          <p style={styles.heroSub}>Discover thousands of products at unbeatable prices. Fast delivery, easy returns.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-accent" style={{ fontSize: 15, padding: "12px 28px" }}>
              Shop Now <FiArrowRight />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline" style={{ fontSize: 15, padding: "12px 28px", borderColor: "#fff", color: "#fff" }}>
                Join Free
              </Link>
            )}
          </div>
        </div>
        <div style={styles.heroIllustration}>🛒</div>
      </section>

      {/* ── Categories ── */}
      <section style={styles.section}>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`} style={styles.catCard}>
                <span style={styles.catIcon}>{getCatIcon(cat)}</span>
                <span style={styles.catLabel}>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={styles.section}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Check back soon or add products via the admin panel.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ ...styles.section, background: "#111827" }}>
        <div className="container">
          <div style={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.label} style={styles.featureItem}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <div>
                  <p style={styles.featureLabel}>{f.label}</p>
                  <p style={styles.featureSub}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const getCatIcon = (cat) => {
  const map = { "Electronics": "💻", "Clothing": "👕", "Footwear": "👟", "Accessories": "⌚", "Home & Kitchen": "🏠", "Books": "📚" };
  return map[cat] || "🛍️";
};

const FEATURES = [
  { icon: <FiTruck size={24} />,      label: "Free Delivery",      sub: "On orders above ₹499" },
  { icon: <FiShield size={24} />,     label: "Secure Payment",     sub: "100% safe transactions" },
  { icon: <FiRefreshCw size={24} />,  label: "Easy Returns",       sub: "7-day return policy" },
  { icon: <FiHeadphones size={24} />, label: "24/7 Support",       sub: "Always here to help" },
];

const styles = {
  hero:            { background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)", color: "#fff", padding: "80px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "100%", gap: 40, flexWrap: "wrap" },
  heroContent:     { flex: 1, minWidth: 280, maxWidth: 600, margin: "0 auto", paddingLeft: "calc((100% - 1200px)/2)", paddingRight: 20 },
  heroTag:         { fontSize: 14, fontWeight: 600, marginBottom: 12, opacity: 0.85 },
  heroTitle:       { fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16 },
  heroSub:         { fontSize: 16, opacity: 0.8, marginBottom: 28, lineHeight: 1.7 },
  heroIllustration:{ fontSize: 120, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center" },
  section:         { padding: "50px 0" },
  catGrid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 16 },
  catCard:         { background: "#fff", borderRadius: 12, padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: "0 2px 8px rgba(0,0,0,.06)", transition: "transform .2s", cursor: "pointer", border: "1px solid #f3f4f6" },
  catIcon:         { fontSize: 32 },
  catLabel:        { fontSize: 13, fontWeight: 700, color: "#374151", textAlign: "center" },
  featuresGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 28 },
  featureItem:     { display: "flex", alignItems: "center", gap: 14, color: "#fff" },
  featureIcon:     { color: "#f97316", flexShrink: 0 },
  featureLabel:    { fontWeight: 700, fontSize: 15, marginBottom: 2 },
  featureSub:      { fontSize: 12, opacity: 0.7 },
};