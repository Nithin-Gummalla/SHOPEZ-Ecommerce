import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ArrowLeft, MapPin, CreditCard, Package, Truck, CheckCircle2, Clock } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? Inventory stock will be returned.')) return;
    setCancelling(true);
    try {
      await API.put(`/orders/${id}/cancel`);
      fetchOrderDetails();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching order details..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchOrderDetails} /></div>;
  if (!order) return null;

  const statuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStatusIndex = statuses.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  return (
    <div className="container py-4">
      <Link to="/myorders" className="btn btn-sm btn-link text-decoration-none text-muted p-0 mb-3 d-inline-flex align-items-center gap-1">
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-extrabold text-dark mb-1">
            Order <span className="font-monospace text-primary">#{order._id}</span>
          </h3>
          <p className="text-muted small mb-0">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-2 mt-md-0 d-flex align-items-center gap-2">
          <StatusBadge status={order.orderStatus} />
          {['PLACED', 'CONFIRMED'].includes(order.orderStatus) && (
            <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={handleCancel} disabled={cancelling}>
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Status Progress Timeline */}
      {!isCancelled ? (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <h6 className="fw-bold text-dark mb-3">Order Status Timeline</h6>
          <div className="d-flex justify-content-between position-relative">
            {statuses.map((st, idx) => {
              const completed = idx <= currentStatusIndex;
              return (
                <div key={st} className="text-center flex-fill position-relative z-2">
                  <div
                    className={`rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-2 shadow-sm ${
                      completed ? 'bg-primary text-white' : 'bg-light text-muted border'
                    }`}
                    style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                  >
                    {completed ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <small className={`d-block fw-bold ${completed ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                    {st.replace(/_/g, ' ')}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="alert alert-danger rounded-3 mb-4">
          This order was cancelled on {new Date(order.updatedAt).toLocaleString()}.
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Items */}
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <Package size={20} className="text-primary" /> Order Items ({order.orderItems?.length})
            </h5>

            <div className="d-flex flex-column gap-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center gap-3 pb-3 border-bottom">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-3 object-fit-cover"
                    style={{ width: '60px', height: '60px' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                    <small className="text-muted">
                      Price: ${item.finalPrice?.toFixed(2)} × {item.quantity}
                    </small>
                  </div>
                  <span className="fw-extrabold text-dark">
                    ${(item.finalPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address & Payment Summary */}
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <MapPin size={18} className="text-primary" /> Shipping Address
            </h6>
            <div className="p-3 bg-light rounded-3 small mb-4">
              <strong className="text-dark d-block">{order.shippingAddress?.fullName}</strong>
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}<br />
              Phone: {order.shippingAddress?.phone}
            </div>

            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <CreditCard size={18} className="text-primary" /> Payment Info
            </h6>
            <div className="p-3 bg-light rounded-3 small mb-4">
              <div>Method: <strong>{order.paymentMethod}</strong></div>
              <div>Status: <span className="badge bg-success">PAID</span></div>
              {order.paymentResult?.id && (
                <div className="font-monospace text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                  Txn ID: {order.paymentResult.id}
                </div>
              )}
            </div>

            <h6 className="fw-bold text-dark mb-3">Cost Summary</h6>
            <div className="d-flex justify-content-between mb-1 small text-secondary">
              <span>Items Total:</span>
              <span>${order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-1 small text-secondary">
              <span>Tax (5%):</span>
              <span>${order.taxPrice?.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small text-secondary">
              <span>Shipping Fee:</span>
              <span>${order.shippingPrice?.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
              <span>Total Paid:</span>
              <span className="text-primary">${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
