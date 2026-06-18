import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useAuth } from "../utils/AuthContext.jsx";
import { useCart } from "../utils/CartContext.jsx";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.info("Please login to add items to cart."); return; }
    try {
      await addToCart({
        productId:   product._id,
        title:       product.title,
        description: product.description,
        mainImg:     product.mainImg,
        size:        product.sizes?.[0] || "Free Size",
        quantity:    1,
        price:       product.price,
        discount:    product.discount,
      });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
      <div style={styles.card}>
        <div style={styles.imgWrap}>
          <img
            src={product.mainImg || "https://via.placeholder.com/300x280?text=No+Image"}
            alt={product.title}
            style={styles.img}
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x280?text=No+Image"; }}
          />
          {product.discount > 0 && (
            <span style={styles.discBadge}>{product.discount}% OFF</span>
          )}
        </div>

        <div style={styles.body}>
          <p style={styles.category}>{product.category}</p>
          <h3 style={styles.title}>{product.title}</h3>
          <p style={styles.desc}>{product.description?.slice(0, 60)}...</p>

          <div style={styles.priceRow}>
            <span style={styles.price}>₹{discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span style={styles.original}>₹{product.price.toFixed(2)}</span>
            )}
          </div>

          <button className="btn btn-accent btn-full" style={{ marginTop: 12 }} onClick={handleAddToCart}>
            <FiShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card:     { background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.07)", transition: "transform .2s, box-shadow .2s", cursor: "pointer" },
  imgWrap:  { position: "relative", height: 220, overflow: "hidden", background: "#f9fafb" },
  img:      { width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" },
  discBadge:{ position: "absolute", top: 10, left: 10, background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 },
  body:     { padding: "14px 16px 16px" },
  category: { fontSize: 11, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  title:    { fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  desc:     { fontSize: 12, color: "#6b7280", marginBottom: 8, lineHeight: 1.5 },
  priceRow: { display: "flex", alignItems: "center", gap: 8 },
  price:    { fontSize: 18, fontWeight: 800, color: "#111827" },
  original: { fontSize: 13, color: "#9ca3af", textDecoration: "line-through" },
};