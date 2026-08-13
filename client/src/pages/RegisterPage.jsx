import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserCheck } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(name, email, password, confirmPassword);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 text-center border-0">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2 shadow-sm">
                <UserCheck size={28} />
              </div>
              <h4 className="fw-bold mb-1">Create Your Account</h4>
              <p className="mb-0 text-white-50 small">Join ShopEZ for fast checkout and order tracking</p>
            </div>

            <div className="card-body p-4 p-md-5">
              {errorMsg && (
                <div className="alert alert-danger rounded-3 small py-2 px-3 mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="•••••••• (Min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    'Register Account'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="text-muted small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none">
                    Log In
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

export default RegisterPage;
