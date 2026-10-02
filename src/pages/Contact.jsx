import React, { useState, useEffect } from "react";
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
  FiCheckCircle
} from "react-icons/fi";
import api from "../lib/api";
import "./Contact.css";

export default function Contact() {
  const [contactInfo, setContactInfo] = useState({
    phone: "+91 98765 43210",
    alternatePhone: "+91 98765 43211",
    email: "support@shreebalaji.com",
    alternateEmail: "info@shreebalaji.com",
    address: "Shree Balaji Vastraalaya, Main Market",
    city: "Rohtak",
    state: "Haryana",
    pincode: "124001",
    workingHours: "Monday - Saturday, 10:00 AM - 8:00 PM",
    mapUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    youtubeUrl: ""
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api.get("/contact").then((res) => {
      if (res.success && res.contact) {
        setContactInfo((prev) => ({ ...prev, ...res.contact }));
      }
    }).catch((err) => console.error("Error loading contact:", err));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await api.post("/inquiries", form);
      if (res.success) {
        setSubmitted(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setErrorMsg(res.message || "Failed to submit message. Please try again.");
      }
    } catch (err) {
      console.error("Submit inquiry error:", err);
      setErrorMsg("Something went wrong while sending your inquiry. Please try again later.");
    } finally {
      setSubmitting(false);
    }
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
                  {contactInfo.address}
                  <br />
                  {[contactInfo.city, contactInfo.state, contactInfo.pincode].filter(Boolean).join(", ") || "India"}
                </p>
                {contactInfo.mapUrl ? (
                  <a href={contactInfo.mapUrl} target="_blank" rel="noreferrer" className="contact-card-link">
                    Get Directions <FiArrowRight />
                  </a>
                ) : (
                  <span className="contact-card-link">
                    Visit Our Store <FiArrowRight />
                  </span>
                )}
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <FiPhone />
              </div>

              <div>
                <h3>Call Us</h3>
                <p>
                  {contactInfo.phone}
                  {contactInfo.alternatePhone && (
                    <>
                      <br />
                      {contactInfo.alternatePhone}
                    </>
                  )}
                </p>
                <a href={`tel:${contactInfo.phone}`} className="contact-card-link">
                  Call Now <FiArrowRight />
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <FiMail />
              </div>

              <div>
                <h3>Email Us</h3>
                <p>
                  {contactInfo.email}
                  {contactInfo.alternateEmail && (
                    <>
                      <br />
                      {contactInfo.alternateEmail}
                    </>
                  )}
                </p>
                <a href={`mailto:${contactInfo.email}`} className="contact-card-link">
                  Send Email <FiArrowRight />
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <FiClock />
              </div>

              <div>
                <h3>Working Hours</h3>
                <p>
                  {contactInfo.workingHours || "Monday - Saturday, 10:00 AM - 8:00 PM"}
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

              {submitted && (
                <div style={{
                  padding: "14px 18px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#def7ec",
                  color: "#03543f",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <FiCheckCircle size={22} style={{ flexShrink: 0 }} />
                  <span>Thank you! Your message has been sent successfully. Our team will reach out to you shortly.</span>
                </div>
              )}

              {errorMsg && (
                <div style={{
                  padding: "12px 16px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#fde8e8",
                  color: "#9b1c1c",
                  fontWeight: "600"
                }}>
                  {errorMsg}
                </div>
              )}

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
                  disabled={submitting}
                >
                  {submitting ? "Sending Message..." : "Send Message"}
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
                  {contactInfo.instagramUrl ? (
                    <a href={contactInfo.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                      <FiInstagram />
                    </a>
                  ) : (
                    <a href="#" aria-label="Instagram"><FiInstagram /></a>
                  )}

                  {contactInfo.facebookUrl ? (
                    <a href={contactInfo.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                      <FiFacebook />
                    </a>
                  ) : (
                    <a href="#" aria-label="Facebook"><FiFacebook /></a>
                  )}

                  {contactInfo.youtubeUrl ? (
                    <a href={contactInfo.youtubeUrl} target="_blank" rel="noreferrer" aria-label="Youtube">
                      <FiYoutube />
                    </a>
                  ) : (
                    <a href="#" aria-label="Youtube"><FiYoutube /></a>
                  )}
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