import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../utils/CartContext.jsx";
import { toast } from "react-toastify";

export default function CartPage() {
  const { cartItems, cartTotal, removeItem, updateQty } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (id) => {
    try { await removeItem(id); toast.success("Item removed."); }
    catch { toast.error("Failed to remove item."); }
  };

  const handleQty = async (id, qty) => {
    if (qty < 1) return;
    try { await updateQty(id, qty); }
    catch { toast.error("Failed to update quantity."); }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-wrap">
        <div className="empty-state">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start shopping to add items to your cart.</p>
          <Link to="/products" className="btn btn-primary mt-4">
            <FiShoppingBag /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const savings = cartItems.reduce((sum, item) => sum + (item.price * item.discount / 100) * item.quantity, 0);

  return (
    <div className="page-wrap">
      <h1 className="section-title">Shopping Cart ({cartItems.length} items)</h1>

      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.itemsCol}>
          {cartItems.map((item) => {
            const discPrice = item.price - (item.price * (item.discount || 0)) / 100;
            return (
              <div key={item._id} style={styles.item}>
                <img
                  src={item.mainImg || "https://via.placeholder.com/90?text=Img"}
                  alt={item.title} style={styles.img}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/90?text=Img"; }}
                />
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.itemMeta}>Size: <strong>{item.size}</strong></p>
                  <div style={styles.itemPrice}>
                    <span style={styles.discP}>₹{discPrice.toFixed(2)}</span>
                    {item.discount > 0 && <span style={styles.origP}>₹{item.price.toFixed(2)}</span>}
                    {item.discount > 0 && <span style={styles.discTag}>{item.discount}% OFF</span>}
                  </div>
                </div>
                <div style={styles.itemActions}>
                  <div style={styles.qtyRow}>
                    <button style={styles.qtyBtn} onClick={() => handleQty(item._id, item.quantity - 1)}>−</button>
                    <span style={styles.qty}>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => handleQty(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <p style={styles.subtotal}>₹{(discPrice * item.quantity).toFixed(2)}</p>
                  <button style={styles.removeBtn} onClick={() => handleRemove(item._id)}>
                    <FiTrash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <aside style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.summaryRow}>
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{cartItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
          </div>
          <div style={{ ...styles.summaryRow, color: "#22c55e" }}>
            <span>Discount</span>
            <span>−₹{savings.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: "#22c55e" }}>{cartTotal >= 499 ? "FREE" : "₹49"}</span>
          </div>
          <div style={styles.divider} />
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span>₹{(cartTotal + (cartTotal >= 499 ? 0 : 49)).toFixed(2)}</span>
          </div>

          {savings > 0 && (
            <div style={styles.savingsBox}>
              🎉 You save ₹{savings.toFixed(2)} on this order!
            </div>
          )}

          <button className="btn btn-primary btn-full" style={{ marginTop: 20, fontSize: 16, padding: "14px" }}
            onClick={() => navigate("/checkout")}>
            Proceed to Checkout <FiArrowRight />
          </button>
          <Link to="/products" style={styles.continueLink}>← Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  layout:       { display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" },
  itemsCol:     { display: "flex", flexDirection: "column", gap: 12 },
  item:         { background: "#fff", borderRadius: 12, padding: 16, display: "flex", gap: 16, boxShadow: "0 2px 8px rgba(0,0,0,.06)", alignItems: "flex-start" },
  img:          { width: 90, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#f3f4f6" },
  itemInfo:     { flex: 1 },
  itemTitle:    { fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#111827" },
  itemMeta:     { fontSize: 12, color: "#6b7280", marginBottom: 6 },
  itemPrice:    { display: "flex", alignItems: "center", gap: 8 },
  discP:        { fontSize: 16, fontWeight: 700 },
  origP:        { fontSize: 12, color: "#9ca3af", textDecoration: "line-through" },
  discTag:      { fontSize: 11, background: "#fef2f2", color: "#dc2626", padding: "2px 6px", borderRadius: 4, fontWeight: 700 },
  itemActions:  { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 },
  qtyRow:       { display: "flex", alignItems: "center", gap: 10 },
  qtyBtn:       { width: 30, height: 30, borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  qty:          { fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: "center" },
  subtotal:     { fontSize: 15, fontWeight: 700 },
  removeBtn:    { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 },
  summary:      { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,.08)", position: "sticky", top: 80 },
  summaryTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20 },
  summaryRow:   { display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12 },
  divider:      { height: 1, background: "#f3f4f6", margin: "12px 0" },
  savingsBox:   { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#166534", marginTop: 12 },
  continueLink: { display: "block", textAlign: "center", marginTop: 14, fontSize: 13, color: "#6b7280" },
};