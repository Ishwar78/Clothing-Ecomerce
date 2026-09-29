import React from 'react';
import {
    FiRefreshCw,
    FiCheckCircle,
    FiXCircle,
    FiPackage,
    FiClock,
    FiCreditCard,
    FiAlertCircle,
    FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ReturnRefund.css';

export default function ReturnRefund() {
    const navigate = useNavigate();

    return (
        <div className="return-page">

            {/* HERO */}
            <section className="return-hero">
                <div className="return-hero-content">
                    <span className="return-eyebrow">
                        SS VASTRALAYA
                    </span>

                    <h1>Returns & Refunds</h1>

                    <p>
                        We want you to love every purchase. If something isn't
                        right, here's everything you need to know about our
                        return and refund process.
                    </p>

                    <button
                        className="return-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                        Back
                    </button>
                </div>

                <div className="return-hero-icon">
                    <FiRefreshCw />
                </div>
            </section>

            {/* QUICK INFO */}
            <section className="return-container">
                <div className="return-info-grid">

                    <div className="return-info-card">
                        <div className="return-icon">
                            <FiClock />
                        </div>
                        <div>
                            <h3>7 Days</h3>
                            <p>Return window from delivery</p>
                        </div>
                    </div>

                    <div className="return-info-card">
                        <div className="return-icon">
                            <FiPackage />
                        </div>
                        <div>
                            <h3>Easy Returns</h3>
                            <p>Simple return request process</p>
                        </div>
                    </div>

                    <div className="return-info-card">
                        <div className="return-icon">
                            <FiCreditCard />
                        </div>
                        <div>
                            <h3>Secure Refunds</h3>
                            <p>Refunds processed safely</p>
                        </div>
                    </div>

                </div>

                {/* CONTENT */}
                <div className="return-content">

                    <div className="return-main">

                        <section className="return-section">
                            <span className="section-number">01</span>

                            <div>
                                <h2>Our Return Policy</h2>

                                <p>
                                    We accept eligible returns within
                                    <strong> 7 days </strong>
                                    from the date your order is delivered.
                                    Products must be unused, unworn and in
                                    their original condition.
                                </p>

                                <p>
                                    All original tags, packaging and
                                    accessories should be retained for the
                                    return to be accepted.
                                </p>
                            </div>
                        </section>

                        <section className="return-section">
                            <span className="section-number">02</span>

                            <div>
                                <h2>Eligible Products</h2>

                                <ul className="return-list">
                                    <li>
                                        <FiCheckCircle />
                                        Product must be unused and unworn.
                                    </li>

                                    <li>
                                        <FiCheckCircle />
                                        Original tags must be attached.
                                    </li>

                                    <li>
                                        <FiCheckCircle />
                                        Original packaging should be intact.
                                    </li>

                                    <li>
                                        <FiCheckCircle />
                                        Product should not show signs of
                                        washing or damage.
                                    </li>

                                    <li>
                                        <FiCheckCircle />
                                        Return request must be raised within
                                        the eligible return period.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="return-section">
                            <span className="section-number">03</span>

                            <div>
                                <h2>Non-Returnable Items</h2>

                                <ul className="return-list return-list-danger">
                                    <li>
                                        <FiXCircle />
                                        Products that have been used, washed
                                        or damaged.
                                    </li>

                                    <li>
                                        <FiXCircle />
                                        Products without original tags.
                                    </li>

                                    <li>
                                        <FiXCircle />
                                        Items damaged after delivery due to
                                        improper handling.
                                    </li>

                                    <li>
                                        <FiXCircle />
                                        Products returned after the eligible
                                        return period.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="return-section">
                            <span className="section-number">04</span>

                            <div>
                                <h2>How To Request A Return</h2>

                                <div className="return-steps">

                                    <div className="return-step">
                                        <span>1</span>
                                        <div>
                                            <h4>Contact Us</h4>
                                            <p>
                                                Contact our support team with
                                                your order details.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="return-step">
                                        <span>2</span>
                                        <div>
                                            <h4>Share Order Details</h4>
                                            <p>
                                                Provide your order number and
                                                reason for the return.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="return-step">
                                        <span>3</span>
                                        <div>
                                            <h4>Verification</h4>
                                            <p>
                                                Our team will review your
                                                return request.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="return-step">
                                        <span>4</span>
                                        <div>
                                            <h4>Pickup & Processing</h4>
                                            <p>
                                                Once approved, the product
                                                will be collected and
                                                processed.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>

                        <section className="return-section">
                            <span className="section-number">05</span>

                            <div>
                                <h2>Refund Process</h2>

                                <p>
                                    Once your returned product is received and
                                    inspected, we will process the refund for
                                    eligible orders.
                                </p>

                                <div className="refund-box">
                                    <FiCreditCard />

                                    <div>
                                        <h3>Refund Processing</h3>
                                        <p>
                                            Approved refunds will be processed
                                            to the original payment method,
                                            subject to the applicable payment
                                            provider's processing time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="return-section">
                            <span className="section-number">06</span>

                            <div>
                                <h2>Exchange Policy</h2>

                                <p>
                                    If you have received an incorrect size or
                                    need a different size, please contact our
                                    support team within the applicable return
                                    period.
                                </p>

                                <p>
                                    Exchange availability depends on product
                                    availability and eligibility.
                                </p>
                            </div>
                        </section>

                        <section className="return-section">
                            <span className="section-number">07</span>

                            <div>
                                <h2>Damaged Or Incorrect Product</h2>

                                <p>
                                    If your order arrives damaged, defective
                                    or different from what you ordered, please
                                    contact us as soon as possible.
                                </p>

                                <div className="alert-box">
                                    <FiAlertCircle />

                                    <p>
                                        Please keep the product, packaging and
                                        tags safely available until your
                                        return request has been reviewed.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* SIDEBAR */}
                    <aside className="return-sidebar">

                        <div className="return-sidebar-card">
                            <div className="sidebar-icon">
                                <FiRefreshCw />
                            </div>

                            <h3>Need Help?</h3>

                            <p>
                                Our support team is here to help you with
                                returns, exchanges and refunds.
                            </p>

                            <a href="/contact-us">
                                Contact Support
                            </a>
                        </div>

                        <div className="return-sidebar-card light">
                            <h3>Return Checklist</h3>

                            <ul>
                                <li>
                                    <FiCheckCircle />
                                    Product unused
                                </li>

                                <li>
                                    <FiCheckCircle />
                                    Tags attached
                                </li>

                                <li>
                                    <FiCheckCircle />
                                    Original packaging
                                </li>

                                <li>
                                    <FiCheckCircle />
                                    Order details available
                                </li>
                            </ul>
                        </div>

                    </aside>

                </div>

                {/* FAQ */}
                <section className="return-faq">

                    <div className="faq-heading">
                        <span>FAQ</span>
                        <h2>Frequently Asked Questions</h2>
                        <p>
                            Quick answers to common return and refund questions.
                        </p>
                    </div>

                    <div className="faq-grid">

                        <details>
                            <summary>
                                How many days do I have to return an order?
                            </summary>

                            <p>
                                Eligible products can be requested for return
                                within 7 days from the date of delivery.
                            </p>
                        </details>

                        <details>
                            <summary>
                                Can I return a used product?
                            </summary>

                            <p>
                                Returns are generally accepted only when the
                                product is unused, unworn and in its original
                                condition with tags and packaging.
                            </p>
                        </details>

                        <details>
                            <summary>
                                When will I receive my refund?
                            </summary>

                            <p>
                                After the returned product is received and
                                approved, the refund is processed to the
                                original payment method. Processing time can
                                vary by payment provider.
                            </p>
                        </details>

                        <details>
                            <summary>
                                What if I receive a wrong product?
                            </summary>

                            <p>
                                Please contact our support team with your order
                                details so that the issue can be reviewed and
                                resolved.
                            </p>
                        </details>

                    </div>

                </section>

                {/* CONTACT CTA */}
                <section className="return-cta">

                    <div>
                        <span>NEED ASSISTANCE?</span>

                        <h2>
                            We're here to make your shopping experience easy.
                        </h2>

                        <p>
                            Have a question about a return, exchange or refund?
                            Our team is ready to help.
                        </p>
                    </div>

                    <a href="/contact-us">
                        Contact Us
                    </a>

                </section>

            </section>
        </div>
    );
}