import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, LayoutDashboard, Package, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { name: 'Electronics', slug: 'Electronics' },
  { name: 'Laptops', slug: 'Laptops' },
  { name: 'Phones', slug: 'Phones' },
  { name: 'Fashion', slug: 'Fashion' },
  { name: 'Books', slug: 'Books' },
  { name: 'Furniture', slug: 'Furniture' },
  { name: 'Gaming', slug: 'Gaming' },
  { name: 'Study Essentials', slug: 'Study Essentials' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-tn-black/95 backdrop-blur-xl border-b border-tn-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-tn-orange rounded-lg flex items-center justify-center font-display font-bold text-sm text-white group-hover:scale-110 transition-transform">
              TN
            </div>
            <span className="font-display font-bold text-xl text-tn-text hidden sm:block">
              Thrift<span className="text-tn-orange">Nepal</span>
            </span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tn-muted w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laptops, books, clothes..."
                className="w-full bg-tn-card border border-tn-border rounded-xl pl-10 pr-4 py-2 text-sm text-tn-text placeholder-tn-muted focus:outline-none focus:border-tn-orange transition-colors"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/sell" className="hidden md:flex items-center gap-1.5 bg-tn-orange hover:bg-tn-orange-dark text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" />
                  Sell
                </Link>
                <Link to="/wishlist" className="relative p-2 hover:text-tn-orange transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/cart" className="relative p-2 hover:text-tn-orange transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {count > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-tn-orange text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-tn-card transition-colors">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 bg-tn-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-tn-dark border border-tn-border rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-tn-border">
                          <p className="font-semibold text-sm text-tn-text">{user.username}</p>
                          <p className="text-xs text-tn-muted truncate">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-tn-text hover:bg-tn-card rounded-xl transition-colors">
                            <User className="w-4 h-4 text-tn-muted" /> My Profile
                          </Link>
                          <Link to="/my-listings" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-tn-text hover:bg-tn-card rounded-xl transition-colors">
                            <Package className="w-4 h-4 text-tn-muted" /> My Listings
                          </Link>
                          <Link to="/orders" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-tn-text hover:bg-tn-card rounded-xl transition-colors">
                            <ShoppingCart className="w-4 h-4 text-tn-muted" /> My Orders
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-tn-orange hover:bg-tn-card rounded-xl transition-colors">
                              <LayoutDashboard className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-tn-card rounded-xl transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-tn-muted hover:text-tn-text text-sm font-medium px-3 py-2 transition-colors">Login</Link>
                <Link to="/register" className="bg-tn-orange hover:bg-tn-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                  Join Free
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:text-tn-orange transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide border-t border-tn-border/50">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`}
              className="flex-shrink-0 text-xs font-medium text-tn-muted hover:text-tn-orange px-3 py-1.5 rounded-lg hover:bg-tn-card transition-all whitespace-nowrap">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-tn-dark border-t border-tn-border overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tn-muted w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-tn-card border border-tn-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-tn-text placeholder-tn-muted focus:outline-none focus:border-tn-orange"
                  />
                </div>
              </form>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <Link key={cat.slug} to={`/products?category=${cat.slug}`}
                    className="text-sm text-tn-muted hover:text-tn-orange py-2 px-3 rounded-xl hover:bg-tn-card transition-all">
                    {cat.name}
                  </Link>
                ))}
              </div>
              {user && (
                <Link to="/sell" className="flex items-center justify-center gap-2 bg-tn-orange text-white py-3 rounded-xl font-semibold">
                  <Plus className="w-4 h-4" /> Sell Something
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
