import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../api/client';
import { CheckCircle, XCircle, Trash2, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// ─── Users ────────────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(r => setUsers(r.data.users || [])).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id, current) => {
    try {
      await adminAPI.toggleUser(id, !current);
      setUsers(u => u.map(x => x.id === id ? { ...x, is_active: !current } : x));
      toast.success(`User ${!current ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-tn-text">Users</h1>
        <span className="text-tn-muted text-sm">{users.length} total</span>
      </div>
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
      ) : (
        <div className="bg-tn-dark border border-tn-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tn-card border-b border-tn-border">
                <tr>
                  {['User', 'Email', 'College', 'Role', 'Joined', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tn-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-tn-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-tn-card/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-tn-orange rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-tn-text">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-tn-muted">{u.email}</td>
                    <td className="px-4 py-3 text-tn-muted">{u.college || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`tag text-xs ${u.role === 'admin' ? 'bg-tn-orange/20 text-tn-orange' : 'bg-tn-card text-tn-muted'}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-tn-muted text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`tag text-xs ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleToggle(u.id, u.is_active)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${u.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getProducts().then(r => setProducts(r.data.products || [])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      setProducts(p => p.filter(x => x.id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleFeatured = async (id, current) => {
    try {
      await adminAPI.toggleFeatured(id, !current);
      setProducts(p => p.map(x => x.id === id ? { ...x, is_featured: !current } : x));
      toast.success(`${!current ? 'Added to' : 'Removed from'} featured`);
    } catch { toast.error('Failed'); }
  };

  const STATUS_C = { available: 'bg-green-500/20 text-green-400', sold: 'bg-red-500/20 text-red-400', inactive: 'bg-tn-card text-tn-muted' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-tn-text">Products</h1>
        <span className="text-tn-muted text-sm">{products.length} total</span>
      </div>
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
      ) : (
        <div className="bg-tn-dark border border-tn-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tn-card border-b border-tn-border">
                <tr>
                  {['Product', 'Category', 'Price', 'Condition', 'Seller', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tn-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-tn-border">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-tn-card/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-tn-card flex-shrink-0">
                          {p.primary_image ? <img src={p.primary_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-base">📦</div>}
                        </div>
                        <span className="font-medium text-tn-text line-clamp-1 max-w-[160px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-tn-muted">{p.category}</td>
                    <td className="px-4 py-3 font-bold text-tn-orange">रू {Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-tn-muted">{p.condition}</td>
                    <td className="px-4 py-3 text-tn-muted">{p.seller_name}</td>
                    <td className="px-4 py-3">
                      <span className={`tag text-xs ${STATUS_C[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/products/${p.id}`}
                          className="w-7 h-7 bg-tn-card rounded-lg flex items-center justify-center text-tn-muted hover:text-tn-text transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleFeatured(p.id, p.is_featured)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${p.is_featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-tn-card text-tn-muted hover:text-yellow-400'}`} title="Feature">
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="w-7 h-7 bg-tn-card rounded-lg flex items-center justify-center text-tn-muted hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getOrders().then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await adminAPI.updateOrderStatus(id, status);
      setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const STATUS_C = { pending: 'text-yellow-400', confirmed: 'text-blue-400', shipped: 'text-purple-400', delivered: 'text-green-400', cancelled: 'text-red-400' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-tn-text">Orders</h1>
        <span className="text-tn-muted text-sm">{orders.length} total</span>
      </div>
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
      ) : (
        <div className="bg-tn-dark border border-tn-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tn-card border-b border-tn-border">
                <tr>
                  {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tn-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-tn-border">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-tn-card/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-tn-muted text-xs">#{o.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-tn-text">{o.username}</p>
                      <p className="text-xs text-tn-muted">{o.email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-tn-orange">रू {Number(o.total_amount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`tag text-xs ${o.payment_status === 'verified' ? 'bg-green-500/20 text-green-400' : o.payment_status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {o.payment_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${STATUS_C[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-tn-muted text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => handleStatus(o.id, e.target.value)}
                        className="text-xs bg-tn-card border border-tn-border rounded-lg px-2 py-1.5 text-tn-text focus:outline-none focus:border-tn-orange">
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    adminAPI.getPayments().then(r => setPayments(r.data.payments || [])).finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await adminAPI.verifyPayment(id, status, noteInput);
      setPayments(p => p.map(x => x.id === id ? { ...x, payment_status: status } : x));
      toast.success(`Payment ${status}`);
      setNoteInput('');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-tn-text">Payments</h1>
        <div className="flex items-center gap-2 text-sm text-tn-muted">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" /> Pending: {payments.filter(p => p.payment_status === 'pending').length}
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedImg && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
          <div className="bg-tn-dark rounded-2xl p-3 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImg} alt="Payment screenshot" className="w-full rounded-xl" />
            <button onClick={() => setSelectedImg(null)} className="w-full mt-3 btn-secondary text-sm py-2">Close</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-16 text-tn-muted">No payments yet</div>
          ) : payments.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-tn-dark border border-tn-border rounded-2xl p-5">
              <div className="flex flex-wrap items-start gap-4">
                {/* Screenshot */}
                {p.payment_screenshot && (
                  <button onClick={() => setSelectedImg(p.payment_screenshot)}
                    className="w-16 h-16 rounded-xl overflow-hidden border border-tn-border flex-shrink-0 hover:border-tn-orange transition-colors">
                    <img src={p.payment_screenshot} alt="Screenshot" className="w-full h-full object-cover" />
                  </button>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-tn-text">{p.username}</p>
                    <span className="text-tn-muted text-xs">· Order #{p.order_id}</span>
                    <span className={`tag text-xs ${p.payment_status === 'verified' ? 'bg-green-500/20 text-green-400' : p.payment_status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {p.payment_status}
                    </span>
                  </div>
                  <p className="text-tn-orange font-bold text-lg">रू {Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs text-tn-muted">{new Date(p.created_at).toLocaleString()}</p>
                </div>

                {/* Actions */}
                {p.payment_status === 'pending' && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <input value={noteInput} onChange={e => setNoteInput(e.target.value)}
                      placeholder="Optional note..." className="input-field text-xs py-1.5 px-3 w-40" />
                    <div className="flex gap-2">
                      <button onClick={() => handleVerify(p.id, 'verified')}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-semibold py-2 rounded-xl transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Verify
                      </button>
                      <button onClick={() => handleVerify(p.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-semibold py-2 rounded-xl transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
