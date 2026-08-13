const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Please specify a brand'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please specify original price'],
      min: 0
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    finalPrice: {
      type: Number,
      min: 0
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: 0,
      default: 0
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate finalPrice before saving
productSchema.pre('save', function (next) {
  if (this.discountPercent > 0) {
    this.finalPrice = Math.round(this.price * (1 - this.discountPercent / 100) * 100) / 100;
  } else {
    this.finalPrice = this.price;
  }
  next();
});

// Indexes for optimized searching and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ finalPrice: 1 });

module.exports = mongoose.model('Product', productSchema);
