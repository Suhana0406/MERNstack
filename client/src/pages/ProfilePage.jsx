import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiUser } from "react-icons/fi";
import { fetchMyOrders } from "../utils/api.js";
import { useAuth } from "../utils/AuthContext.jsx";

const STATUS_COLORS = {
  "Order Placed": "badge-info", "Processing": "badge-warn",
  "Shipped": "badge-warn", "Out for Delivery": "badge-warn",
  "Delivered": "badge-success", "Cancelled": "badge-danger",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrap">
      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}><FiUser size={32} /></div>
        <div>
          <h2 style={styles.name}>{user?.username}</h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>{user?.email}</p>
          <span style={{ ...styles.roleBadge, background: user?.usertype === "ADMIN" ? "#fef3c7" : "#eff6ff", color: user?.usertype === "ADMIN" ? "#b45309" : "#1d4ed8" }}>
            {user?.usertype}
          </span>
        </div>
      </div>

      {/* Orders */}
      <h2 className="section-title" style={{ marginTop: 32 }}>
        <FiPackage style={{ marginRight: 8 }} />My Orders ({orders.length})
      </h2>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here.</p>
          <Link to="/products" className="btn btn-primary mt-4">Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p style={styles.orderDate}>Placed on {order.orderDate}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`badge ${STATUS_COLORS[order.orderStatus] || "badge-info"}`}>{order.orderStatus}</span>
                  <p style={styles.total}>₹{order.totalAmount?.toFixed(2)}</p>
                </div>
              </div>

              <div style={styles.orderItems}>
                {order.items?.map((item, i) => (
                  <div key={i} style={styles.orderItem}>
                    <img src={item.mainImg} alt="" style={styles.itemImg} onError={(e) => { e.target.src = "https://via.placeholder.com/60?text=Img"; }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: "#6b7280" }}>Size: {item.size} · Qty: {item.quantity} · ₹{((item.price - (item.price * item.discount / 100)) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.orderFooter}>
                <p style={styles.delivery}>📅 Expected: {order.deliveryDate}</p>
                <Link to={`/order-success/${order._id}`} style={styles.viewBtn}>View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  profileCard: { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.07)", display: "flex", alignItems: "center", gap: 20 },
  avatar:      { width: 72, height: 72, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name:        { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  roleBadge:   { display: "inline-block", marginTop: 6, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 },
  orderCard:   { background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)", overflow: "hidden" },
  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px", borderBottom: "1px solid #f3f4f6" },
  orderId:     { fontWeight: 700, fontSize: 15, marginBottom: 2 },
  orderDate:   { fontSize: 12, color: "#6b7280" },
  total:       { fontSize: 16, fontWeight: 700, marginTop: 6 },
  orderItems:  { padding: "12px 20px", display: "flex", flexDirection: "column", gap: 10 },
  orderItem:   { display: "flex", alignItems: "center", gap: 12 },
  itemImg:     { width: 60, height: 60, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" },
  orderFooter: { padding: "12px 20px", background: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" },
  delivery:    { fontSize: 12, color: "#6b7280" },
  viewBtn:     { fontSize: 13, fontWeight: 600, color: "#2563eb" },
};
