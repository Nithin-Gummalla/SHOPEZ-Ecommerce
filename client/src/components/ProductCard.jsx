import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import RatingStars from './RatingStars';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMsg(null);
    setAdding(true);

    try {
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add item');
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setAdding(false);
    }
  };

  const finalPrice = product.finalPrice || product.price;

  return (
    <div className="card h-100 border-0 shadow-sm custom-card rounded-3 overflow-hidden position-relative">
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span className="position-absolute top-0 start-0 m-3 badge bg-danger z-2 shadow-sm rounded-2 fs-7 fw-bold px-2 py-1">
          {product.discountPercent}% OFF
        </span>
      )}

      {/* Product Image Link */}
      <Link to={`/products/${product._id}`} className="product-card-img-wrapper text-decoration-none">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
      </Link>

      <div className="card-body d-flex flex-column p-3">
        {/* Category & Brand */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-uppercase tracking-wider text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
            {product.category}
          </span>
          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
            {product.brand}
          </span>
        </div>

        {/* Title */}
        <h6 className="card-title fw-bold text-dark mb-2 text-truncate-2" style={{ height: '2.5rem', lineHeight: '1.25rem' }}>
          <Link to={`/products/${product._id}`} className="text-dark text-decoration-none hover-primary">
            {product.name}
          </Link>
        </h6>

        {/* Rating */}
        <div className="mb-2">
          <RatingStars rating={product.rating} numReviews={product.numReviews} size={14} />
        </div>

        {/* Price & Stock */}
        <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
          <div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-5 fw-extrabold text-primary">
                ${finalPrice.toFixed(2)}
              </span>
              {product.discountPercent > 0 && (
                <span className="text-muted text-decoration-line-through small">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {product.stock <= 0 ? (
              <span className="text-danger fw-semibold" style={{ fontSize: '0.75rem' }}>Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-warning fw-semibold" style={{ fontSize: '0.75rem' }}>Only {product.stock} left!</span>
            ) : (
              <span className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}>In Stock ({product.stock})</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`btn rounded-pill d-flex align-items-center justify-content-center p-2 shadow-sm transition-all ${
              added
                ? 'btn-success text-white'
                : product.stock <= 0
                ? 'btn-secondary opacity-50'
                : 'btn-primary-custom'
            }`}
            style={{ width: '40px', height: '40px' }}
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          >
            {adding ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : added ? (
              <Check size={18} />
            ) : (
              <ShoppingCart size={18} />
            )}
          </button>
        </div>

        {/* Error message popup if auth or stock issue */}
        {errorMsg && (
          <div className="alert alert-danger p-1 mt-2 mb-0 text-center rounded-2 small d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '0.75rem' }}>
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
