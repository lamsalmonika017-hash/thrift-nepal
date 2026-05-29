import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      toast.success(res.message || 'Welcome back! 👋');
      navigate(res.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-tn-black via-tn-dark to-tn-black" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-tn-orange/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-tn-dark border border-tn-border rounded-3xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-tn-orange rounded-xl flex items-center justify-center font-display font-bold text-white">TN</div>
              <span className="font-display font-bold text-xl">Thrift<span className="text-tn-orange">Nepal</span></span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-tn-text">Welcome back</h1>
            <p className="text-tn-muted text-sm mt-1">Login to your student account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-tn-muted w-4 h-4" />
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email address" className="input-field pl-11" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-tn-muted w-4 h-4" />
              <input type={showPass ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Password" className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-tn-muted hover:text-tn-text transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>Login</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-tn-muted mt-6">
            New to ThriftNepal?{' '}
            <Link to="/register" className="text-tn-orange hover:underline font-medium">Create account</Link>
          </p>

          <div className="mt-4 pt-4 border-t border-tn-border">
            <p className="text-center text-xs text-tn-muted/60">
              Admin: admin@thriftnepal.com / Admin@123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', college: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await register(form);
      toast.success(res.message || 'Account created! 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-tn-black via-tn-dark to-tn-black" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-tn-orange/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-tn-dark border border-tn-border rounded-3xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-tn-orange rounded-xl flex items-center justify-center font-display font-bold text-white">TN</div>
              <span className="font-display font-bold text-xl">Thrift<span className="text-tn-orange">Nepal</span></span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-tn-text">Join ThriftNepal</h1>
            <p className="text-tn-muted text-sm mt-1">Free forever · No listing fees</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Username" className="input-field" minLength={3} />
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="Email address" className="input-field" />
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Password (min 6 chars)" className="input-field pr-11" minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-tn-muted hover:text-tn-text">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Phone number (optional)" className="input-field" />
            <input value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
              placeholder="College / University (optional)" className="input-field" />

            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account 🎉'}
            </button>
          </form>

          <p className="text-center text-sm text-tn-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-tn-orange hover:underline font-medium">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
