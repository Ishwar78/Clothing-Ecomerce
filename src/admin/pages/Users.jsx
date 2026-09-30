import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import './DataPages.css';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/all');
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-title">
        <div>
          <h2>Users</h2>
          <p>Customer accounts and details.</p>
        </div>
      </div>
      <div className="admin-card">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading users...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, i) => (
                  <tr key={u._id}>
                    <td>U-{1000 + i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td><span className="admin-badge">Active</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
