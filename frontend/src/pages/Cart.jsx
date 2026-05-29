import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, total, removeFromCart, updateQuantity, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="text-center">
        <ShoppingCart className="w-16 h-16 text-tn-muted mx-auto mb-4" />
        <h2 className="font-display text-xl text-tn-text mb-2">Login to view cart</h2>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-tn-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl text-tn-text mb-2">Your cart is empty</h2>
        <p className="text-tn-muted mb-6">Browse the marketplace to find great deals</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const handleRemove = async (productId) => {
    try { await removeFromCart(productId); toast.success('Removed'); }
    catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl text-tn-text mb-8">
          Shopping Cart <span className="text-tn-muted text-xl font-normal">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-tn-dark border border-tn-border rounded-2xl p-4 flex items-center gap-4"
                >
                  <Link to={`/products/${item.product_id}`} className="w-16 h-16 bg-tn-card rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product_id}`} className="font-semibold text-tn-text hover:text-tn-orange transition-colors line-clamp-1 text-sm">
                      {item.title}
                    </Link>
                    <p className="text-tn-orange font-bold mt-0.5">रू {Number(item.price).toLocaleString()}</p>
                    {item.product_status === 'sold' && (
                      <span className="text-xs text-red-400 font-medium">⚠️ Item sold — please remove</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-7 h-7 bg-tn-card border border-tn-border rounded-lg flex items-center justify-center hover:border-tn-orange transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-7 h-7 bg-tn-card border border-tn-border rounded-lg flex items-center justify-center hover:border-tn-orange transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button onClick={() => handleRemove(item.product_id)}
                    className="text-tn-muted hover:text-red-400 transition-colors p-1.5 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-tn-dark border border-tn-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-tn-text mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-tn-muted">
                  <span>Subtotal</span>
                  <span className="text-tn-text">रू {Number(total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-tn-muted">
                  <span>Delivery</span>
                  <span className="text-green-400 font-medium">Campus Pickup</span>
                </div>
                <div className="border-t border-tn-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-tn-orange">रू {Number(total).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/products" className="block text-center text-sm text-tn-muted hover:text-tn-orange mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
