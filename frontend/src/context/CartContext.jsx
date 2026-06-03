import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('tn_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchCart = async () => {
    if (!user) { setItems([]); setTotal(0); return; }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/cart`, { headers: getHeaders() });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, qty = 1) => {
    await axios.post(`${API}/cart`, { product_id: productId, quantity: qty }, { headers: getHeaders() });
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    await axios.delete(`${API}/cart/${productId}`, { headers: getHeaders() });
    await fetchCart();
  };

  const updateQuantity = async (productId, qty) => {
    await axios.put(`${API}/cart/${productId}`, { quantity: qty }, { headers: getHeaders() });
    await fetchCart();
  };

  const clearCart = async () => {
    await axios.delete(`${API}/cart`, { headers: getHeaders() });
    setItems([]);
    setTotal(0);
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, loading, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
