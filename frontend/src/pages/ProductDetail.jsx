import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ArrowLeft, MapPin, Clock, Tag, CheckCircle, Phone } from 'lucide-react';
import { productsAPI, wishlistAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    productsAPI.getById(id).then(res => {
      setProduct(res.data.product);
    }).catch(() => toast.error('Product not found')).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (product?.status === 'sold') { toast.error('Item already sold'); return; }
    setCartLoading(true);
    try {
      await addToCart(product.id);
      toast.success('Added to cart! 🛒');
    } catch { toast.error('Failed to add to cart'); }
    setCartLoading(false);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const res = await wishlistAPI.toggle(product.id);
      setWishlisted(res.data.wishlisted);
      toast.success(res.data.message);
    } catch { toast.error('Failed'); }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-tn-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-28 flex items-center justify-center text-tn-muted">
      Product not found
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-tn-muted hover:text-tn-text transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative aspect-square bg-tn-card rounded-3xl overflow-hidden mb-3">
              {hasImages ? (
                <img src={images[activeImg]?.image_url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-tn-card to-tn-dark">
                  📦
                </div>
              )}
              {product.status === 'sold' && (
                <div className="absolute inset-0 bg-tn-black/70 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xl font-bold px-6 py-3 rounded-full rotate-[-12deg]">SOLD OUT</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-tn-orange' : 'border-tn-border'}`}>
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="tag bg-tn-card text-tn-muted text-xs">{product.category}</span>
              <span className={`tag text-xs ${
                product.condition === 'New' ? 'bg-green-500/20 text-green-400' :
                product.condition === 'Like New' ? 'bg-blue-500/20 text-blue-400' :
                'bg-tn-orange/20 text-tn-orange'
              }`}>{product.condition}</span>
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-tn-text mb-3 leading-tight">{product.title}</h1>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display font-bold text-4xl text-tn-orange">
                रू {Number(product.price).toLocaleString()}
              </span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-tn-muted uppercase tracking-wide mb-2">Description</h3>
                <p className="text-tn-text/80 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-tn-card border border-tn-border rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-sm text-tn-muted uppercase tracking-wide mb-3">Seller</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tn-orange rounded-full flex items-center justify-center text-white font-bold">
                  {product.seller_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-tn-text">{product.seller_name}</p>
                  {product.seller_college && (
                    <p className="text-xs text-tn-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {product.seller_college}
                    </p>
                  )}
                </div>
              </div>
              {product.seller_phone && (
                <div className="mt-3 pt-3 border-t border-tn-border">
                  <p className="text-xs text-tn-muted flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> {product.seller_phone}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {product.status !== 'sold' ? (
                <>
                  <button onClick={handleAddToCart} disabled={cartLoading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                    <ShoppingCart className="w-5 h-5" />
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button onClick={handleWishlist}
                    className={`w-12 h-12 border rounded-xl flex items-center justify-center transition-colors ${
                      wishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-tn-border hover:border-red-500 hover:text-red-400'
                    }`}>
                    <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={handleShare}
                    className="w-12 h-12 border border-tn-border hover:border-tn-orange rounded-xl flex items-center justify-center transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 bg-tn-card border border-tn-border rounded-xl py-3 text-tn-muted font-semibold">
                  This item has been sold
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-tn-muted">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Verified student seller · Safe campus exchange
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
