import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Package, ShoppingBag, CreditCard,
  ChevronRight, Menu, X, TrendingUp, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { adminAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
];

export function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/'); }
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-tn-black flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-tn-dark border-r border-tn-border transform transition-transform duration-300 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-5 border-b border-tn-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tn-orange rounded-lg flex items-center justify-center font-display font-bold text-white text-sm">TN</div>
            <div>
              <p className="font-display font-bold text-sm text-tn-text">ThriftNepal</p>
              <p className="text-[10px] text-tn-muted">Admin Panel</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-tn-muted"><X className="w-4 h-4" /></button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-tn-orange text-white' : 'text-tn-muted hover:text-tn-text hover:bg-tn-card'}`}>
                <Icon className="w-4 h-4" />
                {item.label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-tn-border">
          <div className="flex items-center gap-2.5 p-3 bg-tn-card rounded-xl">
            <div className="w-8 h-8 bg-tn-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-tn-text truncate">{user.username}</p>
              <p className="text-[10px] text-tn-orange">Administrator</p>
            </div>
          </div>
          <Link to="/" className="block text-center text-xs text-tn-muted hover:text-tn-text mt-2 transition-colors">← Back to site</Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 bg-tn-dark border-b border-tn-border flex items-center px-4 gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-tn-muted hover:text-tn-text">
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-sm font-semibold text-tn-text">
            {NAV.find(n => n.path === location.pathname)?.label || 'Admin'}
          </p>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
export function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getPayments()])
      .then(([s, p]) => { setStats(s.data.stats); setPayments((p.data.payments || []).slice(0, 5)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Products Listed', value: stats.products, icon: Package, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Verified Revenue', value: `रू ${Number(stats.revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-tn-orange', bg: 'bg-tn-orange/10' },
  ] : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-tn-text">Dashboard Overview</h1>
        <p className="text-tn-muted text-sm mt-1">Welcome back, Admin</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-tn-dark border border-tn-border rounded-2xl p-5">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className="font-display font-bold text-2xl text-tn-text">{s.value}</p>
                <p className="text-xs text-tn-muted mt-0.5">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Payments */}
      <div className="bg-tn-dark border border-tn-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-tn-text">Recent Payments</h2>
          <Link to="/admin/payments" className="text-tn-orange text-sm hover:underline">View all</Link>
        </div>
        {payments.length === 0 ? (
          <p className="text-tn-muted text-sm text-center py-6">No payments yet</p>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-tn-card rounded-xl">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.payment_status === 'verified' ? 'bg-green-500' : p.payment_status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-tn-text font-medium">{p.username}</p>
                  <p className="text-xs text-tn-muted">Order #{p.order_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-tn-orange">रू {Number(p.amount).toLocaleString()}</p>
                  <span className={`text-[10px] font-medium ${p.payment_status === 'verified' ? 'text-green-400' : p.payment_status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {p.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
