const Product = require('../models/Product');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    let query = {};

    // Search Keyword
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { category: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Category Filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Price Filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.finalPrice = {};
      if (req.query.minPrice) query.finalPrice.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.finalPrice.$lte = Number(req.query.maxPrice);
    }

    // Sorting
    let sortOptions = {};
    if (req.query.sort === 'price-asc') {
      sortOptions.finalPrice = 1;
    } else if (req.query.sort === 'price-desc') {
      sortOptions.finalPrice = -1;
    } else if (req.query.sort === 'rating') {
      sortOptions.rating = -1;
    } else if (req.query.sort === 'discount') {
      sortOptions.discountPercent = -1;
    } else {
      sortOptions.createdAt = -1; // Default to newest
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const categories = await Product.distinct('category');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Product ID format' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const reviews = await Review.find({ product: product._id }).populate('user', 'name');
      res.json({ product, reviews });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, images, brand, category, stock, discountPercent } = req.body;

    if (!name || !price || !description || !brand || !category) {
      return res.status(400).json({ message: 'Please provide all required product fields' });
    }

    const product = new Product({
      name,
      price: Number(price),
      discountPercent: Number(discountPercent) || 0,
      description,
      brand,
      category,
      stock: Number(stock) || 0,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80']
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const { name, price, description, images, brand, category, stock, discountPercent } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.discountPercent = discountPercent !== undefined ? Number(discountPercent) : product.discountPercent;
      product.description = description || product.description;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      if (images && images.length > 0) {
        product.images = images;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      await Review.deleteMany({ product: product._id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide rating and comment' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = await Review.findOne({
        product: product._id,
        user: req.user._id
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed by you' });
      }

      const review = new Review({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        product: product._id
      });

      await review.save();

      const allReviews = await Review.find({ product: product._id });
      product.numReviews = allReviews.length;
      product.rating =
        allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

      await product.save();

      res.status(201).json({ message: 'Review added successfully', review });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories
};
