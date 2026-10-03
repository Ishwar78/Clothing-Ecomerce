import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiInstagram, FiUpload, FiCheckCircle, FiX, FiExternalLink, FiImage } from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './StyleShare.css';

export default function StyleShare() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initialForm = {
    image: '',
    title: '',
    link: '',
    order: 0,
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/style-share/all');
      if (res.success && Array.isArray(res.items)) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Fetch style items error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        image: item.image || '',
        title: item.title || '',
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
    if (!formData.image) {
      alert('Please upload or provide an image.');
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/style-share/${editingId}`, formData);
        if (res.success) {
          setItems(prev => prev.map(item => item._id === editingId ? res.item : item));
          handleCloseModal();
        }
      } else {
        const res = await api.post('/style-share', formData);
        if (res.success) {
          setItems(prev => [...prev, res.item]);
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Save style item error:', err);
      alert('Failed to save: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this style image?')) return;

    try {
      const res = await api.delete(`/style-share/${id}`);
      if (res.success) {
        setItems(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete item: ' + err.message);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await api.put(`/style-share/${item._id}`, { isActive: !item.isActive });
      if (res.success) {
        setItems(prev => prev.map(i => i._id === item._id ? res.item : i));
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  return (
    <div className="data-page style-share-page">
      <div className="data-header">
        <div>
          <h2>STYLE IT. SHARE IT. Gallery</h2>
          <p>Manage customer lookbook and social showcase images featured on the homepage</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Style Image
        </button>
      </div>

      {loading ? (
        <div className="data-loading">Loading style images...</div>
      ) : items.length === 0 ? (
        <div className="data-empty">
          <FiInstagram size={48} color="#d4af37" />
          <p>No style images found. Add your first lookbook image!</p>
        </div>
      ) : (
        <div className="style-grid">
          {items.map((item) => (
            <div key={item._id} className={`style-card ${!item.isActive ? 'disabled' : ''}`}>
              <div className="style-img-wrapper">
                <img
                  src={item.image}
                  alt={item.title || 'Style image'}
                  onError={(e) => { e.currentTarget.src = '/assets/women.png'; }}
                />
                <span className={`status-pill ${item.isActive ? 'active' : 'inactive'}`}>
                  {item.isActive ? 'Active' : 'Hidden'}
                </span>
                <div className="style-order-badge">#{item.order || 0}</div>
              </div>

              <div className="style-info">
                <h3>{item.title || 'Untitled Look'}</h3>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="style-link">
                    <FiInstagram size={14} /> View Post <FiExternalLink size={12} />
                  </a>
                ) : (
                  <span className="no-link">No link set</span>
                )}
              </div>

              <div className="style-actions">
                <button
                  className="btn-icon"
                  title={item.isActive ? 'Hide from homepage' : 'Show on homepage'}
                  onClick={() => handleToggleStatus(item)}
                >
                  <FiCheckCircle color={item.isActive ? '#10b981' : '#9ca3af'} />
                </button>
                <button className="btn-icon" title="Edit" onClick={() => handleOpenModal(item)}>
                  <FiEdit2 />
                </button>
                <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content style-modal">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Style Image' : 'Add Style Image'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Image *</label>
                <div className="image-upload-box">
                  {formData.image ? (
                    <div className="preview-container">
                      <img src={formData.image} alt="Preview" />
                      <button
                        type="button"
                        className="change-img-btn"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-trigger">
                      <FiUpload size={24} />
                      <span>{uploading ? 'Uploading Image...' : 'Click to Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Or paste image URL directly..."
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Title / Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Elegant Silk Saree Look"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Social / Instagram Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/p/..."
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                  />
                </div>

                <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '28px' }}>
                  <input
                    type="checkbox"
                    id="isActiveCheckbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label htmlFor="isActiveCheckbox" style={{ margin: 0, cursor: 'pointer' }}>
                    Show on Homepage
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {editingId ? 'Save Changes' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
