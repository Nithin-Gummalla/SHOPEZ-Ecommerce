import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const response = await API.get('/cart');
      setCart(response.data || { items: [] });
    } catch (err) {
      console.error('Error fetching cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error('Please log in to add items to cart');
    }
    setLoading(true);
    try {
      const response = await API.post('/cart', { productId, quantity });
      setCart(response.data);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await API.put(`/cart/${productId}`, { quantity });
      setCart(response.data);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await API.delete(`/cart/${productId}`);
      setCart(response.data);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await API.delete('/cart');
      setCart({ items: [] });
    } catch (err) {
      console.error('Error clearing cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const cartItems = cart.items || [];
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const itemsPrice = cartItems.reduce((acc, item) => {
    const p = item.product;
    if (!p) return acc;
    return acc + (p.finalPrice || p.price) * item.quantity;
  }, 0);

  const originalTotal = cartItems.reduce((acc, item) => {
    const p = item.product;
    if (!p) return acc;
    return acc + p.price * item.quantity;
  }, 0);

  const discountAmount = originalTotal - itemsPrice;
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        itemsPrice,
        originalTotal,
        discountAmount,
        taxPrice,
        shippingPrice,
        totalPrice,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
