import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopez_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);
export const fetchProfile  = ()     => API.get("/auth/profile");

// ─── Products ─────────────────────────────────────────────────────────────────
export const fetchProducts       = (params) => API.get("/products", { params });
export const fetchProductById    = (id)     => API.get(`/products/${id}`);
export const createProduct       = (data)   => API.post("/products", data);
export const updateProduct       = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct       = (id)     => API.delete(`/products/${id}`);

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const fetchCart       = ()         => API.get("/cart");
export const addToCart       = (data)     => API.post("/cart", data);
export const updateCartItem  = (id, data) => API.put(`/cart/${id}`, data);
export const removeCartItem  = (id)       => API.delete(`/cart/${id}`);
export const clearCart       = ()         => API.delete("/cart/clear");

// ─── Orders ───────────────────────────────────────────────────────────────────
export const placeOrder      = (data) => API.post("/orders", data);
export const fetchMyOrders   = ()     => API.get("/orders/my-orders");
export const fetchOrderById  = (id)   => API.get(`/orders/${id}`);

// ─── Admin ────────────────────────────────────────────────────────────────────
export const fetchAdminStats   = ()        => API.get("/admin/stats");
export const fetchAdminConfig  = ()        => API.get("/admin/config");
export const updateAdminConfig = (data)    => API.put("/admin/config", data);
export const fetchAllUsers     = ()        => API.get("/admin/users");
export const deleteUser        = (id)      => API.delete(`/admin/users/${id}`);
export const fetchAllOrders    = ()        => API.get("/orders/admin/all");
export const updateOrderStatus = (id, data) => API.put(`/orders/admin/${id}/status`, data);

export default API;