import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../api/client';
import toast from 'react-hot-toast';

const CONDITION_COLORS = {
  'New': 'bg-green-500/20 text-green-400 border border-green-500/30',
  'Like New': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'Used': 'bg-tn-orange/20 text-tn-orange border border-tn-orange/30',
};

const CATEGORY_EMOJIS = {
  'Electronics': '⚡', 'Laptops': '💻', 'Phones': '📱', 'Fashion': '👕',
  'Shoes': '👟', 'Bags': '🎒', 'Books': '📚', 'Furniture': '🪑',
  'Study Essentials': '✏️', 'Gaming': '🎮', 'Accessories': '🎧',
  'default': '📦'
};

export default function ProductCard({ product, className = '' }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const img = product.primary_image || product.images?.[0]?.image_url;
  const emoji = CATEGORY_EMOJIS[product.category] || CATEGORY_EMOJIS.default;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to save items'); return; }
    try {
      const res = await wishlistAPI.toggle(product.id);
      setWishlisted(res.data.wishlisted);
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (product.status === 'sold') { toast.error('Item already sold'); return; }
    try {
      setCartLoading(true);
      await addToCart(product.id);
      toast.success('Added to cart! 🛒');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`product-card group ${className}`}
    >
      <Link to={`/products/${product.id}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-tn-card">
          {img ? (
            <img
              src={img}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-tn-card to-tn-dark">
              {emoji}
            </div>
          )}

          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-tn-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          {product.status === 'sold' && (
            <div className="absolute inset-0 bg-tn-black/70 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full rotate-[-15deg]">SOLD</span>
            </div>
          )}

          {/* Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={handleWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${wishlisted ? 'bg-red-500 text-white' : 'bg-tn-black/70 text-tn-text hover:bg-red-500'}`}>
              <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Condition Tag */}
          <div className="absolute top-2 left-2">
            <span className={`tag ${CONDITION_COLORS[product.condition] || 'bg-tn-card text-tn-muted'}`}>
              {product.condition}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-tn-text text-sm leading-tight line-clamp-2 flex-1">{product.title}</h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-bold text-tn-orange text-lg">
              रू {Number(product.price).toLocaleString()}
            </span>
            {product.status !== 'sold' && (
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="w-8 h-8 bg-tn-orange hover:bg-tn-orange-dark text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-xs text-tn-muted truncate">{product.seller_name}</span>
            {product.seller_college && (
              <>
                <span className="text-tn-border">·</span>
                <span className="text-xs text-tn-muted flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />{product.seller_college}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
