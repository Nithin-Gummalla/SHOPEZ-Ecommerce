import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Search, User, LogOut, ShieldAlert, Package, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary fs-4" to="/">
          <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
            <ShoppingBag size={20} />
          </div>
          <span>Shop<span className="text-dark">EZ</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links & Search */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search Bar */}
          <form className="d-flex mx-auto my-2 my-lg-0 w-100 max-w-lg position-relative" style={{ maxWidth: '420px' }} onSubmit={handleSearchSubmit}>
            <input
              className="form-control rounded-pill ps-4 pe-5 bg-light border-0"
              type="search"
              placeholder="Search electronics, fashion, books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn position-absolute end-0 top-0 bottom-0 text-muted me-2 border-0 bg-transparent" type="submit">
              <Search size={18} />
            </button>
          </form>

          {/* Right Navigation Controls */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3 text-secondary-hover" to="/products">
                All Products
              </Link>
            </li>

            {/* Shopping Cart Button */}
            <li className="nav-item">
              <Link className="btn btn-light rounded-pill position-relative d-flex align-items-center gap-2 px-3 me-lg-2 my-1 my-lg-0 border" to="/cart">
                <ShoppingCart size={18} className="text-primary" />
                <span className="fw-semibold d-none d-sm-inline">Cart</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {/* Auth Buttons / Dropdown */}
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2 fw-semibold border rounded-pill px-3 py-1 bg-light text-dark"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-truncate" style={{ maxWidth: '120px' }}>{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile">
                      <User size={16} /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/myorders">
                      <Package size={16} /> My Orders
                    </Link>
                  </li>

                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item text-primary fw-semibold d-flex align-items-center gap-2 py-2" to="/admin/dashboard">
                          <ShieldAlert size={16} /> Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2 py-2" onClick={logout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="d-flex align-items-center gap-2 ms-lg-2">
                <Link className="btn btn-outline-custom text-decoration-none" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary-custom text-decoration-none" to="/register">
                  Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
