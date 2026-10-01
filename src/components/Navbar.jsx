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

    React.useEffect(() => {
        import('../lib/api').then(({ default: api }) => {
            api.get('/categories').then(res => {
                if (res.success && res.categories.length > 0) {
                    setDbCategories(res.categories);
                }
            });
        });
    }, []);

    const navLinks = dbCategories.length > 0
        ? dbCategories.map(c => [c.name, c.path || ('/' + c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))])
        : categories;
    const location = useLocation();
    const navigate = useNavigate();

    const cart = JSON.parse(localStorage.getItem('sbv-cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('sbv-wishlist') || '[]');

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
                    <div className="search-box">
                        <input
                            placeholder="Search for products, categories, brands..."
                        />
                        <FiSearch />
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

                        <button
                            onClick={() => {
                                navigate('/sale');
                                setOpen(false);
                            }}
                        >
                            SALE
                        </button>

                    </div>
                </nav>
            </header>
        </>
    );
}