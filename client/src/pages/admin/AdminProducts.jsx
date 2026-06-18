import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from "react-icons/fi";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../utils/api";
import AdminLayout from "./AdminLayout";
import { toast } from "react-toastify";

const BLANK = { title: "", description: "", mainImg: "", category: "", gender: "Unisex", price: "", discount: 0, stock: 100, sizes: "" };
const CATS   = ["Electronics", "Clothing", "Footwear", "Accessories", "Home & Kitchen", "Books"];
const GENS   = ["Men", "Women", "Unisex", "Kids"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(BLANK);
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try { const { data } = await fetchProducts(); setProducts(Array.isArray(data) ? data : []); }
    catch { toast.error("Failed to load products."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(BLANK); setEditing(null); setModal(true); };
  const openEdit   = (p)  => {
    setForm({ ...p, sizes: p.sizes?.join(", ") || "", price: p.price, discount: p.discount, stock: p.stock });
    setEditing(p._id);
    setModal(true);
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.mainImg || !form.category || !form.price) { toast.error("Fill all required fields."); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock), sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [] };
      if (editing) { await updateProduct(editing, payload); toast.success("Product updated!"); }
      else         { await createProduct(payload);           toast.success("Product created!"); }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await deleteProduct(id); toast.success("Product deleted."); load(); }
    catch { toast.error("Delete failed."); }
  };

  return (
    <AdminLayout title="Products Management">
      <div style={styles.toolbar}>
        <p style={{ color: "#6b7280", fontSize: 14 }}>{products.length} product{products.length !== 1 && "s"}</p>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><FiPlus /> Add Product</button>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Discount</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={styles.tr}>
                  <td style={styles.td}>
                    <img src={p.mainImg} alt="" style={styles.thumb} onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Img"; }} />
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600, maxWidth: 200 }}>{p.title}</td>
                  <td style={styles.td}><span className="badge badge-info">{p.category}</span></td>
                  <td style={styles.td}>₹{p.price}</td>
                  <td style={styles.td}>{p.discount}%</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={styles.editBtn} onClick={() => openEdit(p)}><FiEdit2 size={14} /></button>
                      <button style={styles.delBtn}  onClick={() => handleDelete(p._id, p.title)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={styles.overlay} onClick={() => setModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? "Edit Product" : "Add New Product"}</h2>
              <button style={styles.closeBtn} onClick={() => setModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSave} style={styles.modalBody}>
              <div style={styles.grid2}>
                <div className="form-group">
                  <label>Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Product name" required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select category</option>
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" min="0" required />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="0" min="0" max="100" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="100" min="0" />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    {GENS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Main Image URL *</label>
                <input name="mainImg" value={form.mainImg} onChange={handleChange} placeholder="https://..." required />
              </div>
              <div className="form-group">
                <label>Sizes (comma-separated)</label>
                <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL" />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description..." required />
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FiSave /> {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const styles = {
  toolbar:   { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  tableWrap: { background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  table:     { width: "100%", borderCollapse: "collapse" },
  thead:     { background: "#f9fafb" },
  th:        { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 },
  tr:        { borderTop: "1px solid #f3f4f6" },
  td:        { padding: "12px 16px", fontSize: 14, color: "#374151" },
  thumb:     { width: 50, height: 50, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" },
  editBtn:   { padding: "6px 10px", borderRadius: 6, background: "#eff6ff", color: "#2563eb", border: "none", cursor: "pointer" },
  delBtn:    { padding: "6px 10px", borderRadius: 6, background: "#fef2f2", color: "#dc2626", border: "none", cursor: "pointer" },
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal:     { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f3f4f6" },
  modalTitle:  { fontSize: 18, fontWeight: 700 },
  closeBtn:    { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" },
  modalBody:   { padding: 24 },
  grid2:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" },
};