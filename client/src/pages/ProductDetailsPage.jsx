import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, Star, MessageSquare, ArrowLeft } from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data.product);
      setReviews(response.data.reviews || []);
      if (response.data.product.images && response.data.product.images.length > 0) {
        setSelectedImage(response.data.product.images[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setCartError(null);
    setAddingToCart(true);

    try {
      await addToCart(product._id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err) {
      setCartError(err.message || 'Failed to add item');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please login to leave a review');
      return;
    }
    if (!newComment.trim()) {
      setReviewError('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);

    try {
      await API.post(`/products/${id}/reviews`, {
        rating: newRating,
        comment: newComment
      });
      setReviewSuccess(true);
      setNewComment('');
      fetchProductDetails();
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product specifications..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchProductDetails} /></div>;
  if (!product) return null;

  const finalPrice = product.finalPrice || product.price;

  return (
    <div className="container py-4">
      {/* Back button */}
      <Link to="/products" className="btn btn-sm btn-link text-decoration-none text-muted p-0 mb-4 d-inline-flex align-items-center gap-1">
        <ArrowLeft size={16} /> Back to Products Catalog
      </Link>

      <div className="row g-4 mb-5">
        {/* Product Images Column */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
            <div className="position-relative bg-light text-center" style={{ minHeight: '380px' }}>
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                alt={product.name}
                className="img-fluid object-fit-contain p-4"
                style={{ maxHeight: '420px', width: '100%' }}
              />
              {product.discountPercent > 0 && (
                <span className="position-absolute top-0 start-0 m-3 badge bg-danger z-2 shadow-sm rounded-2 fs-6 px-3 py-2 fw-bold">
                  {product.discountPercent}% DISCOUNT
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={`rounded-3 border cursor-pointer object-fit-cover p-1 ${
                    selectedImage === img ? 'border-primary border-2 shadow-sm' : 'border-light opacity-75'
                  }`}
                  style={{ width: '70px', height: '70px' }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="col-12 col-md-6">
          <div className="ps-md-3">
            <span className="badge bg-light text-primary border text-uppercase tracking-wider fw-bold mb-2">
              {product.category}
            </span>

            <h2 className="fw-extrabold text-dark mb-2">{product.name}</h2>

            <div className="d-flex align-items-center gap-3 mb-3">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size={18} />
              <span className="text-muted">|</span>
              <span className="text-secondary small">Brand: <strong className="text-dark">{product.brand}</strong></span>
            </div>

            {/* Pricing Section */}
            <div className="p-3 bg-light rounded-3 mb-4 d-flex align-items-baseline gap-3">
              <span className="display-6 fw-extrabold text-primary">
                ${finalPrice.toFixed(2)}
              </span>
              {product.discountPercent > 0 && (
                <span className="fs-5 text-muted text-decoration-line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Availability */}
            <div className="mb-4">
              {product.stock <= 0 ? (
                <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-semibold">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill fw-semibold">
                  Only {product.stock} left in stock - order soon!
                </span>
              ) : (
                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold">
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="input-group" style={{ width: '130px' }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled={quantity <= 1 || product.stock <= 0}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center fw-bold bg-white"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled={quantity >= product.stock || product.stock <= 0}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>

              <button
                className={`btn btn-lg flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm rounded-3 ${
                  addedSuccess ? 'btn-success text-white' : 'btn-primary-custom'
                }`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
              >
                {addingToCart ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : addedSuccess ? (
                  <>
                    <Check size={20} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Shopping Cart
                  </>
                )}
              </button>
            </div>

            {cartError && (
              <div className="alert alert-danger rounded-3 p-2 small mb-3">
                {cartError}
              </div>
            )}

            {/* Value Props */}
            <div className="border-top pt-4 mt-4 row g-3 text-secondary small">
              <div className="col-4 d-flex align-items-center gap-2">
                <Truck size={20} className="text-primary" /> Free Express Shipping
              </div>
              <div className="col-4 d-flex align-items-center gap-2">
                <ShieldCheck size={20} className="text-success" /> 1-Year Warranty
              </div>
              <div className="col-4 d-flex align-items-center gap-2">
                <RefreshCw size={20} className="text-warning" /> 30-Day Money Back
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews Tabs */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="card-header bg-white p-3 border-bottom">
          <ul className="nav nav-tabs card-header-tabs border-0" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active fw-bold px-4 border-0" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc" type="button" role="tab">
                Description
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link fw-bold px-4 border-0 d-flex align-items-center gap-1" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">
                Reviews ({reviews.length})
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-4 tab-content" id="productTabsContent">
          {/* Tab 1: Description */}
          <div className="tab-pane fade show active" id="desc" role="tabpanel">
            <h5 className="fw-bold mb-3">Product Overview</h5>
            <p className="text-secondary leading-relaxed fs-6 mb-4">{product.description}</p>
            <div className="row g-3 max-w-lg bg-light p-3 rounded-3">
              <div className="col-6 text-secondary small">Brand: <strong className="text-dark">{product.brand}</strong></div>
              <div className="col-6 text-secondary small">Category: <strong className="text-dark">{product.category}</strong></div>
              <div className="col-6 text-secondary small">Stock Units: <strong className="text-dark">{product.stock}</strong></div>
              <div className="col-6 text-secondary small">Rating: <strong className="text-dark">{product.rating} / 5.0</strong></div>
            </div>
          </div>

          {/* Tab 2: Reviews */}
          <div className="tab-pane fade" id="reviews" role="tabpanel">
            <div className="row g-4">
              {/* Existing Reviews */}
              <div className="col-12 col-md-7">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <MessageSquare size={20} className="text-primary" /> Customer Reviews
                </h5>

                {reviews.length === 0 ? (
                  <p className="text-muted italic py-3">No reviews yet for this product. Be the first to leave a review!</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="p-3 bg-light rounded-3 border">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark">{rev.name || 'Verified Buyer'}</span>
                          <RatingStars rating={rev.rating} size={14} />
                        </div>
                        <small className="text-muted d-block mb-2">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </small>
                        <p className="mb-0 text-dark small">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Review Form */}
              <div className="col-12 col-md-5">
                <div className="p-4 border rounded-3 bg-white shadow-sm">
                  <h6 className="fw-bold mb-3">Write a Customer Review</h6>

                  {reviewSuccess && (
                    <div className="alert alert-success rounded-3 p-2 small mb-3">
                      Review submitted successfully!
                    </div>
                  )}

                  {reviewError && (
                    <div className="alert alert-danger rounded-3 p-2 small mb-3">
                      {reviewError}
                    </div>
                  )}

                  {user ? (
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold small text-secondary">Rating</label>
                        <select
                          className="form-select form-select-sm"
                          value={newRating}
                          onChange={(e) => setNewRating(Number(e.target.value))}
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Average</option>
                          <option value="2">2 - Poor</option>
                          <option value="1">1 - Terrible</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold small text-secondary">Your Review Comment</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows="3"
                          placeholder="What did you like or dislike about this product?"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary-custom btn-sm w-100 fw-bold"
                        disabled={submittingReview}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-muted small mb-2">Please log in to submit a review for this item.</p>
                      <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill">
                        Log In Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
