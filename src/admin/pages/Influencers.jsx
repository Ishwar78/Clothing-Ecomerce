import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiInstagram, FiUpload, FiCheckCircle, FiX, FiExternalLink } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Influencers.css';

export default function Influencers() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initialForm = {
    name: '',
    followers: '',
    image: '',
    link: '',
    order: 0,
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/influencers');
      if (res.success && Array.isArray(res.influencers)) {
        setInfluencers(res.influencers);
      }
    } catch (err) {
      console.error('Fetch influencers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        name: item.name || '',
        followers: item.followers || '',
        image: item.image || '',
        link: item.link || '',
        order: item.order || 0,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.upload('/upload', file);
      if (res.success && res.imageUrl) {
        setFormData(prev => ({ ...prev, image: res.imageUrl }));
      } else {
        alert(res.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      alert('Please provide influencer name and image.');
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/influencers/${editingId}`, formData);
        if (res.success) {
          setInfluencers(prev => prev.map(item => item._id === editingId ? res.influencer : item));
          handleCloseModal();
        }
      } else {
        const res = await api.post('/influencers', formData);
        if (res.success) {
          setInfluencers(prev => [res.influencer, ...prev]);
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Save influencer error:', err);
      alert('Failed to save influencer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this influencer?')) return;
    try {
      const res = await api.delete(`/influencers/${id}`);
      if (res.success) {
        setInfluencers(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Delete influencer error:', err);
      alert('Failed to delete influencer');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await api.put(`/influencers/${item._id}`, { isActive: !item.isActive });
      if (res.success) {
        setInfluencers(prev => prev.map(x => x._id === item._id ? { ...x, isActive: !item.isActive } : x));
      }
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const totalCount = influencers.length;
  const activeCount = influencers.filter(i => i.isActive).length;

  return (
    <div className="influencers-admin-wrap">
      {/* HEADER */}
      <div className="admin-title">
        <div>
          <h2>Fashion Influencer Management</h2>
          <p>Add and manage fashion influencer looks and images displayed on the homepage.</p>
        </div>
        <button 
          className="admin-btn admin-btn-primary" 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiPlus /> Add Influencer
        </button>
      </div>

      {/* STATS */}
      <div className="admin-stat-grid" style={{ marginBottom: '22px' }}>
        <div className="admin-stat">
          <FiInstagram className="stat-icon" style={{ color: '#e1306c' }} />
          <span>Total Influencers</span>
          <strong>{totalCount}</strong>
        </div>
        <div className="admin-stat">
          <FiCheckCircle className="stat-icon" style={{ color: '#10b981' }} />
          <span>Active on Homepage</span>
          <strong style={{ color: '#059669' }}>{activeCount}</strong>
        </div>
      </div>

      {/* INFLUENCER GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
          Loading influencers...
        </div>
      ) : influencers.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <FiInstagram size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <h3>No Influencers Added Yet</h3>
          <p style={{ marginBottom: '18px' }}>Click "Add Influencer" to upload your first community look.</p>
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus /> Add First Influencer
          </button>
        </div>
      ) : (
        <div className="influencer-admin-grid">
          {influencers.map((item) => (
            <div key={item._id} className="influencer-admin-card">
              <div className="influencer-thumb-wrap">
                <img src={item.image} alt={item.name} onError={(e) => { e.target.src = '/assets/mencategory1.png'; }} />
                <span className="insta-badge">
                  <FiInstagram />
                </span>
                <span className={`status-pill ${item.isActive ? 'active' : 'inactive'}`}>
                  {item.isActive ? 'Live' : 'Hidden'}
                </span>
              </div>

              <div className="influencer-card-body">
                <h4>{item.name}</h4>
                <p className="followers-text">{item.followers || 'Follower count'}</p>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noreferrer" className="influencer-link">
                    View Profile <FiExternalLink size={12} />
                  </a>
                )}

                <div className="influencer-actions">
                  <button 
                    type="button" 
                    className="toggle-status-btn"
                    onClick={() => handleToggleStatus(item)}
                    title={item.isActive ? 'Hide from homepage' : 'Show on homepage'}
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    type="button" 
                    className="icon-action edit"
                    onClick={() => handleOpenModal(item)}
                    title="Edit"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button 
                    type="button" 
                    className="icon-action delete"
                    onClick={() => handleDelete(item._id)}
                    title="Delete"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <h3>{editingId ? 'Edit Influencer' : 'Add New Influencer'}</h3>
              <button type="button" className="close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Influencer Handle / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="@stylewithsbv or Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Follower Count Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24K followers, 50K community"
                  value={formData.followers}
                  onChange={e => setFormData({ ...formData, followers: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Influencer Image *
                </label>
                
                {/* Upload or URL */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <FiUpload /> {uploading ? 'Uploading...' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ fontSize: '12px', color: '#888' }}>or paste Image URL below:</span>
                </div>

                <input
                  type="text"
                  required
                  placeholder="https://... or uploaded image URL"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />

                {formData.image && (
                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Preview:</p>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #f0dedb' }}
                      onError={(e) => { e.target.src = '/assets/mencategory1.png'; }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Profile Link (Instagram / Website)
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/username"
                  value={formData.link}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: '1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isActiveToggle" style={{ cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    Active (Live)
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>
                  {editingId ? 'Update Influencer' : 'Add Influencer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
