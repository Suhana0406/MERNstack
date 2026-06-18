import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { useCart } from "../utils/CartContext.jsx";
import { useAuth } from "../utils/AuthContext.jsx";
import { placeOrder } from "../utils/api.js";
import { toast } from "react-toastify";

const INITIAL = { name: "", email: "", mobile: "", address: "", pincode: "", paymentMethod: "COD" };

export default function CheckoutPage() {
  const { cartItems, cartTotal, loadCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ ...INITIAL, name: user?.username || "", email: user?.email || "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(1); // 1 = address, 2 = payment
  const [orderPlaced, setOrderPlaced] = useState(false); 
  const delivery  = cartTotal >= 499 ? 0 : 49;
  const total     = cartTotal + delivery;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.mobile || !form.address || !form.pincode) {
      toast.error("Please fill all address fields."); return false;
    }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error("Enter a valid 6-digit pincode."); return false; }
    if (!/^\d{10}$/.test(form.mobile)) { toast.error("Enter a valid 10-digit mobile number."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setLoading(true);
    try {
      const items = cartItems.map((i) => ({
        productId: i.productId,
        title:     i.title,
        mainImg:   i.mainImg,
        size:      i.size,
        quantity:  i.quantity,
        price:     i.price,
        discount:  i.discount,
      }));
      const { data } = await placeOrder({ ...form, items, totalAmount: total });
      setOrderPlaced(true);
      await loadCart();
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) { navigate("/cart"); return null; }

  return (
    <div className="page-wrap">
      <h1 className="section-title">Checkout</h1>

      {/* Progress */}
      <div style={styles.progress}>
        {["Delivery Address", "Payment"].map((s, i) => (
          <React.Fragment key={s}>
            <div style={styles.progressStep}>
              <div style={{ ...styles.stepCircle, background: step > i ? "#2563eb" : step === i + 1 ? "#2563eb" : "#e5e7eb", color: step >= i + 1 ? "#fff" : "#9ca3af" }}>{i + 1}</div>
              <span style={{ ...styles.stepLabel, color: step >= i + 1 ? "#111827" : "#9ca3af" }}>{s}</span>
            </div>
            {i < 1 && <div style={{ ...styles.progressLine, background: step > 1 ? "#2563eb" : "#e5e7eb" }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={styles.layout}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {step === 1 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Delivery Address</h2>
              <div style={styles.grid2}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} required />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength={6} required />
                </div>
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="House No., Street, City, State" required />
              </div>
              <button type="button" className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => { if (validateStep1()) setStep(2); }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Payment Method</h2>
              {[{ val: "COD", label: "💵 Cash on Delivery", sub: "Pay when your order arrives" }, { val: "Online", label: "💳 Online Payment", sub: "UPI / Debit / Credit Card (Simulated)" }].map((p) => (
                <label key={p.val} style={{ ...styles.payOption, border: form.paymentMethod === p.val ? "2px solid #2563eb" : "2px solid #e5e7eb", background: form.paymentMethod === p.val ? "#eff6ff" : "#fff" }}>
                  <input type="radio" name="paymentMethod" value={p.val} checked={form.paymentMethod === p.val} onChange={handleChange} style={{ marginRight: 12 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15 }}>{p.label}</p>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{p.sub}</p>
                  </div>
                </label>
              ))}

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  <FiLock /> {loading ? "Placing Order..." : `Place Order · ₹${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Summary Sidebar */}
        <aside style={styles.summary}>
          <h3 style={styles.cardTitle}>Order Summary</h3>
          {cartItems.map((item) => {
            const dp = item.price - (item.price * (item.discount || 0)) / 100;
            return (
              <div key={item._id} style={styles.summaryItem}>
                <img src={item.mainImg} alt="" style={styles.summaryImg} onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Img"; }} />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <p style={{ fontWeight: 600 }}>{item.title}</p>
                  <p style={{ color: "#6b7280" }}>Qty: {item.quantity} · Size: {item.size}</p>
                </div>
                <p style={{ fontWeight: 700, fontSize: 14 }}>₹{(dp * item.quantity).toFixed(2)}</p>
              </div>
            );
          })}
          <div style={styles.divider} />
          <div style={styles.row}><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
          <div style={styles.row}><span>Delivery</span><span style={{ color: "#22c55e" }}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
          <div style={{ ...styles.row, fontWeight: 800, fontSize: 17, marginTop: 8 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  progress:     { display: "flex", alignItems: "center", marginBottom: 32 },
  progressStep: { display: "flex", alignItems: "center", gap: 8 },
  stepCircle:   { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 },
  stepLabel:    { fontSize: 14, fontWeight: 600 },
  progressLine: { flex: 1, height: 2, margin: "0 12px" },
  layout:       { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" },
  form:         {},
  card:         { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.07)" },
  cardTitle:    { fontSize: 18, fontWeight: 700, marginBottom: 20 },
  grid2:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" },
  payOption:    { display: "flex", alignItems: "center", padding: 16, borderRadius: 10, marginBottom: 12, cursor: "pointer", transition: "all .15s" },
  summary:      { background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.07)", position: "sticky", top: 80 },
  summaryItem:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  summaryImg:   { width: 50, height: 50, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" },
  divider:      { height: 1, background: "#f3f4f6", margin: "12px 0" },
  row:          { display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 },
};