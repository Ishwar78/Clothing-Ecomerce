import React from 'react';
import {
    FiShield,
    FiTruck,
    FiRefreshCw,
    FiHeart,
    FiFacebook,
    FiInstagram,
    FiYoutube,
    FiPhone,
    FiMail,
    FiMapPin,
    FiArrowUpRight,
    FiChevronRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const shopLinks = [
        { label: 'Men', path: '/men' },
        { label: 'Women', path: '/women' },
        { label: 'Boys', path: '/boys' },
        { label: 'Girls', path: '/girls' },
        // { label: 'Ethnic Wear', path: '/ethnic-wear' },
        // { label: 'Footwear', path: '/footwear' },
        // { label: 'Accessories', path: '/accessories' },
        { label: 'Sale', path: '/sale' }
    ];

    const helpLinks = [
        { label: 'Contact Us', path: '/contact-us' },
        { label: 'Shipping Policy', path: '/shipping-policy' },
        { label: 'Returns & Refunds', path: '/return-&-refund' },
        { label: 'FAQs', path: '/faq' },
        // { label: 'Track Order', path: '/support' },
        // { label: 'Size Guide', path: '/support' }
    ];

    const aboutLinks = [
        { label: 'Our Story', path: '/about-us' },
        { label: 'Blog', path: '/blog' },
        // { label: 'Careers', path: '/about' },
        { label: 'Terms & Conditions', path: '/term-&-condition' },
        { label: 'Privacy Policy', path: '/privacy-policy' },
        // { label: 'Sitemap', path: '/about' }
    ];

    const benefits = [
        {
            icon: <FiShield />,
            title: 'Premium Quality',
            text: 'Best fabrics & designs'
        },
        {
            icon: <FiTruck />,
            title: 'Affordable Prices',
            text: 'Style for every budget'
        },
        {
            icon: <FiRefreshCw />,
            title: 'Easy Returns',
            text: '7 days hassle free'
        },
        {
            icon: <FiShield />,
            title: 'Secure Shopping',
            text: '100% safe & secure'
        },
        {
            icon: <FiHeart />,
            title: 'Happy Customers',
            text: 'Thousands trust us'
        }
    ];

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="site-footer">

            {/* ================= BENEFITS ================= */}
            <section className="footer-benefits-wrap">
                <div className="footer-benefits container">
                    {benefits.map((item, index) => (
                        <div className="footer-benefit" key={index}>

                            <div className="footer-benefit-icon">
                                {item.icon}
                            </div>

                            <div className="footer-benefit-content">
                                <strong>{item.title}</strong>
                                <small>{item.text}</small>
                            </div>

                        </div>
                    ))}
                </div>
            </section>

            {/* ================= MAIN FOOTER ================= */}
            <section className="footer-main-wrap">
                <div className="footer-main container">

                    {/* BRAND */}
                    <div className="footer-brand-column">

                        <Link to="/" className="footer-brand-logo">
                            <img
                                src="/assets/logo.png"
                                alt="SBV Vastralaya"
                                className="footer-logo-image"
                            />
                        </Link>

                        <p className="footer-brand-description">
                            Discover timeless fashion, elegant ethnic wear
                            and everyday styles curated for the modern wardrobe.
                        </p>

                        <div className="footer-social">

                            <a href="#" aria-label="Facebook">
                                <FiFacebook />
                            </a>

                            <a href="#" aria-label="Instagram">
                                <FiInstagram />
                            </a>

                            <a href="#" aria-label="Youtube">
                                <FiYoutube />
                            </a>

                        </div>

                    </div>

                    {/* SHOP */}
                    <div className="footer-column">
                        <h4>SHOP</h4>

                        <div className="footer-links">
                            {shopLinks.map((item) => (
                                <Link key={item.label} to={item.path}>
                                    <FiChevronRight />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* HELP */}
                    <div className="footer-column">
                        <h4>HELP & SUPPORT</h4>

                        <div className="footer-links">
                            {helpLinks.map((item) => (
                                <Link key={item.label} to={item.path}>
                                    <FiChevronRight />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ABOUT */}
                    <div className="footer-column">
                        <h4>ABOUT SBV</h4>

                        <div className="footer-links">
                            {aboutLinks.map((item) => (
                                <Link key={item.label} to={item.path}>
                                    <FiChevronRight />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div className="footer-column footer-contact-column">
                        <h4>GET IN TOUCH</h4>

                        <div className="footer-contact-list">

                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">
                                    <FiPhone />
                                </span>

                                <div>
                                    <small>Customer Care</small>

                                    <a href="tel:+919876543210">
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>

                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">
                                    <FiMail />
                                </span>

                                <div>
                                    <small>Email</small>

                                    <a href="mailto:hello@sbvstore.in">
                                        hello@sbvstore.in
                                    </a>
                                </div>
                            </div>

                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">
                                    <FiMapPin />
                                </span>

                                <div>
                                    <small>Store Location</small>

                                    <span>
                                        Rohtak, Haryana
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* ================= BOTTOM ================= */}
            <section className="footer-bottom-wrap">
                <div className="footer-bottom container">

                    <p>
                        © 2026 <strong>SS Vastralaya</strong>.
                        All Rights Reserved.
                    </p>

                    <div className="footer-bottom-links">
                        <Link to="/privacy-policy">
                            Privacy
                        </Link>

                        <span>•</span>

                        <Link to="/term-&-condition">
                            Terms
                        </Link>

                        <span>•</span>

                        <Link to="/support">
                            Support
                        </Link>
                    </div>

                    {/* 
                    <button
                        className="footer-top-btn"
                        onClick={scrollTop}
                        aria-label="Back to top"
                    >
                        <FiArrowUpRight />
                    </button>
                    */}

                </div>
            </section>

        </footer>
    );
}