import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        {/* Features bar */}
        <div className="row g-4 border-bottom border-secondary pb-4 mb-4 text-center text-md-start">
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <Truck size={28} className="text-info flex-shrink-0" />
              <div>
                <h6 className="mb-0 fw-bold">Free Shipping</h6>
                <small className="text-secondary">On orders over $100</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <ShieldCheck size={28} className="text-success flex-shrink-0" />
              <div>
                <h6 className="mb-0 fw-bold">Authentic Quality</h6>
                <small className="text-secondary">100% genuine products</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <RefreshCw size={28} className="text-warning flex-shrink-0" />
              <div>
                <h6 className="mb-0 fw-bold">Easy Returns</h6>
                <small className="text-secondary">30-day return policy</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <Lock size={28} className="text-primary flex-shrink-0" />
              <div>
                <h6 className="mb-0 fw-bold">Secure Payment</h6>
                <small className="text-secondary">Protected checkout</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 fw-bold text-primary fs-4 mb-3">
              <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <ShoppingBag size={18} />
              </div>
              <span className="text-white">Shop<span className="text-info">EZ</span></span>
            </div>
            <p className="text-secondary small leading-relaxed">
              ShopEZ is a full-stack MERN e-commerce application built for internship evaluation. Experience seamless shopping, instant search, dynamic cart updates, and robust order tracking.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase fs-6 tracking-wider">Quick Links</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/products" className="text-secondary text-decoration-none hover-white">All Products</Link></li>
              <li><Link to="/cart" className="text-secondary text-decoration-none hover-white">Shopping Cart</Link></li>
              <li><Link to="/myorders" className="text-secondary text-decoration-none hover-white">Order Tracking</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase fs-6 tracking-wider">Categories</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/products?category=Electronics" className="text-secondary text-decoration-none hover-white">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="text-secondary text-decoration-none hover-white">Fashion</Link></li>
              <li><Link to="/products?category=Home%20%26%20Kitchen" className="text-secondary text-decoration-none hover-white">Home & Kitchen</Link></li>
              <li><Link to="/products?category=Books" className="text-secondary text-decoration-none hover-white">Books & Study</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase fs-6 tracking-wider">Internship Evaluation</h6>
            <p className="text-secondary small mb-2">
              MERN Stack Architecture • JWT Auth • Role-based Access • Dynamic Analytics
            </p>
            <span className="badge bg-primary px-3 py-2 rounded-pill">Version 1.0.0 Ready</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-top border-secondary pt-3 text-center text-secondary small">
          © {new Date().getFullYear()} ShopEZ E-Commerce. All rights reserved. Designed & Engineered with Node, Express, MongoDB & React.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
