import React from "react";
import {
  FiAward,
  FiHeart,
  FiShield,
  FiUsers,
  FiTruck,
  FiStar,
  FiArrowRight,
  FiCheckCircle,
  FiInstagram,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./About.css";

export default function About() {
  const nav = useNavigate();

  const values = [
    {
      icon: FiAward,
      title: "Premium Quality",
      text: "We focus on quality fabrics, refined finishing and designs made to last.",
    },
    {
      icon: FiHeart,
      title: "Made With Love",
      text: "Every collection is thoughtfully selected to make your everyday style special.",
    },
    {
      icon: FiShield,
      title: "Trusted Shopping",
      text: "A smooth, secure and transparent shopping experience is always our priority.",
    },
    {
      icon: FiUsers,
      title: "Customer First",
      text: "Your satisfaction matters to us before, during and after every purchase.",
    },
  ];

  const highlights = [
    {
      icon: FiStar,
      number: "50K+",
      label: "Happy Customers",
    },
    {
      icon: FiAward,
      number: "1000+",
      label: "Styles Available",
    },
    {
      icon: FiTruck,
      number: "7 Days",
      label: "Easy Returns",
    },
    {
      icon: FiHeart,
      number: "4.6/5",
      label: "Customer Rating",
    },
  ];

  const promises = [
    "Premium fabrics and carefully selected designs",
    "Fashion for men, women and kids",
    "Ethnic wear, footwear and accessories",
    "Secure and convenient shopping experience",
    "Easy returns on eligible products",
    "Friendly customer support",
  ];

  return (
    <main className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>

        <div className="container about-hero-content">
          <span className="about-eyebrow">✦ OUR STORY ✦</span>

          <h1>
            Tradition Meets
            <span> Modern Style</span>
          </h1>

          <p>
            Welcome to SS Vastralaya — a fashion destination where timeless
            traditions meet contemporary trends, bringing you carefully
            selected styles for every occasion.
          </p>

          <div className="about-hero-actions">
            <button
              className="about-primary-btn"
              onClick={() => nav("/shop")}
            >
              Explore Collection
              <FiArrowRight />
            </button>

            <button
              className="about-outline-btn"
              onClick={() => nav("/contact-us")}
            >
              Talk To Us
            </button>
          </div>
        </div>

        <div className="about-hero-badge">
          <FiStar />
          <strong>SS Vastralaya</strong>
          <span>Tradition Meets Trend</span>
        </div>
      </section>

      {/* INTRO */}
      <section className="about-intro container">
        <div className="about-intro-content">
          <span className="section-label">WHO WE ARE</span>

          <h2>
            Fashion that feels
            <span> personal.</span>
          </h2>

          <p>
            SS Vastralaya is built around a simple idea — fashion should feel
            beautiful, comfortable and effortless. We bring together
            traditional elegance and modern fashion to create collections
            that fit naturally into your lifestyle.
          </p>

          <p>
            From everyday essentials to festive looks, our collections are
            curated with attention to quality, design and value. Whether
            you're dressing for a celebration or simply refreshing your
            wardrobe, we want every purchase to feel worthwhile.
          </p>

          <div className="about-signature">
            <span>✦</span>
            <div>
              <strong>SS Vastralaya</strong>
              <small>Tradition Meets Trend</small>
            </div>
          </div>
        </div>

        <div className="about-intro-card">
          <div className="intro-card-inner">
            <span className="intro-small">OUR PHILOSOPHY</span>

            <h3>
              Style is not just
              <br />
              what you wear.
            </h3>

            <div className="intro-line"></div>

            <p>
              It's how confidently you carry yourself.
            </p>

            <div className="intro-icon">
              <FiHeart />
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="about-highlights">
        <div className="container">
          <div className="highlights-grid">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <div className="highlight-item" key={index}>
                  <div className="highlight-icon">
                    <Icon />
                  </div>

                  <div>
                    <strong>{item.number}</strong>
                    <span>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values container">
        <div className="section-heading">
          <span className="section-label">WHAT WE STAND FOR</span>

          <h2>
            More than fashion.
            <span> A promise.</span>
          </h2>

          <p>
            Everything we do is guided by the values that make your shopping
            experience better.
          </p>
        </div>

        <div className="values-grid">
          {values.map((item, index) => {
            const Icon = item.icon;

            return (
              <article className="value-card" key={index}>
                <div className="value-icon">
                  <Icon />
                </div>

                <span className="value-number">
                  0{index + 1}
                </span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <div className="value-arrow">
                  <FiArrowRight />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PROMISE */}
      <section className="about-promise">
        <div className="container promise-grid">

          <div className="promise-content">
            <span className="section-label">OUR PROMISE</span>

            <h2>
              Thoughtful fashion,
              <span> better shopping.</span>
            </h2>

            <p>
              We believe great fashion should be accessible without
              compromising on quality or experience. That's why every part of
              our store is designed around simplicity, trust and style.
            </p>

            <div className="promise-list">
              {promises.map((item, index) => (
                <div className="promise-item" key={index}>
                  <FiCheckCircle />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="promise-card">
            <div className="promise-card-top">
              <FiAward />
            </div>

            <span>THE SBV DIFFERENCE</span>

            <h3>
              Designed for
              <br />
              <em>everyday elegance.</em>
            </h3>

            <p>
              From classic silhouettes to modern statement pieces, discover
              styles that make every day a little more special.
            </p>

            <button onClick={() => nav("/shop")}>
              Shop Now
              <FiArrowRight />
            </button>
          </div>

        </div>
      </section>

      {/* COMMUNITY */}
      <section className="about-community container">
        <div className="community-box">
          <div className="community-icon">
            <FiInstagram />
          </div>

          <div>
            <span className="section-label">STAY CONNECTED</span>

            <h2>
              Be part of the
              <span> SBV family.</span>
            </h2>

            <p>
              Follow us for new arrivals, styling inspiration, festive
              collections and more.
            </p>
          </div>

          <button onClick={() => nav("/contact-us")}>
            Connect With Us
            <FiArrowRight />
          </button>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="about-final container">
        <div className="final-content">
          <span>✦ SS VASTRALAYA ✦</span>

          <h2>
            Your style.
            <br />
            Your story.
          </h2>

          <p>
            Discover fashion that feels uniquely yours.
          </p>

          <button onClick={() => nav("/shop")}>
            Explore Our Collection
            <FiArrowRight />
          </button>
        </div>
      </section>

    </main>
  );
}