import React from "react";
import {
  FiTruck,
  FiMapPin,
  FiClock,
  FiPackage,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiHelpCircle,
} from "react-icons/fi";
import "./ShippingPolicy.css";

export default function ShippingPolicy() {
  const shippingInfo = [
    {
      icon: <FiTruck />,
      title: "Free Shipping",
      text: "Enjoy free shipping on orders above ₹999.",
    },
    {
      icon: <FiPackage />,
      title: "Secure Packaging",
      text: "Every order is carefully packed to ensure your products reach you safely.",
    },
    {
      icon: <FiClock />,
      title: "Fast Delivery",
      text: "Orders are generally delivered within 3–7 business days.",
    },
    {
      icon: <FiMapPin />,
      title: "Pan India Delivery",
      text: "We deliver fashion and lifestyle products across India.",
    },
  ];

  const deliverySteps = [
    {
      number: "01",
      title: "Order Confirmed",
      text: "Once your order is successfully placed, you will receive an order confirmation.",
    },
    {
      number: "02",
      title: "Order Processing",
      text: "Our team carefully prepares and packs your products for dispatch.",
    },
    {
      number: "03",
      title: "Order Shipped",
      text: "Once dispatched, your order will be handed over to our delivery partner.",
    },
    {
      number: "04",
      title: "Delivered",
      text: "Your order will arrive at the delivery address provided during checkout.",
    },
  ];

  return (
    <main className="shipping-policy-page">
      {/* Hero */}
      <section className="shipping-hero">
        <div className="shipping-hero-content">
          <span className="shipping-eyebrow">SS VASTRALAYA</span>

          <h1>
            Shipping <span>Policy</span>
          </h1>

          <p>
            We believe shopping should be simple, transparent and convenient.
            Here is everything you need to know about our shipping and delivery
            process.
          </p>

          <div className="shipping-hero-line"></div>
        </div>
      </section>

      {/* Quick Benefits */}
      <section className="shipping-container">
        <div className="shipping-benefits">
          {shippingInfo.map((item, index) => (
            <div className="shipping-benefit-card" key={index}>
              <div className="shipping-icon">{item.icon}</div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="shipping-container shipping-content-section">
        <div className="shipping-content-grid">
          {/* Left Content */}
          <div className="shipping-main-content">
            <div className="shipping-section">
              <div className="section-heading">
                <span>01</span>
                <div>
                  <small>DELIVERY INFORMATION</small>
                  <h2>Shipping & Delivery</h2>
                </div>
              </div>

              <p>
                At SS Vastralaya, we work hard to make sure your order reaches
                you safely and on time. Once your order is confirmed, our team
                begins processing and preparing your package for dispatch.
              </p>

              <p>
                Delivery timelines may vary depending on your location,
                product availability, courier service and unforeseen
                circumstances.
              </p>
            </div>

            {/* Delivery Timeline */}
            <div className="shipping-section">
              <div className="section-heading">
                <span>02</span>
                <div>
                  <small>HOW IT WORKS</small>
                  <h2>Your Delivery Journey</h2>
                </div>
              </div>

              <div className="delivery-timeline">
                {deliverySteps.map((step) => (
                  <div className="delivery-step" key={step.number}>
                    <div className="step-number">{step.number}</div>

                    <div className="step-content">
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Time */}
            <div className="shipping-section">
              <div className="section-heading">
                <span>03</span>
                <div>
                  <small>ESTIMATED TIMELINE</small>
                  <h2>Delivery Time</h2>
                </div>
              </div>

              <div className="shipping-info-box">
                <FiClock />

                <div>
                  <h3>3–7 Business Days</h3>
                  <p>
                    Most orders are delivered within 3–7 business days after
                    dispatch. Remote locations may require additional time.
                  </p>
                </div>
              </div>

              <p>
                During festive seasons, sales, promotional events or other
                high-order periods, delivery may take slightly longer than
                usual.
              </p>
            </div>

            {/* Shipping Charges */}
            <div className="shipping-section">
              <div className="section-heading">
                <span>04</span>
                <div>
                  <small>SHIPPING CHARGES</small>
                  <h2>Shipping Cost</h2>
                </div>
              </div>

              <div className="charge-table">
                <div className="charge-row charge-header">
                  <span>Order Value</span>
                  <span>Shipping Charge</span>
                </div>

                <div className="charge-row">
                  <span>₹999 & above</span>
                  <strong className="free-shipping-text">
                    FREE
                  </strong>
                </div>

                <div className="charge-row">
                  <span>Below ₹999</span>
                  <span>Applicable at Checkout</span>
                </div>
              </div>

              <p>
                Any applicable shipping charges will be clearly displayed
                during checkout before you place your order.
              </p>
            </div>

            {/* Tracking */}
            <div className="shipping-section">
              <div className="section-heading">
                <span>05</span>
                <div>
                  <small>ORDER TRACKING</small>
                  <h2>Track Your Order</h2>
                </div>
              </div>

              <p>
                Once your order has been shipped, tracking information may be
                shared with you through your registered contact details.
              </p>

              <div className="tracking-box">
                <FiCheckCircle />

                <div>
                  <h3>Stay Updated</h3>
                  <p>
                    Keep your phone number and email address updated so you can
                    receive important order and delivery notifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="shipping-section">
              <div className="section-heading">
                <span>06</span>
                <div>
                  <small>PLEASE NOTE</small>
                  <h2>Important Information</h2>
                </div>
              </div>

              <ul className="shipping-list">
                <li>
                  <FiCheckCircle />
                  Please ensure that your shipping address and contact details
                  are correct before placing an order.
                </li>

                <li>
                  <FiCheckCircle />
                  Delivery timelines are estimates and may vary depending on
                  the destination and courier network.
                </li>

                <li>
                  <FiCheckCircle />
                  Orders may be delayed due to weather, natural events,
                  transportation issues or other circumstances beyond our
                  control.
                </li>

                <li>
                  <FiCheckCircle />
                  Please inspect the package at the time of delivery and
                  contact us promptly if there is any visible damage.
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="shipping-sidebar">
            <div className="shipping-sidebar-card">
              <div className="sidebar-icon">
                <FiTruck />
              </div>

              <span className="sidebar-label">SHIPPING AT A GLANCE</span>

              <h2>Simple. Safe. Reliable.</h2>

              <p>
                We carefully handle every order from packing to delivery so
                your shopping experience remains smooth.
              </p>

              <div className="sidebar-details">
                <div>
                  <FiClock />
                  <span>
                    <strong>3–7 Days</strong>
                    Estimated delivery
                  </span>
                </div>

                <div>
                  <FiPackage />
                  <span>
                    <strong>₹999+</strong>
                    Free shipping
                  </span>
                </div>

                <div>
                  <FiMapPin />
                  <span>
                    <strong>Pan India</strong>
                    Delivery available
                  </span>
                </div>
              </div>
            </div>

            <div className="shipping-help-card">
              <FiHelpCircle />

              <h3>Need Help?</h3>

              <p>
                Have a question about your order or delivery? Our support team
                is here to help.
              </p>

              <a href="/contact-us">Contact Us</a>
            </div>
          </aside>
        </div>
      </section>

      {/* Returns Note */}
      <section className="shipping-bottom">
        <div className="shipping-container">
          <div className="shipping-bottom-card">
            <div className="bottom-icon">
              <FiRefreshCw />
            </div>

            <div>
              <span>RETURNS & EXCHANGE</span>
              <h2>Need to return or exchange an item?</h2>
              <p>
                Please visit our Returns & Refunds section or contact our
                support team for assistance with eligible products.
              </p>
            </div>

            <a href="/support">View Returns Policy</a>
          </div>
        </div>
      </section>
    </main>
  );
}