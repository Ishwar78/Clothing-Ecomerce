import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { allProducts } from "../data/products";

import {
  FiHeart,
  FiShare2,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiCheckCircle,
  FiPlay,
  FiStar,
  FiEdit3,
} from "react-icons/fi";

import "./ProductDetails.css";

const defaultProduct = {
  id: 100,
  name: "Embroidered Anarkali Suit Set",
  price: 2499,
  mrp: 3499,
  discount: "29% OFF",

  image:
    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=90",

  thumbs: [
    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=90",
  ],

  description:
    "Make a statement with this beautiful embroidered Anarkali suit set, crafted from premium fabric for a graceful and elegant look. Intricate embroidery, flowing silhouette and matching dupatta make it perfect for weddings, festive occasions and special celebrations.",
};

const completeLookProducts = [
  {
    id: 201,
    name: "Embellished Earrings",
    price: 399,
    mrp: 699,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 202,
    name: "Potli Bag",
    price: 699,
    mrp: 1199,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 203,
    name: "Embroidered Jutti",
    price: 799,
    mrp: 1299,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 204,
    name: "Bangle Set",
    price: 499,
    mrp: 899,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 205,
    name: "Maang Tikka",
    price: 299,
    mrp: 599,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=90",
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80";

const getColorHex = (name) => {
  if (!name) return '#ccc';
  const clean = String(name).trim().toLowerCase();
  const map = {
    white: '#ffffff',
    black: '#1a1a1a',
    red: '#e53e3e',
    blue: '#3182ce',
    green: '#38a169',
    yellow: '#ecc94b',
    pink: '#ed64a6',
    purple: '#805ad5',
    orange: '#dd6b20',
    grey: '#718096',
    gray: '#718096',
    navy: '#1a365d',
    maroon: '#742a2a',
    beige: '#f5f5dc',
    cream: '#fffdd0',
    brown: '#7b341e',
    peach: '#ffdab9',
    teal: '#319795',
    olive: '#808000',
    gold: '#ffd700',
    silver: '#c0c0c0',
    mustard: '#ffdb58',
    rust: '#b7410e',
    wine: '#722f37',
    lavender: '#e6e6fa',
    cyan: '#00ffff',
    magenta: '#ff00ff'
  };
  return map[clean] || (clean.startsWith('#') ? clean : clean);
};

const initialMockReviews = [
  {
    _id: "mock-1",
    userName: "Priya Sharma",
    rating: 5,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    comment: "Beautiful embroidery and very comfortable fabric! The fitting is true to size and looks exactly like the pictures.",
    isVerified: true
  },
  {
    _id: "mock-2",
    userName: "Neha Rajput",
    rating: 5,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    comment: "Loved the rich colour and quality. Perfect for festive occasions and family functions. Highly recommend!",
    isVerified: true
  },
  {
    _id: "mock-3",
    userName: "Anjali Kapoor",
    rating: 4,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    comment: "Good quality material, fast delivery, and very elegant design. Very satisfied with the purchase.",
    isVerified: true
  }
];

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  
  const [dbProduct, setDbProduct] = useState(null);
  const [allDbProducts, setAllDbProducts] = useState([]);
  const slugify = (text) => text ? text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    import('../lib/api').then(({default: api}) => {
      api.get('/products').then(res => {
        if(res.success && Array.isArray(res.products)) {
           setAllDbProducts(res.products);
           const p = res.products.find(x => 
             x.slug === id || 
             slugify(x.name) === id || 
             x._id === id || 
             String(x.id) === String(id)
           );
           if (p) setDbProduct(p);
        }
      });
    });
  }, [id]);
  const foundProduct = dbProduct || allProducts.find(p => 
    p.slug === id || 
    slugify(p.name) === id || 
    String(p._id || p.id) === String(id)
  );

  const mainImage = foundProduct?.images?.[0] || foundProduct?.image || defaultProduct.image;
  const productThumbs = foundProduct?.images && foundProduct.images.length > 0
    ? foundProduct.images
    : (foundProduct?.image ? [foundProduct.image, ...defaultProduct.thumbs.slice(1)] : defaultProduct.thumbs);

  const productPrice = Math.round(Number(foundProduct?.price || defaultProduct.price));
  const productMrp = Math.round(Number(foundProduct?.originalPrice || foundProduct?.mrp || defaultProduct.mrp));
  const discountStr = productMrp > productPrice
    ? Math.round(((productMrp - productPrice) / productMrp) * 100) + "% OFF"
    : "Special Price";

  const product = foundProduct ? {
    ...defaultProduct,
    ...foundProduct,
    image: mainImage,
    thumbs: productThumbs,
    price: productPrice,
    mrp: productMrp,
    discount: discountStr
  } : defaultProduct;

  const displayRelatedProducts = useMemo(() => {
    const normalize = (str) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    const currentId = String(foundProduct?._id || foundProduct?.id || id || '');
    const currentSlug = foundProduct?.slug || slugify(foundProduct?.name) || id;
    const currentCat = normalize(foundProduct?.category);
    const currentSub = normalize(foundProduct?.subcategory);

    const pool = (allDbProducts && allDbProducts.length > 0) ? allDbProducts : allProducts;

    // Filter out current product
    const otherProducts = pool.filter(p => {
      const pId = String(p._id || p.id || '');
      const pSlug = p.slug || slugify(p.name);
      return pId !== currentId && pSlug !== currentSlug;
    });

    if (otherProducts.length === 0) {
      return completeLookProducts;
    }

    // 1. Same Category and Same Subcategory
    const sameSub = currentSub
      ? otherProducts.filter(p => normalize(p.category) === currentCat && normalize(p.subcategory) === currentSub)
      : [];

    // 2. Same Category (other subcategories)
    const sameCat = currentCat
      ? otherProducts.filter(p => normalize(p.category) === currentCat && !sameSub.some(s => String(s._id || s.id) === String(p._id || p.id)))
      : [];

    // 3. Other Products from DB/store
    const others = otherProducts.filter(p => 
      !sameSub.some(s => String(s._id || s.id) === String(p._id || p.id)) &&
      !sameCat.some(s => String(s._id || s.id) === String(p._id || p.id))
    );

    const combined = [...sameSub, ...sameCat, ...others];
    return combined.slice(0, 10);
  }, [allDbProducts, foundProduct, id]);

  const [img, setImg] = useState(product.image);
  
  useEffect(() => {
    setImg(product.image);
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product.sizes && product.sizes.length > 0) {
      setSize(product.sizes[0]);
    }
  }, [product.image, product.name]);

  const [selectedColor, setSelectedColor] = useState("");
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const currentProdId = String(foundProduct?._id || foundProduct?.id || id || '');
  const currentProdSlug = foundProduct?.slug || slugify(foundProduct?.name) || id;

  const [reviewsList, setReviewsList] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");
  const [reviewEligibility, setReviewEligibility] = useState({ checked: false, canReview: false, message: '' });

  const loggedInUser = useMemo(() => {
    try {
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!currentProdId && !currentProdSlug) return;
    import('../lib/api').then(({ default: api }) => {
      // Fetch reviews
      api.get(`/reviews?productId=${currentProdId}`).then(res => {
        if (res.success && Array.isArray(res.reviews) && res.reviews.length > 0) {
          setReviewsList(res.reviews);
        }
      });

      // Check review eligibility if user is logged in
      if (loggedInUser && (loggedInUser.email || loggedInUser.id || loggedInUser._id)) {
        const emailParam = encodeURIComponent(loggedInUser.email || '');
        const idParam = encodeURIComponent(loggedInUser.id || loggedInUser._id || '');
        const nameParam = encodeURIComponent(product?.name || '');
        api.get(`/reviews/can-review?productId=${currentProdId}&productName=${nameParam}&email=${emailParam}&userId=${idParam}`)
          .then(res => {
            if (res.success) {
              setReviewEligibility({
                checked: true,
                canReview: res.canReview,
                message: res.message || ''
              });
            }
          })
          .catch(() => {
            setReviewEligibility({ checked: true, canReview: false, message: '' });
          });
      } else {
        setReviewEligibility({
          checked: true,
          canReview: false,
          message: 'Please login to write a review.'
        });
      }
    });
  }, [currentProdId, currentProdSlug, loggedInUser, product?.name]);

  const displayedReviews = reviewsList.length > 0 ? reviewsList : initialMockReviews;
  const avgScore = (
    displayedReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) /
    displayedReviews.length
  ).toFixed(1);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert("Please enter your name and review message.");
      return;
    }

    try {
      setSubmittingReview(true);
      const { default: api } = await import('../lib/api');
      const payload = {
        productId: currentProdId,
        productSlug: currentProdSlug,
        productName: product.name,
        productImage: product.image,
        userName: newReview.name.trim() || loggedInUser?.name || 'Customer',
        userEmail: loggedInUser?.email || newReview.email.trim(),
        userId: loggedInUser?.id || loggedInUser?._id,
        rating: Number(newReview.rating) || 5,
        comment: newReview.comment.trim()
      };

      const res = await api.post('/reviews', payload);
      if (res.success && res.review) {
        setReviewsList(prev => [res.review, ...prev]);
        setNewReview({ name: "", email: "", rating: 5, comment: "" });
        setShowReviewForm(false);
        setReviewSuccessMsg("Thank you! Your verified review has been submitted successfully.");
        setTimeout(() => setReviewSuccessMsg(""), 5000);
      } else {
        alert(res.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      alert(err.message || "Error submitting review. Only verified buyers can submit a review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          fill={i <= rating ? "currentColor" : "none"}
          color={i <= rating ? "#f59e0b" : "#d1d5db"}
        />
      );
    }
    return stars;
  };

  const lookRef = useRef(null);

  const handleImageError = (e) => {
    if (e.currentTarget.src !== fallbackImage) {
      e.currentTarget.src = fallbackImage;
    }
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (item = product) => {
    const existingCart = JSON.parse(
      localStorage.getItem("Joyfulmarts-cart") || "[]"
    );

    const isCurrentProduct = (item._id || item.id) === (product._id || product.id);
    const chosenSize = isCurrentProduct ? (size || product.sizes?.[0] || "M") : (item.size || item.sizes?.[0] || "M");
    const chosenColor = isCurrentProduct 
      ? (selectedColor || product.colors?.[0] || "") 
      : (item.color || item.colors?.[0] || "");
    const chosenImage = (isCurrentProduct && img) || item.image || item.images?.[0] || fallbackImage;
    const chosenQuantity = isCurrentProduct ? Number(qty || 1) : 1;
    const itemPrice = Math.round(Number(item.price || productPrice || 0));

    const cartItem = {
      ...item,
      id: item._id || item.id,
      productId: item._id || item.id,
      name: item.name,
      image: chosenImage,
      price: itemPrice,
      quantity: chosenQuantity,
      size: chosenSize,
      color: chosenColor,
    };

    const existingIndex = existingCart.findIndex(
      (x) => (x.productId === cartItem.productId || x.id === cartItem.id) &&
             x.size === cartItem.size &&
             x.color === cartItem.color
    );

    let updatedCart;
    if (existingIndex !== -1) {
      updatedCart = [...existingCart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity:
          Number(updatedCart[existingIndex].quantity || 0) +
          Number(cartItem.quantity || 1),
      };
    } else {
      updatedCart = [...existingCart, cartItem];
    }

    localStorage.setItem("Joyfulmarts-cart", JSON.stringify(updatedCart));
    alert(`${item.name} (Size: ${chosenSize}${chosenColor ? ', Color: ' + chosenColor : ''}) added to cart`);
  };

  /* =========================
     BUY NOW
  ========================= */

  const buyNow = () => {
    addToCart(product);
    nav("/checkout");
  };

  /* =========================
     WISHLIST
  ========================= */

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("Joyfulmarts-wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const isItemInWishlist = (item) => {
    if (!item) return false;
    const itemId = String(item._id || item.id || '');
    const itemSlug = item.slug || slugify(item.name);
    return wishlist.some(x => {
      const xId = String(x._id || x.id || '');
      const xSlug = x.slug || slugify(x.name);
      return (itemId && xId && itemId === xId) || (itemSlug && xSlug && itemSlug === xSlug);
    });
  };

  const toggleWishlistItem = (item) => {
    if (!item) return;
    const itemId = String(item._id || item.id || '');
    const itemSlug = item.slug || slugify(item.name);
    const exists = isItemInWishlist(item);
    let updated;
    if (exists) {
      updated = wishlist.filter(x => {
        const xId = String(x._id || x.id || '');
        const xSlug = x.slug || slugify(x.name);
        return !( (itemId && xId && itemId === xId) || (itemSlug && xSlug && itemSlug === xSlug) );
      });
      alert(`${item.name} removed from wishlist`);
    } else {
      const cleanItem = {
        ...item,
        id: item._id || item.id,
        image: item.images?.[0] || item.image || fallbackImage,
        price: Number(item.price || 0),
        originalPrice: Number(item.originalPrice || item.mrp || 0),
      };
      updated = [...wishlist, cleanItem];
      alert(`${item.name} added to wishlist`);
    }
    setWishlist(updated);
    localStorage.setItem("Joyfulmarts-wishlist", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('Joyfulmarts-wishlist-updated', { detail: { list: updated } }));
    window.dispatchEvent(new Event('storage'));
  };

  const toggleWishlist = () => {
    toggleWishlistItem(product);
  };

  const liked = isItemInWishlist(product);

  /* =========================
     SHARE
  ========================= */

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Product link copied!");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  /* =========================
     COMPLETE LOOK SCROLL
  ========================= */

  const scrollLook = (direction) => {
    if (!lookRef.current) return;

    lookRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  /* =========================
     SCROLL TOP
  ========================= */

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="detail-page">

      {/* =========================
          BREADCRUMB
      ========================= */}

      <div className="detail-container">
        <div className="breadcrumbs">
          <span onClick={() => nav("/")}>Home</span>
          <b>›</b>

          <span onClick={() => nav("/women")}>Women</span>
          <b>›</b>

          <span>Ethnic Wear</span>
          <b>›</b>

          <span>Kurtis & Suits</span>
          <b>›</b>

          <strong>{product.name}</strong>
        </div>
      </div>

      {/* =========================
          PRODUCT TOP
      ========================= */}

      <section className="detail-container detail-top">

        {/* GALLERY */}

        <div className="gallery">

          <div className="thumbs">

            {product.thumbs.map((thumb, index) => (
              <button
                type="button"
                key={thumb}
                className={
                  img === thumb
                    ? "thumb-btn active"
                    : "thumb-btn"
                }
                onClick={() => setImg(thumb)}
              >
                <img
                  src={thumb}
                  alt={`${product.name} ${index + 1}`}
                  onError={handleImageError}
                />

                {index === 3 && (
                  <span className="thumb-play">
                    <FiPlay />
                  </span>
                )}
              </button>
            ))}

          </div>

          <div className="main-photo">

            <img
              src={img}
              alt={product.name}
              onError={handleImageError}
            />

            <button
              type="button"
              className="gallery-arrow gallery-prev"
              onClick={() => {
                const current = product.thumbs.indexOf(img);
                const next =
                  current <= 0
                    ? product.thumbs.length - 1
                    : current - 1;

                setImg(product.thumbs[next]);
              }}
            >
              <FiChevronLeft />
            </button>

            <button
              type="button"
              className="gallery-arrow gallery-next"
              onClick={() => {
                const current = product.thumbs.indexOf(img);
                const next =
                  current >= product.thumbs.length - 1
                    ? 0
                    : current + 1;

                setImg(product.thumbs[next]);
              }}
            >
              <FiChevronRight />
            </button>

            <button
              type="button"
              className="expand"
              onClick={() => window.open(img, "_blank")}
            >
              ↗
            </button>

          </div>
        </div>

        {/* PRODUCT INFORMATION */}

        <div className="detail-info">

          <div className="product-actions">

            <button
              type="button"
              className={liked ? "action-btn liked" : "action-btn"}
              onClick={toggleWishlist}
            >
              <FiHeart fill={liked ? "currentColor" : "none"} />
              <span>{liked ? "Wishlisted" : "Add to Wishlist"}</span>
            </button>

            <button
              type="button"
              className="action-btn"
              onClick={handleShare}
            >
              <FiShare2 />
              <span>Share</span>
            </button>

          </div>

          <span className="pill">
            ✦ New Arrival
          </span>

          <h1>{product.name}</h1>

          <div
            className="product-description product-description-html"
            dangerouslySetInnerHTML={{
              __html: product.shortDescription || product.description
            }}
          />

          <div className="rating">

            <span className="stars">
              ★★★★★
            </span>

            <u>4.6 (128 reviews)</u>

            <i>|</i>

            <span>500+ sold</span>

          </div>

          <div className="detail-price">
            ₹{product.price.toLocaleString("en-IN")}

            <del>
              ₹{product.mrp.toLocaleString("en-IN")}
            </del>

            <b>{product.discount}</b>
          </div>

          <small className="tax-text">
            Inclusive of all taxes
          </small>

          {/* COLOR */}
          {product.colors && product.colors.length > 0 && (
            <div className="option">
              <div className="size-heading">
                <strong>
                  Color: <span style={{ color: '#e83f5d', fontWeight: '700', marginLeft: '6px' }}>{selectedColor || product.colors[0]}</span>
                </strong>
              </div>

              <div className="color-boxes">
                {product.colors.map((c) => {
                  const isSelected = (selectedColor || product.colors[0]) === c;
                  return (
                    <button
                      type="button"
                      key={c}
                      className={`color-box-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      <span
                        className="color-dot"
                        style={{
                          backgroundColor: getColorHex(c)
                        }}
                      />
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SIZE */}
          <div className="option">
            <div className="size-heading">
              <strong>Size: {size}</strong>
              <button type="button">Size Guide</button>
            </div>

            <div className="sizes">
              {(product.sizes && product.sizes.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL"]).map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={size === item ? "selected" : ""}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          {/* QUANTITY */}

          <div className="qty">

            <button
              type="button"
              onClick={() =>
                setQty((value) => Math.max(1, value - 1))
              }
            >
              <FiMinus />
            </button>

            <b>{qty}</b>

            <button
              type="button"
              onClick={() =>
                setQty((value) => value + 1)
              }
            >
              <FiPlus />
            </button>

          </div>

          {/* BUY BUTTONS */}

          <div className="buy-row">

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addToCart(product)}
            >
              <FiShoppingBag />
              Add to Cart
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={buyNow}
            >
              <FiZap />
              Buy Now
            </button>

          </div>

          {/* TRUST FEATURES */}

          <div className="trust-box">

            <div className="trust-item">
              <span className="trust-icon">
                <FiTruck />
              </span>

              <span>
                <b>Free Shipping</b>
                <small>On orders above ₹999</small>
              </span>
            </div>

            <div className="trust-item">
              <span className="trust-icon">
                <FiRefreshCw />
              </span>

              <span>
                <b>Easy Returns</b>
                <small>7 days hassle free</small>
              </span>
            </div>

            <div className="trust-item">
              <span className="trust-icon">
                <FiShield />
              </span>

              <span>
                <b>Secure Payment</b>
                <small>100% secure payments</small>
              </span>
            </div>

            <div className="trust-item">
              <span className="trust-icon">
                <FiRefreshCw />
              </span>

              <span>
                <b>COD Available</b>
                <small>On eligible orders</small>
              </span>
            </div>

            <div className="trust-item">
              <span className="trust-icon">
                <FiTruck />
              </span>

              <span>
                <b>Estimated Delivery</b>
                <small>3 - 5 business days</small>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================
          TRUST STRIP
      ========================= */}

      <section className="detail-container feature-strip">

        <div>
          <span>
            <FiShield />
          </span>

          <div>
            <b>Premium Quality</b>
            <small>Best fabrics & designs</small>
          </div>
        </div>

        <div>
          <span>
            <FiShoppingBag />
          </span>

          <div>
            <b>Affordable Prices</b>
            <small>Style for every budget</small>
          </div>
        </div>

        <div>
          <span>
            <FiCheckCircle />
          </span>

          <div>
            <b>Trusted by 50K+ Customers</b>
            <small>4.6/5 average rating</small>
          </div>
        </div>

        <div>
          <span>
            <FiRefreshCw />
          </span>

          <div>
            <b>Easy Exchange</b>
            <small>Size & style issues</small>
          </div>
        </div>

        <div>
          <span>
            <FiHeart />
          </span>

          <div>
            <b>24/7 Support</b>
            <small>We're here to help</small>
          </div>
        </div>

      </section>

      {/* =========================
          TABS
      ========================= */}

      <section className="detail-container product-tabs">

        <div className="tab-head">
          <button
            type="button"
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            DESCRIPTION
          </button>

          <button
            type="button"
            className={activeTab === "highlights" ? "active" : ""}
            onClick={() => setActiveTab("highlights")}
          >
            HIGHLIGHTS
          </button>

          <button
            type="button"
            className={activeTab === "specifications" ? "active" : ""}
            onClick={() => setActiveTab("specifications")}
          >
            SPECIFICATIONS
          </button>

          <button
            type="button"
            className={activeTab === "faq" ? "active" : ""}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>

          <button
            type="button"
            className={activeTab === "shipping" ? "active" : ""}
            onClick={() => setActiveTab("shipping")}
          >
            SHIPPING & RETURNS
          </button>

          <button
            type="button"
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            REVIEWS ({displayedReviews.length})
          </button>
        </div>

                {/* DESCRIPTION */}
        {activeTab === "description" && (
          <div className="tab-content description-content">
            <div>
              <div
                className="rich-description-render"
                dangerouslySetInnerHTML={{
                  __html: product.description || "Make a statement with this beautiful piece, crafted from premium fabric for a graceful and elegant look."
                }}
              />
              {product.shortDescription && (
                <div style={{ marginTop: '20px', padding: '14px 18px', backgroundColor: '#fdf8f7', borderRadius: '8px', borderLeft: '4px solid #e11b22' }}>
                  <b style={{ display: 'block', marginBottom: '6px', color: '#222' }}>Quick Highlights / Summary:</b>
                  <div
                    className="product-description-html"
                    dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                  />
                </div>
              )}
            </div>

            {product.highlights && product.highlights.length > 0 && (
              <div className="spec-card">
                <h4 style={{ marginBottom: '12px' }}>Highlights</h4>
                <ul style={{ paddingLeft: '18px', lineHeight: '1.8' }}>
                  {product.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* HIGHLIGHTS */}
        {activeTab === "highlights" && (
          <div className="tab-content single-tab">
            <div className="large-spec-card">
              <h3>Product Highlights</h3>
              {product.highlights && product.highlights.length > 0 ? (
                <ul style={{ paddingLeft: '24px', lineHeight: '2.2', fontSize: '15px' }}>
                  {product.highlights.map((h, i) => (
                    <li key={i}><strong>{h}</strong></li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#666' }}>No specific highlights added for this product.</p>
              )}
            </div>
          </div>
        )}

        {/* SPECIFICATIONS */}
        {activeTab === "specifications" && (
          <div className="tab-content single-tab">
            <div className="large-spec-card">
              <h3>Product Specifications</h3>
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, i) => (
                  <div className="spec-row" key={i}>
                    <b>{spec.key}</b>
                    <span>{spec.value}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="spec-row">
                    <b>Category</b>
                    <span>{product.category || 'Apparel'}</span>
                  </div>
                  {product.subcategory && (
                    <div className="spec-row">
                      <b>Subcategory</b>
                      <span>{product.subcategory}</span>
                    </div>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="spec-row">
                      <b>Sizes</b>
                      <span>{product.sizes.join(', ')}</span>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="spec-row">
                      <b>Colors</b>
                      <span>{product.colors.join(', ')}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (
          <div className="tab-content single-tab">
            <div className="large-spec-card">
              <h3>Frequently Asked Questions</h3>
              {product.faqs && product.faqs.length > 0 ? (
                product.faqs.map((faq, i) => (
                  <div key={i} style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #eee' }}>
                    <h4 style={{ margin: '0 0 6px 0', color: '#111' }}>Q: {faq.question}</h4>
                    <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>A: {faq.answer}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#666' }}>No FAQs added for this product yet.</p>
              )}
            </div>
          </div>
        )}

        {/* SHIPPING */}

        {activeTab === "shipping" && (
          <div className="tab-content shipping-content">

            <div className="shipping-card">

              <span>
                <FiTruck />
              </span>

              <div>
                <h3>Free Shipping</h3>
                <p>
                  Free shipping is available on orders
                  above ₹999.
                </p>
              </div>

            </div>

            <div className="shipping-card">

              <span>
                <FiRefreshCw />
              </span>

              <div>
                <h3>Easy Returns</h3>
                <p>
                  Easy returns within 7 days on eligible
                  products.
                </p>
              </div>

            </div>

            <div className="shipping-card">

              <span>
                <FiShield />
              </span>

              <div>
                <h3>Secure Payments</h3>
                <p>
                  Your payment information is securely
                  processed.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="tab-content reviews-content">

            {/* LEFT: SUMMARY & WRITE BUTTON */}
            <div className="review-summary-sidebar">
              <div className="review-summary-card">
                <div className="review-big-score">{avgScore}</div>
                <div className="review-summary-stars">
                  {renderStars(Math.round(Number(avgScore)))}
                </div>
                <span className="review-count-label">
                  Based on {displayedReviews.length} verified reviews
                </span>
              </div>

              {!loggedInUser ? (
                <div>
                  <button
                    type="button"
                    className="write-review-btn"
                    onClick={() => nav('/login')}
                  >
                    <FiEdit3 />
                    Login to Review
                  </button>
                  <div style={{ fontSize: "11px", color: "#8c7b6d", marginTop: "8px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    <FiShield size={12} /> Only verified buyers can submit reviews
                  </div>
                </div>
              ) : reviewEligibility.checked && !reviewEligibility.canReview ? (
                <div style={{
                  padding: "12px 14px",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  color: "#92400e",
                  borderRadius: "8px",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  textAlign: "center"
                }}>
                  <div style={{ fontWeight: "700", marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                    <FiShield size={14} color="#d97706" /> Verified Buyer Only
                  </div>
                  <span>Only customers who have purchased this product can leave a review.</span>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="write-review-btn"
                    onClick={() => {
                      if (!showReviewForm) {
                        setNewReview(prev => ({
                          ...prev,
                          name: prev.name || loggedInUser.name || '',
                          email: prev.email || loggedInUser.email || ''
                        }));
                      }
                      setShowReviewForm(!showReviewForm);
                    }}
                  >
                    <FiEdit3 />
                    {showReviewForm ? "Cancel Review" : "Write a Review"}
                  </button>
                  <div style={{ fontSize: "11px", color: "#059669", marginTop: "8px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontWeight: "600" }}>
                    <FiCheckCircle size={13} /> Verified Buyer Eligible
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: FORM & REVIEWS LIST */}
            <div className="review-right-panel">

              {reviewSuccessMsg && (
                <div style={{
                  padding: "12px 18px",
                  borderRadius: "8px",
                  backgroundColor: "#def7ec",
                  color: "#03543f",
                  fontWeight: "600",
                  fontSize: "14px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FiCheckCircle size={18} />
                  <span>{reviewSuccessMsg}</span>
                </div>
              )}

              {/* WRITE REVIEW FORM */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="review-form-box">
                  <h3>Share Your Experience</h3>

                  <div className="rating-select-row">
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#554848" }}>Rating:</span>
                    <div className="star-rating-picker">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          fill={(hoverRating || newReview.rating) >= star ? "#f59e0b" : "none"}
                          color={(hoverRating || newReview.rating) >= star ? "#f59e0b" : "#d1d5db"}
                        />
                      ))}
                    </div>
                    <span className="star-label-text">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hoverRating || newReview.rating]}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="review-input-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        required
                      />
                    </div>
                    <div className="review-input-group">
                      <label>Your Email (Optional)</label>
                      <input
                        type="email"
                        value={newReview.email}
                        onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                        placeholder="e.g. priya@example.com"
                      />
                    </div>
                  </div>

                  <div className="review-input-group">
                    <label>Review Description *</label>
                    <textarea
                      rows="4"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Tell us what you liked or disliked about this product..."
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: "8px 18px", fontSize: "13px" }}
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submittingReview}
                      style={{ padding: "8px 24px", fontSize: "13px" }}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              )}

              {/* REVIEWS LIST */}
              <div className="product-reviews-list">
                {displayedReviews.map((rev, idx) => {
                  const initial = (rev.userName || "C").charAt(0).toUpperCase();
                  const dateStr = rev.createdAt
                    ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })
                    : "Verified Purchase";

                  return (
                    <div key={rev._id || idx} className="product-review-card">
                      <div className="review-card-top">
                        <div className="review-author-wrap">
                          <div className="review-avatar">{initial}</div>
                          <div className="review-author-meta">
                            <h4>
                              {rev.userName}
                              {rev.isVerified !== false && (
                                <span className="verified-badge">
                                  <FiCheckCircle size={11} /> Verified Buyer
                                </span>
                              )}
                            </h4>
                            <div className="review-stars-row">
                              {renderStars(Number(rev.rating) || 5)}
                            </div>
                          </div>
                        </div>

                        <span className="review-date">{dateStr}</span>
                      </div>

                      <p className="review-card-body">{rev.comment}</p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

      </section>

      {/* =========================
          COMPLETE THE LOOK
      ========================= */}

      <section className="detail-container complete-look">

        <div className="complete-look-header">

          <div>
            <h2>Complete The Look</h2>

            <p>
              Pair with these beautiful products
            </p>
          </div>

          <div className="look-arrows">

            <button
              type="button"
              onClick={() => scrollLook("left")}
            >
              <FiChevronLeft />
            </button>

            <button
              type="button"
              onClick={() => scrollLook("right")}
            >
              <FiChevronRight />
            </button>

          </div>

        </div>

        <div
          className="mini-products"
          ref={lookRef}
        >

          {displayRelatedProducts.map((item) => {
            const itemId = item._id || item.id;
            const itemSlug = item.slug || slugify(item.name) || itemId;
            const itemImg = item.images?.[0] || item.image || fallbackImage;
            const itemPrice = Math.round(Number(item.price) || 0);
            const itemMrp = Math.round(Number(item.originalPrice || item.mrp) || 0);
            const inWish = isItemInWishlist(item);

            return (
              <div
                className="mini-product"
                key={itemId}
              >
                <div 
                  className="mini-image"
                  onClick={() => {
                    nav(`/product/${itemSlug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={itemImg}
                    alt={item.name}
                    onError={handleImageError}
                  />

                  <button
                    type="button"
                    className={`mini-heart ${inWish ? "active" : ""}`}
                    title={inWish ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlistItem(item);
                    }}
                    style={{
                      color: inWish ? "#ef4444" : "#f04464"
                    }}
                  >
                    <FiHeart fill={inWish ? "#ef4444" : "none"} />
                  </button>
                </div>

                <h3
                  onClick={() => {
                    nav(`/product/${itemSlug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ cursor: 'pointer' }}
                  title={item.name}
                >
                  {item.name}
                </h3>

                <div className="mini-price">
                  ₹{itemPrice.toLocaleString("en-IN")}

                  {itemMrp > itemPrice && (
                    <del>
                      ₹{itemMrp.toLocaleString("en-IN")}
                    </del>
                  )}
                </div>

                <button
                  type="button"
                  className="mini-cart"
                  onClick={() => addToCart(item)}
                >
                  <FiShoppingBag />
                  Add to Cart
                </button>
              </div>
            );
          })}

        </div>

      </section>

      {/* =========================
          SCROLL TOP
      ========================= */}

      <button
        type="button"
        className="scroll-top"
        onClick={scrollTop}
      >
        <FiArrowUp />
      </button>

    </div>
  );
}