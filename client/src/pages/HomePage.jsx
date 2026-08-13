import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ShoppingBag, ArrowRight, Laptop, Shirt, Home, Dumbbell, BookOpen, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await API.get('/products?limit=8&sort=rating');
        setFeaturedProducts(response.data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', icon: <Laptop size={24} />, color: 'bg-primary-subtle text-primary' },
    { name: 'Fashion', icon: <Shirt size={24} />, color: 'bg-danger-subtle text-danger' },
    { name: 'Home & Kitchen', icon: <Home size={24} />, color: 'bg-warning-subtle text-warning' },
    { name: 'Sports & Fitness', icon: <Dumbbell size={24} />, color: 'bg-success-subtle text-success' },
    { name: 'Books', icon: <BookOpen size={24} />, color: 'bg-info-subtle text-info' }
  ];

  return (
    <div className="pb-5">
      {/* Hero Banner */}
      <section className="hero-gradient py-5 mb-5 rounded-4 shadow-lg overflow-hidden position-relative mx-3 mx-lg-4 mt-2">
        <div className="container py-4 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
              <span className="badge bg-white text-primary px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm d-inline-flex align-items-center gap-1">
                <Sparkles size={14} /> New Season Deals Up to 25% Off
              </span>
              <h1 className="display-4 fw-extrabold mb-3 leading-tight">
                Discover Next-Gen Products at <span className="text-warning">ShopEZ</span>
              </h1>
              <p className="lead mb-4 text-white-50 max-w-xl">
                Explore thousands of premium products with fast delivery, authentic quality guarantee, and safe simulated checkout.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link to="/products" className="btn btn-light btn-lg px-4 py-3 rounded-pill fw-bold text-primary shadow d-flex align-items-center gap-2">
                  Shop Catalog Now <ArrowRight size={20} />
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-semibold">
                  Create Account
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
                alt="ShopEZ Shopping"
                className="img-fluid rounded-4 shadow-lg border border-white border-4"
                style={{ maxHeight: '360px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Categories Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-extrabold text-dark mb-1">Browse Categories</h3>
              <p className="text-muted small mb-0">Find exactly what you need by browsing top departments</p>
            </div>
            <Link to="/products" className="text-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row row-cols-2 row-cols-md-5 g-3">
            {categories.map((cat) => (
              <div className="col" key={cat.name}>
                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="card h-100 border-0 shadow-sm custom-card text-decoration-none text-center p-3 rounded-3"
                >
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3 mx-auto ${cat.color}`} style={{ width: '60px', height: '60px' }}>
                    {cat.icon}
                  </div>
                  <h6 className="fw-bold text-dark mb-0">{cat.name}</h6>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Top-Rated Products */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-extrabold text-dark mb-1">Top Rated Products</h3>
              <p className="text-muted small mb-0">Handpicked customer favorites with top reviews</p>
            </div>
            <Link to="/products?sort=rating" className="btn btn-outline-custom btn-sm rounded-pill">
              Explore All Top Rated
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching top products..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </section>

        {/* Promo Banner */}
        <section className="bg-dark text-white rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden">
          <div className="row align-items-center position-relative z-2">
            <div className="col-md-8 mb-3 mb-md-0">
              <span className="badge bg-warning text-dark font-monospace fw-bold mb-2">LIMITED TIME DEAL</span>
              <h2 className="fw-extrabold mb-2">Upgrade Your Tech & Electronics Today</h2>
              <p className="text-secondary mb-0">
                Get extra discounts on wireless headphones, smartwatches, and mechanical keyboards.
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/products?category=Electronics" className="btn btn-warning btn-lg px-4 rounded-pill fw-bold text-dark">
                Shop Electronics Deals
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
