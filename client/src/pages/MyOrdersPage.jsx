import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Package, ExternalLink, XCircle } from 'lucide-react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchMyOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/orders/myorders');
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Item stock will be returned to catalog.')) {
      return;
    }

    setCancellingId(orderId);
    try {
      await API.put(`/orders/${orderId}/cancel`);
      fetchMyOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your orders..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchMyOrders} /></div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-extrabold text-dark mb-1">My Orders</h2>
          <p className="text-muted small mb-0">Track and manage your order history</p>
        </div>
        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill font-monospace">
          Total Orders: {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-4">
          <div className="bg-light text-muted rounded-circle d-inline-flex p-3 mb-3">
            <Package size={40} />
          </div>
          <h5 className="fw-bold">No orders found</h5>
          <p className="text-muted small mb-3">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary-custom rounded-pill px-4">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="card-header bg-light p-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <small className="text-muted d-block">Order ID:</small>
                    <span className="font-monospace fw-bold text-dark">#{order._id}</span>
                  </div>
                  <div className="d-none d-sm-block border-start ps-3">
                    <small className="text-muted d-block">Placed On:</small>
                    <span className="fw-semibold text-dark small">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <StatusBadge status={order.orderStatus} />
                  <span className="fw-extrabold text-primary fs-5 ms-2">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="card-body p-3 p-md-4">
                <div className="row align-items-center g-3">
                  <div className="col-12 col-md-8">
                    <div className="d-flex gap-2 overflow-x-auto pb-1">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center gap-2 p-2 border rounded-3 bg-light" style={{ minWidth: '220px' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded-2 object-fit-cover"
                            style={{ width: '40px', height: '40px' }}
                          />
                          <div className="overflow-hidden">
                            <span className="fw-bold text-dark d-block text-truncate small" style={{ maxWidth: '140px' }}>
                              {item.name}
                            </span>
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12 col-md-4 text-md-end d-flex align-items-center justify-content-md-end gap-2">
                    {['PLACED', 'CONFIRMED'].includes(order.orderStatus) && (
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                      >
                        <XCircle size={14} /> Cancel Order
                      </button>
                    )}
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-sm btn-outline-custom d-flex align-items-center gap-1 rounded-pill px-3"
                    >
                      <ExternalLink size={14} /> View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
