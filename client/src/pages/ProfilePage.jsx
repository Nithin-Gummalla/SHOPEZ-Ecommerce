import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (password && password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      await updateProfile({ name, email, password });
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2 shadow-sm">
                <User size={32} />
              </div>
              <h4 className="fw-bold mb-1">{user?.name}</h4>
              <span className="badge bg-primary px-3 py-1 rounded-pill">{user?.role}</span>
            </div>

            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold text-dark mb-4">Edit Profile Settings</h5>

              {successMsg && (
                <div className="alert alert-success rounded-3 small py-2 px-3 mb-4 d-flex align-items-center gap-2">
                  <CheckCircle size={16} /> {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger rounded-3 small py-2 px-3 mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <hr className="my-4" />
                <h6 className="fw-bold text-dark mb-3">Change Password (Optional)</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Leave blank to keep current password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2.5 fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
