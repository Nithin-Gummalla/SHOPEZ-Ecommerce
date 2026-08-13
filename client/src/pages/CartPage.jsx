import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Tag } from 'lucide-react';

const CartPage = () => {
  const {
    cartItems,
    itemsPrice,
    originalTotal,
    discountAmount,
    taxPrice,
    shippingPrice,
    totalPrice,
    clearCart,
    cartCount
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container py-5 my-4 text-center">
        <div className="bg-light text-primary rounded-circle d-inline-flex align-items-center justify-content-center p-4 mb-3 shadow-sm">
          <ShoppingBag size={48} />
        </div>
        <h3 className="fw-bold text-dark mb-2">Your Shopping Cart is Empty</h3>
        <p className="text-muted mb-4 max-w-md mx-auto">
          Looks like you haven't added any products to your cart yet. Explore our latest electronics, fashion, and home goods!
        </p>
        <Link to="/products" className="btn btn-primary-custom btn-lg rounded-pill px-4 shadow-sm">
          Explore Products Catalog
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (itemsPrice / freeShippingThreshold) * 100);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-extrabold text-dark mb-1">Shopping Cart</h2>
          <p className="text-muted small mb-0">You have {cartCount} item(s) in your cart</p>
        </div>
        <button
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-2"
          onClick={clearCart}
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Item List */}
        <div className="col-12 col-lg-8">
          {/* Free Shipping Progress Indicator */}
          <div className="p-3 bg-white rounded-3 border shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="fw-bold text-dark">
                {itemsPrice >= freeShippingThreshold ? (
                  <span className="text-success">🎉 Congratulations! You unlocked FREE Express Shipping!</span>
                ) : (
                  <span>Add <strong>${(freeShippingThreshold - itemsPrice).toFixed(2)}</strong> more for FREE Shipping!</span>
                )}
              </small>
              <small className="text-muted font-monospace">{progressToFreeShipping.toFixed(0)}%</small>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className={`progress-bar ${itemsPrice >= freeShippingThreshold ? 'bg-success' : 'bg-primary'}`}
                role="progressbar"
                style={{ width: `${progressToFreeShipping}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.map((item, idx) => (
            <CartItem key={item.product ? item.product._id || idx : idx} item={item} />
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Original Items Total:</span>
              <span className="fw-semibold text-dark">${originalTotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-danger">
                <span className="d-flex align-items-center gap-1">
                  <Tag size={14} /> Product Discounts:
                </span>
                <span className="fw-bold">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Subtotal:</span>
              <span className="fw-semibold text-dark">${itemsPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Estimated Tax (5%):</span>
              <span className="fw-semibold text-dark">${taxPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 text-secondary">
              <span>Shipping Fee:</span>
              <span className="fw-semibold text-dark">
                {shippingPrice === 0 ? <span className="text-success fw-bold">FREE</span> : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-extrabold text-dark">Total Amount:</span>
              <span className="fs-4 fw-extrabold text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn btn-primary-custom btn-lg w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>

            <div className="text-center text-muted small d-flex align-items-center justify-content-center gap-1">
              <ShieldCheck size={16} className="text-success" /> Safe & Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
