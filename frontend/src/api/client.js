import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tn_token');
      localStorage.removeItem('tn_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Products
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getRecent: () => api.get('/products/recent'),
  getByCategory: (cat, limit) => api.get(`/products/category/${cat}`, { params: { limit } }),
  getMine: () => api.get('/products/my'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  markSold: (id) => api.patch(`/products/${id}/sold`),
};

// Cart
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (product_id, quantity = 1) => api.post('/cart', { product_id, quantity }),
  update: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
};

// Wishlist
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (product_id) => api.post('/wishlist/toggle', { product_id }),
};

// Orders
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMine: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
};

// Payments
export const paymentsAPI = {
  submit: (data) => api.post('/payments', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id, is_active) => api.patch(`/admin/users/${id}/toggle`, { is_active }),
  getProducts: () => api.get('/admin/products'),
  toggleFeatured: (id, featured) => api.patch(`/admin/products/${id}/featured`, { featured }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  getPayments: () => api.get('/admin/payments'),
  verifyPayment: (id, status, note) => api.patch(`/admin/payments/${id}/verify`, { status, admin_note: note }),
};

export default api;
