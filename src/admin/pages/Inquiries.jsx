import React, { useState, useEffect } from 'react';
import { FiEye, FiTrash2, FiSearch, FiMail, FiPhone, FiCheckCircle, FiClock, FiMessageCircle, FiFilter } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Inquiries.css';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inquiries');
      if (res.success && Array.isArray(res.inquiries)) {
        setInquiries(res.inquiries);
      }
    } catch (err) {
      console.error('Fetch inquiries error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/inquiries/${id}`, { status: newStatus });
      if (res.success) {
        setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
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
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await api.delete(`/inquiries/${id}`);
      if (res.success) {
        setInquiries(prev => prev.filter(inq => inq._id !== id));
        if (selected && selected._id === id) setSelected(null);
      }
    } catch (err) {
      console.error('Delete inquiry error:', err);
      alert('Failed to delete inquiry');
    }
  };

  const filtered = inquiries.filter(item => {
    const s = search.toLowerCase();
    const matchesSearch =
      (item.name || '').toLowerCase().includes(s) ||
      (item.email || '').toLowerCase().includes(s) ||
      (item.phone || '').toLowerCase().includes(s) ||
      (item.subject || '').toLowerCase().includes(s) ||
      (item.message || '').toLowerCase().includes(s) ||
      (item.inquiryId || '').toLowerCase().includes(s);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = inquiries.length;
  const newCount = inquiries.filter(i => i.status === 'New').length;
  const contactedCount = inquiries.filter(i => i.status === 'Contacted').length;
  const resolvedCount = inquiries.filter(i => i.status === 'Resolved').length;

  return (
    <div>
      <div className="admin-title">
        <div>
          <h2>Store Inquiries</h2>
          <p>Customer contact messages and storefront inquiries submitted from the Contact Us page.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stat-grid" style={{ marginBottom: '20px' }}>
        <div className="admin-stat">
          <FiMessageCircle className="stat-icon" />
          <span>Total Inquiries</span>
          <strong>{totalCount}</strong>
        </div>
        <div className="admin-stat">
          <FiClock className="stat-icon" style={{ color: '#f59e0b' }} />
          <span>New Messages</span>
          <strong style={{ color: '#d97706' }}>{newCount}</strong>
        </div>
        <div className="admin-stat">
          <FiMail className="stat-icon" style={{ color: '#3b82f6' }} />
          <span>Contacted</span>
          <strong style={{ color: '#2563eb' }}>{contactedCount}</strong>
        </div>
        <div className="admin-stat">
          <FiCheckCircle className="stat-icon" style={{ color: '#10b981' }} />
          <span>Resolved</span>
          <strong style={{ color: '#059669' }}>{resolvedCount}</strong>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, subject, phone..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiFilter style={{ color: '#666' }} />
          <span style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>Status:</span>
          {['All', 'New', 'Contacted', 'Resolved'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: statusFilter === st ? '1px solid #ef4b68' : '1px solid #e2e8f0',
                backgroundColor: statusFilter === st ? '#ef4b68' : '#fff',
                color: statusFilter === st ? '#fff' : '#4a5568',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* INQUIRIES TABLE */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
            Loading inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
            No inquiries found matching your filters.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Inquiry ID</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message Preview</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inq => {
                const dateStr = new Date(inq.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                const badgeClass =
                  inq.status === 'New' ? 'admin-badge warn' :
                  inq.status === 'Resolved' ? 'admin-badge' :
                  'admin-badge info';

                return (
                  <tr key={inq._id}>
                    <td>
                      <b style={{ color: '#ef4b68' }}>{inq.inquiryId || inq._id.slice(-6).toUpperCase()}</b>
                    </td>
                    <td>
                      <div>
                        <strong>{inq.name}</strong>
                        <div style={{ fontSize: '11px', color: '#777' }}>
                          <FiMail style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                          {inq.email}
                        </div>
                        {inq.phone && (
                          <div style={{ fontSize: '11px', color: '#777' }}>
                            <FiPhone style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            {inq.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: '#333' }}>{inq.subject || 'General'}</span>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#666',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {inq.message}
                      </p>
                    </td>
                    <td style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                      {dateStr}
                    </td>
                    <td>
                      <select
                        value={inq.status || 'New'}
                        onChange={(e) => handleUpdateStatus(inq._id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: '1px solid #cbd5e1',
                          backgroundColor:
                            inq.status === 'New' ? '#fef3c7' :
                            inq.status === 'Resolved' ? '#d1fae5' : '#dbeafe',
                          color:
                            inq.status === 'New' ? '#92400e' :
                            inq.status === 'Resolved' ? '#065f46' : '#1e40af',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="icon-btn"
                          title="View Inquiry Details"
                          onClick={() => {
                            setSelected(inq);
                            if (inq.status === 'New') {
                              handleUpdateStatus(inq._id, 'Contacted');
                            }
                          }}
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          style={{ color: '#ef4444' }}
                          title="Delete Inquiry"
                          onClick={() => handleDelete(inq._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal small" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '92%' }}>
            <div className="modal-head">
              <div>
                <h3 style={{ margin: 0 }}>Inquiry Details</h3>
                <small style={{ color: '#ef4b68', fontWeight: '700' }}>
                  {selected.inquiryId || selected._id}
                </small>
              </div>
              <button onClick={() => setSelected(null)}>×</button>
            </div>

            <div style={{ padding: '20px 0 10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <div>
                  <small style={{ color: '#888', display: 'block' }}>Sender Name</small>
                  <strong>{selected.name}</strong>
                </div>
                <div>
                  <small style={{ color: '#888', display: 'block' }}>Email Address</small>
                  <a href={`mailto:${selected.email}`} style={{ color: '#ef4b68', fontWeight: '600' }}>
                    {selected.email}
                  </a>
                </div>
                <div>
                  <small style={{ color: '#888', display: 'block' }}>Phone Number</small>
                  {selected.phone ? (
                    <a href={`tel:${selected.phone}`} style={{ color: '#333' }}>
                      {selected.phone}
                    </a>
                  ) : (
                    <span style={{ color: '#aaa' }}>Not provided</span>
                  )}
                </div>
                <div>
                  <small style={{ color: '#888', display: 'block' }}>Received Date</small>
                  <span>{new Date(selected.createdAt || Date.now()).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <small style={{ color: '#888', display: 'block' }}>Subject</small>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginTop: '2px' }}>
                  {selected.subject || 'General Inquiry'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <small style={{ color: '#888', display: 'block', marginBottom: '6px' }}>Message</small>
                <div style={{
                  padding: '14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#334155',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selected.message}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Status:</span>
                  <select
                    value={selected.status || 'New'}
                    onChange={(e) => handleUpdateStatus(selected._id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Inquiry')}`}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    Reply via Email
                  </a>
                  <button
                    className="btn btn-outline"
                    onClick={() => setSelected(null)}
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
