import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ShoppingCart, ExternalLink, Filter } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/orders');
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.orderStatus === filterStatus);

  if (loading) return <LoadingSpinner message="Fetching order records..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchOrders} /></div>;

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-extrabold text-dark mb-1">Order Management</h2>
          <p className="text-muted small mb-0">Update status, track deliveries, or cancel orders</p>
        </div>

        {/* Status Filter */}
        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <Filter size={16} className="text-muted" />
          <select
            className="form-select form-select-sm rounded-pill fw-semibold"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PLACED">PLACED</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Paid</th>
                <th>Placed Date</th>
                <th>Status Transition</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord._id}>
                  <td className="font-monospace fw-bold text-primary">#{ord._id}</td>
                  <td>
                    <span className="fw-bold text-dark d-block">{ord.user?.name || 'Customer'}</span>
                    <small className="text-muted">{ord.user?.email}</small>
                  </td>
                  <td><span className="badge bg-light text-dark border">{ord.orderItems?.length} item(s)</span></td>
                  <td className="fw-bold text-dark">${ord.totalPrice?.toFixed(2)}</td>
                  <td className="small text-muted">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      className="form-select form-select-sm rounded-2 font-monospace fw-bold"
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      style={{ maxWidth: '170px' }}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="text-end">
                    <Link to={`/orders/${ord._id}`} className="btn btn-sm btn-outline-custom rounded-2">
                      <ExternalLink size={14} /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
