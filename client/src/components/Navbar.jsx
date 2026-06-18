import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from "react-icons/fi";
import { useAuth } from "../utils/AuthContext.jsx";
import { useCart } from "../utils/CartContext.jsx";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          Shop<span style={{ color: "#f97316" }}>EZ</span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links}>
          <Link to="/"         style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          {isAdmin && <Link to="/admin" style={{ ...styles.link, color: "#f97316" }}>Admin</Link>}
        </div>

        {/* Right Icons */}
        <div style={styles.actions}>
          {user && (
            <Link to="/cart" style={styles.cartBtn}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>
          )}

          {user ? (
            <div style={{ position: "relative" }}>
              <button style={styles.userBtn} onClick={() => setDropOpen((p) => !p)}>
                <FiUser size={18} />
                <span style={{ fontSize: 13 }}>{user.username}</span>
              </button>
              {dropOpen && (
                <div style={styles.dropdown}>
                  <Link to="/profile" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                    <FiPackage size={14} /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                      <FiSettings size={14} /> Admin Panel
                    </Link>
                  )}
                  <button style={{ ...styles.dropItem, width: "100%", textAlign: "left", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }} onClick={handleLogout}>
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          <button style={styles.hamburger} onClick={() => setMenuOpen((p) => !p)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/"         style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Products</Link>
          {user && <Link to="/cart"    style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>}
          {user && <Link to="/profile" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>}
          {isAdmin && <Link to="/admin" style={{ ...styles.mobileLink, color: "#f97316" }} onClick={() => setMenuOpen(false)}>Admin</Link>}
          {!user && <Link to="/login"    style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>}
          {!user && <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>}
          {user  && <button style={{ ...styles.mobileLink, background: "none", border: "none", color: "#ef4444", cursor: "pointer", textAlign: "left" }} onClick={handleLogout}>Logout</button>}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav:        { background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,.06)" },
  inner:      { maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo:       { fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: -0.5 },
  links:      { display: "flex", gap: 28 },
  link:       { fontSize: 14, fontWeight: 500, color: "#374151", transition: "color .15s" },
  actions:    { display: "flex", alignItems: "center", gap: 12 },
  cartBtn:    { position: "relative", padding: "6px 8px", color: "#374151", display: "flex" },
  badge:      { position: "absolute", top: 0, right: 0, background: "#f97316", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  userBtn:    { display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 600 },
  dropdown:   { position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", minWidth: 170, padding: "6px 0", zIndex: 200 },
  dropItem:   { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#374151", transition: "background .15s" },
  hamburger:  { display: "none", background: "none", border: "none", color: "#374151", padding: 4 },
  mobileMenu: { background: "#fff", borderTop: "1px solid #f3f4f6", padding: "12px 0" },
  mobileLink: { display: "block", padding: "11px 20px", fontSize: 15, fontWeight: 500, color: "#111827", borderBottom: "1px solid #f9fafb" },
};