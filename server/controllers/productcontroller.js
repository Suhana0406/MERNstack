import { Product } from "../models/Schema.js";

// ─── Get All Products ─────────────────────────────────────────────────────────
export const getAllProducts = async (req, res) => {
  try {
    const { category, gender, search, minPrice, maxPrice } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (gender && gender !== "All")     filter.gender   = gender;
    if (search)   filter.title    = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products.", error: err.message });
  }
};

// ─── Get Single Product ───────────────────────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product.", error: err.message });
  }
};

// ─── Create Product (Admin) ───────────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created successfully.", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to create product.", error: err.message });
  }
};

// ─── Update Product (Admin) ───────────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ message: "Product updated.", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product.", error: err.message });
  }
};

// ─── Delete Product (Admin) ───────────────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product.", error: err.message });
  }
};