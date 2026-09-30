import React, { useState } from 'react';
import api from '../../lib/api';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import './CrudPages.css';
import './Categories.css';

const initialCategories = [
  {
    id: 1,
    name: 'Men',
    image: '',
    subcategories: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers']
  },
  {
    id: 2,
    name: 'Women',
    image: '',
    subcategories: ['Dresses', 'Tops', 'Jeans', 'Kurtis']
  },
  {
    id: 3,
    name: 'Boys',
    image: '',
    subcategories: ['T-Shirts', 'Shirts', 'Jeans']
  },
  {
    id: 4,
    name: 'Girls',
    image: '',
    subcategories: ['Dresses', 'Tops', 'Skirts']
  },
  {
    id: 5,
    name: 'Ethnic Wear',
    image: '',
    subcategories: ['Kurta', 'Sherwani', 'Lehenga', 'Saree']
  },
  {
    id: 6,
    name: 'Footwear',
    image: '',
    subcategories: ['Sneakers', 'Sandals', 'Heels', 'Loafers']
  },
  {
    id: 7,
    name: 'Accessories',
    image: '',
    subcategories: ['Watches', 'Bags', 'Belts', 'Wallets']
  },
  {
    id: 8,
    name: 'Sale',
    image: '',
    subcategories: ['Men Sale', 'Women Sale', 'Kids Sale']
  }
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    api.get('/categories').then(res => {
      if (res.success) setCategories(res.categories.map(c => ({...c, id: c._id})));
      setLoading(false);
    });
  }, []);

  const [categoryModal, setCategoryModal] = useState(false);
  const [subcategoryModal, setSubcategoryModal] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubcategoryIndex, setEditingSubcategoryIndex] = useState(null);

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryImageFile, setCategoryImageFile] = useState(null);

  const [subcategoryName, setSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [expandedCategories, setExpandedCategories] = useState([]);

  // =========================
  // CATEGORY MODAL
  // =========================

  const openAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryImage('');
    setCategoryModal(true);
  };

  const openEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryImage(category.image || '');
    setCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setCategoryModal(false);
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryImage('');
  };

  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleCategoryImage = (e) => {
    setCategoryImageFile(e.target.files?.[0] || null);
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setCategoryImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SAVE CATEGORY
  // =========================

  const saveCategory = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      alert('Please enter category name.');
      return;
    }

    let finalImageUrl = categoryImage;
    if (categoryImageFile) {
      try {
        const uploadRes = await api.upload('/upload', categoryImageFile);
        if (uploadRes.success) { finalImageUrl = uploadRes.imageUrl; }
      } catch (err) { alert('Error uploading image'); return; }
    }
    
    try {
      if (editingCategoryId) {
        const res = await api.put('/categories/' + editingCategoryId, { name: trimmedName, image: finalImageUrl });
        if (res.success) {
          setCategories(prev => prev.map(c => c.id === editingCategoryId ? {...res.category, id: res.category._id} : c));
        }
      } else {
        const res = await api.post('/categories', { name: trimmedName, image: finalImageUrl, subcategories: [] });
        if (res.success) {
          setCategories(prev => [...prev, {...res.category, id: res.category._id}]);
        }
      }
      closeCategoryModal();
    } catch (err) { alert('Failed to save category'); }
  };

  // =========================
  // DELETE CATEGORY
  // =========================

  const deleteCategory = async (id) => {
    const category = categories.find((item) => item.id === id);

    if (!category) return;

    const confirmed = window.confirm(
      `Delete "${category.name}" category and all its subcategories?`
    );

    if (!confirmed) return;

    try {
      await api.delete('/categories/' + id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      setExpandedCategories((prev) => prev.filter((categoryId) => categoryId !== id));
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  // =========================
  // SUBCATEGORY MODAL
  // =========================

  const openAddSubcategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setEditingSubcategoryIndex(null);
    setSubcategoryName('');
    setSubcategoryModal(true);
  };

  const openEditSubcategory = (categoryId, index, name) => {
    setSelectedCategoryId(categoryId);
    setEditingSubcategoryIndex(index);
    setSubcategoryName(name);
    setSubcategoryModal(true);
  };

  const closeSubcategoryModal = () => {
    setSubcategoryModal(false);
    setSelectedCategoryId(null);
    setEditingSubcategoryIndex(null);
    setSubcategoryName('');
  };

  // =========================
  // SAVE SUBCATEGORY
  // =========================

  const saveSubcategory = async () => {
    const trimmedName = subcategoryName.trim();

    if (!trimmedName) {
      alert('Please enter subcategory name.');
      return;
    }

    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const subcategories = [...(category.subcategories || [])];
    if (editingSubcategoryIndex !== null) {
      subcategories[editingSubcategoryIndex] = trimmedName;
    } else {
      subcategories.push(trimmedName);
    }

    try {
      await api.put('/categories/' + selectedCategoryId, { ...category, subcategories });
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCategoryId ? { ...c, subcategories } : c))
      );
      setExpandedCategories((prev) =>
        prev.includes(selectedCategoryId) ? prev : [...prev, selectedCategoryId]
      );
      closeSubcategoryModal();
    } catch (err) {
      alert('Failed to save subcategory');
    }
  };

  // =========================
  // DELETE SUBCATEGORY
  // =========================

  const deleteSubcategory = async (categoryId, index) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;

    const subcategory = category.subcategories[index];
    const confirmed = window.confirm(`Delete "${subcategory}" subcategory?`);
    if (!confirmed) return;

    const updatedSubcategories = category.subcategories.filter((_, subIndex) => subIndex !== index);
    
    try {
      await api.put('/categories/' + categoryId, { ...category, subcategories: updatedSubcategories });
      setCategories((prev) =>
        prev.map((item) => {
          if (item.id !== categoryId) return item;
          return { ...item, subcategories: updatedSubcategories };
        })
      );
    } catch (err) {
      alert('Failed to delete subcategory');
    }
  };

  // =========================
  // EXPAND / COLLAPSE
  // =========================

  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  // =========================
  // SLUG
  // =========================

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="categories-page">

      {/* ================= HEADER ================= */}

      <div className="admin-title categories-header">
        <div>
          <h2>Categories</h2>
          <p>
            Create and manage storefront categories and
            subcategories.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddCategory}
        >
          <FiPlus />
          Add Category
        </button>
      </div>

      {/* ================= CATEGORY CARDS ================= */}

      <div className="categories-list">

        {categories.length === 0 ? (
          <div className="admin-card empty-category">
            <div className="empty-icon">
              <FiImage />
            </div>

            <h3>No Categories Found</h3>

            <p>
              Create your first category to get started.
            </p>

            <button
              className="btn btn-primary"
              onClick={openAddCategory}
            >
              <FiPlus />
              Add Category
            </button>
          </div>
        ) : (
          categories.map((category) => {
            const isExpanded = expandedCategories.includes(
              category.id
            );

            return (
              <div
                className={`category-card ${
                  isExpanded ? 'expanded' : ''
                }`}
                key={category.id}
              >

                {/* CATEGORY MAIN */}

                <div className="category-main">

                  <button
                    className="category-expand"
                    onClick={() =>
                      toggleCategory(category.id)
                    }
                    title="Show subcategories"
                  >
                    {isExpanded ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </button>

                  <div className="category-image">

                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                      />
                    ) : (
                      <div className="category-image-placeholder">
                        <FiImage />
                      </div>
                    )}

                  </div>

                  <div className="category-info">

                    <h3>{category.name}</h3>

                    <span>
                      /{createSlug(category.name)}
                    </span>

                    <div className="category-meta">
                      <span className="admin-badge">
                        Active
                      </span>

                      <span className="subcategory-count">
                        {category.subcategories.length}{' '}
                        {category.subcategories.length === 1
                          ? 'Subcategory'
                          : 'Subcategories'}
                      </span>
                    </div>

                  </div>

                  <div className="category-actions">

                    <button
                      className="btn btn-subcategory"
                      onClick={() =>
                        openAddSubcategory(category.id)
                      }
                    >
                      <FiPlus />
                      Subcategory
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        openEditCategory(category)
                      }
                      title="Edit Category"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="icon-btn danger"
                      onClick={() =>
                        deleteCategory(category.id)
                      }
                      title="Delete Category"
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </div>

                {/* ================= SUBCATEGORIES ================= */}

                {isExpanded && (
                  <div className="subcategory-area">

                    <div className="subcategory-header">

                      <div>
                        <h4>Subcategories</h4>

                        <p>
                          Add as many subcategories as you
                          need under {category.name}.
                        </p>
                      </div>

                      <button
                        className="btn btn-primary btn-small"
                        onClick={() =>
                          openAddSubcategory(category.id)
                        }
                      >
                        <FiPlus />
                        Add Subcategory
                      </button>

                    </div>

                    {category.subcategories.length === 0 ? (
                      <div className="no-subcategory">

                        <FiPlus />

                        <span>
                          No subcategories added yet.
                        </span>

                        <button
                          onClick={() =>
                            openAddSubcategory(category.id)
                          }
                        >
                          Add one
                        </button>

                      </div>
                    ) : (
                      <div className="subcategory-grid">

                        {category.subcategories.map(
                          (subcategory, index) => (
                            <div
                              className="subcategory-item"
                              key={`${subcategory}-${index}`}
                            >

                              <div className="subcategory-number">
                                {index + 1}
                              </div>

                              <div className="subcategory-content">

                                <strong>
                                  {subcategory}
                                </strong>

                                <span>
                                  /{createSlug(
                                    category.name
                                  )}
                                  /
                                  {createSlug(
                                    subcategory
                                  )}
                                </span>

                              </div>

                              <div className="subcategory-actions">

                                <button
                                  className="icon-btn"
                                  onClick={() =>
                                    openEditSubcategory(
                                      category.id,
                                      index,
                                      subcategory
                                    )
                                  }
                                  title="Edit Subcategory"
                                >
                                  <FiEdit2 />
                                </button>

                                <button
                                  className="icon-btn danger"
                                  onClick={() =>
                                    deleteSubcategory(
                                      category.id,
                                      index
                                    )
                                  }
                                  title="Delete Subcategory"
                                >
                                  <FiTrash2 />
                                </button>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })
        )}

      </div>

      {/* ================= CATEGORY MODAL ================= */}

      {categoryModal && (
        <div
          className="modal-backdrop"
          onClick={closeCategoryModal}
        >
          <div
            className="admin-modal category-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-head">

              <div>
                <h3>
                  {editingCategoryId
                    ? 'Edit Category'
                    : 'Add Category'}
                </h3>

                <p>
                  Add category name and storefront image.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeCategoryModal}
              >
                ×
              </button>

            </div>

            <div className="category-form">

              {/* IMAGE */}

              <div className="image-upload-section">

                <label>Category Image</label>

                <div className="category-upload">

                  {categoryImage ? (
                    <div className="uploaded-image">

                      <img
                        src={categoryImage}
                        alt="Category preview"
                      />

                      <button
                        type="button"
                        className="remove-image"
                        onClick={() =>
                          setCategoryImage('')
                        }
                      >
                        ×
                      </button>

                    </div>
                  ) : (
                    <label className="upload-box">

                      <FiImage />

                      <strong>
                        Upload Category Image
                      </strong>

                      <span>
                        PNG, JPG, WEBP up to 5MB
                      </span>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleCategoryImage}
                      />

                    </label>
                  )}

                </div>

              </div>

              {/* NAME */}

              <div className="field">

                <label>Category Name</label>

                <input
                  type="text"
                  placeholder="e.g. Men"
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(e.target.value)
                  }
                  autoFocus
                />

              </div>

              {/* SLUG PREVIEW */}

              {categoryName.trim() && (
                <div className="slug-preview">
                  <span>Slug</span>

                  <strong>
                    /{createSlug(categoryName)}
                  </strong>
                </div>
              )}

            </div>

            <div className="modal-actions">

              <button
                className="btn btn-outline"
                onClick={closeCategoryModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={saveCategory}
              >
                {editingCategoryId
                  ? 'Update Category'
                  : 'Save Category'}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= SUBCATEGORY MODAL ================= */}

      {subcategoryModal && (
        <div
          className="modal-backdrop"
          onClick={closeSubcategoryModal}
        >
          <div
            className="admin-modal small subcategory-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-head">

              <div>
                <h3>
                  {editingSubcategoryIndex !== null
                    ? 'Edit Subcategory'
                    : 'Add Subcategory'}
                </h3>

                <p>
                  Add a subcategory under the selected
                  category.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeSubcategoryModal}
              >
                ×
              </button>

            </div>

            <div className="subcategory-form">

              <div className="field">

                <label>Subcategory Name</label>

                <input
                  type="text"
                  placeholder="e.g. T-Shirts"
                  value={subcategoryName}
                  onChange={(e) =>
                    setSubcategoryName(e.target.value)
                  }
                  autoFocus
                />

              </div>

              {subcategoryName.trim() && (
                <div className="slug-preview">

                  <span>Slug</span>

                  <strong>
                    /{createSlug(subcategoryName)}
                  </strong>

                </div>
              )}

            </div>

            <div className="modal-actions">

              <button
                className="btn btn-outline"
                onClick={closeSubcategoryModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={saveSubcategory}
              >
                {editingSubcategoryIndex !== null
                  ? 'Update Subcategory'
                  : 'Save Subcategory'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
