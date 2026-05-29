const { Product } = require('../models/Product');
const path = require('path');

const getAllProducts = async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, search, limit } = req.query;
    const [products] = await Product.getAll({ category, condition, minPrice, maxPrice, search, limit });
    res.json({ success: true, products });
  } catch (error) {
    console.error('getAll error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const [products] = await Product.getFeatured();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured products' });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const [products] = await Product.getTrending();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending products' });
  }
};

const getRecentProducts = async (req, res) => {
  try {
    const [products] = await Product.getRecent();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recent products' });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 8;
    const [products] = await Product.getByCategory(category, limit);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category products' });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const [products] = await Product.getBySeller(req.user.userId);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, condition } = req.body;
    if (!title || !category || !price)
      return res.status(400).json({ success: false, message: 'Title, category, and price are required' });

    const result = await Product.create({
      title, description, category,
      price: parseFloat(price),
      condition: condition || 'Used',
      seller_id: req.user.userId,
    });

    const productId = result.insertId;
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(f => `/uploads/products/${f.filename}`);
      await Product.addImages(productId, imageUrls);
    }

    res.status(201).json({ success: true, message: 'Product listed successfully! 🎉', productId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.seller_id !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const { title, description, category, price, condition, status } = req.body;
    await Product.update(req.params.id, { title, description, category, price, condition, status });

    if (req.files && req.files.length > 0) {
      await Product.deleteImages(req.params.id);
      const imageUrls = req.files.map(f => `/uploads/products/${f.filename}`);
      await Product.addImages(req.params.id, imageUrls);
    }
    res.json({ success: true, message: 'Product updated!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.seller_id !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await Product.delete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

const markAsSold = async (req, res) => {
  try {
    await Product.markAsSold(req.params.id);
    res.json({ success: true, message: 'Marked as sold!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as sold' });
  }
};

// Admin
const adminGetAllProducts = async (req, res) => {
  try {
    const [products] = await Product.adminGetAll();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const { featured } = req.body;
    await Product.toggleFeatured(req.params.id, featured);
    res.json({ success: true, message: 'Featured status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
};

module.exports = {
  getAllProducts, getFeaturedProducts, getTrendingProducts, getRecentProducts,
  getProductsByCategory, getProduct, getMyProducts, createProduct, updateProduct,
  deleteProduct, markAsSold, adminGetAllProducts, toggleFeatured,
};
