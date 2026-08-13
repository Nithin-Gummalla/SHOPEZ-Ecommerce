import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';
import { Plus, Edit, Trash2, Search, Package, Check, X } from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    brand: '',
    price: '',
    discountPercent: 0,
    stock: 10,
    imageUrl: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/products?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=10`);
      setProducts(response.data.products || []);
      setPage(response.data.page || 1);
      setPages(response.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, keyword]);

  const handleOpenAddModal = () => {
    setEditMode(false);
    setSelectedProductId(null);
    setFormData({
      name: '',
      description: '',
      category: 'Electronics',
      brand: '',
      price: '',
      discountPercent: 0,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditMode(true);
    setSelectedProductId(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      brand: prod.brand,
      price: prod.price,
      discountPercent: prod.discountPercent || 0,
      stock: prod.stock,
      imageUrl: prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        discountPercent: Number(formData.discountPercent),
        stock: Number(formData.stock),
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600']
      };

      if (editMode && selectedProductId) {
        await API.put(`/products/${selectedProductId}`, payload);
      } else {
        await API.post('/products', payload);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleQuickStockUpdate = async (prod, delta) => {
    const newStock = Math.max(0, prod.stock + delta);
    try {
      await API.put(`/products/${prod._id}`, { stock: newStock });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-extrabold text-dark mb-1">Product Inventory Management</h2>
          <p className="text-muted small mb-0">Create, edit, update stock, and set product discounts</p>
        </div>
        <button className="btn btn-primary-custom rounded-pill px-4 d-flex align-items-center gap-2 mt-2 mt-md-0" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 max-w-md">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0 text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search inventory by title or category..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching catalog..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small text-muted">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price / Discount</th>
                  <th>Final Price</th>
                  <th>Stock Quantity</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                          alt={prod.name}
                          className="rounded-2 object-fit-cover"
                          style={{ width: '45px', height: '45px' }}
                        />
                        <span className="fw-bold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                          {prod.name}
                        </span>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark border">{prod.category}</span></td>
                    <td className="small text-muted">{prod.brand}</td>
                    <td>
                      <span className="fw-bold">${prod.price.toFixed(2)}</span>
                      {prod.discountPercent > 0 && (
                        <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>-{prod.discountPercent}%</span>
                      )}
                    </td>
                    <td className="fw-bold text-primary">${(prod.finalPrice || prod.price).toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <button className="btn btn-sm btn-light border px-2 py-0" onClick={() => handleQuickStockUpdate(prod, -1)}>-</button>
                        <span className={`fw-bold px-2 ${prod.stock <= 5 ? 'text-danger' : 'text-dark'}`}>{prod.stock}</span>
                        <button className="btn btn-sm btn-light border px-2 py-0" onClick={() => handleQuickStockUpdate(prod, 1)}>+</button>
                      </div>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-light border text-primary me-2 rounded-2" onClick={() => handleOpenEditModal(prod)} title="Edit product">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-light border text-danger rounded-2" onClick={() => handleDelete(prod._id)} title="Delete product">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pages={pages} onPageChange={(p) => setPage(p)} />
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showModal && (
        <div className="modal show d-block tab-active bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white p-4">
                <h5 className="modal-title fw-bold">{editMode ? 'Edit Product Details' : 'Add New Product'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label fw-semibold small text-secondary">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold small text-secondary">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                        <option value="Books">Books</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold small text-secondary">Original Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold small text-secondary">Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.discountPercent}
                        onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small text-secondary">Initial Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-semibold small text-secondary">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-secondary">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary-custom px-4 fw-bold">{editMode ? 'Update Product' : 'Create Product'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
