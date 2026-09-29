import React, { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiArrowRight,
  FiSend,
  FiInstagram,
  FiFacebook,
  FiYoutube,
} from "react-icons/fi";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you! Your message has been submitted.");

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="sbv-contact-page">

      {/* ================= HERO ================= */}
      <section className="contact-hero">
        <div className="contact-hero-overlay">
          <div className="contact-hero-content">
            <span className="contact-eyebrow">
              WE'D LOVE TO HEAR FROM YOU
            </span>

            <h1>
              Get In <em>Touch</em>
            </h1>

            <p>
              Have a question about our products, orders or services?
              <br />
              Our team is here to help you.
            </p>

            <div className="contact-breadcrumb">
              Home <b>›</b> Contact Us
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="contact-info-section">
        <div className="contact-container">

          <div className="contact-section-heading">
            <span>CONTACT US</span>
            <h2>
              We're Here To <em>Help</em>
            </h2>
            <p>
              Whether you need assistance with an order or simply want
              to know more about us, feel free to reach out.
            </p>
          </div>

          <div className="contact-info-grid">

            <div className="contact-info-card">
              <div className="contact-icon">
                <FiMapPin />
              </div>

              <div>
                <h3>Visit Us</h3>
                <p>
                  Shree Balaji Vastraalaya
                  <br />
                  India
                </p>
                <span className="contact-card-link">
                  Get Directions <FiArrowRight />
                </span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <FiPhone />
              </div>

              <div>
                <h3>Call Us</h3>
                <p>
                  +91 98765 43210
                  <br />
                  +91 98765 43211
                </p>
                <span className="contact-card-link">
                  Call Now <FiArrowRight />
                </span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <FiMail />
              </div>

              <div>
                <h3>Email Us</h3>
                <p>
                  support@shreebalaji.com
                  <br />
                  info@shreebalaji.com
                </p>
                <span className="contact-card-link">
                  Send Email <FiArrowRight />
                </span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <FiClock />
              </div>

              <div>
                <h3>Working Hours</h3>
                <p>
                  Monday - Saturday
                  <br />
                  10:00 AM - 8:00 PM
                </p>
                <span className="contact-card-link">
                  We're Available <FiArrowRight />
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FORM + IMAGE ================= */}
      <section className="contact-main-section">
        <div className="contact-container">

          <div className="contact-main-grid">

            {/* LEFT */}
            <div className="contact-form-wrapper">

              <span className="contact-form-label">
                SEND US A MESSAGE
              </span>

              <h2>
                Let's Start A <em>Conversation</em>
              </h2>

              <p className="contact-form-intro">
                Fill out the form below and our support team will get
                back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="contact-form">

                <div className="contact-form-row">

                  <div className="contact-field">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                </div>

                <div className="contact-form-row">

                  <div className="contact-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="contact-field">
                    <label>Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select subject</option>
                      <option value="Order">Order Related</option>
                      <option value="Product">Product Related</option>
                      <option value="Return">Return & Exchange</option>
                      <option value="Payment">Payment Related</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                </div>

                <div className="contact-field">
                  <label>Your Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                >
                  Send Message
                  <FiSend />
                </button>

              </form>
            </div>

            {/* RIGHT */}
            <div className="contact-visual">

              <div className="contact-image-card">
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85"
                  alt="Shree Balaji Vastraalaya"
                />

                <div className="contact-image-content">
                  <span>SBV COLLECTION</span>

                  <h3>
                    Style With
                    <br />
                    <em>Confidence</em>
                  </h3>

                  <p>
                    Discover fashion made for every occasion,
                    from everyday essentials to festive favourites.
                  </p>
                </div>
              </div>

              <div className="contact-social-card">
                <div>
                  <strong>Follow Our Journey</strong>
                  <small>Stay connected with SBV</small>
                </div>

                <div className="contact-socials">
                  <a href="#" aria-label="Instagram">
                    <FiInstagram />
                  </a>

                  <a href="#" aria-label="Facebook">
                    <FiFacebook />
                  </a>

                  <a href="#" aria-label="Youtube">
                    <FiYoutube />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= FAQ STRIP ================= */}
      <section className="contact-help-section">
        <div className="contact-container">

          <div className="contact-help-inner">

            <div>
              <span>NEED QUICK HELP?</span>

              <h2>
                We're Always Happy To <em>Assist</em>
              </h2>

              <p>
                For order tracking, returns, exchanges and other
                common questions, visit our help section.
              </p>
            </div>

            <button className="contact-help-btn">
              VISIT HELP CENTER
              <FiArrowRight />
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}