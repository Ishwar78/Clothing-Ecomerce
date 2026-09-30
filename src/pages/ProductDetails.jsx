import React, { useRef, useState, useEffect } from "react";
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

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  
  const [dbProduct, setDbProduct] = useState(null);
  const [dbRelated, setDbRelated] = useState([]);
  useEffect(() => {
    import('../lib/api').then(({default: api}) => {
      api.get('/products').then(res => {
        if(res.success) {
           const p = res.products.find(x => x._id === id || String(x.id) === String(id));
           if (p) setDbProduct(p);
           setDbRelated(res.products.filter(x => x._id !== id).slice(0, 4));
        }
      });
    });
  }, [id]);
  const foundProduct = dbProduct || allProducts.find(p => String(p._id || p.id) === String(id));

  const mainImage = foundProduct?.images?.[0] || foundProduct?.image || defaultProduct.image;
  const productThumbs = foundProduct?.images && foundProduct.images.length > 0
    ? foundProduct.images
    : (foundProduct?.image ? [foundProduct.image, ...defaultProduct.thumbs.slice(1)] : defaultProduct.thumbs);

  const productPrice = Number(foundProduct?.price || defaultProduct.price);
  const productMrp = Number(foundProduct?.originalPrice || foundProduct?.mrp || defaultProduct.mrp);
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

  const [img, setImg] = useState(product.image);
  
  useEffect(() => {
    setImg(product.image);
  }, [product.image]);

  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [liked, setLiked] = useState(false);

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
      localStorage.getItem("sbv-cart") || "[]"
    );

    const cartItem = {
      ...item,
      quantity: item.id === product.id ? qty : 1,
      size: item.id === product.id ? size : "M",
    };

    const existingIndex = existingCart.findIndex(
      (x) => x.id === item.id
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

    localStorage.setItem("sbv-cart", JSON.stringify(updatedCart));

    alert(`${item.name} added to cart`);
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

  const toggleWishlist = () => {
    const wishlist = JSON.parse(
      localStorage.getItem("sbv-wishlist") || "[]"
    );

    const exists = wishlist.some((item) => item.id === product.id);

    let updated;

    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
      setLiked(false);
    } else {
      updated = [...wishlist, product];
      setLiked(true);
    }

    localStorage.setItem("sbv-wishlist", JSON.stringify(updated));
  };

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

          <p className="product-description">
            {product.description}
          </p>

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

          <div className="option">

            <strong>
              Color: <span>Peach Pink</span>
            </strong>

            <div className="swatches">

              <button
                type="button"
                className="selected peach"
              />

              <button
                type="button"
                className="cream"
              />

              <button
                type="button"
                className="purple"
              />

              <button
                type="button"
                className="green"
              />

            </div>
          </div>

          {/* SIZE */}

          <div className="option">

            <div className="size-heading">

              <strong>
                Size:
              </strong>

              <button type="button">
                Size Guide
              </button>

            </div>

            <div className="sizes">

              {["XS", "S", "M", "L", "XL", "XXL"].map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      size === item
                        ? "selected"
                        : ""
                    }
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
            className={
              activeTab === "description"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("description")
            }
          >
            DESCRIPTION
          </button>

          <button
            type="button"
            className={
              activeTab === "specifications"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("specifications")
            }
          >
            SPECIFICATIONS
          </button>

          <button
            type="button"
            className={
              activeTab === "shipping"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("shipping")
            }
          >
            SHIPPING & RETURNS
          </button>

          <button
            type="button"
            className={
              activeTab === "reviews"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("reviews")
            }
          >
            REVIEWS (128)
          </button>

        </div>

        {/* DESCRIPTION */}

        {activeTab === "description" && (
          <div className="tab-content description-content">

            <div>

              <p>
                Make a statement with this beautiful
                embroidered Anarkali suit set, crafted
                from premium fabric for a graceful and
                elegant look. Intricate embroidery,
                flowing silhouette and matching dupatta
                make it perfect for weddings, festive
                occasions and special celebrations.
              </p>

              <ul>
                <li>Premium quality fabric</li>
                <li>Beautiful embroidery work</li>
                <li>Comfortable & breathable</li>
                <li>Comes with matching dupatta</li>
                <li>Perfect for festive & wedding occasions</li>
                <li>Available in multiple sizes</li>
              </ul>

            </div>

            <div className="spec-card">

              <p>
                <b>Fabric</b>
                <span>Georgette</span>
              </p>

              <p>
                <b>Work</b>
                <span>Embroidery</span>
              </p>

              <p>
                <b>Set Includes</b>
                <span>Anarkali, Dupatta, Bottom</span>
              </p>

              <p>
                <b>Occasion</b>
                <span>Wedding, Festive, Party</span>
              </p>

              <p>
                <b>Care</b>
                <span>Dry Clean Only</span>
              </p>

              <p>
                <b>Fit</b>
                <span>Regular Fit</span>
              </p>

            </div>

          </div>
        )}

        {/* SPECIFICATIONS */}

        {activeTab === "specifications" && (
          <div className="tab-content single-tab">

            <div className="large-spec-card">

              <h3>Product Specifications</h3>

              <div className="spec-row">
                <b>Product Type</b>
                <span>Anarkali Suit Set</span>
              </div>

              <div className="spec-row">
                <b>Fabric</b>
                <span>Georgette</span>
              </div>

              <div className="spec-row">
                <b>Work</b>
                <span>Embroidery</span>
              </div>

              <div className="spec-row">
                <b>Set Includes</b>
                <span>Anarkali, Dupatta, Bottom</span>
              </div>

              <div className="spec-row">
                <b>Occasion</b>
                <span>Wedding, Festive, Party</span>
              </div>

              <div className="spec-row">
                <b>Fit</b>
                <span>Regular Fit</span>
              </div>

              <div className="spec-row">
                <b>Care</b>
                <span>Dry Clean Only</span>
              </div>

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

            <div className="review-summary">

              <strong>4.6</strong>

              <div>
                <div className="review-stars">
                  ★★★★★
                </div>

                <span>
                  Based on 128 verified reviews
                </span>
              </div>

            </div>

            <div className="review-list">

              <div className="review-item">
                <div>
                  <b>Priya S.</b>
                  <span>★★★★★</span>
                </div>

                <p>
                  Beautiful embroidery and very
                  comfortable fabric. Looks exactly as
                  shown.
                </p>
              </div>

              <div className="review-item">
                <div>
                  <b>Neha R.</b>
                  <span>★★★★★</span>
                </div>

                <p>
                  Loved the colour and fitting. Perfect
                  for festive occasions.
                </p>
              </div>

              <div className="review-item">
                <div>
                  <b>Anjali K.</b>
                  <span>★★★★☆</span>
                </div>

                <p>
                  Good quality and beautiful design.
                </p>
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

          {completeLookProducts.map((item) => (
            <div
              className="mini-product"
              key={item.id}
            >

              <div className="mini-image">

                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImageError}
                />

                <button
                  type="button"
                  className="mini-heart"
                >
                  <FiHeart />
                </button>

              </div>

              <h3>{item.name}</h3>

              <div className="mini-price">
                ₹{item.price.toLocaleString("en-IN")}

                <del>
                  ₹{item.mrp.toLocaleString("en-IN")}
                </del>
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
          ))}

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