import React from 'react';
import {
    FiShield,
    FiLock,
    FiUser,
    FiCreditCard,
    FiMail,
    FiGlobe,
    FiCheckCircle
} from 'react-icons/fi';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
    return (
        <div className="privacy-page">

            {/* Hero */}
            <section className="privacy-hero">
                <div className="privacy-hero-inner">
                    <span className="privacy-pill">
                        <FiShield />
                        YOUR PRIVACY MATTERS
                    </span>

                    <h1>Privacy Policy</h1>

                    <p>
                        Your trust matters to us. Learn how Joyfulmarts
                        collects, uses and protects your personal information.
                    </p>

                    <div className="privacy-updated">
                        Last Updated: September 2026
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="privacy-container">

                {/* Intro */}
                <section className="privacy-card privacy-intro">
                    <div className="privacy-icon">
                        <FiLock />
                    </div>

                    <div>
                        <h2>Your Privacy Is Important To Us</h2>

                        <p>
                            At <strong>Joyfulmarts</strong>, we respect your
                            privacy and are committed to protecting your
                            personal information. This Privacy Policy explains
                            how we collect, use, store and protect information
                            when you visit or use our website.
                        </p>

                        <p>
                            By using our website, you agree to the practices
                            described in this Privacy Policy.
                        </p>
                    </div>
                </section>

                {/* Information */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiUser /></span>
                        <div>
                            <small>01</small>
                            <h2>Information We Collect</h2>
                        </div>
                    </div>

                    <p>
                        We may collect information that you provide directly
                        when you create an account, place an order, contact us,
                        or use our services.
                    </p>

                    <ul className="privacy-list">
                        <li>
                            <FiCheckCircle />
                            <span><strong>Personal Information:</strong> Name,
                                email address, phone number and delivery
                                address.</span>
                        </li>

                        <li>
                            <FiCheckCircle />
                            <span><strong>Account Information:</strong> Login
                                and account details provided by you.</span>
                        </li>

                        <li>
                            <FiCheckCircle />
                            <span><strong>Order Information:</strong> Products,
                                orders, billing and delivery details.</span>
                        </li>

                        <li>
                            <FiCheckCircle />
                            <span><strong>Communication:</strong> Information
                                you provide when contacting our support team.</span>
                        </li>
                    </ul>
                </section>

                {/* Usage */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiGlobe /></span>
                        <div>
                            <small>02</small>
                            <h2>How We Use Your Information</h2>
                        </div>
                    </div>

                    <p>
                        Information collected through our website may be used
                        for the following purposes:
                    </p>

                    <ul className="privacy-list">
                        <li>
                            <FiCheckCircle />
                            <span>To process and deliver your orders.</span>
                        </li>

                        <li>
                            <FiCheckCircle />
                            <span>To provide customer support and respond to
                                your enquiries.</span>
                        </li>

                        <li>
                            <FiCheckCircle />
                            <span>To manage your account and preferences.</span>
                        </li>

                        <li>
                            <FiCheckCircle />
                            <span>To improve our website, products and
                                shopping experience.</span>
                        </li>

                        <li>
                            <FiCheckCircle />
                            <span>To prevent fraudulent or unauthorized
                                activities.</span>
                        </li>
                    </ul>
                </section>

                {/* Payments */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiCreditCard /></span>
                        <div>
                            <small>03</small>
                            <h2>Payment Information</h2>
                        </div>
                    </div>

                    <p>
                        Payments made through our website may be processed by
                        trusted third-party payment providers. Payment details
                        such as card or banking information are handled by the
                        respective payment service provider according to their
                        security and privacy practices.
                    </p>

                    <div className="privacy-highlight">
                        <FiShield />
                        <span>
                            We do not intentionally store complete card,
                            banking or other sensitive payment credentials on
                            our website.
                        </span>
                    </div>
                </section>

                {/* Cookies */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiGlobe /></span>
                        <div>
                            <small>04</small>
                            <h2>Cookies & Website Technologies</h2>
                        </div>
                    </div>

                    <p>
                        Our website may use cookies and similar technologies
                        to remember preferences, understand website usage and
                        improve your overall shopping experience.
                    </p>

                    <p>
                        You can control or disable cookies through your
                        browser settings. Disabling certain cookies may affect
                        some website functionality.
                    </p>
                </section>

                {/* Data Protection */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiShield /></span>
                        <div>
                            <small>05</small>
                            <h2>Data Protection</h2>
                        </div>
                    </div>

                    <p>
                        We take reasonable measures to protect your personal
                        information against unauthorized access, alteration,
                        disclosure or destruction.
                    </p>

                    <p>
                        However, no method of transmission over the internet
                        or electronic storage can be guaranteed to be
                        completely secure.
                    </p>
                </section>

                {/* Third Party */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiGlobe /></span>
                        <div>
                            <small>06</small>
                            <h2>Third-Party Services</h2>
                        </div>
                    </div>

                    <p>
                        We may work with trusted third-party service providers
                        for payment processing, shipping, analytics, website
                        hosting and other services required to operate our
                        business.
                    </p>

                    <p>
                        These third parties may have access to information
                        only to the extent necessary to perform their
                        services and are expected to handle it responsibly.
                    </p>
                </section>

                {/* User Rights */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiUser /></span>
                        <div>
                            <small>07</small>
                            <h2>Your Choices & Rights</h2>
                        </div>
                    </div>

                    <p>
                        Depending on applicable law, you may have rights
                        regarding your personal information, including the
                        ability to request access, correction or deletion of
                        certain information.
                    </p>

                    <p>
                        You may also contact us if you have questions about
                        how your information is being used.
                    </p>
                </section>

                {/* Children's Privacy */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiUser /></span>
                        <div>
                            <small>08</small>
                            <h2>Children's Privacy</h2>
                        </div>
                    </div>

                    <p>
                        Our website is not intentionally designed to collect
                        personal information from children. If you believe
                        that a child has provided personal information through
                        our website, please contact us so that appropriate
                        action can be taken.
                    </p>
                </section>

                {/* Policy Updates */}
                <section className="privacy-card">
                    <div className="privacy-section-heading">
                        <span><FiCheckCircle /></span>
                        <div>
                            <small>09</small>
                            <h2>Changes To This Policy</h2>
                        </div>
                    </div>

                    <p>
                        We may update this Privacy Policy from time to time
                        to reflect changes in our services, practices or
                        applicable requirements.
                    </p>

                    <p>
                        Any updated version will be posted on this page with
                        the revised update date.
                    </p>
                </section>

                {/* Contact */}
                <section className="privacy-contact">
                    <div className="privacy-contact-icon">
                        <FiMail />
                    </div>

                    <div>
                        <span>HAVE QUESTIONS?</span>
                        <h2>We're Here To Help</h2>
                        <p>
                            If you have any questions about this Privacy
                            Policy or how we handle your information, feel
                            free to contact us.
                        </p>

                        <div className="privacy-contact-details">
                            <a href="mailto:hello@Joyfulmartsstore.in">
                                <FiMail />
                                hello@Joyfulmartsstore.in
                            </a>

                            <a href="tel:+919876543210">
                                <FiUser />
                                +91 98765 43210
                            </a>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}