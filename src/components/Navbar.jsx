import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FiHeart,
    FiUser,
    FiShoppingBag,
    FiSearch,
    FiMenu,
    FiX,
    FiTruck,
    FiRefreshCw,
    FiShield
} from 'react-icons/fi';
import './Navbar.css';

export const categories = [
    // ['Home', '/'],
    ['Men', '/men'],
    ['Women', '/women'],
    ['Boys', '/boys'],
    ['Girls', '/girls'],
    ['Ethnic Wear', '/ethnic-wear'],
    ['Footwear', '/footwear'],
    ['Accessories', '/accessories'],
    ['Sale', '/sale']
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [dbCategories, setDbCategories] = useState([]);
    const [dbProducts, setDbProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = React.useRef(null);
    const mobileSearchRef = React.useRef(null);

    React.useEffect(() => {
        import('../lib/api').then(({ default: api }) => {
            api.get('/categories').then(res => {
                if (res.success && res.categories.length > 0) {
                    setDbCategories(res.categories);
                }
            });
            api.get('/products').then(res => {
                if (res.success && Array.isArray(res.products)) {
                    setDbProducts(res.products);
                }
            });
        });
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = dbCategories.length > 0
        ? dbCategories.map(c => [c.name, c.path || ('/' + c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))])
        : categories;
    const location = useLocation();
    const navigate = useNavigate();

    const cart = JSON.parse(localStorage.getItem('sbv-cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('sbv-wishlist') || '[]');

    const searchResults = searchQuery.trim().length > 0
        ? dbProducts.filter(p => {
            const q = searchQuery.toLowerCase().trim();
            const name = (p.name || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            const sub = (p.subcategory || '').toLowerCase();
            return name.includes(q) || cat.includes(q) || sub.includes(q);
        }).slice(0, 8)
        : [];

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            setIsSearchOpen(false);
            setOpen(false);
            navigate(`/shop?search=${encodeURIComponent(q)}`);
        }
    };

    return (
        <>
            <div className="top-strip">
                <span>
                    <FiTruck /> Free Shipping on Orders Above ₹999
                </span>

                <span>
                    <FiRefreshCw /> Easy 7 Days Returns
                </span>

                <span>
                    ◉ COD Available
                </span>

                <span>
                    <FiShield /> 100% Secure Payments
                </span>

                <span className="top-right">
                    Track Order &nbsp; • &nbsp; Help & Support
                </span>
            </div>

            <header className="site-header">
                <div className="header-main container">

                    <button
                        className="mobile-menu"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <FiX /> : <FiMenu />}
                    </button>

                    {/* LOGO */}
                    <div
                        className="brand"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="/assets/logo.png"
                            alt="SBV Vastralaya"
                            className="brand-logo"
                        />
                    </div>

                    {/* SEARCH */}
                    <div className="search-box" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                placeholder="Search for products, categories, styles..."
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="search-clear-btn"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setIsSearchOpen(false);
                                    }}
                                    title="Clear"
                                >
                                    <FiX />
                                </button>
                            )}
                            <button type="submit" className="search-btn" title="Search">
                                <FiSearch />
                            </button>
                        </form>

                        {/* LIVE SEARCH DROPDOWN */}
                        {isSearchOpen && searchQuery.trim().length > 0 && (
                            <div className="search-dropdown">
                                {searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map((p) => {
                                            const pSlug = p.slug || (p.name ? p.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : (p._id || p.id));
                                            const pImg = p.images?.[0] || p.image || '/assets/mencategory1.png';
                                            const pPrice = Math.round(Number(p.price) || 0);
                                            const pMrp = Math.round(Number(p.originalPrice || p.mrp) || 0);

                                            return (
                                                <div
                                                    key={p._id || p.id}
                                                    className="search-result-item"
                                                    onClick={() => {
                                                        navigate(`/product/${pSlug}`);
                                                        setSearchQuery('');
                                                        setIsSearchOpen(false);
                                                    }}
                                                >
                                                    <img
                                                        src={pImg}
                                                        alt={p.name}
                                                        onError={(e) => { e.target.src = '/assets/mencategory1.png'; }}
                                                    />
                                                    <div className="search-item-info">
                                                        <h4>{p.name}</h4>
                                                        <small>{p.category} {p.subcategory ? `• ${p.subcategory}` : ''}</small>
                                                    </div>
                                                    <div className="search-item-price">
                                                        <span>₹{pPrice.toLocaleString('en-IN')}</span>
                                                        {pMrp > pPrice && <del>₹{pMrp.toLocaleString('en-IN')}</del>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div
                                            className="search-view-all"
                                            onClick={() => handleSearchSubmit()}
                                        >
                                            View all results for "{searchQuery}" →
                                        </div>
                                    </>
                                ) : (
                                    <div className="search-no-results">
                                        No products found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* HEADER ACTIONS */}
                    <div className="header-actions">

                        <button onClick={() => navigate('/wishlist')}>
                            <FiHeart />
                            <small>Wishlist</small>
                            <b>{wishlist.length}</b>
                        </button>

                        <button onClick={() => {
                            if (localStorage.getItem('userToken')) {
                                navigate('/dashboard');
                            } else {
                                navigate('/login');
                            }
                        }}>
                            <FiUser />
                            <small>Account</small>
                        </button>

                        <button onClick={() => navigate('/cart')}>
                            <FiShoppingBag />
                            <small>Cart</small>
                            <b>{cart.length}</b>
                        </button>

                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className={open ? 'main-nav open' : 'main-nav'}>
                    <div className="container nav-inner">

                        {navLinks.map(([n, p]) => (
                            <button
                                key={p}
                                className={
                                    location.pathname === p
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => {
                                    navigate(p);
                                    setOpen(false);
                                }}
                            >
                                {n}
                                {!['Sale'].includes(n)}
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                navigate('/new-arrivals');
                                setOpen(false);
                            }}
                        >
                            NEW ARRIVALS
                        </button>

                        {/* <button
                            onClick={() => {
                                navigate('/sale');
                                setOpen(false);
                            }}
                        >
                            SALE
                        </button> */}

                    </div>
                </nav>
            </header>
        </>
    );
}