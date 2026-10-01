import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiCheck,
  FiX
} from 'react-icons/fi';
import './AdminPages.css';

const POSITIONS = [
  { id: 'hero', label: 'Hero Slider (Top Banner Carousel)' },
  { id: 'pre-trending-1', label: 'Above Trending - Left Card (Men\'s Collection)' },
  { id: 'pre-trending-2', label: 'Above Trending - Right Card (Women\'s Collection)' },
  { id: 'post-influencer-1', label: 'Below Influencer - Left Card (Boys Collection)' },
  { id: 'post-influencer-2', label: 'Below Influencer - Right Card (Girls Collection)' },
  { id: 'sale', label: 'Bottom Sale Banner (The Style Sale)' }
];

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    link: '/shop',
    position: 'hero',
    image: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchBanners = () => {
    setLoading(true);
    api.get('/banners')
      .then((res) => {
        if (res.success) {
          setBanners(res.banners || []);
        }
      })
      .catch((err) => console.error('Error fetching banners:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = (defaultPos = 'hero') => {
    setEditingBannerId(null);
    setForm({
      title: '',
      subtitle: '',
      link: '/shop',
      position: defaultPos,
      image: '',
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBannerId(banner._id);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      link: banner.link || '/shop',
      position: banner.position || 'hero',
      image: banner.image || '',
      isActive: banner.isActive !== false
    });
    setImageFile(null);
    setImagePreview(banner.image || '');
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = form.image;

    if (imageFile) {
      try {
        const uploadRes = await api.upload('/upload', imageFile);
        if (uploadRes.success) {
          finalImageUrl = uploadRes.imageUrl;
        } else {
          alert('Failed to upload image');
          return;
        }
      } catch (err) {
        console.error(err);
        alert('Image upload failed');
        return;
      }
    }

    if (!finalImageUrl) {
      alert('Please upload a banner image');
      return;
    }

    const payload = {
      ...form,
      image: finalImageUrl
    };

    try {
      if (editingBannerId) {
        const res = await api.put(`/banners/${editingBannerId}`, payload);
        if (res.success) {
          setBanners(prev => prev.map(b => b._id === editingBannerId ? res.banner : b));
          setModalOpen(false);
          alert('Banner updated successfully!');
        }
      } else {
        const res = await api.post('/banners', payload);
        if (res.success) {
          setBanners(prev => [res.banner, ...prev]);
          setModalOpen(false);
          alert('Banner created successfully!');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await api.delete(`/banners/${id}`);
      if (res.success) {
        setBanners(prev => prev.filter(b => b._id !== id));
        alert('Banner deleted successfully');
      }
    } catch (err) {
      alert('Failed to delete banner');
    }
  };

  const getPositionLabel = (pos) => {
    return POSITIONS.find(p => p.id === pos)?.label || pos;
  };

  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <h2>Home Banners Manager</h2>
          <p>Upload & manage all promotional banners, hero sliders, and collection cards on the homepage.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openAddModal('hero')}>
          <FiPlus /> Add New Banner
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading banners...</p>
        ) : banners.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <FiImage size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No banners uploaded yet. Click "Add New Banner" to customize any section on the homepage.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Banner Preview</th>
                <th>Position on Homepage</th>
                <th>Title / Headline</th>
                <th>Subtitle / Text</th>
                <th>Target Link</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner._id}>
                  <td>
                    <img
                      src={banner.image}
                      alt={banner.title || 'Banner'}
                      style={{
                        width: '120px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #eee'
                      }}
                    />
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      backgroundColor: '#f0f4ff', 
                      color: '#2b50ed' 
                    }}>
                      {getPositionLabel(banner.position || 'hero')}
                    </span>
                  </td>
                  <td><b>{banner.title || '-'}</b></td>
                  <td>{banner.subtitle || '-'}</td>
                  <td><code>{banner.link || '/'}</code></td>
                  <td>
                    <span className={`admin-badge ${banner.isActive ? 'success' : 'warn'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="icon-btn"
                        title="Edit Banner"
                        onClick={() => openEditModal(banner)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        title="Delete Banner"
                        onClick={() => handleDelete(banner._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BANNER MODAL */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '580px' }}>
            <div className="modal-head">
              <h3>{editingBannerId ? 'Edit Home Banner' : 'Add Home Banner'}</h3>
              <button className="icon-btn" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                  Select Homepage Position *
                </label>
                <select
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fff' }}
                >
                  {POSITIONS.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                  Banner Title (Headline)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Men's Collection / Style Sale"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Essentials For Every Occasion"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                  Target Link (Redirect page on click)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /men or /women or /sale"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                  Banner Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginBottom: '8px', display: 'block' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                    <img
                      src={imagePreview}
                      alt="Banner Preview"
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  Active (Show on Homepage)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBannerId ? 'Update Banner' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
