import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiShoppingBag } from "react-icons/fi";
import { fetchOrderById } from "../utils/api.js";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderById(id).then(({ data }) => setOrder(data)).catch(() => {});
  }, [id]);

  return (
    <div className="page-wrap" style={{ maxWidth: 640, textAlign: "center" }}>
      <div style={styles.icon}><FiCheckCircle color="#22c55e" size={72} /></div>
      <h1 style={styles.heading}>Order Placed Successfully!</h1>
      <p style={styles.sub}>Thank you for shopping with ShopEZ. Your order has been confirmed.</p>

      {order && (
        <div style={styles.card}>
          <div style={styles.row}><span>Order ID</span><strong>#{order._id.slice(-8).toUpperCase()}</strong></div>
          <div style={styles.row}><span>Order Date</span><strong>{order.orderDate}</strong></div>
          <div style={styles.row}><span>Expected Delivery</span><strong style={{ color: "#2563eb" }}>{order.deliveryDate}</strong></div>
          <div style={styles.row}><span>Payment</span><strong>{order.paymentMethod}</strong></div>
          <div style={styles.row}><span>Status</span>
            <span style={{ background: "#dcfce7", color: "#166534", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{order.orderStatus}</span>
          </div>
          <div style={styles.row}><span>Total Amount</span><strong style={{ fontSize: 18 }}>₹{order.totalAmount?.toFixed(2)}</strong></div>

          <div style={styles.divider} />
          <h4 style={{ marginBottom: 12, textAlign: "left" }}>Items Ordered</h4>
          {order.items?.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <img src={item.mainImg} alt="" style={styles.img} onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Img"; }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</p>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p style={{ fontWeight: 700 }}>₹{((item.price - (item.price * item.discount / 100)) * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <div style={styles.divider} />
          <div style={styles.address}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>Delivery Address</p>
            <p>{order.name} · {order.mobile}</p>
            <p>{order.address}, {order.pincode}</p>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
        <Link to="/profile" className="btn btn-outline">
          <FiPackage /> View All Orders
        </Link>
        <Link to="/products" className="btn btn-primary">
          <FiShoppingBag /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

const styles = {
  icon:    { margin: "0 auto 20px", display: "flex", justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 },
  sub:     { fontSize: 15, color: "#6b7280", marginBottom: 28 },
  card:    { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,.08)", textAlign: "left" },
  row:     { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, marginBottom: 12 },
  divider: { height: 1, background: "#f3f4f6", margin: "16px 0" },
  itemRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  img:     { width: 50, height: 50, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" },
  address: { fontSize: 13, color: "#374151", lineHeight: 1.8 },
};