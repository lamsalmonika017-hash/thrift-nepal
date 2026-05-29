import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Plus, ArrowRight } from 'lucide-react';
import { productsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Laptops', 'Phones', 'Fashion', 'Shoes', 'Bags', 'Books', 'Furniture', 'Study Essentials', 'Gaming', 'Accessories'];
const CONDITIONS = ['New', 'Like New', 'Used'];

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', price: '', condition: 'Used' });

  if (!user) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="font-display text-xl text-tn-text mb-2">Login to sell items</h2>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    </div>
  );

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) { toast.error('Max 5 images allowed'); return; }
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(p => [...p, ...newPreviews]);
  };

  const removeImage = (i) => {
    setImages(imgs => imgs.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.price) { toast.error('Please fill all required fields'); return; }
    if (parseFloat(form.price) <= 0) { toast.error('Price must be greater than 0'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      const res = await productsAPI.create(fd);
      toast.success('Product listed successfully! 🎉');
      navigate(`/products/${res.data.productId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list product');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-tn-orange/10 border border-tn-orange/20 text-tn-orange text-sm font-medium px-4 py-1.5 rounded-full mb-3">
              ✨ Free to list · No commission
            </div>
            <h1 className="font-display font-bold text-3xl text-tn-text">List Your Item</h1>
            <p className="text-tn-muted mt-1">Sell to fellow students across Nepal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div className="bg-tn-dark border border-tn-border rounded-2xl p-5">
              <label className="text-sm font-semibold text-tn-text mb-3 block">Product Photos</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-tn-card border border-tn-border">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-tn-orange text-white px-1 rounded">Main</span>}
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-tn-border hover:border-tn-orange transition-colors cursor-pointer flex flex-col items-center justify-center bg-tn-card group">
                    <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                    <Plus className="w-6 h-6 text-tn-muted group-hover:text-tn-orange transition-colors" />
                    <span className="text-[10px] text-tn-muted mt-1 group-hover:text-tn-orange transition-colors">
                      {images.length === 0 ? 'Add Photo' : 'Add More'}
                    </span>
                  </label>
                )}
              </div>
              <p className="text-xs text-tn-muted mt-2">First photo will be the main image · Max 5 photos</p>
            </div>

            {/* Product Info */}
            <div className="bg-tn-dark border border-tn-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-tn-text">Product Details</h3>
              <div>
                <label className="text-xs text-tn-muted font-medium mb-1.5 block">Title *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Dell Inspiron 15 Laptop 2021 — Excellent Condition"
                  className="input-field" maxLength={200} />
              </div>
              <div>
                <label className="text-xs text-tn-muted font-medium mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your item — condition, specs, reason for selling, any flaws..."
                  rows={4} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="input-field">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Condition *</label>
                  <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                    className="input-field">
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-tn-muted font-medium mb-1.5 block">Price (रू) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tn-muted font-medium">रू</span>
                  <input required type="number" min="1" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 25000" className="input-field pl-10" />
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-tn-orange/5 border border-tn-orange/20 rounded-2xl p-4">
              <p className="text-sm font-medium text-tn-orange mb-2">💡 Tips for faster sales</p>
              <ul className="text-xs text-tn-muted space-y-1">
                <li>• Add clear, well-lit photos from multiple angles</li>
                <li>• Mention brand, model, year, and any defects</li>
                <li>• Price 10–20% below market rate for quick sale</li>
                <li>• Include your college location for campus meetup</li>
              </ul>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>List Item for Free</span><ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
