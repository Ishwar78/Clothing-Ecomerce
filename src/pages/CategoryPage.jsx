import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiGrid,
  FiList,
  FiSliders,
  FiArrowRight,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiHeart as FiLove,
  FiShoppingBag,
} from "react-icons/fi";
import "./CategoryPage.css";

import { allProducts } from "../data/products";

const categories = [
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

const categoryMap = {
  women: ["Women", "412"],
  men: ["Men", "246"],
  boys: ["Boys", "128"],
  girls: ["Girls", "132"],
  "ethnic-wear": ["Ethnic Wear", "214"],
  footwear: ["Footwear", "98"],
  accessories: ["Accessories", "176"],
  "new-arrivals": ["New Arrivals", "126"],
  sale: ["Sale", "238"],
};

const filterData = [
  {
    title: "Category",
    items: [
      "Men ",
      "Women",
      "Boys",
      "Girls",
      "Ethnic Wear",
      "Footwear ",
      "Accessories ",
    ],
  },
  {
    title: "Sub Category",
    items: [
      "Kurtis ",
      "Sarees",
      "Lehengas ",
      "Tops ",
      "Dresses ",
      "Bottom Wear ",
      "Dupattas ",
    ],
  },
];

const benefits = [
  [FiShield, "Premium Quality", "Best materials & designs"],
  [FiArrowRight, "Affordable Prices", "Style for every budget"],
  [FiRefreshCw, "Easy Returns", "7 days hassle free"],
  [FiTruck, "Secure Shopping", "100% safe & secure"],
  [FiLove, "Happy Customers", "Thousands trust us"],
];

export default function CategoryPage({ slug: propSlug }) {
  const [categoriesData, setCategoriesData] = useState([]);
  React.useEffect(() => {
    import('../lib/api').then(({ default: api }) => {
      api.get('/categories').then((res) => {
        if (res.success) {
          setCategoriesData(res.categories);
        }
      });
    });
  }, []);
  const currentDynamicFilters = React.useMemo(() => {
    const filters = [
      {
        title: "Category",
        items: categoriesData.length > 0 ? categoriesData.map(c => c.name) : filterData[0].items
      }
    ];
    let s = propSlug || window.location.pathname.replace('/', '');
    const currentCategory = categoriesData.find(c => c.path === "/" + s || c.path === s || c.name.toLowerCase() === s.toLowerCase());
    if (currentCategory && currentCategory.subcategories?.length > 0) {
      filters.push({ title: "Sub Category", items: currentCategory.subcategories });
    } else {
      filters.push(filterData[1]);
    }
    return filters;
  }, [categoriesData, propSlug]);
  const params = useParams();
  const slug = propSlug || params.slug;
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(true);
  const [sort, setSort] = useState("popularity");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [dbProducts, setDbProducts] = useState([]);
  React.useEffect(() => {
    import('../lib/api').then(({ default: api }) => {
      api.get('/products').then(res => res.success && setDbProducts(res.products));
    });
  }, []);

  const title = categoryMap[slug]?.[0] || "Shop All";
  const totalProducts = categoryMap[slug]?.[1] || "412";

  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const products = useMemo(() => {
    // Only show real dynamic products from database
    let result = [...dbProducts];

    if (slug) {
      const cleanSlug = normalize(slug);
      result = result.filter((item) => {
        if (!item.category) return false;
        const cleanCat = normalize(item.category);

        if (cleanSlug === 'sale') {
          return item.badge === 'Sale' || item.isSale || (item.originalPrice && item.originalPrice > item.price);
        }
        if (cleanSlug === 'newarrivals' || cleanSlug === 'new') {
          return item.badge === 'New' || item.isNewArrival;
        }

        return (
          cleanCat === cleanSlug ||
          cleanCat.startsWith(cleanSlug) ||
          cleanSlug.startsWith(cleanCat)
        );
      });
    }

    // Subcategory & Category Checkbox Filtering (from sidebar)
    if (selectedFilters.length > 0) {
      result = result.filter((item) => {
        return selectedFilters.some((filter) => {
          const cleanFilter = normalize(filter);
          const cleanSub = normalize(item.subcategory);
          const cleanCat = normalize(item.category);
          const cleanName = normalize(item.name);
          return (
            cleanSub === cleanFilter ||
            cleanCat === cleanFilter ||
            cleanName.includes(cleanFilter)
          );
        });
      });
    }

    // Sorting
    if (sort === "low") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sort === "high") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sort === "newest") {
      result.sort((a, b) => {
        if ((a.badge === "New" || a.isNewArrival) && !(b.badge === "New" || b.isNewArrival)) return -1;
        if (!(a.badge === "New" || a.isNewArrival) && (b.badge === "New" || b.isNewArrival)) return 1;
        return 0;
      });
    }

    return result;
  }, [slug, sort, selectedFilters, dbProducts]);

  const toggleFilter = (value) => {
    setSelectedFilters((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("sbv-cart") || "[]");

    localStorage.setItem(
      "sbv-cart",
      JSON.stringify([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ])
    );

    alert(`${product.name} added to cart`);
  };

  return (
    <div className="category-page">

      {/* ================= HERO ================= */}
      <section className="category-hero">
        <div className="category-hero-content">
          <span className="category-kicker">SBV COLLECTION</span>

          <h1>
            {title}
            <br />
            <em>Collection</em>
          </h1>

          <p>
            Discover the latest fashion for Men, Women, Boys & Girls.
            <br />
            From everyday essentials to festive favourites.
          </p>

          <div className="category-breadcrumb">
            Home <b>›</b> {title}
          </div>
        </div>

        <div className="category-hero-image">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=90"
            alt="SBV Collection"
          />

          <div className="hero-side-text">
            <strong>
              Style
              <br />
              Tradition
              <br />
              Comfort
            </strong>

            <span>All in One</span>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY STRIP ================= */}
      <section className="category-circle-section">
        <div className="category-circle-container">
          {categoriesData.map((category, index) => (
            <button
              type="button"
              key={category.path}
              className="category-circle-card"
              style={{
                "--category-delay": `${index * 70}ms`,
              }}
              onClick={() => navigate(category.path)}
            >
              <div className="category-circle-image">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />

                {category.name === "Sale" && (
                  <span className="category-sale-badge">
                    UP TO
                    <strong>50%</strong>
                    OFF
                  </span>
                )}

                <span className="category-arrow">
                  <FiArrowRight />
                </span>
              </div>

              <span className="category-circle-name">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= SHOP AREA ================= */}
      <section className="shop-layout-container">

        {/* FILTER SIDEBAR */}
        <aside
          className={`category-filter-sidebar ${
            showFilters ? "filter-open" : ""
          }`}
        >
          <div className="filter-heading">
            <h3>Filters</h3>

            <button type="button" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {currentDynamicFilters.map((group) => (
            <div className="filter-group" key={group.title}>
              <div className="filter-group-title">
                <h4>{group.title}</h4>
                <FiChevronDown />
              </div>

              {group.items.map((item) => (
                <label className="filter-checkbox" key={item}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilter(item)}
                  />

                  <span className="custom-checkbox"></span>

                  <span>{item}</span>
                </label>
              ))}
            </div>
          ))}

          {/* PRICE */}
          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Price Range</h4>
              <FiChevronDown />
            </div>

            <div className="price-slider">
              <div className="price-track"></div>
              <span className="price-dot left"></span>
              <span className="price-dot right"></span>
            </div>

            <div className="price-values">
              <span>₹0</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* SIZE */}
          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Size</h4>
              <FiChevronDown />
            </div>

            <div className="size-filter">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button key={size} type="button">
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Color</h4>
              <FiChevronDown />
            </div>

            <div className="color-filter">
              <button className="color pink"></button>
              <button className="color red"></button>
              <button className="color cream"></button>
              <button className="color yellow"></button>
              <button className="color green"></button>
              <button className="color blue"></button>
              <button className="color brown"></button>
              <button className="color black"></button>
              <button className="color white"></button>
              <button className="color purple"></button>
            </div>
          </div>

          {/* BRAND */}
          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Brand</h4>
              <FiChevronDown />
            </div>

            <input
              className="brand-search"
              type="text"
              placeholder="Search brand..."
            />

            {[
              "Shree Balaji (120)",
              "Biba (86)",
              "Libas (54)",
              "W (42)",
              "Aurelia (36)",
              "Manyavar (28)",
            ].map((brand) => (
              <label className="filter-checkbox" key={brand}>
                <input type="checkbox" />
                <span className="custom-checkbox"></span>
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* PRODUCT LISTING */}
        <main className="category-listing">

          <div className="mobile-filter-row">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiSliders />
              Filters
            </button>

            <span>{products.length} Products</span>
          </div>

          <div className="listing-toolbar">

            <div className="listing-count">
              Showing <strong>1–24</strong> of{" "}
              <strong>{totalProducts}</strong> products
            </div>

            <div className="listing-actions">

              <label className="sort-label">
                Sort By:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </label>

              <button className="view-button active">
                <FiGrid />
              </button>

              <button className="view-button">
                <FiList />
              </button>

            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="category-product-grid">
            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1', color: '#666', width: '100%' }}>
                <FiShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <h3>No Products Found</h3>
                <p>No products have been added to this category yet.</p>
              </div>
            )}
            {products.map((product) => (
              <article
                className="category-product-card"
                key={product._id || product.id}
                onClick={() => { const slug = product.slug || (product.name ? product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : (product._id || product.id)); navigate('/product/' + slug); }}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-product-image">

                  <img
                    src={product.images?.[0] || product.image || '/assets/mencategory1.png'} onError={(e) => { e.target.src = '/assets/mencategory1.png'; }}
                    alt={product.name}
                    loading="lazy"
                  />

                  <span
                    className={`product-badge ${
                      product.badge === "New" ? "new" : ""
                    }`}
                  >
                    {product.badge}
                  </span>

                  <button
                    className="product-heart"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiHeart />
                  </button>
                </div>

                <div className="category-product-info">
                  <h3>{product.name}</h3>

                  <p>{product.category}</p>

                  <div className="product-rating">
                    <span>★★★★★</span>
                    <small>
                      {product.rating} ({product.reviews})
                    </small>
                  </div>

                  <div className="product-price">
                    <strong>
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </strong>

                    {Number(product.originalPrice || product.mrp || 0) > Number(product.price || 0) && (
                      <del>
                        ₹{Number(product.originalPrice || product.mrp).toLocaleString("en-IN")}
                      </del>
                    )}
                  </div>

                  <div className="product-card-actions">
                    <button
                      className="category-add-cart"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <FiShoppingBag />
                      Add to Cart
                    </button>
                    <button
                      className="category-buy-now"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                        navigate('/checkout');
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="category-pagination">

            <button type="button">
              <FiChevronLeft />
            </button>

            {[1, 2, 3, 4, 5].map((number) => (
              <button
                type="button"
                key={number}
                className={page === number ? "active" : ""}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}

            <span>...</span>

            <button type="button">18</button>

            <button type="button">
              <FiChevronRight />
            </button>

          </div>
        </main>
      </section>

      {/* ================= FIRST ORDER BANNER ================= */}
      {/* <section className="category-newsletter">

        <div className="newsletter-image">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85"
            alt=""
          />
        </div>

        <div className="newsletter-content">
          <h2>
            GET <strong>10% OFF</strong>
            <br />
            YOUR FIRST ORDER
          </h2>

          <p>
            Sign up for new arrivals, exclusive offers and fashion
            inspiration.
          </p>
        </div>

        <form
          className="newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button type="submit">
            SUBSCRIBE
          </button>
        </form>
      </section> */}

      {/* ================= BENEFITS ================= */}
      {/* <section className="category-benefits">
        <div className="category-benefits-container">
          {benefits.map(([Icon, titleText, text]) => (
            <div className="category-benefit" key={titleText}>
              <span className="benefit-icon">
                <Icon />
              </span>

              <div>
                <strong>{titleText}</strong>
                <small>{text}</small>
              </div>
            </div>
          ))}
        </div>
      </section> */}

    </div>
  );
}
