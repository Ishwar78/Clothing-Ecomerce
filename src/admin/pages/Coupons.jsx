import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiTag, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Coupons.css';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    expiryDate: '',
    description: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      if (res.success) {
        setCoupons(res.coupons || []);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue) {
      alert('Please provide Coupon Code and Discount Value');
      return;
    }

    setSaving(true);
    try {
      const res = await api.post('/coupons', {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        expiryDate: form.expiryDate || null,
        description: form.description,
        isActive: form.isActive
      });

      if (res.success) {
        setCoupons([res.coupon, ...coupons]);
        setOpen(false);
        setForm({
          code: '',
          discountType: 'percentage',
          discountValue: '',
          minOrderAmount: '',
          maxDiscount: '',
          expiryDate: '',
          description: '',
          isActive: true
        });
        alert('Coupon created successfully!');
      } else {
        alert(res.message || 'Failed to create coupon');
      }
    } catch (err) {
      console.error('Create coupon error:', err);
      alert('Error creating coupon: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      } else {
        alert(res.message || 'Failed to delete coupon');
      }
    } catch (err) {
      console.error('Delete coupon error:', err);
      alert('Error deleting coupon: ' + err.message);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const res = await api.put(`/coupons/${coupon._id}`, {
        isActive: !coupon.isActive
      });
      if (res.success) {
        setCoupons(coupons.map(c => c._id === coupon._id ? res.coupon : c));
      }
    } catch (err) {
      console.error('Toggle coupon status error:', err);
    }
  };

  return (
    <div>
      <div className="admin-title">
        <div>
          <h2>Coupon Codes & Discounts</h2>
          <p>Create percentage or flat discount promo codes for customers to use at checkout.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={fetchCoupons}
            title="Refresh"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiPlus /> Add Coupon
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #efddda', padding: '16px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <FiRefreshCw className="spin" size={24} style={{ display: 'block', margin: '0 auto 10px' }} />
            Loading coupon codes...
          </div>
        ) : !coupons.length ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
            <FiTag size={40} style={{ color: '#ccc', marginBottom: '12px' }} />
            <h3>No coupons created yet</h3>
            <p style={{ fontSize: '13px', margin: '4px 0 16px' }}>Create discounts using percentage or flat amounts.</p>
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <FiPlus /> Create First Coupon
            </button>
          </div>
        ) : (
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f2e4e1', color: '#6d5a57' }}>
                <th style={{ padding: '12px 10px' }}>Coupon Code</th>
                <th style={{ padding: '12px 10px' }}>Discount</th>
                <th style={{ padding: '12px 10px' }}>Min Order</th>
                <th style={{ padding: '12px 10px' }}>Expiry Date</th>
                <th style={{ padding: '12px 10px' }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const discountDisplay = c.discountType === 'percentage'
                  ? `${c.discountValue}% OFF`
                  : `₹${c.discountValue} OFF`;

                const expiryDisplay = c.expiryDate
                  ? new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'No Expiry';

                return (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f6edeb', verticalAlign: 'middle' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: '#fff0ed',
                          color: '#e11b22',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          letterSpacing: '0.8px',
                          border: '1px dashed #ffa39e'
                        }}>
                          {c.code}
                        </span>
                      </div>
                      {c.description && <small style={{ display: 'block', color: '#777', marginTop: '4px' }}>{c.description}</small>}
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <strong style={{ color: '#2563eb', fontSize: '14px' }}>{discountDisplay}</strong>
                      {c.maxDiscount > 0 && <small style={{ display: 'block', color: '#888' }}>Up to ₹{c.maxDiscount}</small>}
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : 'No Minimum'}
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      {expiryDisplay}
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c)}
                        title="Click to toggle status"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <span className={'admin-badge ' + (c.isActive ? 'success' : 'warn')}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>

                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => handleDeleteCoupon(c._id, c.code)}
                        title="Delete coupon"
                        style={{ cursor: 'pointer' }}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE COUPON MODAL */}
      {open && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="admin-modal small" style={{ width: '480px', borderRadius: '14px', padding: '24px' }}>
            <div className="modal-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3>Create New Coupon</h3>
              <button type="button" onClick={() => setOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateCoupon}>
              <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="field full" style={{ gridColumn: '1/-1' }}>
                  <label>Coupon Code <span style={{ color: '#e11b22' }}>*</span></label>
                  <input
                    required
                    placeholder="e.g. FESTIVE20, FLAT200"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}
                  />
                </div>

                <div className="field">
                  <label>Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="field">
                  <label>Discount Value <span style={{ color: '#e11b22' }}>*</span></label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={form.discountType === 'percentage' ? 'e.g. 20 (for 20%)' : 'e.g. 200 (for ₹200)'}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Minimum Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 999 (0 for none)"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500 (optional)"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  />
                </div>

                <div className="field full" style={{ gridColumn: '1/-1' }}>
                  <label>Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>

                <div className="field full" style={{ gridColumn: '1/-1' }}>
                  <label>Description / Offer Text</label>
                  <input
                    placeholder="e.g. 20% OFF on all orders above ₹999"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="field full" style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <span>Active (Available for customers to use at checkout)</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Creating...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
