import React, { useState, useEffect } from 'react';
import { FiSave, FiCheckCircle, FiFileText, FiPhone, FiMail, FiMapPin, FiHash, FiShield } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    companyName: 'Shree Balaji Vastraalaya',
    tagline: 'SBV Fashion Store - Complete Family Wear',
    gstin: '06ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    phone: '+91 98765 43210',
    alternatePhone: '+91 98765 43211',
    email: 'billing@shreebalaji.com',
    supportEmail: 'support@shreebalaji.com',
    address: 'Shop No. 12-14, Shree Balaji Complex, Main Cloth Market',
    city: 'Rohtak',
    state: 'Haryana',
    pincode: '124001',
    invoicePrefix: 'INV-SBV-',
    terms: '1. Goods once sold can be returned/exchanged within 7 days in unused condition with original tags.\n2. All disputes are subject to local jurisdiction.\n3. This is a computer-generated tax invoice.',
    authorizedSignatory: 'For Shree Balaji Vastraalaya'
  });

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get('/company');
      if (res.success && res.company) {
        setForm(prev => ({ ...prev, ...res.company }));
      }
    } catch (err) {
      console.error('Fetch company details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      const res = await api.put('/company', form);
      if (res.success) {
        setSuccessMsg('Company & Invoice details updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(res.message || 'Failed to update details');
      }
    } catch (err) {
      console.error('Save company details error:', err);
      alert('Error saving company details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading company profile...</div>;
  }

  return (
    <div className="company-settings-admin-wrap" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="admin-title">
        <div>
          <h2>Company & Invoice Settings</h2>
          <p>Manage store identity, GSTIN, billing address, and terms shown on customer invoices & bills.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600'
        }}>
          <FiCheckCircle size={18} />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          
          {/* BUSINESS IDENTITY */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', color: '#222', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiShield style={{ color: '#ef4b68' }} /> Store Identity & Tax Info
            </h3>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                Legal Company / Store Name *
              </label>
              <input
                type="text"
                name="companyName"
                required
                value={form.companyName}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                Tagline / Brand Subtitle
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  GSTIN Number *
                </label>
                <input
                  type="text"
                  name="gstin"
                  required
                  placeholder="06ABCDE1234F1Z5"
                  value={form.gstin}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  PAN Number
                </label>
                <input
                  type="text"
                  name="panNumber"
                  placeholder="ABCDE1234F"
                  value={form.panNumber}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', textTransform: 'uppercase' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                Invoice Number Prefix
              </label>
              <input
                type="text"
                name="invoicePrefix"
                value={form.invoicePrefix}
                onChange={handleChange}
                placeholder="INV-SBV-"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
              <small style={{ color: '#888', fontSize: '11px' }}>Example: INV-SBV-10023</small>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                Authorized Signatory Text
              </label>
              <input
                type="text"
                name="authorizedSignatory"
                value={form.authorizedSignatory}
                onChange={handleChange}
                placeholder="For Shree Balaji Vastraalaya"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
          </div>

          {/* CONTACT & BILLING ADDRESS */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', color: '#222', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiMapPin style={{ color: '#ef4b68' }} /> Registered Address & Contacts
            </h3>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                Store / Office Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={form.pincode}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  Billing Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  Alternate Phone
                </label>
                <input
                  type="text"
                  name="alternatePhone"
                  value={form.alternatePhone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  Billing Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                  Support Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={form.supportEmail}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* INVOICE TERMS & CONDITIONS */}
        <div className="admin-card" style={{ padding: '24px', marginTop: '22px' }}>
          <h3 style={{ fontSize: '17px', color: '#222', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFileText style={{ color: '#ef4b68' }} /> Invoice Terms & Conditions / Footer Note
          </h3>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Terms & Conditions printed at bottom of customer bill:
            </label>
            <textarea
              rows={4}
              name="terms"
              value={form.terms}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontSize: '15px' }}
            >
              <FiSave /> {saving ? 'Saving Changes...' : 'Save Company Details'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
