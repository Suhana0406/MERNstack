import React, { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../utils/api";
import AdminLayout from "./AdminLayout";
import { toast } from "react-toastify";

const STATUSES = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const STATUS_COLORS = {
  "Order Placed": "#1d4ed8", "Processing": "#b45309", "Shipped": "#7c3aed",
  "Out for Delivery": "#0891b2", "Delivered": "#16a34a", "Cancelled": "#dc2626",
};

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await fetchAllOrders(); setOrders(Array.isArray(data) ? data : []); }
    catch { toast.error("Failed to load orders."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, orderStatus) => {
    try {
      await updateOrderStatus(id, { orderStatus });
      toast.success("Status updated.");
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus } : o));
    } catch { toast.error("Failed to update status."); }
  };

  return (
    <AdminLayout title="Orders Management">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <p style={{ color: "#6b7280", fontSize: 14 }}>{orders.length} total order{orders.length !== 1 && "s"}</p>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state"><h3>No orders yet</h3></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              {/* Header row */}
              <div style={styles.header} onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                <div>
                  <p style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</p>
                  <p style={styles.orderMeta}>{order.name} · {order.email}</p>
                  <p style={styles.orderDate}>{order.orderDate}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <p style={styles.amount}>₹{order.totalAmount?.toFixed(2)}</p>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatus(order._id, e.target.value)}
                    style={{ ...styles.statusSelect, color: STATUS_COLORS[order.orderStatus] || "#374151" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span style={styles.chevron}>{expanded === order._id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order._id && (
                <div style={styles.details}>
                  <div style={styles.detailsGrid}>
                    <div>
                      <p style={styles.detailTitle}>Delivery Address</p>
                      <p style={styles.detailText}>{order.name}</p>
                      <p style={styles.detailText}>{order.mobile}</p>
                      <p style={styles.detailText}>{order.address}, {order.pincode}</p>
                    </div>
                    <div>
                      <p style={styles.detailTitle}>Payment</p>
                      <p style={styles.detailText}>{order.paymentMethod}</p>
                      <p style={{ ...styles.detailTitle, marginTop: 12 }}>Delivery Date</p>
                      <p style={styles.detailText}>{order.deliveryDate}</p>
                    </div>
                  </div>
                  <div style={styles.itemsSection}>
                    <p style={styles.detailTitle}>Items ({order.items?.length})</p>
                    {order.items?.map((item, i) => (
                      <div key={i} style={styles.itemRow}>
                        <img src={item.mainImg} alt="" style={styles.itemImg} onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Img"; }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: "#6b7280" }}>Size: {item.size} · Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontWeight: 700 }}>₹{((item.price - item.price * item.discount / 100) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

const styles = {
  card:         { background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,.06)", overflow: "hidden" },
  header:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer" },
  orderId:      { fontSize: 15, fontWeight: 700, marginBottom: 2 },
  orderMeta:    { fontSize: 13, color: "#374151" },
  orderDate:    { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  amount:       { fontSize: 16, fontWeight: 800 },
  statusSelect: { padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, fontWeight: 700, cursor: "pointer", outline: "none" },
  chevron:      { fontSize: 12, color: "#9ca3af" },
  details:      { borderTop: "1px solid #f3f4f6", padding: "16px 20px", background: "#f9fafb" },
  detailsGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 },
  detailTitle:  { fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  detailText:   { fontSize: 13, color: "#374151", marginBottom: 2 },
  itemsSection: {},
  itemRow:      { display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #e5e7eb" },
  itemImg:      { width: 48, height: 48, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" },
};