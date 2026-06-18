import { Admin, User, Product, Orders } from "../models/Schema.js";

// ─── Get Admin Config (banner, categories) ────────────────────────────────────
export const getAdminConfig = async (req, res) => {
  try {
    let config = await Admin.findOne();
    if (!config) config = await Admin.create({ banner: "", categories: [] });
    res.status(200).json(config);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch config.", error: err.message });
  }
};

// ─── Update Admin Config ──────────────────────────────────────────────────────
export const updateAdminConfig = async (req, res) => {
  try {
    const config = await Admin.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(200).json({ message: "Config updated.", config });
  } catch (err) {
    res.status(500).json({ message: "Failed to update config.", error: err.message });
  }
};

// ─── Get All Users ────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users.", error: err.message });
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user.", error: err.message });
  }
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments({ usertype: "USER" }),
      Product.countDocuments(),
      Orders.countDocuments(),
      Orders.find().select("totalAmount"),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.status(200).json({ totalUsers, totalProducts, totalOrders, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats.", error: err.message });
  }
};