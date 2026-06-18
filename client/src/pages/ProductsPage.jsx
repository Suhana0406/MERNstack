import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { fetchProducts } from "../utils/api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["All", "Electronics", "Clothing", "Footwear", "Accessories", "Home & Kitchen", "Books"];
const GENDERS    = ["All", "Men", "Women", "Unisex", "Kids"];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState(searchParams.get("search") || "");
  const [category, setCategory]         = useState(searchParams.get("category") || "All");
  const [gender, setGender]             = useState("All");
  const [minPrice, setMinPrice]         = useState("");
  const [maxPrice, setMaxPrice]         = useState("");
  const [showFilter, setShowFilter]     = useState(false);
  const [isDesktop, setIsDesktop]       = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)               params.search   = search;
      if (category !== "All")   params.category = category;
      if (gender !== "All")     params.gender   = gender;
      if (minPrice)             params.minPrice = minPrice;
      if (maxPrice)             params.maxPrice = maxPrice;

      const { data } = await fetchProducts(params);
       setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [category, gender]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const resetFilters = () => {
    setSearch(""); setCategory("All"); setGender("All");
    setMinPrice(""); setMaxPrice("");
    setSearchParams({});
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={styles.header}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>All Products</h1>
        <button style={styles.filterBtn} onClick={() => setShowFilter((p) => !p)}>
          <FiFilter /> Filters
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={styles.searchBar}>
        <div style={styles.searchWrap}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text" placeholder="Search products..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && <button type="button" style={styles.clearBtn} onClick={() => setSearch("")}><FiX /></button>}
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <div style={styles.layout}>
        {/* Sidebar Filters */}
        <aside style={{ ...styles.sidebar, display: showFilter || isDesktop ? "block" : "none" }}>
          <div style={styles.filterCard}>
            <div style={styles.filterHeader}>
              <h3 style={styles.filterTitle}>Filters</h3>
              <button style={styles.resetBtn} onClick={resetFilters}>Reset</button>
            </div>

            <div className="form-group">
              <label>Category</label>
              {CATEGORIES.map((c) => (
                <label key={c} style={styles.radioLabel}>
                  <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} />
                  {c}
                </label>
              ))}
            </div>

            <div className="form-group">
              <label>Gender</label>
              {GENDERS.map((g) => (
                <label key={g} style={styles.radioLabel}>
                  <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} />
                  {g}
                </label>
              ))}
            </div>

            <div className="form-group">
              <label>Price Range (₹)</label>
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ marginBottom: 8 }} />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>

            <button className="btn btn-primary btn-full" onClick={loadProducts}>Apply Filters</button>
          </div>
        </aside>

        {/* Products Grid */}
        <main style={styles.main}>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
              <button className="btn btn-primary mt-4" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <p style={styles.count}>{products.length} product{products.length !== 1 && "s"} found</p>
              <div className="products-grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  filterBtn:   { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  searchBar:   { display: "flex", gap: 10, marginBottom: 28, alignItems: "center" },
  searchWrap:  { flex: 1, position: "relative", display: "flex", alignItems: "center" },
  searchIcon:  { position: "absolute", left: 12, color: "#9ca3af", fontSize: 16 },
  searchInput: { width: "100%", padding: "11px 40px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", background: "#fff" },
  clearBtn:    { position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", color: "#9ca3af" },
  layout:      { display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" },
  sidebar:     {},
  filterCard:  { background: "#fff", borderRadius: 12, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", position: "sticky", top: 80 },
  filterHeader:{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  filterTitle: { fontSize: 16, fontWeight: 700 },
  resetBtn:    { fontSize: 12, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 },
  radioLabel:  { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", marginBottom: 6, cursor: "pointer" },
  main:        {},
  count:       { fontSize: 13, color: "#6b7280", marginBottom: 16 },
};