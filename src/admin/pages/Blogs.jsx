import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiUpload,
  FiCheckCircle,
  FiX,
  FiExternalLink,
  FiSearch,
  FiCalendar,
  FiClock,
  FiUser,
  FiTag,
  FiGlobe
} from 'react-icons/fi';
import api from '../../lib/api';
import RichTextEditor from '../components/RichTextEditor';
import './DataPages.css';
import './Blogs.css';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const initialForm = {
    title: '',
    slug: '',
    category: 'FASHION',
    image: '',
    shortDescription: '',
    content: '',
    author: 'Joyfulmarts Editorial',
    readTime: '5 min read',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    isActive: true
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs/all');
      if (res.success && Array.isArray(res.blogs)) {
        setBlogs(res.blogs);
      }
    } catch (err) {
      console.error('Fetch blogs error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format string into slug
  const formatSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => {
      // Auto-generate slug if creating new blog or if slug matches old generated title
      const newSlug = !editingId || prev.slug === formatSlug(prev.title)
        ? formatSlug(val)
        : prev.slug;
      return {
        ...prev,
        title: val,
        slug: newSlug,
        seoTitle: !editingId && !prev.seoTitle ? `${val} | Joyfulmarts Fashion` : prev.seoTitle
      };
    });
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title || '',
        slug: item.slug || '',
        category: item.category || 'FASHION',
        image: item.image || '',
        shortDescription: item.shortDescription || '',
        content: item.content || '',
        author: item.author || 'Joyfulmarts Editorial',
        readTime: item.readTime || '5 min read',
        seoTitle: item.seoTitle || '',
        seoDescription: item.seoDescription || '',
        seoKeywords: item.seoKeywords || '',
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
    if (!formData.title.trim()) {
      alert('Please provide a title for the blog article.');
      return;
    }
    if (!formData.image.trim()) {
      alert('Please upload or provide a featured image.');
      return;
    }

    try {
      const payload = {
        ...formData,
        slug: formatSlug(formData.slug || formData.title)
      };

      if (editingId) {
        const res = await api.put(`/blogs/${editingId}`, payload);
        if (res.success) {
          setBlogs(prev => prev.map(b => (b._id === editingId ? res.blog : b)));
          handleCloseModal();
        } else {
          alert(res.message || 'Failed to update blog');
        }
      } else {
        const res = await api.post('/blogs', payload);
        if (res.success) {
          setBlogs(prev => [res.blog, ...prev]);
          handleCloseModal();
        } else {
          alert(res.message || 'Failed to create blog');
        }
      }
    } catch (err) {
      console.error('Save blog error:', err);
      alert(err.message || 'Error saving blog article');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog article?')) return;

    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.success) {
        setBlogs(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error('Delete blog error:', err);
      alert(err.message || 'Failed to delete blog');
    }
  };

  const handleToggleStatus = async (blog) => {
    try {
      const res = await api.put(`/blogs/${blog._id}`, { isActive: !blog.isActive });
      if (res.success) {
        setBlogs(prev => prev.map(b => (b._id === blog._id ? res.blog : b)));
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch =
      !searchTerm ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' ||
      b.category.toUpperCase() === categoryFilter.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="data-page blogs-admin-page">
      {/* HEADER */}
      <div className="data-header">
        <div>
          <h2>Blog & Articles Manager</h2>
          <p>Create and edit styling guides, seasonal stories and SEO-optimized fashion articles</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Create Article
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="blog-admin-filters">
        <div className="blog-search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by title, category, or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="blog-cat-select">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="FASHION">Fashion</option>
            <option value="ETHNIC WEAR">Ethnic Wear</option>
            <option value="STYLE GUIDE">Style Guide</option>
            <option value="LIFESTYLE">Lifestyle</option>
            <option value="ACCESSORIES">Accessories</option>
          </select>
        </div>
      </div>

      {/* BLOGS TABLE */}
      {loading ? (
        <div className="data-loading">Loading articles...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="data-empty">
          <p>No blog articles found. Click "Create Article" to write your first story.</p>
        </div>
      ) : (
        <div className="blogs-table-wrap">
          <table className="blogs-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Author & Read Time</th>
                <th>Slug (URL)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((b) => (
                <tr key={b._id} className={!b.isActive ? 'draft-row' : ''}>
                  <td>
                    <div className="blog-table-article">
                      <img
                        src={b.image}
                        alt={b.title}
                        onError={(e) => { e.currentTarget.src = '/assets/women.png'; }}
                      />
                      <div>
                        <strong>{b.title}</strong>
                        <span className="blog-date-sub">
                          <FiCalendar size={11} /> {new Date(b.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="blog-cat-badge">{b.category}</span>
                  </td>
                  <td>
                    <div className="blog-author-meta">
                      <span><FiUser size={12} /> {b.author || 'Joyfulmarts'}</span>
                      <small><FiClock size={11} /> {b.readTime || '5 min read'}</small>
                    </div>
                  </td>
                  <td>
                    <code className="slug-code">/blog/{b.slug}</code>
                  </td>
                  <td>
                    <span className={`status-pill ${b.isActive ? 'active' : 'inactive'}`}>
                      {b.isActive ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <a
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon"
                        title="View Live Page"
                      >
                        <FiExternalLink />
                      </a>
                      <button
                        type="button"
                        className="btn-icon"
                        title={b.isActive ? 'Make Draft' : 'Publish Article'}
                        onClick={() => handleToggleStatus(b)}
                      >
                        <FiCheckCircle color={b.isActive ? '#10b981' : '#9ca3af'} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        title="Edit Article"
                        onClick={() => handleOpenModal(b)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        className="btn-icon delete"
                        title="Delete Article"
                        onClick={() => handleDelete(b._id)}
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content blog-modal">
            <div className="modal-header">
              <div>
                <h3>{editingId ? 'Edit Blog Article' : 'Create New Blog Article'}</h3>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {editingId ? `Editing: ${formData.title}` : 'Draft a new story for the Joyfulmarts Journal'}
                </span>
              </div>
              <button className="close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form blog-form-scroll">
              {/* BASIC DETAILS */}
              <div className="form-group">
                <label>Article Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Stunning Ways to Style Sarees for Modern Celebrations"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Slug URL (Dynamic route: /blog/:slug) *</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-stunning-ways-to-style-sarees"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: formatSlug(e.target.value) }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="FASHION">Fashion</option>
                    <option value="ETHNIC WEAR">Ethnic Wear</option>
                    <option value="STYLE GUIDE">Style Guide</option>
                    <option value="LIFESTYLE">Lifestyle</option>
                    <option value="ACCESSORIES">Accessories</option>
                    <option value="TRENDS">Trends</option>
                  </select>
                </div>
              </div>

              {/* FEATURED IMAGE */}
              <div className="form-group">
                <label>Featured Image *</label>
                <div className="image-upload-box">
                  {formData.image ? (
                    <div className="preview-container blog-preview-container">
                      <img src={formData.image} alt="Featured Preview" />
                      <button
                        type="button"
                        className="change-img-btn"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <label className="upload-trigger">
                      <FiUpload size={24} />
                      <span>{uploading ? 'Uploading Image...' : 'Click to Upload Featured Banner'}</span>
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
                    placeholder="Or enter image URL directly..."
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  />
                </div>
              </div>

              {/* AUTHOR & READ TIME */}
              <div className="form-row">
                <div className="form-group">
                  <label>Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Joyfulmarts Editorial Team"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  />
                </div>
              </div>

              {/* SHORT DESCRIPTION (RICH TEXT EDITOR) */}
              <div className="form-group">
                <label>Short Description / Excerpt (Rich Text Editor)</label>
                <span className="field-hint">
                  Summary shown on blog listing cards and search previews.
                </span>
                <RichTextEditor
                  compact={true}
                  minHeight="100px"
                  placeholder="Write a compelling brief summary..."
                  value={formData.shortDescription}
                  onChange={(val) => setFormData(prev => ({ ...prev, shortDescription: val }))}
                />
              </div>

              {/* FULL DESCRIPTION / CONTENT (RICH TEXT EDITOR) */}
              <div className="form-group">
                <label>Full Article Content (Rich Text Editor) *</label>
                <span className="field-hint">
                  Supports Headings (H2, H3), bold, lists, quotes, colors, links and raw HTML code view.
                </span>
                <RichTextEditor
                  minHeight="300px"
                  placeholder="Write your in-depth story, styling guide, and fashion tips here..."
                  value={formData.content}
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                />
              </div>

              {/* SEO SETTINGS */}
              <div className="seo-section-card">
                <div className="seo-card-header">
                  <FiGlobe />
                  <h4>SEO & Meta Settings (Search Engines & Head Tags)</h4>
                </div>

                <div className="form-group">
                  <label>SEO Meta Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Ways to Style Ethnic Wear | Joyfulmarts Fashion"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  />
                  <small style={{ color: '#888', fontSize: '11px' }}>
                    Recommended: 50-60 characters. Appears in browser tab and Google search title.
                  </small>
                </div>

                <div className="form-group">
                  <label>SEO Meta Description</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Discover elegant ideas for styling traditional ethnic wear for celebrations..."
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  />
                  <small style={{ color: '#888', fontSize: '11px' }}>
                    Recommended: 150-160 characters. Displayed as the Google snippet description.
                  </small>
                </div>

                <div className="form-group">
                  <label>SEO Keywords</label>
                  <input
                    type="text"
                    placeholder="e.g. ethnic wear, styling tips, fashion trends, kurti designs, Joyfulmarts store"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                  />
                  <small style={{ color: '#888', fontSize: '11px' }}>
                    Comma-separated keywords for meta tags and indexing.
                  </small>
                </div>
              </div>

              {/* PUBLISH STATUS TOGGLE */}
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                <input
                  type="checkbox"
                  id="blogIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="blogIsActive" style={{ margin: 0, cursor: 'pointer', fontWeight: '600' }}>
                  Publish Article Live (Available on Storefront)
                </label>
              </div>

              {/* ACTIONS */}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {editingId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
