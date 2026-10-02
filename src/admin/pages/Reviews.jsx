import React, { useState, useEffect } from 'react';
import { FiStar, FiTrash2, FiSearch, FiCheckCircle, FiClock, FiFilter, FiExternalLink } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews');
      if (res.success && Array.isArray(res.reviews)) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/reviews/${id}`, { status: newStatus });
      if (res.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
        if (selected && selected._id === id) {
          setSelected(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
        if (selected && selected._id === id) setSelected(null);
      }
    } catch (err) {
      console.error('Delete review error:', err);
      alert('Failed to delete review');
    }
  };

  const filtered = reviews.filter(item => {
    const s = search.toLowerCase();
    const matchesSearch =
      (item.productName || '').toLowerCase().includes(s) ||
      (item.userName || '').toLowerCase().includes(s) ||
      (item.userEmail || '').toLowerCase().includes(s) ||
      (item.comment || '').toLowerCase().includes(s);

    const matchesRating = ratingFilter === 'All' || String(item.rating) === String(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';
  const fiveStars = reviews.filter(r => r.rating === 5).length;
  const pendingCount = reviews.filter(r => r.status === 'Pending').length;

  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          fill={i <= count ? '#f59e0b' : 'none'}
          color={i <= count ? '#f59e0b' : '#d1d5db'}
          size={14}
        />
      );
    }
    return stars;
  };

  return (
    <div className="reviews-admin-wrap">
      <div className="admin-title">
        <div>
          <h2>Product Customer Reviews</h2>
          <p>View, moderate, and manage all customer product ratings and reviews.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stat-grid" style={{ marginBottom: '20px' }}>
        <div className="admin-stat">
          <FiStar className="stat-icon" style={{ color: '#ef4b68' }} />
          <span>Total Reviews</span>
          <strong>{totalReviews}</strong>
        </div>
        <div className="admin-stat">
          <FiCheckCircle className="stat-icon" style={{ color: '#f59e0b' }} />
          <span>Average Rating</span>
          <strong style={{ color: '#d97706' }}>{avgRating} ★</strong>
        </div>
        <div className="admin-stat">
          <FiStar className="stat-icon" style={{ color: '#10b981' }} />
          <span>5-Star Ratings</span>
          <strong style={{ color: '#059669' }}>{fiveStars}</strong>
        </div>
        <div className="admin-stat">
          <FiClock className="stat-icon" style={{ color: '#6366f1' }} />
          <span>Pending Moderation</span>
          <strong style={{ color: '#4f46e5' }}>{pendingCount}</strong>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product, customer, text..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiFilter style={{ color: '#666' }} />
          <span style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>Rating:</span>
          {['All', '5', '4', '3', '2', '1'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(r)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: ratingFilter === r ? '1px solid #ef4b68' : '1px solid #e2e8f0',
                backgroundColor: ratingFilter === r ? '#ef4b68' : '#fff',
                color: ratingFilter === r ? '#fff' : '#4a5568',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r === 'All' ? 'All Ratings' : `${r} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* REVIEWS TABLE */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
            Loading reviews...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
            No reviews found matching your search.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(rev => {
                const dateStr = new Date(rev.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <tr key={rev._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={rev.productImage || '/assets/mencategory1.png'}
                          alt={rev.productName}
                          onError={(e) => { e.target.src = '/assets/mencategory1.png'; }}
                          style={{ width: '42px', height: '48px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#f5f5f5' }}
                        />
                        <div>
                          <strong>{rev.productName}</strong>
                          {rev.productSlug && (
                            <a
                              href={`/product/${rev.productSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#ef4b68', marginTop: '2px' }}
                            >
                              View product <FiExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{rev.userName}</strong>
                        {rev.userEmail && (
                          <div style={{ fontSize: '11px', color: '#777' }}>
                            {rev.userEmail}
                          </div>
                        )}
                        {rev.isVerified !== false && (
                          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700' }}>
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {renderStars(rev.rating)}
                        </div>
                        <b style={{ fontSize: '12px', color: '#333' }}>({rev.rating})</b>
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#444',
                        lineHeight: '1.4',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }} title={rev.comment}>
                        {rev.comment}
                      </p>
                    </td>
                    <td style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                      {dateStr}
                    </td>
                    <td>
                      <select
                        value={rev.status || 'Approved'}
                        onChange={(e) => handleUpdateStatus(rev._id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: '1px solid #cbd5e1',
                          backgroundColor: rev.status === 'Pending' ? '#fef3c7' : '#d1fae5',
                          color: rev.status === 'Pending' ? '#92400e' : '#065f46',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="icon-btn"
                        style={{ color: '#ef4444' }}
                        title="Delete Review"
                        onClick={() => handleDelete(rev._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
