import React, { useState, useEffect } from 'react';
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiCornerUpLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiCreditCard,
  FiCopy,
  FiCheck,
  FiMaximize2
} from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Returns.css';

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReturn, setSelectedReturn] = useState(null);

  // Modal edit state
  const [editStatus, setEditStatus] = useState('Requested');
  const [adminNotesText, setAdminNotesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/returns');
      if (res.success) {
        setReturns(res.returns || []);
      }
    } catch (err) {
      console.error('Failed to fetch returns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const openReturnModal = (ret) => {
    setSelectedReturn(ret);
    setEditStatus(ret.status || 'Requested');
    setAdminNotesText(ret.adminNotes || '');
  };

  const handleUpdateReturn = async () => {
    if (!selectedReturn) return;
    setSaving(true);
    try {
      const res = await api.put(`/returns/${selectedReturn._id}/status`, {
        status: editStatus,
        adminNotes: adminNotesText
      });

      if (res.success) {
        setReturns(prev =>
          prev.map(r => (r._id === selectedReturn._id ? res.returnRequest : r))
        );
        setSelectedReturn(res.returnRequest);
        alert('Return request status updated successfully!');
      } else {
        alert(res.message || 'Failed to update return status');
      }
    } catch (err) {
      console.error('Update return error:', err);
      alert('Error updating return request: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReturn = async (id) => {
    if (!window.confirm('Are you sure you want to delete this return request?')) return;
    try {
      const res = await api.delete(`/returns/${id}`);
      if (res.success) {
        setReturns(prev => prev.filter(r => r._id !== id));
        if (selectedReturn?._id === id) {
          setSelectedReturn(null);
        }
        alert('Return request deleted successfully');
      } else {
        alert(res.message || 'Failed to delete return request');
      }
    } catch (err) {
      alert('Error deleting return: ' + err.message);
    }
  };

  const handleCopyUpi = (upiId) => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const filteredReturns = returns.filter(r => {
    const matchesSearch =
      (r.returnId || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.productName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.upiId || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.reason || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const requestedCount = returns.filter(r => r.status === 'Requested').length;
  const approvedCount = returns.filter(r => r.status === 'Approved').length;
  const refundedCount = returns.filter(r => r.status === 'Refund Completed').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Requested':
        return <span className="admin-badge warn">Requested</span>;
      case 'Approved':
        return <span className="admin-badge info">Approved</span>;
      case 'Refund Completed':
        return <span className="admin-badge success">Refund Completed</span>;
      case 'Rejected':
        return <span className="admin-badge danger">Rejected</span>;
      default:
        return <span className="admin-badge">{status}</span>;
    }
  };

  return (
    <div className="admin-returns-page">
      {/* HEADER */}
      <div className="admin-title">
        <div>
          <h2>Return Requests & Refunds</h2>
          <p>Review customer product return applications, defective items, and payout refunds.</p>
        </div>
        <button
          type="button"
          className="admin-btn secondary"
          onClick={fetchReturns}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* STATS STRIP */}
      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0e7ff', color: '#6366f1', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiCornerUpLeft />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>TOTAL RETURNS</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>{returns.length}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#f59e0b', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiClock />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>PENDING REVIEW</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#d97706' }}>{requestedCount}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dbeafe', color: '#3b82f6', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiCheckCircle />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>APPROVED FOR RETURN</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#2563eb' }}>{approvedCount}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#d1fae5', color: '#10b981', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiDollarSign />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>REFUND COMPLETED</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>{refundedCount}</div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="admin-card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }}>
            <FiSearch style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by Return ID, Order #, Customer, Product, UPI ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', background: '#fff' }}
            >
              <option value="ALL">All Return Statuses</option>
              <option value="Requested">Requested (Pending)</option>
              <option value="Approved">Approved</option>
              <option value="Refund Completed">Refund Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* RETURNS TABLE */}
      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <FiRefreshCw className="spin" style={{ fontSize: '24px', marginBottom: '8px' }} />
            <div>Loading return requests...</div>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6b7280' }}>
            <FiCornerUpLeft style={{ fontSize: '36px', color: '#d1d5db', marginBottom: '12px' }} />
            <h3>No Return Requests Found</h3>
            <p>Customer return and refund submissions will appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Return ID</th>
                  <th>Order & Customer</th>
                  <th>Product Details</th>
                  <th>Reason & Proof</th>
                  <th>Refund Details</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map(ret => (
                  <tr key={ret._id}>
                    <td>
                      <b style={{ color: '#4f46e5', letterSpacing: '0.5px' }}>{ret.returnId}</b>
                      <small style={{ color: '#6b7280', display: 'block', marginTop: '2px' }}>
                        {new Date(ret.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </small>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#111827', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                        {ret.orderId}
                      </span>
                      <div style={{ fontWeight: '600', color: '#374151', marginTop: '3px' }}>{ret.userName}</div>
                      <small style={{ color: '#6b7280' }}>{ret.userEmail}</small>
                      {ret.userPhone && <small style={{ color: '#9ca3af' }}>{ret.userPhone}</small>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {ret.productImage && (
                          <img
                            src={ret.productImage}
                            alt={ret.productName}
                            style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{ret.productName}</div>
                          <small style={{ color: '#6b7280' }}>
                            {ret.productSize ? `Size: ${ret.productSize}` : ''} 
                            {ret.productColor ? ` • Color: ${ret.productColor}` : ''}
                          </small>
                          {ret.productPrice > 0 && (
                            <div style={{ fontWeight: '700', color: '#e11b22', fontSize: '12px' }}>
                              ₹{Number(ret.productPrice).toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', display: 'inline-block', marginBottom: '4px' }}>
                        {ret.reason}
                      </span>
                      <small style={{ color: '#4b5563', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ret.message}
                      </small>
                      {ret.defectImage && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(ret.defectImage)}
                          style={{ border: 'none', background: '#f3f4f6', color: '#4f46e5', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '600' }}
                        >
                          <FiMaximize2 /> View Defect Image
                        </button>
                      )}
                    </td>
                    <td>
                      {ret.refundMethod === 'UPI' ? (
                        <div>
                          <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                            UPI REFUND
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <code style={{ fontSize: '12px', background: '#f9fafb', padding: '2px 6px', borderRadius: '4px', color: '#111827', border: '1px solid #e5e7eb' }}>
                              {ret.upiId}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyUpi(ret.upiId)}
                              title="Copy UPI ID"
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
                            >
                              <FiCopy />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                            BANK TRANSFER
                          </span>
                          <small style={{ display: 'block', color: '#111827', fontWeight: '600', marginTop: '3px' }}>
                            {ret.bankDetails?.accountHolderName}
                          </small>
                          <small style={{ color: '#6b7280' }}>
                            A/C: {ret.bankDetails?.accountNumber}
                          </small>
                          <small style={{ color: '#6b7280' }}>
                            {ret.bankDetails?.bankName} ({ret.bankDetails?.ifscCode})
                          </small>
                        </div>
                      )}
                    </td>
                    <td>{getStatusBadge(ret.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="admin-action-btn view"
                          title="Manage Return"
                          onClick={() => openReturnModal(ret)}
                        >
                          <FiEye /> Review
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn delete"
                          title="Delete Request"
                          onClick={() => handleDeleteReturn(ret._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RETURN DETAILS & STATUS MODAL */}
      {selectedReturn && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="admin-modal" style={{ maxWidth: '680px', width: '100%', borderRadius: '16px', padding: '26px' }}>
            <div className="modal-head" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0 }}>Return Request #{selectedReturn.returnId}</h3>
                  {getStatusBadge(selectedReturn.status)}
                </div>
                <small style={{ color: '#6b7280' }}>
                  Submitted on {new Date(selectedReturn.createdAt).toLocaleString('en-IN')}
                </small>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedReturn(null)} 
                style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}
              >
                ×
              </button>
            </div>

            {/* ORDER & PRODUCT INFO */}
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '10px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'center' }}>
              {selectedReturn.productImage ? (
                <img
                  src={selectedReturn.productImage}
                  alt={selectedReturn.productName}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#e5e7eb', display: 'grid', placeItems: 'center', color: '#9ca3af' }}>
                  <FiCornerUpLeft fontSize="24px" />
                </div>
              )}
              <div>
                <span style={{ fontSize: '11px', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  Order #{selectedReturn.orderId}
                </span>
                <h4 style={{ margin: '4px 0 2px', fontSize: '16px', color: '#111827' }}>{selectedReturn.productName}</h4>
                <div style={{ fontSize: '13px', color: '#4b5563' }}>
                  {selectedReturn.productSize && <span>Size: <b>{selectedReturn.productSize}</b></span>}
                  {selectedReturn.productColor && <span style={{ marginLeft: '10px' }}>Color: <b>{selectedReturn.productColor}</b></span>}
                  {selectedReturn.productPrice > 0 && <span style={{ marginLeft: '10px', color: '#dc2626', fontWeight: 'bold' }}>Price: ₹{Number(selectedReturn.productPrice).toLocaleString('en-IN')}</span>}
                </div>
              </div>
            </div>

            {/* CUSTOMER & REFUND INFO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  CUSTOMER INFORMATION
                </span>
                <div style={{ fontSize: '13px', color: '#111827', fontWeight: '600' }}><FiUser style={{ verticalAlign: '-1px' }} /> {selectedReturn.userName}</div>
                <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}><FiMail style={{ verticalAlign: '-1px' }} /> {selectedReturn.userEmail}</div>
                {selectedReturn.userPhone && (
                  <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}><FiPhone style={{ verticalAlign: '-1px' }} /> {selectedReturn.userPhone}</div>
                )}
              </div>

              <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  REFUND DESTINATION ({selectedReturn.refundMethod})
                </span>
                {selectedReturn.refundMethod === 'UPI' ? (
                  <div>
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>UPI ID:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <code style={{ fontSize: '13px', background: '#f0fdf4', padding: '4px 8px', borderRadius: '4px', color: '#15803d', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                        {selectedReturn.upiId}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyUpi(selectedReturn.upiId)}
                        style={{ border: 'none', background: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedUpi ? <><FiCheck color="#16a34a" /> Copied</> : <><FiCopy /> Copy</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
                    <div><b>Holder:</b> {selectedReturn.bankDetails?.accountHolderName}</div>
                    <div><b>Account:</b> {selectedReturn.bankDetails?.accountNumber}</div>
                    <div><b>Bank:</b> {selectedReturn.bankDetails?.bankName}</div>
                    <div><b>IFSC:</b> {selectedReturn.bankDetails?.ifscCode}</div>
                  </div>
                )}
              </div>
            </div>

            {/* PROBLEM DESCRIPTION & DEFECT IMAGE */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                  Reason: {selectedReturn.reason}
                </span>
              </div>
              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#2d3748', lineHeight: '1.6' }}>
                <b>Customer Statement:</b> {selectedReturn.message}
              </div>

              {selectedReturn.defectImage && (
                <div style={{ marginTop: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Defect / Proof Image Provided:
                  </label>
                  <img
                    src={selectedReturn.defectImage}
                    alt="Defect Proof"
                    onClick={() => setPreviewImage(selectedReturn.defectImage)}
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ef4444', cursor: 'pointer' }}
                  />
                  <small style={{ display: 'block', color: '#6b7280', marginTop: '2px' }}>Click image to zoom</small>
                </div>
              )}
            </div>

            {/* STATUS UPDATE & ADMIN NOTES */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Update Return Status:
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Requested">Requested (Under Review)</option>
                    <option value="Approved">Approved (Pickup Scheduled)</option>
                    <option value="Refund Completed">Refund Completed (Amount Sent)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Admin Notes (Visible to Customer in their Return Dashboard):
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Return approved. Courier partner will pick up item within 48 hours. Refund will be credited to your UPI ID."
                  value={adminNotesText}
                  onChange={(e) => setAdminNotesText(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', lineHeight: '1.5', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setSelectedReturn(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn primary"
                  disabled={saving}
                  onClick={handleUpdateReturn}
                >
                  <FiCheckCircle /> {saving ? 'Saving...' : 'Save & Update Return'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL DEFECT IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div 
          className="modal-backdrop" 
          style={{ zIndex: 10000, background: 'rgba(0,0,0,0.85)', display: 'grid', placeItems: 'center' }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: 'transparent', color: '#fff', border: 'none', fontSize: '32px', cursor: 'pointer' }}
            >
              ×
            </button>
            <img
              src={previewImage}
              alt="Defect Full View"
              style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
