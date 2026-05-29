import { Link } from 'react-router-dom';
import { Github, Instagram, Facebook, Twitter } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Laptops', 'Phones', 'Fashion', 'Books', 'Furniture', 'Gaming', 'Study Essentials'];
const LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Sell With Us', href: '/sell' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-tn-dark border-t border-tn-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-tn-orange rounded-lg flex items-center justify-center font-display font-bold text-white">TN</div>
              <span className="font-display font-bold text-2xl">Thrift<span className="text-tn-orange">Nepal</span></span>
            </div>
            <p className="text-tn-muted text-sm leading-relaxed max-w-xs">
              Nepal's first dedicated student thrift marketplace. Buy & sell laptops, phones, books, clothes and more — all from fellow students. 🎓
            </p>
            <p className="text-tn-muted/60 text-xs mt-4">Sustainable. Affordable. Student-first.</p>
            <div className="flex items-center gap-3 mt-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-tn-card border border-tn-border rounded-lg flex items-center justify-center text-tn-muted hover:text-tn-orange hover:border-tn-orange/50 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-tn-text mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-sm text-tn-muted hover:text-tn-orange transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-tn-text mb-4">Company</h4>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-tn-muted hover:text-tn-orange transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-tn-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-tn-muted text-xs">© 2025 ThriftNepal. Made with ❤️ for Nepali students.</p>
          <div className="flex items-center gap-4">
            <span className="text-tn-muted/50 text-xs">eSewa Verified</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
