import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Search } from 'lucide-react';
import { productsAPI } from '../api/client';
import ProductCard from '../components/ProductCard';
import { GridSkeleton } from '../components/Skeleton';

const CATEGORIES = ['All', 'Electronics', 'Laptops', 'Phones', 'Fashion', 'Shoes', 'Bags', 'Books', 'Furniture', 'Study Essentials', 'Gaming', 'Accessories'];
const CONDITIONS = ['All', 'New', 'Like New', 'Used'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('search') || '',
  });
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    setFilters(f => ({ ...f, category: cat, search }));
    setSearchInput(search);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.condition) params.condition = filters.condition;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.search) params.search = filters.search;
        const res = await productsAPI.getAll(params);
        setProducts(res.data.products || []);
      } catch { setProducts([]); }
      setLoading(false);
    };
    fetchProducts();
  }, [filters]);

  const updateFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }));

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const clearFilters = () => {
    setFilters({ category: '', condition: '', minPrice: '', maxPrice: '', search: '' });
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.condition || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-tn-text">
              {filters.category || 'All Products'}
            </h1>
            <p className="text-tn-muted text-sm mt-1">
              {loading ? 'Loading...' : `${products.length} items found`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-tn-card border border-tn-border hover:border-tn-orange rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-tn-orange rounded-full" />}
          </button>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tn-muted w-4 h-4" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-11"
            />
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 text-sm">Search</button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = (cat === 'All' && !filters.category) || filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => updateFilter('category', cat === 'All' ? '' : cat)}
                className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-xl transition-all ${active ? 'bg-tn-orange text-white' : 'bg-tn-card border border-tn-border text-tn-muted hover:text-tn-text hover:border-tn-orange/50'}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-tn-dark border border-tn-border rounded-2xl p-5 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => updateFilter('condition', e.target.value === 'All' ? '' : e.target.value)}
                    className="input-field text-sm"
                  >
                    {CONDITIONS.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Min Price (रू)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    placeholder="0"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Max Price (रू)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    placeholder="Any"
                    className="input-field text-sm"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
                  <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {loading ? (
          <GridSkeleton count={12} />
        ) : products.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="font-display text-xl text-tn-text mb-2">No products found</h3>
            <p className="text-tn-muted mb-6">Try different filters or be the first to list something!</p>
            <button onClick={clearFilters} className="btn-secondary text-sm">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
