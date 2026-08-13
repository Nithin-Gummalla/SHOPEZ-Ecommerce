import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const product = item.product;

  if (!product) return null;

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    if (newQty > product.stock) {
      setErrorMsg(`Only ${product.stock} in stock`);
      setTimeout(() => setErrorMsg(null), 2500);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await updateQuantity(product._id, newQty);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeFromCart(product._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unitPrice = product.finalPrice || product.price;
  const itemTotal = unitPrice * item.quantity;

  return (
    <div className="card border-0 shadow-sm rounded-3 p-3 mb-3 bg-white">
      <div className="row align-items-center g-3">
        {/* Product Image */}
        <div className="col-3 col-md-2">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
            alt={product.name}
            className="img-fluid rounded-2 object-fit-cover"
            style={{ width: '100%', height: '70px' }}
          />
        </div>

        {/* Product Info */}
        <div className="col-9 col-md-4">
          <span className="text-uppercase tracking-wider text-muted fw-bold" style={{ fontSize: '0.65rem' }}>
            {product.category}
          </span>
          <h6 className="fw-bold mb-1 text-truncate">
            <Link to={`/products/${product._id}`} className="text-dark text-decoration-none hover-primary">
              {product.name}
            </Link>
          </h6>
          <div className="text-muted small">
            Brand: <span className="fw-semibold text-dark">{product.brand}</span>
          </div>
          {errorMsg && (
            <span className="text-danger fw-semibold d-block small" style={{ fontSize: '0.75rem' }}>
              {errorMsg}
            </span>
          )}
        </div>

        {/* Unit Price */}
        <div className="col-4 col-md-2 text-md-center">
          <span className="text-muted d-block d-md-none small">Price:</span>
          <span className="fw-bold text-dark">${unitPrice.toFixed(2)}</span>
          {product.discountPercent > 0 && (
            <small className="text-muted text-decoration-line-through d-block" style={{ fontSize: '0.7rem' }}>
              ${product.price.toFixed(2)}
            </small>
          )}
        </div>

        {/* Quantity Handler */}
        <div className="col-5 col-md-2">
          <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ maxWidth: '110px' }}>
            <button
              className="btn btn-light border-0 px-2"
              type="button"
              disabled={item.quantity <= 1 || loading}
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Minus size={14} />
            </button>
            <input
              type="text"
              className="form-control text-center bg-transparent border-0 fw-bold px-1"
              value={item.quantity}
              readOnly
            />
            <button
              className="btn btn-light border-0 px-2"
              type="button"
              disabled={item.quantity >= product.stock || loading}
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus size={14} />
            </button>
          </div>
          {item.quantity >= product.stock && (
            <span className="text-warning fw-semibold d-block mt-1" style={{ fontSize: '0.65rem' }}>Max Stock</span>
          )}
        </div>

        {/* Item Total & Remove */}
        <div className="col-3 col-md-2 text-end d-flex align-items-center justify-content-end gap-2">
          <div>
            <span className="text-muted d-block d-md-none small">Total:</span>
            <span className="fw-extrabold text-primary fs-6">${itemTotal.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-sm text-danger btn-light rounded-circle p-2 ms-2 border-0"
            title="Remove item"
            onClick={handleRemove}
            disabled={loading}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
