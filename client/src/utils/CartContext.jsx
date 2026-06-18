import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCart, addToCart as apiAddToCart, removeCartItem, updateCartItem } from "./api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

const loadCart = async () => {
    if (!user) { setCartItems([]); setCartCount(0); return; }
    try {
      const { data } = await fetchCart();
      const safeData = Array.isArray(data) ? data : [];
      setCartItems(safeData);
      setCartCount(safeData.reduce((sum, i) => sum + i.quantity, 0));
    } catch { setCartItems([]); }
  };

  useEffect(() => { loadCart(); }, [user]);

  const addToCart = async (item) => {
    await apiAddToCart(item);
    await loadCart();
  };

  const removeItem = async (id) => {
    await removeCartItem(id);
    await loadCart();
  };

  const updateQty = async (id, quantity) => {
    await updateCartItem(id, { quantity });
    await loadCart();
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const discounted = item.price - (item.price * (item.discount || 0)) / 100;
    return sum + discounted * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeItem, updateQty, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);