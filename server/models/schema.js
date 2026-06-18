import mongoose from "mongoose";

// ─── User Schema ──────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    usertype: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

// ─── Admin Schema ─────────────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema(
  {
    banner:     { type: String },
    categories: { type: Array, default: [] },
  },
  { timestamps: true }
);

// ─── Product Schema ───────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    mainImg:     { type: String, required: true },
    carousel:    { type: Array, default: [] },
    sizes:       { type: Array, default: [] },
    category:    { type: String, required: true },
    gender:      { type: String, enum: ["Men", "Women", "Unisex", "Kids"], default: "Unisex" },
    price:       { type: Number, required: true, min: 0 },
    discount:    { type: Number, default: 0, min: 0, max: 100 },
    stock:       { type: Number, default: 100 },
  },
  { timestamps: true }
);

// ─── Cart Schema ──────────────────────────────────────────────────────────────
const cartSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    title:       { type: String },
    description: { type: String },
    mainImg:     { type: String },
    size:        { type: String },
    quantity:    { type: Number, default: 1, min: 1 },
    price:       { type: Number },
    discount:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Order Schema ─────────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    name:          { type: String, required: true },
    email:         { type: String, required: true },
    mobile:        { type: String, required: true },
    address:       { type: String, required: true },
    pincode:       { type: String, required: true },
    items:         [
      {
        productId:   { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        title:       { type: String },
        mainImg:     { type: String },
        size:        { type: String },
        quantity:    { type: Number },
        price:       { type: Number },
        discount:    { type: Number },
      },
    ],
    totalAmount:   { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
    orderDate:     { type: String },
    deliveryDate:  { type: String },
    orderStatus:   { type: String, default: "Order Placed" },
  },
  { timestamps: true }
);

export const User    = mongoose.model("users", userSchema);
export const Admin   = mongoose.model("admin", adminSchema);
export const Product = mongoose.model("products", productSchema);
export const Cart    = mongoose.model("cart", cartSchema);
export const Orders  = mongoose.model("orders", orderSchema);