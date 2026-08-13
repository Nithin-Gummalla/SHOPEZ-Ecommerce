import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle, Package, ArrowRight, Home, MapPin, Truck } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <LoadingSpinner message="Fetching order receipt details..." />;
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!order) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden text-center mb-4">
            <div className="bg-success text-white p-4 p-md-5">
              <div className="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3 shadow">
                <CheckCircle size={48} />
              </div>
              <h2 className="fw-extrabold mb-1">Order Placed Successfully!</h2>
              <p className="mb-0 text-white-50">
                Thank you for your order. We are processing your items now.
              </p>
            </div>

            <div className="card-body p-4 p-md-5 text-start">
              {/* Order ID Bar */}
              <div className="p-3 bg-light rounded-3 border d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
                <div>
                  <small className="text-muted d-block">Order Reference ID:</small>
                  <span className="font-monospace fw-bold fs-6 text-primary">#{order._id}</span>
                </div>
                <div>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="alert alert-info rounded-3 d-flex align-items-center gap-3 mb-4">
                <Truck size={24} className="text-info flex-shrink-0" />
                <div>
                  <h6 className="fw-bold mb-0">Estimated Delivery</h6>
                  <small className="text-secondary">
                    Expected to arrive within 3-5 business days at your shipping address.
                  </small>
                </div>
              </div>

              {/* Shipping Address Summary */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-1">
                  <MapPin size={16} className="text-primary" /> Delivery Shipping Address
                </h6>
                <div className="p-3 bg-light rounded-3 small">
                  <strong>{order.shippingAddress?.fullName}</strong><br />
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}<br />
                  Phone: {order.shippingAddress?.phone}
                </div>
              </div>

              {/* Items Table */}
              <h6 className="fw-bold text-dark mb-3">Purchased Items ({order.orderItems?.length})</h6>
              <div className="list-group mb-4">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="list-group-item d-flex align-items-center gap-3 py-3 border-0 border-bottom">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-2 object-fit-cover"
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-0">{item.name}</h6>
                      <small className="text-muted">Quantity: {item.quantity}</small>
                    </div>
                    <span className="fw-bold text-dark">${(item.finalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Total Paid */}
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold text-dark fs-5">Total Paid:</span>
                <span className="fs-4 fw-extrabold text-primary">${order.totalPrice.toFixed(2)}</span>
              </div>

              {/* Navigation Action Buttons */}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link to="/myorders" className="btn btn-primary-custom py-2 px-4 rounded-pill d-flex align-items-center justify-content-center gap-2">
                  <Package size={18} /> View My Orders History
                </Link>
                <Link to="/" className="btn btn-outline-custom py-2 px-4 rounded-pill d-flex align-items-center justify-content-center gap-2">
                  <Home size={18} /> Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
