import { Orders, Cart } from "../models/Schema.js";

const getDeliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

// ─── Place Order ──────────────────────────────────────────────────────────────
export const placeOrder = async (req, res) => {
  try {
    const { name, email, mobile, address, pincode, items, totalAmount, paymentMethod } = req.body;

    if (!name || !email || !mobile || !address || !pincode || !items?.length)
      return res.status(400).json({ message: "All order details are required." });

    const order = await Orders.create({
      userId: req.user._id,
      name,
      email,
      mobile,
      address,
      pincode,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      orderDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
      deliveryDate: getDeliveryDate(),
      orderStatus: "Order Placed",
    });

    // Clear the user's cart after placing order
    await Cart.deleteMany({ userId: req.user._id });

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order.", error: err.message });
  }
};

// ─── Get My Orders ────────────────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
  }
};

// ─── Get Order by ID ──────────────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Orders.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order.", error: err.message });
  }
};

// ─── Admin: Get All Orders ────────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find().populate("userId", "username email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all orders.", error: err.message });
  }
};

// ─── Admin: Update Order Status ───────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus))
      return res.status(400).json({ message: "Invalid order status." });

    const order = await Orders.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });

    res.status(200).json({ message: "Order status updated.", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order.", error: err.message });
  }
};