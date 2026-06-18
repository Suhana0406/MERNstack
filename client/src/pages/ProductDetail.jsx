import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft, FiCheck } from "react-icons/fi";
import { fetchProductById } from "../utils/api.js";
import { useAuth } from "../utils/AuthContext.jsx";
import { useCart } from "../utils/CartContext.jsx";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [selSize, setSelSize]   = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selImg, setSelImg]     = useState("");
  const [added, setAdded]       = useState(false);

  useEffect(() => {
    fetchProductById(id)
      .then(({ data }) => {
        setProduct(data);
        setSelImg(data.mainImg);
        setSelSize(data.sizes?.[0] || "");
      })
      .catch(() => toast.error("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3><Link to="/products" className="btn btn-primary mt-4">Back to Products</Link></div>;

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  const handleAddToCart = async () => {
    if (!user) { toast.info("Please login first."); navigate("/login"); return; }
    if (product.sizes?.length > 0 && !selSize) { toast.warning("Please select a size."); return; }
    try {
      await addToCart({
        productId:   product._id,
        title:       product.title,
        description: product.description,
        mainImg:     product.mainImg,
        size:        selSize || "Free Size",
        quantity,
        price:       product.price,
        discount:    product.discount,
      });
      setAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setAdded(false), 2000);
    } catch {
      toast.error("Failed to add to cart.");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="page-wrap">
      <button onClick={() => navigate(-1)} style={styles.back}>
        <FiArrowLeft /> Back
      </button>

      <div style={styles.grid}>
        {/* Image Gallery */}
        <div style={styles.gallery}>
          <img src={selImg || product.mainImg} alt={product.title} style={styles.mainImg}
            onError={(e) => { e.target.src = "https://via.placeholder.com/480x400?text=No+Image"; }} />
          {product.carousel?.length > 0 && (
            <div style={styles.thumbRow}>
              {[product.mainImg, ...product.carousel].map((img, i) => (
                <img key={i} src={img} alt="" style={{ ...styles.thumb, border: selImg === img ? "2px solid #2563eb" : "2px solid transparent" }}
                  onClick={() => setSelImg(img)}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Img"; }} />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.info}>
          <span style={styles.cat}>{product.category} · {product.gender}</span>
          <h1 style={styles.title}>{product.title}</h1>
          <p style={styles.desc}>{product.description}</p>

          <div style={styles.priceRow}>
            <span style={styles.price}>₹{discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span style={styles.original}>₹{product.price.toFixed(2)}</span>
                <span style={styles.discBadge}>{product.discount}% OFF</span>
              </>
            )}
          </div>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={styles.label}>Select Size</p>
              <div style={styles.sizes}>
                {product.sizes.map((s) => (
                  <button key={s} style={{ ...styles.sizeBtn, ...(selSize === s ? styles.sizeSel : {}) }}
                    onClick={() => setSelSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: 24 }}>
            <p style={styles.label}>Quantity</p>
            <div style={styles.qtyRow}>
              <button style={styles.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span style={styles.qtyNum}>{quantity}</span>
              <button style={styles.qtyBtn} onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleAddToCart}>
              {added ? <><FiCheck /> Added!</> : <><FiShoppingCart /> Add to Cart</>}
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Meta */}
          <div style={styles.meta}>
            <p>🚚 Free delivery on orders above ₹499</p>
            <p>🔄 Easy 7-day returns</p>
            <p>✅ {product.stock > 0 ? `In stock (${product.stock} units)` : "Out of stock"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  back:       { display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, background: "none", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" },
  grid:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" },
  gallery:    {},
  mainImg:    { width: "100%", height: 400, objectFit: "cover", borderRadius: 14, background: "#f9fafb", marginBottom: 12 },
  thumbRow:   { display: "flex", gap: 8, flexWrap: "wrap" },
  thumb:      { width: 72, height: 72, objectFit: "cover", borderRadius: 8, cursor: "pointer", transition: "border .15s" },
  info:       {},
  cat:        { fontSize: 12, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1 },
  title:      { fontSize: 28, fontWeight: 800, color: "#111827", margin: "8px 0" },
  desc:       { fontSize: 14, color: "#6b7280", lineHeight: 1.8, marginBottom: 20 },
  priceRow:   { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 },
  price:      { fontSize: 32, fontWeight: 900, color: "#111827" },
  original:   { fontSize: 16, color: "#9ca3af", textDecoration: "line-through" },
  discBadge:  { background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 },
  label:      { fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 },
  sizes:      { display: "flex", gap: 8, flexWrap: "wrap" },
  sizeBtn:    { padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s" },
  sizeSel:    { border: "1.5px solid #2563eb", background: "#eff6ff", color: "#2563eb" },
  qtyRow:     { display: "flex", alignItems: "center", gap: 14 },
  qtyBtn:     { width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  qtyNum:     { fontSize: 18, fontWeight: 700, minWidth: 24, textAlign: "center" },
  meta:       { marginTop: 24, padding: 16, background: "#f9fafb", borderRadius: 10, display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#374151" },
};