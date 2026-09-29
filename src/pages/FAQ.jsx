import React, { useMemo, useState } from 'react';
import {
    FiSearch,
    FiPlus,
    FiMinus,
    FiShoppingBag,
    FiTruck,
    FiRefreshCw,
    FiCreditCard,
    FiUser,
    FiMessageCircle,
    FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './FAQ.css';

const FAQ_DATA = [
    {
        category: 'Orders',
        icon: FiShoppingBag,
        question: 'How can I place an order?',
        answer:
            'Browse the products you like, select the required size or variant, add the product to your cart and proceed to checkout. Enter your delivery details and complete the payment to place your order.'
    },
    {
        category: 'Orders',
        icon: FiShoppingBag,
        question: 'Can I cancel my order after placing it?',
        answer:
            'Order cancellation depends on the current processing status of your order. If the order has not been processed or shipped, please contact our support team as soon as possible.'
    },
    {
        category: 'Orders',
        icon: FiShoppingBag,
        question: 'Where can I check my order status?',
        answer:
            'You can check your order status from your account dashboard. Once your order is shipped, tracking information may also be available through the shipping details provided for your order.'
    },
    {
        category: 'Shipping',
        icon: FiTruck,
        question: 'How long does delivery take?',
        answer:
            'Orders are generally delivered within the estimated delivery period shown during checkout. Delivery time can vary depending on your location, product availability and courier service.'
    },
    {
        category: 'Shipping',
        icon: FiTruck,
        question: 'Do you provide free shipping?',
        answer:
            'Free shipping is available on eligible orders according to the shipping offer displayed on the website. Any applicable shipping charges will be shown during checkout.'
    },
    {
        category: 'Shipping',
        icon: FiTruck,
        question: 'Can I track my order?',
        answer:
            'Yes. Once your order is shipped, tracking details can be used to check the latest available shipment status.'
    },
    {
        category: 'Returns',
        icon: FiRefreshCw,
        question: 'What is your return policy?',
        answer:
            'Eligible products can generally be requested for return within 7 days from delivery. Products should be unused, unworn and returned with their original tags and packaging.'
    },
    {
        category: 'Returns',
        icon: FiRefreshCw,
        question: 'How do I request a return?',
        answer:
            'Contact our support team with your order number and the reason for your return. Our team will review the request and guide you through the next steps.'
    },
    {
        category: 'Returns',
        icon: FiRefreshCw,
        question: 'Can I exchange a product for another size?',
        answer:
            'Exchange requests may be available for eligible products, subject to size availability and the applicable return period. Please contact our support team for assistance.'
    },
    {
        category: 'Payments',
        icon: FiCreditCard,
        question: 'What payment methods are available?',
        answer:
            'Available payment methods are displayed during checkout. The options may vary depending on your location, order and payment provider.'
    },
    {
        category: 'Payments',
        icon: FiCreditCard,
        question: 'Is online payment secure?',
        answer:
            'Payments are processed through secure payment infrastructure. Your payment information is handled according to the applicable payment provider security practices.'
    },
    {
        category: 'Payments',
        icon: FiCreditCard,
        question: 'When will I receive my refund?',
        answer:
            'After an eligible returned product is received and approved, the refund is processed to the original payment method. The final crediting time may vary depending on the payment provider.'
    },
    {
        category: 'Account',
        icon: FiUser,
        question: 'Do I need an account to shop?',
        answer:
            'An account can make it easier to manage orders, wishlist items and account details. If guest checkout is enabled, you may also be able to place an order without creating an account.'
    },
    {
        category: 'Account',
        icon: FiUser,
        question: 'How can I update my account details?',
        answer:
            'Log in to your account and open the profile section from your account dashboard. You can update the available personal details from there.'
    },
    {
        category: 'Products',
        icon: FiShoppingBag,
        question: 'How do I choose the right size?',
        answer:
            'Check the size guide available on the product page before placing your order. If you still need help, contact our support team.'
    },
    {
        category: 'Products',
        icon: FiShoppingBag,
        question: 'What should I do if I receive a damaged product?',
        answer:
            'Please contact our support team as soon as possible with your order details. Keep the product, original packaging and tags available until the issue has been reviewed.'
    }
];

const CATEGORIES = [
    { id: 'All', label: 'All Questions' },
    { id: 'Orders', label: 'Orders' },
    { id: 'Shipping', label: 'Shipping' },
    { id: 'Returns', label: 'Returns & Exchange' },
    { id: 'Payments', label: 'Payments' },
    { id: 'Account', label: 'Account' },
    { id: 'Products', label: 'Products' }
];

export default function FAQ() {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const filteredFAQs = useMemo(() => {
        const query = search.trim().toLowerCase();

        return FAQ_DATA.filter((item) => {
            const categoryMatch =
                activeCategory === 'All' ||
                item.category === activeCategory;

            const searchMatch =
                !query ||
                item.question.toLowerCase().includes(query) ||
                item.answer.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query);

            return categoryMatch && searchMatch;
        });
    }, [activeCategory, search]);

    const handleCategory = (category) => {
        setActiveCategory(category);
        setOpenIndex(null);
    };

    const toggleFAQ = (index) => {
        setOpenIndex((current) =>
            current === index ? null : index
        );
    };

    return (
        <div className="faq-page">

            {/* HERO */}
            <section className="faq-hero">

                <div className="faq-hero-inner">

                    <div className="faq-hero-content">

                        <span className="faq-eyebrow">
                            SS VASTRALAYA
                        </span>

                        <h1>
                            Frequently Asked
                            <span> Questions</span>
                        </h1>

                        <p>
                            Find quick answers about orders, shipping,
                            payments, returns, exchanges and your account.
                        </p>

                        <button
                            className="faq-back-btn"
                            onClick={() => navigate(-1)}
                        >
                            <FiArrowLeft />
                            Back
                        </button>

                    </div>

                    <div className="faq-hero-art">
                        <div className="faq-art-circle">
                            <FiMessageCircle />
                        </div>

                        <span className="faq-art-dot dot-one"></span>
                        <span className="faq-art-dot dot-two"></span>
                        <span className="faq-art-dot dot-three"></span>
                    </div>

                </div>

            </section>

            {/* MAIN */}
            <main className="faq-container">

                {/* SEARCH */}
                <section className="faq-search-section">

                    <div className="faq-search-box">

                        <FiSearch />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setOpenIndex(null);
                            }}
                            placeholder="Search your question..."
                        />

                        {search && (
                            <button
                                type="button"
                                className="faq-clear"
                                onClick={() => setSearch('')}
                            >
                                Clear
                            </button>
                        )}

                    </div>

                </section>

                {/* CATEGORY */}
                <section className="faq-category-section">

                    <div className="faq-category-header">
                        <span>EXPLORE HELP</span>
                        <h2>What can we help you with?</h2>
                    </div>

                    <div className="faq-categories">

                        {CATEGORIES.map((category) => {

                            const Icon =
                                category.id === 'Orders'
                                    ? FiShoppingBag
                                    : category.id === 'Shipping'
                                        ? FiTruck
                                        : category.id === 'Returns'
                                            ? FiRefreshCw
                                            : category.id === 'Payments'
                                                ? FiCreditCard
                                                : category.id === 'Account'
                                                    ? FiUser
                                                    : FiMessageCircle;

                            return (
                                <button
                                    key={category.id}
                                    className={
                                        activeCategory === category.id
                                            ? 'faq-category active'
                                            : 'faq-category'
                                    }
                                    onClick={() =>
                                        handleCategory(category.id)
                                    }
                                >
                                    <Icon />
                                    <span>{category.label}</span>
                                </button>
                            );
                        })}

                    </div>

                </section>

                {/* FAQ LIST */}
                <section className="faq-list-section">

                    <div className="faq-list-heading">

                        <div>
                            <span>HELP CENTER</span>
                            <h2>
                                {activeCategory === 'All'
                                    ? 'All Frequently Asked Questions'
                                    : activeCategory}
                            </h2>
                        </div>

                        <p>
                            {filteredFAQs.length} questions
                        </p>

                    </div>

                    {filteredFAQs.length > 0 ? (

                        <div className="faq-list">

                            {filteredFAQs.map((item, index) => {

                                const Icon = item.icon;
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        className={
                                            isOpen
                                                ? 'faq-item open'
                                                : 'faq-item'
                                        }
                                        key={`${item.category}-${item.question}`}
                                    >

                                        <button
                                            className="faq-question"
                                            onClick={() =>
                                                toggleFAQ(index)
                                            }
                                            aria-expanded={isOpen}
                                        >

                                            <div className="faq-question-left">

                                                <span className="faq-question-icon">
                                                    <Icon />
                                                </span>

                                                <div>
                                                    <small>
                                                        {item.category}
                                                    </small>

                                                    <strong>
                                                        {item.question}
                                                    </strong>
                                                </div>

                                            </div>

                                            <span className="faq-toggle">
                                                {isOpen ? (
                                                    <FiMinus />
                                                ) : (
                                                    <FiPlus />
                                                )}
                                            </span>

                                        </button>

                                        <div
                                            className="faq-answer-wrapper"
                                            style={{
                                                gridTemplateRows: isOpen
                                                    ? '1fr'
                                                    : '0fr'
                                            }}
                                        >
                                            <div className="faq-answer">
                                                <p>
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    ) : (

                        <div className="faq-empty">

                            <div className="faq-empty-icon">
                                <FiSearch />
                            </div>

                            <h3>No questions found</h3>

                            <p>
                                We couldn't find an answer matching your
                                search. Try another keyword or browse all
                                categories.
                            </p>

                            <button
                                onClick={() => {
                                    setSearch('');
                                    setActiveCategory('All');
                                }}
                            >
                                View All Questions
                            </button>

                        </div>

                    )}

                </section>

                {/* CONTACT CTA */}
                <section className="faq-contact">

                    <div className="faq-contact-icon">
                        <FiMessageCircle />
                    </div>

                    <div className="faq-contact-content">

                        <span>STILL NEED HELP?</span>

                        <h2>
                            Can't find what you're looking for?
                        </h2>

                        <p>
                            Our support team is happy to help you with your
                            order, product, return or any other question.
                        </p>

                    </div>

                    <a href="/contact-us">
                        Contact Us
                    </a>

                </section>

            </main>
        </div>
    );
}