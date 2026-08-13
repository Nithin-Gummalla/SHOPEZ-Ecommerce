import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { Users, Package, ShoppingCart, DollarSign, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <LoadingSpinner message="Generating analytics dashboard..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchDashboardStats} /></div>;
  if (!stats) return null;

  const { summary, lowStockProducts, recentOrders, statusCounts, salesChartData } = stats;

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="container py-4">
      {/* Dashboard Title Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-extrabold text-dark mb-1">Admin Dashboard & Analytics</h2>
          <p className="text-muted small mb-0">Live metrics, inventory alerts, and sales performance</p>
        </div>
        <div className="mt-2 mt-md-0 d-flex gap-2">
          <Link to="/admin/products" className="btn btn-sm btn-outline-primary rounded-pill px-3">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-sm btn-outline-dark rounded-pill px-3">
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
        {/* Card 1: Revenue */}
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-primary border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Total Revenue</span>
              <div className="p-2 bg-primary-subtle text-primary rounded-3">
                <DollarSign size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mb-0">${summary.totalRevenue?.toFixed(2)}</h3>
            <small className="text-success fw-semibold d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.75rem' }}>
              <TrendingUp size={12} /> Server Authenticated Total
            </small>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-info border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Total Orders</span>
              <div className="p-2 bg-info-subtle text-info rounded-3">
                <ShoppingCart size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{summary.totalOrders}</h3>
            <small className="text-secondary d-block mt-1" style={{ fontSize: '0.75rem' }}>
              {summary.pendingOrders} Pending | {summary.deliveredOrders} Delivered
            </small>
          </div>
        </div>

        {/* Card 3: Products */}
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-warning border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Products Catalog</span>
              <div className="p-2 bg-warning-subtle text-warning rounded-3">
                <Package size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{summary.totalProducts}</h3>
            <small className="text-warning fw-semibold d-block mt-1" style={{ fontSize: '0.75rem' }}>
              {summary.lowStockCount} Products Low Stock
            </small>
          </div>
        </div>

        {/* Card 4: Users */}
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-success border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Registered Users</span>
              <div className="p-2 bg-success-subtle text-success rounded-3">
                <Users size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{summary.totalUsers}</h3>
            <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>
              Active Customer Accounts
            </small>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="row g-4 mb-4">
        {/* Sales Revenue Trend Chart */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Sales & Revenue Monthly Growth</h5>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="revenue" name="Revenue ($)" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown Chart */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Order Status Breakdown</h5>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusCounts}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ _id, count }) => `${_id}: ${count}`}
                  >
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="row g-4">
        {/* Low Stock Alert Table */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <AlertTriangle size={18} className="text-warning" /> Low Stock Warnings (&le; 5)
              </h5>
              <Link to="/admin/products" className="small text-primary fw-bold text-decoration-none">
                Update Stock
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-muted small py-3">All inventory items have sufficient stock levels.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Remaining Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((prod) => (
                      <tr key={prod._id}>
                        <td className="fw-bold text-dark text-truncate" style={{ maxWidth: '180px' }}>
                          {prod.name}
                        </td>
                        <td>{prod.category}</td>
                        <td>${prod.price?.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${prod.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {prod.stock} left
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent Placed Orders</h5>
              <Link to="/admin/orders" className="small text-primary fw-bold text-decoration-none">
                View All
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((ord) => (
                    <tr key={ord._id}>
                      <td className="font-monospace fw-bold">#{ord._id.substring(18)}</td>
                      <td>{ord.user?.name || 'Customer'}</td>
                      <td><StatusBadge status={ord.orderStatus} /></td>
                      <td className="fw-bold">${ord.totalPrice?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
