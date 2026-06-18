import { Cart } from "../models/Schema.js";

// ─── Get User Cart ────────────────────────────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id }).populate("productId", "title mainImg price discount stock");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart.", error: err.message });
  }
};

// ─── Add to Cart ──────────────────────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const { productId, title, description, mainImg, size, quantity, price, discount } = req.body;

    const existing = await Cart.findOne({ userId: req.user._id, productId, size });
    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.status(200).json({ message: "Cart updated.", cart: existing });
    }

    const cartItem = await Cart.create({
      userId: req.user._id,
      productId,
      title,
      description,
      mainImg,
      size,
      quantity: quantity || 1,
      price,
      discount,
    });

    res.status(201).json({ message: "Added to cart.", cart: cartItem });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart.", error: err.message });
  }
};

// ─── Update Cart Item Quantity ────────────────────────────────────────────────
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1." });

    const item = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { quantity },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Cart item not found." });

    res.status(200).json({ message: "Cart updated.", cart: item });
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart.", error: err.message });
  }
};

// ─── Remove from Cart ─────────────────────────────────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: "Cart item not found." });
    res.status(200).json({ message: "Item removed from cart." });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item.", error: err.message });
  }
};

// ─── Clear Cart ───────────────────────────────────────────────────────────────
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: "Cart cleared." });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart.", error: err.message });
  }
};