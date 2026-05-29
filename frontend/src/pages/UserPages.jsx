import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, ShoppingBag, Heart, Edit3, Camera, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { authAPI, productsAPI, ordersAPI, wishlistAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

// ─── Profile ─────────────────────────────────────────────────────────────────
export function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: user?.username || '', phone: user?.phone || '', college: user?.college || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  if (!user) return <div className="min-h-screen pt-28 flex items-center justify-center"><Link to="/login" className="btn-primary">Login</Link></div>;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('username', form.username);
      fd.append('phone', form.phone);
      fd.append('college', form.college);
      if (avatarFile) fd.append('avatar', avatarFile);
      const res = await authAPI.updateProfile(fd);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-tn-dark border border-tn-border rounded-3xl p-8">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-tn-orange flex items-center justify-center text-3xl font-bold text-white">
                  {avatarPreview || user.avatar
                    ? <img src={avatarPreview || user.avatar} alt="" className="w-full h-full object-cover" />
                    : user.username?.[0]?.toUpperCase()}
                </div>
                {editing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-tn-orange rounded-full flex items-center justify-center cursor-pointer">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                )}
              </div>
              <h2 className="font-display font-bold text-2xl text-tn-text mt-4">{user.username}</h2>
              <p className="text-tn-muted text-sm">{user.email}</p>
              {user.college && <p className="text-tn-muted text-sm mt-1">🎓 {user.college}</p>}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Username</label>
                  <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="98XXXXXXXX" />
                </div>
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">College</label>
                  <input value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))} className="input-field" placeholder="Your college name" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={loading} className="flex-1 btn-primary py-3 disabled:opacity-60">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(false)} className="flex-1 btn-secondary py-3">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={() => setEditing(true)} className="w-full btn-secondary flex items-center justify-center gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/my-listings" className="flex items-center justify-center gap-2 bg-tn-card border border-tn-border rounded-xl py-3 text-sm font-medium hover:border-tn-orange transition-colors">
                    <Package className="w-4 h-4 text-tn-orange" /> My Listings
                  </Link>
                  <Link to="/orders" className="flex items-center justify-center gap-2 bg-tn-card border border-tn-border rounded-xl py-3 text-sm font-medium hover:border-tn-orange transition-colors">
                    <ShoppingBag className="w-4 h-4 text-tn-orange" /> My Orders
                  </Link>
                </div>
                <button onClick={logout} className="w-full py-3 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium">
                  Logout
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── My Listings ─────────────────────────────────────────────────────────────
export function MyListings() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    productsAPI.getMine()
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await productsAPI.delete(id);
      setProducts(p => p.filter(x => x.id !== id));
      toast.success('Listing deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleMarkSold = async (id) => {
    try {
      await productsAPI.markSold(id);
      setProducts(p => p.map(x => x.id === id ? { ...x, status: 'sold' } : x));
      toast.success('Marked as sold!');
    } catch { toast.error('Failed'); }
  };

  if (!user) return <div className="min-h-screen pt-28 flex items-center justify-center"><Link to="/login" className="btn-primary">Login</Link></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl text-tn-text">My Listings</h1>
          <Link to="/sell" className="btn-primary flex items-center gap-2 text-sm">
            <span>+</span> New Listing
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-tn-orange border-t-transparent rounded-full animate-spin" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="font-display text-xl text-tn-text mb-2">No listings yet</h3>
            <p className="text-tn-muted mb-6">Start selling your unused items!</p>
            <Link to="/sell" className="btn-primary">List Something</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(p => (
              <div key={p.id} className="relative group">
                <ProductCard product={p} />
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {p.status === 'available' && (
                    <button onClick={() => handleMarkSold(p.id)}
                      className="w-7 h-7 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center" title="Mark as sold">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <Link to={`/sell/edit/${p.id}`}
                    className="w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center" title="Edit">
                    <Edit3 className="w-3.5 h-3.5 text-white" />
                  </Link>
                  <button onClick={() => handleDelete(p.id)}
                    className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center" title="Delete">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};
const PAYMENT_STYLES = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  verified: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
};

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    ordersAPI.getMine()
      .then(r => setOrders(r.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="min-h-screen pt-28 flex items-center justify-center"><Link to="/login" className="btn-primary">Login</Link></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-bold text-3xl text-tn-text mb-8">My Orders</h1>
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-tn-orange border-t-transparent rounded-full animate-spin" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🛍️</p>
            <h3 className="font-display text-xl text-tn-text mb-2">No orders yet</h3>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-tn-dark border border-tn-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-tn-text">Order #{order.id}</p>
                    <p className="text-xs text-tn-muted mt-0.5">{new Date(order.created_at).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`tag text-xs ${STATUS_STYLES[order.status] || 'bg-tn-card text-tn-muted'}`}>
                      {order.status}
                    </span>
                    {order.payment_status && (
                      <span className={`tag text-xs ${PAYMENT_STYLES[order.payment_status]}`}>
                        Payment: {order.payment_status}
                      </span>
                    )}
                  </div>
                </div>
                {order.product_titles && (
                  <p className="text-sm text-tn-muted line-clamp-1 mb-3">{order.product_titles}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-tn-border">
                  <span className="font-bold text-tn-orange">रू {Number(order.total_amount).toLocaleString()}</span>
                  <Link to={`/orders/${order.id}`} className="text-sm text-tn-orange hover:underline">View Details →</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    wishlistAPI.get()
      .then(r => setItems(r.data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="min-h-screen pt-28 flex items-center justify-center"><Link to="/login" className="btn-primary">Login</Link></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-7 h-7 text-tn-orange" />
          <h1 className="font-display font-bold text-3xl text-tn-text">Wishlist</h1>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-tn-orange border-t-transparent rounded-full animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💛</p>
            <h3 className="font-display text-xl text-tn-text mb-2">Nothing saved yet</h3>
            <p className="text-tn-muted mb-6">Tap the heart icon on any product to save it</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map(item => (
              <ProductCard key={item.id} product={{ ...item, id: item.product_id, primary_image: item.image }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
