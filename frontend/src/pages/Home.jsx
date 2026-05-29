import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Zap, BookOpen, Monitor, Shirt, Package, Gamepad2, Search } from 'lucide-react';
import { productsAPI } from '../api/client';
import ProductCard from '../components/ProductCard';
import { GridSkeleton } from '../components/Skeleton';

const CATEGORIES = [
  { name: 'Electronics', icon: Zap, color: 'from-yellow-500/20 to-yellow-500/5', accent: '#F59E0B', slug: 'Electronics' },
  { name: 'Laptops', icon: Monitor, color: 'from-blue-500/20 to-blue-500/5', accent: '#3B82F6', slug: 'Laptops' },
  { name: 'Books', icon: BookOpen, color: 'from-green-500/20 to-green-500/5', accent: '#22C55E', slug: 'Books' },
  { name: 'Fashion', icon: Shirt, color: 'from-pink-500/20 to-pink-500/5', accent: '#EC4899', slug: 'Fashion' },
  { name: 'Gaming', icon: Gamepad2, color: 'from-purple-500/20 to-purple-500/5', accent: '#A855F7', slug: 'Gaming' },
  { name: 'Furniture', icon: Package, color: 'from-orange-500/20 to-orange-500/5', accent: '#F97316', slug: 'Furniture' },
];

const STATS = [
  { value: '10K+', label: 'Students' },
  { value: '50K+', label: 'Items Listed' },
  { value: '30+', label: 'Colleges' },
  { value: '₹2M+', label: 'Saved' },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, r, e, b] = await Promise.all([
          productsAPI.getTrending(),
          productsAPI.getRecent(),
          productsAPI.getByCategory('Electronics', 6),
          productsAPI.getByCategory('Books', 6),
        ]);
        setTrending(t.data.products || []);
        setRecent(r.data.products || []);
        setElectronics(e.data.products || []);
        setBooks(b.data.products || []);
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-tn-black via-tn-dark to-tn-black" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-tn-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-tn-beige/5 rounded-full blur-3xl" />
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#FF6B35 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 bg-tn-orange/10 border border-tn-orange/20 text-tn-orange text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-tn-orange rounded-full animate-pulse" />
              Nepal's #1 Student Thrift Marketplace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6"
            >
              Buy & Sell
              <span className="block text-gradient">Student Stuff</span>
              <span className="block text-tn-text/80 text-4xl sm:text-5xl lg:text-6xl">in Nepal 🇳🇵</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-tn-muted text-lg sm:text-xl mb-8 max-w-xl leading-relaxed"
            >
              Laptops, phones, books, clothes & more — all from Nepali students. Save money, earn money. Built for hostel life. ✨
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              onSubmit={handleSearch}
              className="flex gap-3 max-w-lg mb-8"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tn-muted w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laptops, books, phones..."
                  className="w-full bg-tn-card border border-tn-border rounded-2xl pl-12 pr-4 py-4 text-tn-text placeholder-tn-muted focus:outline-none focus:border-tn-orange transition-colors text-base"
                />
              </div>
              <button type="submit" className="bg-tn-orange hover:bg-tn-orange-dark text-white font-semibold px-6 py-4 rounded-2xl transition-colors flex items-center gap-2 whitespace-nowrap">
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link to="/products" className="btn-primary flex items-center gap-2">
                Browse Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/sell" className="btn-secondary flex items-center gap-2">
                Start Selling
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex items-center gap-8 mt-14 pt-8 border-t border-tn-border/50 flex-wrap"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-2xl text-tn-orange">{s.value}</p>
                <p className="text-tn-muted text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-tn-orange text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link to={`/products?category=${cat.slug}`}
                  className={`block bg-gradient-to-b ${cat.color} border border-tn-border hover:border-opacity-60 rounded-2xl p-5 text-center group hover:-translate-y-1 transition-all duration-200`}
                  style={{ '--hover-border': cat.accent }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors"
                    style={{ background: `${cat.accent}20` }}>
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: cat.accent }} />
                  </div>
                  <p className="font-semibold text-sm text-tn-text">{cat.name}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Trending Products ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tn-orange/10 border border-tn-orange/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-tn-orange" />
            </div>
            <h2 className="section-title">Trending Now 🔥</h2>
          </div>
          <Link to="/products" className="text-tn-orange text-sm font-medium hover:underline flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        {loading ? (
          <GridSkeleton count={6} />
        ) : trending.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {trending.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-tn-muted">No trending products yet. Be the first to sell! 🎉</div>
        )}
      </section>

      {/* ── Electronics Section ───────────────────────────────────── */}
      {(loading || electronics.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="section-title">⚡ Electronics & Gadgets</h2>
            <Link to="/products?category=Electronics" className="text-tn-orange text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          {loading ? <GridSkeleton count={6} /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {electronics.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Student Deals Banner ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-r from-tn-orange/20 via-tn-orange/10 to-tn-beige/10 border border-tn-orange/30 rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-tn-orange/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-tn-orange/20 text-tn-orange text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🎓 Student Exclusive
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-tn-text mb-3">
              Sell Your Stuff,<br />Fund Your Dreams
            </h2>
            <p className="text-tn-muted max-w-md mb-6">
              Listed 500+ students already selling their items. Your old laptop could be someone's new opportunity. Zero listing fees forever.
            </p>
            <Link to="/sell" className="btn-primary inline-flex items-center gap-2">
              Start Selling Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Books Section ─────────────────────────────────────────── */}
      {(loading || books.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="section-title">📚 Books & Study Material</h2>
            <Link to="/products?category=Books" className="text-tn-orange text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          {loading ? <GridSkeleton count={6} /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {books.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Recently Added ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="section-title">🆕 Just Listed</h2>
          <Link to="/products" className="text-tn-orange text-sm font-medium hover:underline flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        {loading ? <GridSkeleton count={8} /> : recent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recent.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🛍️</p>
            <p className="text-tn-muted mb-6">No products yet. Be the first to list something!</p>
            <Link to="/sell" className="btn-primary">Start Selling</Link>
          </div>
        )}
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title text-center mb-12"
        >
          How ThriftNepal Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'List Your Item', desc: 'Take photos, set your price, and list it in minutes. Completely free.', emoji: '📸' },
            { step: '02', title: 'Someone Buys It', desc: "Students browse and buy your item. They pay via eSewa — Nepal's trusted wallet.", emoji: '🛒' },
            { step: '03', title: 'Get Paid', desc: 'Admin verifies the eSewa payment. You hand over the item and collect your cash.', emoji: '💰' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="bg-tn-dark border border-tn-border rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 font-display font-bold text-5xl text-tn-border select-none">{item.step}</div>
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="font-display font-bold text-lg text-tn-text mb-2">{item.title}</h3>
              <p className="text-tn-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
