import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCheck,
  FiHeart,
  FiPackage,
  FiShield
} from 'react-icons/fi';

import api from '../lib/api';
import './Signup.css';

export default function Signup() {
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Assuming api wrapper is correctly imported at the top
      const res = await api.post('/users/register', form);
      if (res.success) {
        nav('/login');
      } else {
        setError(res.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">

      {/* ================= LEFT VISUAL ================= */}
      <section className="signup-visual">

        <button
          type="button"
          className="signup-back-btn"
          onClick={() => nav('/')}
        >
          <FiArrowLeft />
          <span>Back to Store</span>
        </button>

        <div className="signup-visual-overlay"></div>

        <div className="signup-visual-content">

          <span className="signup-pill">
            JOIN SBV
          </span>

          <h1>
            Discover
            <br />
            <em>your style.</em>
          </h1>

          <p className="signup-visual-description">
            Create your SBV account and enjoy a smoother,
            more personalised shopping experience.
          </p>

          <div className="signup-benefits">

            <div className="signup-benefit">
              <div className="signup-benefit-icon">
                <FiHeart />
              </div>

              <div>
                <strong>Save Your Wishlist</strong>
                <span>Keep your favourite styles in one place.</span>
              </div>
            </div>

            <div className="signup-benefit">
              <div className="signup-benefit-icon">
                <FiPackage />
              </div>

              <div>
                <strong>Track Your Orders</strong>
                <span>Manage your purchases with ease.</span>
              </div>
            </div>

            <div className="signup-benefit">
              <div className="signup-benefit-icon">
                <FiCheck />
              </div>

              <div>
                <strong>Member Benefits</strong>
                <span>Get access to exclusive offers.</span>
              </div>
            </div>

          </div>

          <div className="signup-brand-mark">
            <span>✦ SBV ✦</span>
            <small>SS VASTRALAYA</small>
            <em>TRADITION MEETS TREND</em>
          </div>

        </div>
      </section>


      {/* ================= SIGNUP CARD ================= */}
      <section className="signup-card">

        <button
          type="button"
          className="signup-mobile-back"
          onClick={() => nav('/')}
        >
          <FiArrowLeft />
          Back to Store
        </button>

        <div className="signup-card-header">

          <span className="signup-card-pill">
            CREATE ACCOUNT
          </span>

          <h2>
            Sign <em>Up</em>
          </h2>

          <p>
            Create your account and start shopping
            your favourite styles.
          </p>

        </div>


        {/* ================= FORM ================= */}
        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}
          <div className="signup-field">

            <label htmlFor="signup-name">
              Full Name
            </label>

            <div className="signup-input-wrapper">

              <FiUser />

              <input
                id="signup-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

            </div>

          </div>


          {/* EMAIL */}
          <div className="signup-field">

            <label htmlFor="signup-email">
              Email Address
            </label>

            <div className="signup-input-wrapper">

              <FiMail />

              <input
                id="signup-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

            </div>

          </div>


          {/* PHONE */}
          <div className="signup-field">

            <label htmlFor="signup-phone">
              Phone Number
            </label>

            <div className="signup-input-wrapper">

              <FiPhone />

              <input
                id="signup-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                autoComplete="tel"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />

            </div>

          </div>


          {/* PASSWORD */}
          <div className="signup-field">

            <label htmlFor="signup-password">
              Password
            </label>

            <div className="signup-input-wrapper signup-password-wrapper">

              <FiLock />

              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                autoComplete="new-password"
                minLength="6"
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>

          </div>


          {/* TERMS */}
          <label className="signup-terms">

            <input
              type="checkbox"
              required
            />

            <span>
              I agree to the{' '}
              <Link to="/terms-and-conditions">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
              .
            </span>

          </label>


          {/* SUBMIT */}
          <button
            type="submit"
            className="signup-submit"
          >
            {error && <div style={{ color: 'red', fontSize: '13px', marginBottom: '15px' }}>{error}</div>}<span>{loading ? 'CREATING...' : 'CREATE ACCOUNT'}</span>
            <b>→</b>
          </button>

        </form>


        {/* LOGIN */}
        <div className="signup-login">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>


        {/* SECURITY */}
        <div className="signup-security">

          <FiShield />

          <span>
            Your information is kept secure and private.
          </span>

        </div>

      </section>

    </main>
  );
}
