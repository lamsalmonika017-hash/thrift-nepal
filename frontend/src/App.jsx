import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import { Login, Register } from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Sell from './pages/Sell';
import { Profile, MyListings, Orders, Wishlist } from './pages/UserPages';
import { AdminLayout, AdminOverview } from './admin/AdminLayout';
import { AdminUsers, AdminProducts, AdminOrders, AdminPayments } from './admin/AdminPages';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-tn-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-center px-4">
            <div>
              <p className="text-7xl mb-4">404</p>
              <h2 className="font-display text-2xl text-tn-text mb-2">Page not found</h2>
              <a href="/" className="text-tn-orange hover:underline">Go home</a>
            </div>
          </div>
        } />
      </Routes>
      <Footer />
    </>
  );
}

function AdminApp() {
  return (
    <AdminRoute>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>
      </Routes>
    </AdminRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1A1A1A',
                color: '#E8E8E8',
                border: '1px solid #2E2E2E',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
