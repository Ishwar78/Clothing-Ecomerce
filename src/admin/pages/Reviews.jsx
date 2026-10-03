import React, { useState, useEffect } from 'react';
import { FiStar, FiTrash2, FiSearch, FiCheckCircle, FiClock, FiFilter, FiExternalLink, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  // Create review modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const initialCreateForm = {
    productId: '',
    userName: '',
    userEmail: '',
    rating: 5,
    comment: '',
    isVerified: true,
    status: 'Approved'
  };
  const [createForm, setCreateForm] = useState(initialCreateForm);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.success && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

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

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!createForm.productId) {
      alert('Please select a product for the review.');
      return;
    }
    if (!createForm.userName.trim() || !createForm.comment.trim()) {
      alert('Please enter reviewer name and comment.');
      return;
    }

    const prod = products.find(p => String(p._id || p.id) === String(createForm.productId));
    if (!prod) {
      alert('Selected product not found.');
      return;
    }

    const payload = {
      productId: String(prod._id || prod.id),
      productName: prod.name,
      productSlug: prod.slug || (prod.name ? prod.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : String(prod._id || prod.id)),
      productImage: prod.images?.[0] || prod.image || '',
      userName: createForm.userName.trim(),
      userEmail: createForm.userEmail ? createForm.userEmail.trim() : 'customer@example.com',
      rating: Number(createForm.rating) || 5,
      comment: createForm.comment.trim(),
      isVerified: Boolean(createForm.isVerified),
      status: createForm.status || 'Approved'
    };

    try {
      setSubmitting(true);
      const res = await api.post('/reviews', payload);
      if (res.success && res.review) {
        setReviews(prev => [res.review, ...prev]);
        setIsCreateOpen(false);
        setCreateForm(initialCreateForm);
        alert('Review created successfully!');
      } else {
        alert(res.message || 'Failed to create review.');
      }
    } catch (err) {
      console.error('Create review error:', err);
      alert('Error creating review');
    } finally {
      setSubmitting(false);
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
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setIsCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiPlus /> Create Review
        </button>
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

      {/* CREATE REVIEW MODAL */}
      {isCreateOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="admin-modal-header">
              <h3>Create Product Review</h3>
              <button type="button" className="close-btn" onClick={() => setIsCreateOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="admin-modal-body">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Select Product *
                </label>
                <select
                  required
                  value={createForm.productId}
                  onChange={e => setCreateForm({ ...createForm, productId: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                >
                  <option value="">-- Choose a Product --</option>
                  {products.map(p => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.name} {p.category ? `(${p.category})` : ''}
                    </option>
                  ))}
                </select>

                {createForm.productId && (() => {
                  const sel = products.find(p => String(p._id || p.id) === String(createForm.productId));
                  if (!sel) return null;
                  const thumb = sel.images?.[0] || sel.image || '/assets/mencategory1.png';
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', padding: '8px 12px', background: '#fdf8f7', borderRadius: '6px', border: '1px solid #f2deda' }}>
                      <img src={thumb} alt={sel.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/assets/mencategory1.png'; }} />
                      <div>
                        <strong style={{ fontSize: '13px', display: 'block' }}>{sel.name}</strong>
                        <small style={{ color: '#666' }}>₹{Math.round(Number(sel.price) || 0).toLocaleString('en-IN')}</small>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                    Customer / Reviewer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={createForm.userName}
                    onChange={e => setCreateForm({ ...createForm, userName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                    Customer Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={createForm.userEmail}
                    onChange={e => setCreateForm({ ...createForm, userEmail: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
              </div>

              {/* RATING */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Star Rating (1 to 5) *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, rating: star })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <FiStar
                        size={26}
                        fill={star <= createForm.rating ? '#f59e0b' : 'none'}
                        color={star <= createForm.rating ? '#f59e0b' : '#d1d5db'}
                      />
                    </button>
                  ))}
                  <span style={{ marginLeft: '10px', fontWeight: '700', color: '#d97706', fontSize: '14px' }}>
                    {createForm.rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* COMMENT */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Review Comment *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the customer review here (e.g. Excellent fabric quality, fitting is great!)..."
                  value={createForm.comment}
                  onChange={e => setCreateForm({ ...createForm, comment: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical' }}
                />
              </div>

              {/* VERIFIED & STATUS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px' }}>
                  <input
                    type="checkbox"
                    id="isVerifiedReview"
                    checked={createForm.isVerified}
                    onChange={e => setCreateForm({ ...createForm, isVerified: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isVerifiedReview" style={{ cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    Verified Buyer Badge
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                    Moderation Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={e => setCreateForm({ ...createForm, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                  >
                    <option value="Approved">Approved (Publicly Visible)</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
