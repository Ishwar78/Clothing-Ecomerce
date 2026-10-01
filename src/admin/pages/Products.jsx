import React, { useMemo, useState, useEffect } from 'react';
import api from '../../lib/api';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiUpload,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi';
import RichTextEditor from '../components/RichTextEditor';
import './Products.css';

const seed = [
  ['P-1001', 'Embroidered Anarkali Suit', 'Women', '₹2,499', 'Active', 'Yes', 'Yes'],
  ['P-1002', 'Casual Striped Shirt', 'Men', '₹999', 'Active', 'No', 'Yes'],
  ['P-1003', 'Denim Kids Set', 'Boys', '₹1,499', 'Inactive', 'Yes', 'No'],
  ['P-1004', 'Premium Sneakers', 'Footwear', '₹1,199', 'Active', 'No', 'Yes']
];

const categoryData = {
  Women: ['Dresses', 'Tops', 'Jeans', 'Kurtis', 'Sarees'],
  Men: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets'],
  Boys: ['T-Shirts', 'Shirts', 'Jeans', 'Shorts'],
  Girls: ['Dresses', 'Tops', 'Skirts', 'Jeans'],
  'Ethnic Wear': ['Kurta', 'Sherwani', 'Lehenga', 'Saree'],
  Footwear: ['Sneakers', 'Sandals', 'Heels', 'Loafers'],
  Accessories: ['Watches', 'Bags', 'Belts', 'Wallets'],
  Sale: ['Men Sale', 'Women Sale', 'Kids Sale']
};

const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Grey', 'Navy', 'Brown', 'Beige', 'Maroon', 'Peach'];

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const createDefaultSize = (size) => ({
  size,
  quantity: 0,
  chest: '',
  waist: '',
  length: '',
  shoulder: '',
  sleeveLength: ''
});

const initialForm = {
  name: '',
  category: 'Women',
  subcategory: '',
  status: 'Active',
  best: false,
  new: false,

  short: '',
  long: '',

  price: '',
  discount: '',
  discountType: 'percentage',

  sizes: [],
  colors: [],

  highlights: [''],

  faqs: [
    {
      question: '',
      answer: ''
    }
  ],

  specifications: [
    {
      key: '',
      value: ''
    }
  ],

  seoTitle: '',
  keywords: '',
  seoDescription: ''
};

export default function Products() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    api.get('/products').then(res => res.success && setProducts(res.products));
    api.get('/categories').then(res => res.success && setDbCategories(res.categories));
  }, []);
  const [files, setFiles] = useState([]);

  const [form, setForm] = useState(initialForm);

  const upd = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // =========================================
  // CATEGORY
  // =========================================

  const handleCategoryChange = (category) => {
    setForm((prev) => ({
      ...prev,
      category,
      subcategory: ''
    }));
  };

  // =========================================
  // SELLING PRICE
  // =========================================

  const sellingPrice = useMemo(() => {
    const price = Number(form.price) || 0;
    const discount = Number(form.discount) || 0;

    if (!price) return 0;

    if (!discount) return price;

    if (form.discountType === 'percentage') {
      const discountAmount = (price * discount) / 100;
      return Math.max(0, price - discountAmount);
    }

    return Math.max(0, price - discount);
  }, [form.price, form.discount, form.discountType]);

  // =========================================
  // SIZE
  // =========================================

  const toggleColor = (color) => {
    setForm((prev) => {
      const cur = prev.colors || [];
      return {
        ...prev,
        colors: cur.includes(color) ? cur.filter(c => c !== color) : [...cur, color]
      };
    });
  };

  const toggleSize = (size) => {
    setForm((prev) => {
      const exists = prev.sizes.some(
        (item) => item.size === size
      );

      if (exists) {
        return {
          ...prev,
          sizes: prev.sizes.filter(
            (item) => item.size !== size
          )
        };
      }

      return {
        ...prev,
        sizes: [
          ...prev.sizes,
          createDefaultSize(size)
        ]
      };
    });
  };

  const updateSizeField = (size, field, value) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item) =>
        item.size === size
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    }));
  };

  // =========================================
  // HIGHLIGHTS
  // =========================================

  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const updateHighlight = (index, value) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((item, i) =>
        i === index ? value : item
      )
    }));
  };

  const removeHighlight = (index) => {
    setForm((prev) => ({
      ...prev,
      highlights:
        prev.highlights.length === 1
          ? ['']
          : prev.highlights.filter(
              (_, i) => i !== index
            )
    }));
  };

  // =========================================
  // FAQ
  // =========================================

  const addFaq = () => {
    setForm((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: '',
          answer: ''
        }
      ]
    }));
  };

  const updateFaq = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index
          ? {
              ...faq,
              [field]: value
            }
          : faq
      )
    }));
  };

  const removeFaq = (index) => {
    setForm((prev) => ({
      ...prev,
      faqs:
        prev.faqs.length === 1
          ? [
              {
                question: '',
                answer: ''
              }
            ]
          : prev.faqs.filter(
              (_, i) => i !== index
            )
    }));
  };

  // =========================================
  // SPECIFICATIONS
  // =========================================

  const addSpecification = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        {
          key: '',
          value: ''
        }
      ]
    }));
  };

  const updateSpecification = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map(
        (spec, i) =>
          i === index
            ? {
                ...spec,
                [field]: value
              }
            : spec
      )
    }));
  };

  const removeSpecification = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications:
        prev.specifications.length === 1
          ? [
              {
                key: '',
                value: ''
              }
            ]
          : prev.specifications.filter(
              (_, i) => i !== index
            )
    }));
  };

  // =========================================
  // IMAGE UPLOAD & PREVIEW
  // =========================================

  const getImageSource = (file) => {
    if (typeof file === 'string') return file;
    if (file && (file instanceof File || typeof file === 'object')) {
      try {
        return URL.createObjectURL(file);
      } catch (err) {
        return '';
      }
    }
    return '';
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    setFiles((prev) => {
      const combined = [...prev, ...selectedFiles];
      return combined.slice(0, 7);
    });
    e.target.value = '';
  };

  // =========================================
  // OPEN MODAL
  // =========================================

  const openProductModal = () => {
    setForm({
      ...initialForm,
      sizes: [],
  colors: [],
      highlights: [''],
      faqs: [
        {
          question: '',
          answer: ''
        }
      ],
      specifications: [
        {
          key: '',
          value: ''
        }
      ]
    });

    setFiles([]);
    setStep(1);
    setEditingProductId(null);
    setOpen(true);
  };

  // =========================================
  // SUBMIT
  // =========================================

  
  const handleEditProduct = (p) => {
    setEditingProductId(p._id);
    const orig = Number(p.originalPrice) || Number(p.price) || 0;
    const curr = Number(p.price) || 0;
    const disc = (orig > curr && orig > 0) ? Math.round(((orig - curr) / orig) * 100) : '';

    setForm({
      ...initialForm,
      name: p.name || '',
      category: p.category || '',
      subcategory: p.subcategory || '',
      status: p.inStock ? 'Active' : 'Inactive',
      best: !!p.isTrending,
      new: !!p.isNewArrival,
      price: orig ? String(orig) : (curr ? String(curr) : ''),
      discount: disc ? String(disc) : '',
      seoDescription: p.description || '',
      sizes: (p.sizes || []).map(s => typeof s === 'string' ? createDefaultSize(s) : s),
      colors: p.colors || [],
      short: p.shortDescription || p.name || '',
      long: p.description || '',
      highlights: p.highlights && p.highlights.length > 0 ? p.highlights : [''],
      faqs: p.faqs && p.faqs.length > 0 ? p.faqs : [{ question: '', answer: '' }],
      specifications: p.specifications && p.specifications.length > 0 ? p.specifications : [{ key: '', value: '' }]
    });

    setFiles(p.images || []);
    setStep(1);
    setOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim()) {
      alert('Please enter product name.');
      setStep(1);
      return;
    }
    if (!form.category) {
      alert('Please select category.');
      setStep(1);
      return;
    }

    try {
      // 1. Upload new image files (skip URLs already uploaded)
      const uploadedImages = [];
      for (const file of files) {
        if (typeof file === 'object' && file instanceof File) {
          const res = await api.upload('/upload', file);
          if (res.success) uploadedImages.push(res.imageUrl);
        } else if (typeof file === 'string') {
          uploadedImages.push(file);
        }
      }

      // 2. Prepare payload
      const payload = {
        name: form.name.trim(),
        slug: form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        shortDescription: form.short || form.name.trim(),
        description: form.long || form.seoDescription || form.short || 'Premium quality product',
        price: Number(sellingPrice) || Number(form.price) || 0,
        originalPrice: Number(form.price) || Number(sellingPrice) || 0,
        category: form.category,
        subcategory: form.subcategory,
        images: uploadedImages,
        sizes: form.sizes.map(s => typeof s === 'string' ? s : s.size).filter(Boolean),
        colors: form.colors || [],
        highlights: (form.highlights || []).filter(h => h && h.trim()),
        faqs: (form.faqs || []).filter(f => f && f.question && f.question.trim()),
        specifications: (form.specifications || []).filter(s => s && s.key && s.key.trim()),
        isNewArrival: form.new,
        isTrending: form.best,
        inStock: form.status === 'Active'
      };

      if (editingProductId) {
        const res = await api.put('/products/' + editingProductId, payload);
        if (res.success) {
          setProducts(prev => prev.map(p => p._id === editingProductId ? res.product : p));
          setOpen(false);
          setStep(1);
          setFiles([]);
          setEditingProductId(null);
          alert('Product updated successfully!');
        } else {
          alert(res.message || 'Failed to update product');
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.success) {
          setProducts(prev => [res.product, ...prev]);
          setOpen(false);
          setStep(1);
          setFiles([]);
          setEditingProductId(null);
          alert('Product added successfully!');
        } else {
          alert(res.message || 'Failed to save product');
        }
      }
    } catch (err) {
      alert('Failed to save product');
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      await api.delete('/products/' + id);
      setProducts(prev => prev.filter(p => p._id !== id));
      alert('Product deleted successfully');
    } catch(err) {
      alert('Error deleting product');
    }
  };


  return (
    <div className="products-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-title products-header">

        <div>
          <h2>Products</h2>

          <p>
            Manage catalogue, stock, variants,
            pricing and SEO.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openProductModal}
        >
          <FiPlus />
          Add Product
        </button>

      </div>

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="toolbar">

        <div className="admin-search">
          <FiSearch />

          <input
            placeholder="Search product..."
          />
        </div>

        <select>
          <option>All Categories</option>

          {Object.keys(categoryData).map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}

        </select>

      </div>

      {/* =====================================
          PRODUCT TABLE
      ===================================== */}

      <div className="admin-card product-table-card">

        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Status</th>
              <th>Trending</th>
              <th>New Arrival</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p._id || index}>
                <td>
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
                  ) : '-'}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.subcategory || '-'}</td>
                <td>₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
                <td>
                  <span className={'admin-badge ' + (!p.inStock ? 'warn' : '')}>
                    {p.inStock ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{p.isTrending ? 'Yes' : 'No'}</td>
                <td>{p.isNewArrival ? 'Yes' : 'No'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="icon-btn"
                      title="View Product on Store"
                      onClick={() => window.open('/product/' + (p.slug || (p.name ? p.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : p._id)), '_blank')}
                    >
                      <FiEye />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      title="Edit Product"
                      onClick={() => handleEditProduct(p)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      className="icon-btn danger"
                      title="Delete Product"
                      onClick={() => deleteProduct(p._id)}
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

      {/* =====================================
          PRODUCT MODAL
      ===================================== */}

      {open && (

        <div className="modal-backdrop">

          <div className="admin-modal product-modal">

            {/* MODAL HEADER */}

            <div className="modal-head">

              <div>
                <h3>{editingProductId ? 'Edit Product' : 'Add Product'}</h3>

                <p>
                  Step {step} of 4
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>

            </div>

            {/* =================================
                STEPPER
            ================================= */}

            <div className="stepper">

              {[
                'Basic',
                'Description & Price',
                'Images, Sizes & Details',
                'SEO'
              ].map((item, index) => (

                <span
                  key={item}
                  className={
                    step === index + 1
                      ? 'active'
                      : step > index + 1
                      ? 'completed'
                      : ''
                  }
                >
                  <b>{index + 1}</b>
                  {item}
                </span>

              ))}

            </div>

            {/* =================================
                STEP 1
            ================================= */}

            {step === 1 && (

              <div className="product-step">

                <div className="admin-form-grid">

                  {/* PRODUCT NAME */}

                  <div className="field full">

                    <label>
                      Product Name
                    </label>

                    <input
                      value={form.name}
                      placeholder="Enter product name"
                      onChange={(e) =>
                        upd(
                          'name',
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* CATEGORY */}

                  <div className="field">

                    <label>
                      Category
                    </label>

                    <select value={form.category} onChange={e => {
     setForm({...form, category: e.target.value, subcategory: ''});
   }}>
     <option value="">Select Category</option>
     {dbCategories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
   </select>

                  </div>

                  {/* SUBCATEGORY */}

                  <div className="field">

                    <label>
                      Subcategory
                    </label>

                    <select value={form.subcategory} onChange={e => setForm({...form, subcategory: e.target.value})}>
     <option value="">Select Subcategory</option>
     {dbCategories.find(c => c.name === form.category)?.subcategories?.map(sc => (
       <option key={sc} value={sc}>{sc}</option>
     ))}
   </select>

                    {!form.subcategory && (
                      <small className="field-hint">
                        Select category first to
                        see its subcategories.
                      </small>
                    )}

                  </div>

                  {/* STATUS */}

                  <div className="field">

                    <label>
                      Status
                    </label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        upd(
                          'status',
                          e.target.value
                        )
                      }
                    >

                      <option>
                        Active
                      </option>

                      <option>
                        Inactive
                      </option>

                    </select>

                  </div>

                  {/* FLAGS */}

                  <div className="toggle-row">

                    <label>
                      <input
                        type="checkbox"
                        checked={form.best}
                        onChange={(e) =>
                          upd(
                            'best',
                            e.target.checked
                          )
                        }
                      />

                      Best Seller
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={form.new}
                        onChange={(e) =>
                          upd(
                            'new',
                            e.target.checked
                          )
                        }
                      />

                      New Arrival
                    </label>

                  </div>

                </div>

              </div>

            )}

            {/* =================================
                STEP 2
            ================================= */}

            {step === 2 && (

              <div className="product-step">

                <div className="admin-form-grid">

                  {/* SHORT DESCRIPTION */}

                  <div className="field full">

                    <label>
                      Short Description (Summary & Key Points)
                    </label>

                    <RichTextEditor
                      compact={true}
                      value={form.short}
                      onChange={(val) => upd('short', val)}
                      placeholder="Write short product summary, quick bullets..."
                      minHeight="95px"
                    />

                  </div>

                  {/* LONG DESCRIPTION */}

                  <div className="field full">

                    <label>
                      Long Description (Detailed Product Information & Care)
                    </label>

                    <RichTextEditor
                      value={form.long}
                      onChange={(val) => upd('long', val)}
                      placeholder="Write detailed product description, fabric details, styling guide..."
                      minHeight="190px"
                    />

                  </div>

                  {/* PRICE */}

                  <div className="field">

                    <label>
                      MRP / Price
                    </label>

                    <div className="input-prefix">
                      <span>₹</span>

                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        placeholder="2499"
                        onChange={(e) =>
                          upd(
                            'price',
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                  {/* DISCOUNT */}

                  <div className="field">

                    <label>
                      Discount
                    </label>

                    <div className="discount-row">

                      <input
                        type="number"
                        min="0"
                        value={form.discount}
                        placeholder="10"
                        onChange={(e) =>
                          upd(
                            'discount',
                            e.target.value
                          )
                        }
                      />

                      <select
                        value={
                          form.discountType
                        }
                        onChange={(e) =>
                          upd(
                            'discountType',
                            e.target.value
                          )
                        }
                      >

                        <option value="percentage">
                          %
                        </option>

                        <option value="fixed">
                          Fixed ₹
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* SELLING PRICE */}

                  <div className="field selling-price-field">

                    <label>
                      Selling Price
                    </label>

                    <div className="selling-price-box">

                      <span>₹</span>

                      <strong>
                        {Number(
                          sellingPrice
                        ).toLocaleString(
                          'en-IN'
                        )}
                      </strong>

                    </div>

                    {Number(form.price) > 0 &&
                      Number(
                        form.discount
                      ) > 0 && (
                        <small>
                          After applying{' '}
                          {form.discount}
                          {form.discountType ===
                          'percentage'
                            ? '% discount'
                            : ' discount'}
                        </small>
                      )}

                  </div>

                </div>

                {/* =================================
                    HIGHLIGHTS
                ================================= */}

                <div className="detail-section">

                  <div className="section-heading">

                    <div>
                      <h4>
                        Product Highlights
                      </h4>

                      <p>
                        Add important selling points
                        of the product.
                      </p>
                    </div>

                    <button
                      className="btn btn-light"
                      onClick={addHighlight}
                    >
                      <FiPlus />
                      Add Highlight
                    </button>

                  </div>

                  <div className="dynamic-list">

                    {form.highlights.map(
                      (highlight, index) => (

                        <div
                          className="dynamic-row"
                          key={index}
                        >

                          <span className="row-number">
                            {index + 1}
                          </span>

                          <input
                            value={highlight}
                            placeholder="e.g. Premium cotton fabric"
                            onChange={(e) =>
                              updateHighlight(
                                index,
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="remove-row"
                            onClick={() =>
                              removeHighlight(
                                index
                              )
                            }
                          >
                            <FiX />
                          </button>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}

            {/* =================================
                STEP 3
            ================================= */}

            {step === 3 && (

              <div className="product-step">

                {/* IMAGE UPLOAD */}

                <div className="detail-section">

                  <div className="section-heading">

                    <div>
                      <h4>
                        Product Images
                      </h4>

                      <p>
                        Upload up to 7 product
                        images.
                      </p>
                    </div>

                  </div>

                  <label className="upload-box">

                    <FiUpload />

                    <h4>
                      Upload Product Images
                    </h4>

                    <p>
                      JPG, PNG, WEBP • Maximum
                      7 images
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFiles}
                    />

                  </label>

                  {files.length > 0 && (
                    <div className="image-preview-grid">
                      {files.map((file, index) => {
                        const src = getImageSource(file);
                        return (
                          <div className="image-preview-card" key={index}>
                            <img
                              src={src}
                              alt={`Product upload ${index + 1}`}
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=300&q=70';
                              }}
                            />
                            {index === 0 && (
                              <span className="image-main-tag">Cover</span>
                            )}
                            <button
                              type="button"
                              className="image-remove-btn"
                              title="Delete image"
                              onClick={() =>
                                setFiles(files.filter((_, i) => i !== index))
                              }
                            >
                              <FiX />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* =================================
                    SIZES
                ================================= */}

                <div className="detail-section">

                  <div className="section-heading">

                    <div>
                      <h4>
                        Sizes & Inventory
                      </h4>

                      <p>
                        Select sizes and add
                        quantity and measurements.
                      </p>
                    </div>

                  </div>

                  <div className="size-pills">

                    {availableSizes.map(
                      (size) => (

                        <button
                          type="button"
                          className={
                            form.sizes.some(
                              (item) =>
                                item.size ===
                                size
                            )
                              ? 'selected'
                              : ''
                          }
                          onClick={() =>
                            toggleSize(size)
                          }
                          key={size}
                        >
                          {size}
                        </button>

                      )
                    )}

                  </div>

                  <div className="section-heading" style={{ marginTop: '24px' }}>
                    <div>
                      <h4>Colors</h4>
                      <p>Select available colors for this product.</p>
                    </div>
                  </div>

                  <div className="size-pills" style={{ marginBottom: '20px' }}>
                    {availableColors.map((color) => (
                      <button
                        type="button"
                        key={color}
                        className={(form.colors || []).includes(color) ? 'selected' : ''}
                        onClick={() => toggleColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>

                  {/* SIZE TABLE */}

                  {form.sizes.length > 0 ? (

                    <div className="size-details">

                      {form.sizes.map(
                        (sizeData) => (

                          <div
                            className="size-detail-card"
                            key={sizeData.size}
                          >

                            <div className="size-card-head">

                              <div className="size-title">
                                {sizeData.size}
                              </div>

                              <button
                                className="remove-size"
                                onClick={() =>
                                  toggleSize(
                                    sizeData.size
                                  )
                                }
                              >
                                <FiX />
                              </button>

                            </div>

                            <div className="measurement-grid">

                              {/* QUANTITY */}

                              <div className="field">

                                <label>
                                  Quantity
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={
                                    sizeData.quantity
                                  }
                                  onChange={(e) =>
                                    updateSizeField(
                                      sizeData.size,
                                      'quantity',
                                      e.target.value
                                    )
                                  }
                                />

                              </div>

                              {/* CHEST */}

                              <div className="field">

                                <label>
                                  Chest
                                </label>

                                <div className="measurement-input">
                                  <input
                                    placeholder="38"
                                    value={
                                      sizeData.chest
                                    }
                                    onChange={(e) =>
                                      updateSizeField(
                                        sizeData.size,
                                        'chest',
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span>
                                    inch
                                  </span>
                                </div>

                              </div>

                              {/* WAIST */}

                              <div className="field">

                                <label>
                                  Waist
                                </label>

                                <div className="measurement-input">
                                  <input
                                    placeholder="32"
                                    value={
                                      sizeData.waist
                                    }
                                    onChange={(e) =>
                                      updateSizeField(
                                        sizeData.size,
                                        'waist',
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span>
                                    inch
                                  </span>
                                </div>

                              </div>

                              {/* LENGTH */}

                              <div className="field">

                                <label>
                                  Length
                                </label>

                                <div className="measurement-input">
                                  <input
                                    placeholder="28"
                                    value={
                                      sizeData.length
                                    }
                                    onChange={(e) =>
                                      updateSizeField(
                                        sizeData.size,
                                        'length',
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span>
                                    inch
                                  </span>
                                </div>

                              </div>

                              {/* SHOULDER */}

                              <div className="field">

                                <label>
                                  Shoulder
                                </label>

                                <div className="measurement-input">
                                  <input
                                    placeholder="17"
                                    value={
                                      sizeData.shoulder
                                    }
                                    onChange={(e) =>
                                      updateSizeField(
                                        sizeData.size,
                                        'shoulder',
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span>
                                    inch
                                  </span>
                                </div>

                              </div>

                              {/* SLEEVE */}

                              <div className="field">

                                <label>
                                  Sleeve Length
                                </label>

                                <div className="measurement-input">
                                  <input
                                    placeholder="24"
                                    value={
                                      sizeData.sleeveLength
                                    }
                                    onChange={(e) =>
                                      updateSizeField(
                                        sizeData.size,
                                        'sleeveLength',
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span>
                                    inch
                                  </span>
                                </div>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="empty-size-state">
                      Select at least one size above
                      to add quantity and measurements.
                    </div>

                  )}

                </div>

                {/* =================================
                    FAQ
                ================================= */}

                <div className="detail-section">

                  <div className="section-heading">

                    <div>
                      <h4>
                        Frequently Asked Questions
                      </h4>

                      <p>
                        Add product-related questions
                        and answers.
                      </p>
                    </div>

                    <button
                      className="btn btn-light"
                      onClick={addFaq}
                    >
                      <FiPlus />
                      Add FAQ
                    </button>

                  </div>

                  <div className="faq-list">

                    {form.faqs.map(
                      (faq, index) => (

                        <div
                          className="faq-card"
                          key={index}
                        >

                          <div className="faq-card-head">

                            <span>
                              FAQ {index + 1}
                            </span>

                            <button
                              onClick={() =>
                                removeFaq(
                                  index
                                )
                              }
                            >
                              <FiTrash2 />
                            </button>

                          </div>

                          <div className="faq-fields">

                            <div className="field">

                              <label>
                                Question
                              </label>

                              <input
                                value={
                                  faq.question
                                }
                                placeholder="Is this product washable?"
                                onChange={(e) =>
                                  updateFaq(
                                    index,
                                    'question',
                                    e.target.value
                                  )
                                }
                              />

                            </div>

                            <div className="field">

                              <label>
                                Answer
                              </label>

                              <textarea
                                rows="3"
                                value={
                                  faq.answer
                                }
                                placeholder="Yes, the product can be washed..."
                                onChange={(e) =>
                                  updateFaq(
                                    index,
                                    'answer',
                                    e.target.value
                                  )
                                }
                              />

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* =================================
                    SPECIFICATIONS
                ================================= */}

                <div className="detail-section">

                  <div className="section-heading">

                    <div>
                      <h4>
                        Specifications
                      </h4>

                      <p>
                        Add product attributes as
                        key and value.
                      </p>
                    </div>

                    <button
                      className="btn btn-light"
                      onClick={
                        addSpecification
                      }
                    >
                      <FiPlus />
                      Add Specification
                    </button>

                  </div>

                  <div className="specification-list">

                    {form.specifications.map(
                      (spec, index) => (

                        <div
                          className="specification-row"
                          key={index}
                        >

                          <input
                            placeholder="Specification e.g. Fabric"
                            value={spec.key}
                            onChange={(e) =>
                              updateSpecification(
                                index,
                                'key',
                                e.target.value
                              )
                            }
                          />

                          <input
                            placeholder="Value e.g. 100% Cotton"
                            value={spec.value}
                            onChange={(e) =>
                              updateSpecification(
                                index,
                                'value',
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="remove-row"
                            onClick={() =>
                              removeSpecification(
                                index
                              )
                            }
                          >
                            <FiTrash2 />
                          </button>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}

            {/* =================================
                STEP 4
            ================================= */}

            {step === 4 && (

              <div className="product-step">

                <div className="admin-form-grid">

                  <div className="field full">

                    <label>
                      SEO Title
                    </label>

                    <input
                      value={form.seoTitle}
                      placeholder="Product SEO title"
                      onChange={(e) =>
                        upd(
                          'seoTitle',
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="field full">

                    <label>
                      SEO Keywords
                    </label>

                    <input
                      value={form.keywords}
                      placeholder="fashion, shirt, men shirt..."
                      onChange={(e) =>
                        upd(
                          'keywords',
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="field full">

                    <label>
                      SEO Description
                    </label>

                    <textarea
                      rows="5"
                      value={
                        form.seoDescription
                      }
                      placeholder="SEO description..."
                      onChange={(e) =>
                        upd(
                          'seoDescription',
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                {/* FINAL SUMMARY */}

                <div className="product-summary">

                  <div>
                    <span>
                      Category
                    </span>

                    <strong>
                      {form.category}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Subcategory
                    </span>

                    <strong>
                      {form.subcategory ||
                        'Not selected'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Selling Price
                    </span>

                    <strong>
                      ₹
                      {Number(
                        sellingPrice
                      ).toLocaleString(
                        'en-IN'
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Selected Sizes
                    </span>

                    <strong>
                      {form.sizes.length
                        ? form.sizes
                            .map(
                              (item) =>
                                item.size
                            )
                            .join(', ')
                        : 'None'}
                    </strong>
                  </div>

                </div>

              </div>

            )}

            {/* =================================
                MODAL ACTIONS
            ================================= */}

            <div className="modal-actions">

              <button
                className="btn btn-outline"
                onClick={() =>
                  step > 1
                    ? setStep(step - 1)
                    : setOpen(false)
                }
              >

                <FiChevronLeft />

                {step > 1
                  ? 'Previous'
                  : 'Cancel'}

              </button>

              {step < 4 ? (

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setStep(step + 1)
                  }
                >

                  Next

                  <FiChevronRight />

                </button>

              ) : (

                <button
                  className="btn btn-primary"
                  onClick={submit}
                >
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}