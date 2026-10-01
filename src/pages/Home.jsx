import React, { useEffect, useState } from "react";
import api from "../lib/api";
import {
  FiArrowRight,
  FiHeart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiCreditCard,
  FiInstagram,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Home.css";

/* =========================
   HOME PAGE DATA
   ========================= */

const products = [
  {
    id: 1,
    name: "Casual Striped Shirt",
    category: "Men's Collection",
    price: 999,
    mrp: 1449,
    badge: "-30%",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Embroidered Kurti",
    category: "Women's Collection",
    price: 1299,
    mrp: 1849,
    badge: "-30%",
    image:
      "/assets/women.png",
  },
  {
    id: 3,
    name: "Hooded Jacket",
    category: "Boys Collection",
    price: 899,
    mrp: 1099,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Party Wear Dress",
    category: "Girls Collection",
    price: 1199,
    mrp: 1699,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Sherwani Set",
    category: "Ethnic Wear",
    price: 3499,
    mrp: 4999,
    badge: "-30%",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Casual Sneakers",
    category: "Footwear",
    price: 1199,
    mrp: 1699,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
  },
];

const trendingProducts = [
  {
    id: 21,
    name: "Men's Polo T-Shirt",
    category: "Men's Collection",
    price: 799,
    mrp: 1299,
    badge: "-30%",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 22,
    name: "Floral Maxi Dress",
    category: "Women's Collection",
    price: 1599,
    mrp: 2499,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 23,
    name: "Denim Set",
    category: "Boys Collection",
    price: 899,
    mrp: 1499,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 24,
    name: "Frock Dress",
    category: "Girls Collection",
    price: 899,
    mrp: 1499,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 25,
    name: "Designer Saree",
    category: "Ethnic Wear",
    price: 2499,
    mrp: 4499,
    badge: "-20%",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 26,
    name: "Premium Handbag",
    category: "Accessories",
    price: 1299,
    mrp: 1999,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85",
  },
];

const slides = [
  {
    eyebrow: "NEW SEASON COLLECTION +",
    title: "Fashion for Every You",
    text: "Men • Women • Kids • Ethnic Wear",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90",
  },
  {
    eyebrow: "NEW ARRIVALS +",
    title: "New Season, New Style",
    text: "Premium looks for every occasion",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=90",
  },
  {
    eyebrow: "THE ETHNIC EDIT +",
    title: "Tradition Meets Modern Style",
    text: "Celebrate every moment in style",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=90",
  },
];

const initialCategories = [
  {
    name: "Men",
    path: "/men",
    image:
      "/assets/mencategory1.png",
  },
  {
    name: "Women",
    path: "/women",
    image:
      "/assets/women.png",
  },
  {
    name: "Boys",
    path: "/boys",
    image:
      "/assets/boys.png",
  },
  {
    name: "Girls",
    path: "/girls",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Ethnic Wear",
    path: "/ethnic-wear",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Footwear",
    path: "/footwear",
    image:
      "/assets/footwear.png",
  },
  {
    name: "Accessories",
    path: "/accessories",
    image:
      "/assets/accesories.png",
  },
  {
    name: "Sale",
    path: "/sale",
    image:
      "/assets/sale.png",
  },
];

const influencers = [
  {
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
    name: "@stylewithsbv",
    followers: "24K followers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=85",
    name: "@the.fashion.diaries",
    followers: "51K followers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=85",
    name: "@neha.in.style",
    followers: "35K followers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=85",
    name: "@glamwithpooja",
    followers: "43K followers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=85",
    name: "@neha.outfits",
    followers: "27K followers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=600&q=85",
    name: "@urbanethnicgirl",
    followers: "27K followers",
  },
];

const instagramImages = [
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=500&q=85",
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=85",
  "/assets/women.png",
  "/assets/boys.png",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=85",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=85",
];

function SectionHeading({ title, subtitle }) {
  return (
    <div className="home-section-heading">
      <div className="heading-line" />
      <h2>{title}</h2>
      <div className="heading-line" />
      <p>{subtitle}</p>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState(initialCategories);
  const [dbProducts, setDbProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  const [slide, setSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("All");
  const [email, setEmail] = useState("");

  useEffect(() => {
    api.get('/products').then(res => { if (res.success) setDbProducts(res.products || []); });
    api.get('/categories').then(res => {
      if (res.success && res.categories.length > 0) {
        setCategories(res.categories);
      }
    });
    api.get('/banners').then(res => {
      if (res.success && res.banners.length > 0) {
        setBanners(res.banners.filter(b => b.isActive !== false));
      }
    });
  }, []);

  const heroBanners = banners.filter(b => (!b.position || b.position === 'hero'));
  const activeSlides = heroBanners.length > 0 ? heroBanners.map(b => ({
    eyebrow: b.subtitle || "FEATURED COLLECTION +",
    title: b.title || "Fashion for Every You",
    text: "Shop the best styles online",
    image: b.image,
    link: b.link || "/shop"
  })) : slides;

  const preTrending1 = banners.find(b => b.position === 'pre-trending-1');
  const preTrending2 = banners.find(b => b.position === 'pre-trending-2');
  const postInfluencer1 = banners.find(b => b.position === 'post-influencer-1');
  const postInfluencer2 = banners.find(b => b.position === 'post-influencer-2');
  const saleBanner = banners.find(b => b.position === 'sale');

  /* =========================
     HERO AUTO SLIDER
     ========================= */

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const previousSlide = () => {
    setSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  /* =========================
     TRENDING & NEW ARRIVALS
     ========================= */

  const trendingList = dbProducts.filter((product) => {
    if (!product.isTrending) return false;
    if (activeTab === "All") return true;
    const cat = (product.category || "").toLowerCase();
    const tab = activeTab.toLowerCase();
    return cat.includes(tab);
  });

  const newArrivalsList = dbProducts.filter((p) => p.isNewArrival);

  const subscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <main className="home-page">
      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <section className="home-hero">
        <div className="home-hero-image-wrap">
          {activeSlides.map((item, index) => (
            <img
              key={item.title}
              src={item.image}
              alt={item.title}
              className={`home-hero-image ${
                index === slide ? "active" : ""
              }`}
            />
          ))}
        </div>

        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <span className="home-hero-eyebrow">
              {activeSlides[slide]?.eyebrow}
            </span>

            <h1>{activeSlides[slide]?.title}</h1>

            <p>
              {activeSlides[slide]?.text}
              <br />
              Premium Styles for Every Occasion
            </p>

            <div className="home-hero-buttons">
              <button
                className="home-btn home-btn-primary"
                onClick={() => navigate("/women")}
              >
                SHOP WOMEN
                <FiArrowRight />
              </button>

              <button
                className="home-btn home-btn-light"
                onClick={() => navigate("/men")}
              >
                SHOP MEN
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="home-hero-arrow home-hero-arrow-left"
          onClick={previousSlide}
          aria-label="Previous slide"
        >
          <FiChevronLeft />
        </button>

        <button
          type="button"
          className="home-hero-arrow home-hero-arrow-right"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <FiChevronRight />
        </button>

        <div className="home-hero-dots">
          {activeSlides.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={index === slide ? "active" : ""}
              onClick={() => setSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          SHOP BY CATEGORY
          ===================================================== */}
<section className="home-section home-category-section">
  <div className="home-container">
    <SectionHeading
      title="SHOP BY CATEGORY"
      subtitle="Find Your Style, Your Way"
    />

    <div className="home-category-grid">
      {categories.map((category, index) => (
        <button
          type="button"
          key={category.path}
          className="home-category-card"
          style={{
            "--category-delay": `${index * 70}ms`,
          }}
          onClick={() => navigate(category.path)}
        >
          <div className="home-category-image-wrap">
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
            />

            {category.name === "Sale" && (
              <span className="home-sale-badge">
                <span>UP TO</span>
                <strong>50%</strong>
                <span>OFF</span>
              </span>
            )}

            <span className="home-category-overlay">
              <FiArrowRight />
            </span>
          </div>

          <span className="home-category-name">
            {category.name}
          </span>
        </button>
      ))}
    </div>
  </div>
</section>

      {/* =====================================================
          BENEFITS
          ===================================================== */}

      <section className="home-benefit-strip">
        <div className="home-container home-benefit-grid">
          <div className="home-benefit-item">
            <FiTruck />
            <div>
              <strong>Free Shipping</strong>
              <span>Orders above ₹999</span>
            </div>
          </div>

          <div className="home-benefit-item">
            <FiRefreshCw />
            <div>
              <strong>Easy Returns</strong>
              <span>7 days hassle free</span>
            </div>
          </div>

          <div className="home-benefit-item">
            <FiShield />
            <div>
              <strong>Secure Payment</strong>
              <span>100% secure payments</span>
            </div>
          </div>

          <div className="home-benefit-item">
            <FiCreditCard />
            <div>
              <strong>COD Available</strong>
              <span>On eligible orders</span>
            </div>
          </div>

          <div className="home-benefit-item">
            <FiHeadphones />
            <div>
              <strong>24/7 Support</strong>
              <span>We're here to help</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEW ARRIVALS
          ===================================================== */}

      <section className="home-section">
        <div className="home-container">
          <SectionHeading
            title="NEW ARRIVALS"
            subtitle="Fresh Styles Just Dropped"
          />

          <div className="home-products-grid">
            {newArrivalsList.length > 0 ? (
              newArrivalsList.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            ) : dbProducts.length > 0 ? (
              dbProducts.slice(0, 10).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            ) : (
              <p style={{ padding: '30px', textAlign: 'center', width: '100%', color: '#888' }}>
                No new arrival products yet. Add products from the Admin Panel.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          MEN + WOMEN COLLECTION
          ===================================================== */}

      <section className="home-section home-collection-section">
        <div className="home-container home-collection-grid">
          <div
            className="home-collection-card home-men-card"
            style={{
              backgroundImage: `url('${preTrending1?.image || "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=90"}')`,
            }}
          >
            <div className="home-collection-content">
              <span>{preTrending1?.subtitle || "PREMIUM EDIT"}</span>
              <h2>
                {preTrending1?.title ? (
                  preTrending1.title
                ) : (
                  <>Men's<br />Collection</>
                )}
              </h2>

              <p>
                Modern Essentials
                <br />
                For Every Occasion
              </p>

              <button
                className="home-outline-button"
                onClick={() => navigate(preTrending1?.link || "/men")}
              >
                SHOP MEN
                <FiArrowRight />
              </button>
            </div>
          </div>

          <div
            className="home-collection-card home-women-card"
            style={{
              backgroundImage: `url('${preTrending2?.image || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90"}')`,
            }}
          >
            <div className="home-collection-content">
              <span>{preTrending2?.subtitle || "THE WOMEN EDIT"}</span>
              <h2>
                {preTrending2?.title ? (
                  preTrending2.title
                ) : (
                  <>Women's<br />Collection</>
                )}
              </h2>

              <p>
                Elegance In
                <br />
                Every Detail
              </p>

              <button
                className="home-outline-button"
                onClick={() => navigate(preTrending2?.link || "/women")}
              >
                SHOP WOMEN
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRENDING NOW
          ===================================================== */}

      <section className="home-section home-trending-section">
        <div className="home-container">
          <SectionHeading
            title="TRENDING NOW"
            subtitle="Styles Everyone Is Loving"
          />

          <div className="home-trending-tabs">
            {[
              "All",
              "Men",
              "Women",
              "Boys",
              "Girls",
              "Ethnic Wear",
            ].map((tab) => (
              <button
                type="button"
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="home-products-grid">
            {trendingList.length > 0 ? (
              trendingList.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            ) : (
              <p style={{ padding: '30px', textAlign: 'center', width: '100%', color: '#888' }}>
                No trending products found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          FASHION INFLUENCERS
          ===================================================== */}

      <section className="home-section home-influencer-section">
        <div className="home-container">
          <SectionHeading
            title="FASHION INFLUENCERS"
            subtitle="Style Inspiration From Our Community"
          />

          <div className="home-influencer-grid">
            {influencers.map((influencer) => (
              <div
                className="home-influencer-card"
                key={influencer.name}
              >
                <div className="home-influencer-image">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    loading="lazy"
                  />

                  <span className="home-instagram-icon">
                    <FiInstagram />
                  </span>
                </div>

                <strong>{influencer.name}</strong>
                <span>{influencer.followers}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          LITTLE FASHION STARS
          ===================================================== */}

      <section className="home-section home-kids-section">
        <div className="home-container">
          <SectionHeading
            title="LITTLE FASHION STARS"
            subtitle="Trendy Styles for Your Little Ones"
          />

          <div className="home-kids-grid">
            <div
              className="home-kids-card boys"
              style={{
                backgroundImage: `url('${postInfluencer1?.image || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=90"}')`,
              }}
            >
              <div>
                <h3>{postInfluencer1?.title || "Boys Collection"}</h3>
                <p>{postInfluencer1?.subtitle || "Stylish & Comfortable"}</p>

                <button
                  className="home-btn home-btn-primary"
                  onClick={() => navigate(postInfluencer1?.link || "/boys")}
                >
                  SHOP BOYS
                  <FiArrowRight />
                </button>
              </div>
            </div>

            <div
              className="home-kids-card girls"
              style={{
                backgroundImage: `url('${postInfluencer2?.image || "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=90"}')`,
              }}
            >
              <div>
                <h3>{postInfluencer2?.title || "Girls Collection"}</h3>
                <p>{postInfluencer2?.subtitle || "Cute. Stylish. Confident."}</p>

                <button
                  className="home-btn home-btn-primary"
                  onClick={() => navigate(postInfluencer2?.link || "/girls")}
                >
                  SHOP GIRLS
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SALE
          ===================================================== */}

      <section
        className="home-sale-banner"
        style={{
          backgroundImage: `url('${saleBanner?.image || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=90"}')`,
        }}
      >
        <div className="home-sale-content">
          <span>{saleBanner?.subtitle || "LIMITED TIME OFFER"}</span>
          <h2>{saleBanner?.title || "THE STYLE SALE"}</h2>
          <strong>UP TO 50% OFF</strong>
          <p>On Selected Fashion Styles</p>

          <button
            className="home-btn home-btn-primary"
            onClick={() => navigate(saleBanner?.link || "/sale")}
          >
            SHOP SALE
            <FiArrowRight />
          </button>
        </div>
      </section>

      {/* =====================================================
          WHY SHOP WITH US
          ===================================================== */}

      <section className="home-section home-why-section">
        <div className="home-container">
          <SectionHeading
            title="WHY SHOP WITH US"
            subtitle="Your Trusted Fashion Destination"
          />

          <div className="home-why-grid">
            <div>
              <span>
                <FiHeart />
              </span>
              <strong>Premium Quality</strong>
              <small>Best materials & designs</small>
            </div>

            <div>
              <span>
                <FiCreditCard />
              </span>
              <strong>Affordable Prices</strong>
              <small>Style for every budget</small>
            </div>

            <div>
              <span>
                <FiRefreshCw />
              </span>
              <strong>Easy Returns</strong>
              <small>7 days hassle free</small>
            </div>

            <div>
              <span>
                <FiShield />
              </span>
              <strong>Secure Shopping</strong>
              <small>100% safe & secure</small>
            </div>

            <div>
              <span>
                <FiHeart />
              </span>
              <strong>Happy Customers</strong>
              <small>Thousands trust us</small>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STYLE IT / SHARE IT
          ===================================================== */}

      <section className="home-section home-social-section">
        <div className="home-container">
          <SectionHeading
            title="STYLE IT. SHARE IT."
            subtitle="Follow us @ssvastralya"
          />

          <div className="home-social-grid">
            {instagramImages.map((image, index) => (
              <div className="home-social-card" key={image}>
                <img
                  src={image}
                  alt={`SBV style ${index + 1}`}
                  loading="lazy"
                />

                <div>
                  <FiInstagram />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          NEWSLETTER
          ===================================================== */}

      {/* <section className="home-newsletter">
        <div className="home-newsletter-image">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90"
            alt="Fashion collection"
          />
        </div>

        <div className="home-container home-newsletter-inner">
          <div className="home-newsletter-copy">
            <span>EXCLUSIVE OFFER</span>

            <h2>
              GET 10% OFF
              <br />
              YOUR FIRST ORDER
            </h2>

            <p>
              Sign up for new arrivals, exclusive offers and fashion
              inspiration.
            </p>

            <form onSubmit={subscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit">
                SUBSCRIBE
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section> */}
    </main>
  );
}
