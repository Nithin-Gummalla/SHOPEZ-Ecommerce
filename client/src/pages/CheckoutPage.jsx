import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, itemsPrice, taxPrice, shippingPrice, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : '',
    address: '123 Innovation Drive',
    city: 'San Francisco',
    postalCode: '94103',
    country: 'USA',
    phone: '+1 (555) 123-4567'
  });

  const [paymentMethod, setPaymentMethod] = useState('Simulated Card / UPI');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const { fullName, address, city, postalCode, country, phone } = shippingAddress;
    if (!fullName || !address || !city || !postalCode || !country || !phone) {
      setErrorMsg('Please complete all shipping address fields');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod
      };

      const response = await API.post('/orders', orderData);
      const createdOrder = response.data;
      await clearCart();
      navigate(`/order-confirmation/${createdOrder._id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Checkout failed. Please check item stock availability.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-extrabold text-dark mb-4 pb-2 border-bottom">Secure Checkout</h2>

      {errorMsg && (
        <div className="alert alert-danger rounded-3 mb-4 shadow-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          {/* Form Left Side: Address & Payment */}
          <div className="col-12 col-lg-7">
            {/* Shipping Address */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                <MapPin size={20} className="text-primary" /> 1. Shipping Address
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={shippingAddress.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-control"
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Simulated Payment Method */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                <CreditCard size={20} className="text-primary" /> 2. Payment Method
              </h5>

              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentRadio"
                    id="simPay"
                    checked={paymentMethod === 'Simulated Card / UPI'}
                    onChange={() => setPaymentMethod('Simulated Card / UPI')}
                  />
                  <label className="form-check-label fw-bold text-dark" htmlFor="simPay">
                    Safe Simulated Payment Gateway (Card / UPI / NetBanking)
                  </label>
                  <p className="text-muted small mb-0 mt-1">
                    No real credentials charged. Calculates authoritative total securely on backend.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentRadio"
                    id="codPay"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                  />
                  <label className="form-check-label fw-bold text-dark" htmlFor="codPay">
                    Cash on Delivery (COD)
                  </label>
                  <p className="text-muted small mb-0 mt-1">
                    Pay with cash when package is delivered to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Right Side: Order Items Review & Total */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Order Items Breakdown</h5>

              <div className="mb-3 max-h-60 overflow-y-auto pe-1" style={{ maxHeight: '240px' }}>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                      alt={item.product?.name}
                      className="rounded-2 object-fit-cover"
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                        {item.product?.name}
                      </h6>
                      <small className="text-muted">
                        Qty: {item.quantity} × ${((item.product?.finalPrice || item.product?.price) || 0).toFixed(2)}
                      </small>
                    </div>
                    <span className="fw-bold text-dark">
                      ${(((item.product?.finalPrice || item.product?.price) || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Totals */}
              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Items Subtotal:</span>
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

              <hr className="my-2" />

              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-extrabold text-dark">Final Total:</span>
                <span className="fs-4 fw-extrabold text-primary">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom btn-lg w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <>
                    <CheckCircle2 size={20} /> Complete Order (${totalPrice.toFixed(2)})
                  </>
                )}
              </button>

              <div className="text-center text-muted small d-flex align-items-center justify-content-center gap-1">
                <ShieldCheck size={16} className="text-success" /> Server Authorized Total Calculation
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
