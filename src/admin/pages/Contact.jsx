import React, { useState, useEffect } from 'react';
import { FiSave, FiPhone, FiMail, FiMapPin, FiClock, FiGlobe } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({
    phone: '',
    alternatePhone: '',
    email: '',
    alternateEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    workingHours: '',
    mapUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    youtubeUrl: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contact');
      if (res.success && res.contact) {
        setForm({
          phone: res.contact.phone || '',
          alternatePhone: res.contact.alternatePhone || '',
          email: res.contact.email || '',
          alternateEmail: res.contact.alternateEmail || '',
          address: res.contact.address || '',
          city: res.contact.city || '',
          state: res.contact.state || '',
          pincode: res.contact.pincode || '',
          workingHours: res.contact.workingHours || '',
          mapUrl: res.contact.mapUrl || '',
          instagramUrl: res.contact.instagramUrl || '',
          facebookUrl: res.contact.facebookUrl || '',
          youtubeUrl: res.contact.youtubeUrl || ''
        });
      }
    } catch (err) {
      console.error('Fetch contact error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg({ type: '', text: '' });
      const res = await api.put('/contact', form);
      if (res.success) {
        setMsg({ type: 'success', text: 'Contact details updated successfully!' });
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed to update contact details' });
      }
    } catch (err) {
      console.error('Save contact error:', err);
      setMsg({ type: 'error', text: 'Server error while saving contact details.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        Loading contact details...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-title">
        <div>
          <h2>Store Contact Settings</h2>
          <p>Update phone numbers, email, store address and working hours displayed on the storefront.</p>
        </div>
      </div>

      {msg.text && (
        <div style={{
          padding: '12px 18px',
          marginBottom: '20px',
          borderRadius: '6px',
          backgroundColor: msg.type === 'success' ? '#def7ec' : '#fde8e8',
          color: msg.type === 'success' ? '#03543f' : '#9b1c1c',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card admin-contact-form" style={{ padding: '25px' }}>
        <h3 style={{ margin: '0 0 18px', fontSize: '16px', color: '#ef4b68', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPhone /> Contact Numbers & Emails
        </h3>

        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '25px' }}>
          <div className="field">
            <label>Primary Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="field">
            <label>Alternate Phone Number</label>
            <input
              type="text"
              name="alternatePhone"
              value={form.alternatePhone}
              onChange={handleChange}
              placeholder="+91 98765 43211"
            />
          </div>

          <div className="field">
            <label>Primary Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="support@shreebalaji.com"
              required
            />
          </div>

          <div className="field">
            <label>Alternate / Info Email</label>
            <input
              type="email"
              name="alternateEmail"
              value={form.alternateEmail}
              onChange={handleChange}
              placeholder="info@shreebalaji.com"
            />
          </div>
        </div>

        <h3 style={{ margin: '0 0 18px', fontSize: '16px', color: '#ef4b68', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiMapPin /> Store Location & Timing
        </h3>

        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '25px' }}>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label>Store Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Shree Balaji Vastraalaya, Main Market"
              required
            />
          </div>

          <div className="field">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Rohtak"
            />
          </div>

          <div className="field">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Haryana"
            />
          </div>

          <div className="field">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="124001"
            />
          </div>

          <div className="field">
            <label>Working Hours</label>
            <input
              type="text"
              name="workingHours"
              value={form.workingHours}
              onChange={handleChange}
              placeholder="Monday - Saturday, 10:00 AM - 8:00 PM"
            />
          </div>

          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label>Google Maps Link / URL</label>
            <input
              type="text"
              name="mapUrl"
              value={form.mapUrl}
              onChange={handleChange}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </div>

        <h3 style={{ margin: '0 0 18px', fontSize: '16px', color: '#ef4b68', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiGlobe /> Social Media Profiles
        </h3>

        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '25px' }}>
          <div className="field">
            <label>Instagram URL</label>
            <input
              type="text"
              name="instagramUrl"
              value={form.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="field">
            <label>Facebook URL</label>
            <input
              type="text"
              name="facebookUrl"
              value={form.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="field">
            <label>YouTube URL</label>
            <input
              type="text"
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: '700' }}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Contact Details'}
          </button>
        </div>
      </form>
    </div>
  );
}
