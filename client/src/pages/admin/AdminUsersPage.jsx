import React, { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Users, Shield, Trash2, CheckCircle2 } from 'lucide-react';

const AdminUsersPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/users');
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user account permanently?')) return;
    try {
      await API.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner message="Fetching user accounts..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchUsers} /></div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-extrabold text-dark mb-1">User Management</h2>
          <p className="text-muted small mb-0">View registered users, promote admins, or manage access</p>
        </div>
        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill font-monospace">
          Registered Accounts: {users.length}
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold text-dark">{u.name}</span>
                    </div>
                  </td>
                  <td className="font-monospace text-muted">{u.email}</td>
                  <td>
                    <select
                      className={`form-select form-select-sm rounded-pill fw-bold ${u.role === 'ADMIN' ? 'bg-danger text-white border-danger' : 'bg-light text-dark'}`}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === currentUser?._id}
                      style={{ maxWidth: '120px' }}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="small text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-end">
                    {u._id !== currentUser?._id && (
                      <button
                        className="btn btn-sm btn-light border text-danger rounded-2"
                        onClick={() => handleDeleteUser(u._id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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

export default AdminUsersPage;
