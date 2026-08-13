import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShoppingBag } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@shopez.com');
    setPassword('admin123');
  };

  const handleFillDemoUser = () => {
    setEmail('john@example.com');
    setPassword('user123');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header hero-gradient text-white p-4 text-center border-0">
              <div className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2 shadow-sm">
                <ShoppingBag size={28} />
              </div>
              <h4 className="fw-bold mb-1">Welcome Back to ShopEZ</h4>
              <p className="mb-0 text-white-50 small">Sign in to access your cart, orders, and profile</p>
            </div>

            <div className="card-body p-4 p-md-5">
              {errorMsg && (
                <div className="alert alert-danger rounded-3 small py-2 px-3 mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      Sign In <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials Quick Fill Bar */}
              <div className="p-3 bg-light rounded-3 border text-center my-3">
                <small className="d-block fw-bold text-secondary mb-2">⚡ Quick Fill Demo Credentials:</small>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-xs btn-outline-primary py-1 px-2 rounded-2 text-decoration-none"
                    style={{ fontSize: '0.75rem' }}
                    onClick={handleFillDemoUser}
                  >
                    User: john@example.com
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline-dark py-1 px-2 rounded-2 text-decoration-none"
                    style={{ fontSize: '0.75rem' }}
                    onClick={handleFillDemoAdmin}
                  >
                    Admin: admin@shopez.com
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-bold text-decoration-none">
                    Register Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
