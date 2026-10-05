import React from "react";
import { FiFileText, FiShield, FiShoppingBag, FiCreditCard, FiTruck, FiRefreshCw } from "react-icons/fi";
import "./TermsConditions.css";

export default function TermsConditions() {
    return (
        <div className="terms-page">

            {/* Hero */}
            <section className="terms-hero">
                <div className="terms-hero-inner">
                    <span className="terms-pill">
                        <FiFileText />
                        LEGAL INFORMATION
                    </span>

                    <h1>Terms & Conditions</h1>

                    <p>
                        Please read these terms carefully before using Joyfulmarts Vastralaya
                        or placing an order with us.
                    </p>

                    <span className="terms-updated">
                        Last Updated: September 2026
                    </span>
                </div>
            </section>

            {/* Main Content */}
            <section className="terms-content container">

                {/* Intro */}
                <div className="terms-intro">
                    <div className="terms-intro-icon">
                        <FiShield />
                    </div>

                    <div>
                        <h2>Welcome to Joyfulmarts Vastralaya</h2>
                        <p>
                            By accessing or using this website, you agree to comply
                            with the terms and conditions mentioned below. These
                            terms are designed to ensure a safe, transparent and
                            reliable shopping experience for all our customers.
                        </p>
                    </div>
                </div>

                {/* Quick Cards */}
                <div className="terms-highlights">

                    <div className="terms-highlight-card">
                        <span><FiShoppingBag /></span>
                        <h3>Shopping</h3>
                        <p>
                            Clear and fair terms for browsing and purchasing products.
                        </p>
                    </div>

                    <div className="terms-highlight-card">
                        <span><FiCreditCard /></span>
                        <h3>Payments</h3>
                        <p>
                            Secure payment processing and accurate order information.
                        </p>
                    </div>

                    <div className="terms-highlight-card">
                        <span><FiTruck /></span>
                        <h3>Delivery</h3>
                        <p>
                            Delivery timelines may vary depending on location.
                        </p>
                    </div>

                    <div className="terms-highlight-card">
                        <span><FiRefreshCw /></span>
                        <h3>Returns</h3>
                        <p>
                            Returns and exchanges are subject to our applicable policy.
                        </p>
                    </div>

                </div>

                {/* Sections */}
                <div className="terms-sections">

                    <article className="terms-section">
                        <div className="terms-number">01</div>
                        <div>
                            <h2>Acceptance of Terms</h2>
                            <p>
                                By visiting and using the Joyfulmarts Vastralaya website,
                                you acknowledge that you have read, understood and
                                agreed to these Terms & Conditions.
                            </p>
                            <p>
                                If you do not agree with any part of these terms,
                                please discontinue using the website.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">02</div>
                        <div>
                            <h2>Products & Information</h2>
                            <p>
                                We make reasonable efforts to display product
                                descriptions, images, colours, sizes and prices
                                as accurately as possible.
                            </p>
                            <p>
                                However, slight variations may occur due to
                                screen settings, lighting, photography or
                                product availability.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">03</div>
                        <div>
                            <h2>Pricing & Payments</h2>
                            <p>
                                Product prices displayed on the website are subject
                                to change without prior notice.
                            </p>
                            <p>
                                Customers are responsible for providing accurate
                                billing and payment information while placing an order.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">04</div>
                        <div>
                            <h2>Orders & Confirmation</h2>
                            <p>
                                Once an order is placed, you may receive an order
                                confirmation through the contact information
                                provided during checkout.
                            </p>
                            <p>
                                We reserve the right to cancel or decline an order
                                in situations such as incorrect pricing, unavailable
                                inventory or suspected fraudulent activity.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">05</div>
                        <div>
                            <h2>Shipping & Delivery</h2>
                            <p>
                                Delivery times may vary depending on your location,
                                product availability, courier service and other
                                circumstances beyond our direct control.
                            </p>
                            <p>
                                Customers are requested to provide a complete and
                                accurate shipping address and contact information.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">06</div>
                        <div>
                            <h2>Returns & Exchanges</h2>
                            <p>
                                Returns and exchanges are governed by the return
                                policy applicable to the purchased product.
                            </p>
                            <p>
                                Products may need to meet specific condition,
                                packaging and eligibility requirements before
                                a return or exchange can be processed.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">07</div>
                        <div>
                            <h2>User Responsibilities</h2>
                            <p>
                                Users agree to provide correct information and
                                use the website only for lawful purposes.
                            </p>
                            <p>
                                Any attempt to misuse the website, interfere with
                                its operation or use it for fraudulent activities
                                is prohibited.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">08</div>
                        <div>
                            <h2>Intellectual Property</h2>
                            <p>
                                Website content including logos, graphics, images,
                                text, designs and other materials may belong to
                                Joyfulmarts Vastralaya or its respective owners.
                            </p>
                            <p>
                                Such content should not be copied, reproduced or
                                distributed without appropriate permission.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">09</div>
                        <div>
                            <h2>Privacy</h2>
                            <p>
                                Your use of the website may involve the collection
                                and processing of information required to provide
                                our services, process orders and communicate with you.
                            </p>
                            <p>
                                Please refer to our Privacy Policy for more details.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">10</div>
                        <div>
                            <h2>Changes to These Terms</h2>
                            <p>
                                Joyfulmarts Vastralaya may update these Terms & Conditions
                                from time to time. Updated terms will be published
                                on this page.
                            </p>
                            <p>
                                Continued use of the website after changes are
                                published indicates acceptance of the updated terms.
                            </p>
                        </div>
                    </article>

                    <article className="terms-section">
                        <div className="terms-number">11</div>
                        <div>
                            <h2>Contact Us</h2>
                            <p>
                                If you have any questions regarding these Terms &
                                Conditions, you can contact our support team.
                            </p>

                            <div className="terms-contact">
                                <div>
                                    <strong>Email</strong>
                                    <span>hello@Joyfulmartsstore.in</span>
                                </div>

                                <div>
                                    <strong>Phone</strong>
                                    <span>+91 98765 43210</span>
                                </div>

                                <div>
                                    <strong>Location</strong>
                                    <span>Rohtak, Haryana</span>
                                </div>
                            </div>
                        </div>
                    </article>

                </div>

                {/* Bottom Note */}
                <div className="terms-note">
                    <FiShield />
                    <div>
                        <strong>Thank you for shopping with Joyfulmarts Vastralaya.</strong>
                        <p>
                            We appreciate your trust and aim to provide you with
                            a smooth, transparent and enjoyable shopping experience.
                        </p>
                    </div>
                </div>

            </section>
        </div>
    );
}