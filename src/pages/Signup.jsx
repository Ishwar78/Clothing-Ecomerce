import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiKey,
  FiCheck,
  FiHeart,
  FiPackage,
  FiShield,
  FiRefreshCw,
  FiCheckCircle
} from 'react-icons/fi';

import api from '../lib/api';
import './Signup.css';

export default function Signup() {
  const nav = useNavigate();

  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!agreeTerms && step === 'details') {
      setError('Please agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMsg('');

    try {
      const cleanEmail = form.email.trim().toLowerCase();
      const res = await api.post('/users/send-signup-otp', {
        name: form.name.trim(),
        email: cleanEmail,
        phone: form.phone.trim()
      });

      if (res.success) {
        setStep('otp');
        setCountdown(60);
        setInfoMsg(res.message || `Verification code sent to ${cleanEmail}`);
      } else {
        setError(res.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanEmail = form.email.trim().toLowerCase();
      const res = await api.post('/users/verify-signup-otp', {
        name: form.name.trim(),
        email: cleanEmail,
        phone: form.phone.trim(),
        otp: cleanOtp
      });

      if (res.success && res.token) {
        localStorage.setItem('userToken', res.token);
        localStorage.setItem('userData', JSON.stringify(res.user));
        nav('/dashboard');
      } else {
        setError(res.message || 'Invalid verification code.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during verification.');
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
            JOIN Joyfulmarts
          </span>

          <h1>
            Discover
            <br />
            <em>your style.</em>
          </h1>

          <p className="signup-visual-description">
            Create your Joyfulmarts account and enjoy a smoother,
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
            <span>✦ Joyfulmarts ✦</span>
            <small>Joyfulmarts</small>
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
            {step === 'details' ? 'CREATE ACCOUNT' : 'EMAIL VERIFICATION'}
          </span>

          <h2>
            {step === 'details' ? (
              <>Sign <em>Up</em></>
            ) : (
              <>Verify <em>Email</em></>
            )}
          </h2>

          <p>
            {step === 'details'
              ? 'Join Joyfulmarts with easy email verification — no password required.'
              : `Enter the 6-digit code sent to ${form.email}`}
          </p>

        </div>

        {/* ERROR / INFO ALERTS */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#b91c1c',
            fontSize: '13px',
            marginBottom: '18px',
            lineHeight: '1.5'
          }}>
            {error}
          </div>
        )}

        {infoMsg && step === 'otp' && (
          <div style={{
            padding: '10px 14px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            color: '#166534',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FiCheckCircle size={16} />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: DETAILS FORM ================= */}
        {step === 'details' && (
          <form className="signup-form" onSubmit={handleSendOtp}>

            {/* FULL NAME */}
            <div className="signup-field">
              <label htmlFor="signup-name">
                Full Name *
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
                Email Address *
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
                Phone Number *
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

            {/* TERMS */}
            <label className="signup-terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <span>
                I agree to the{' '}
                <Link to="/term-&-condition">
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
              disabled={loading}
            >
              <span>{loading ? 'SENDING CODE...' : 'SEND VERIFICATION CODE'}</span>
              <b>→</b>
            </button>
          </form>
        )}

        {/* ================= STEP 2: OTP VERIFICATION ================= */}
        {step === 'otp' && (
          <form className="signup-form" onSubmit={handleVerifyOtp}>
            <div className="signup-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label htmlFor="signup-otp" style={{ margin: 0 }}>
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => { setStep('details'); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e84965',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Edit Details
                </button>
              </div>

              <div className="signup-input-wrapper">
                <FiKey />
                <input
                  id="signup-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  autoFocus
                  required
                  style={{
                    letterSpacing: '8px',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', margin: '4px 0 10px' }}>
              <span style={{ color: '#888' }}>Didn't get the code?</span>
              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={handleSendOtp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: countdown > 0 ? '#aaa' : '#e84965',
                  fontWeight: '600',
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '13px'
                }}
              >
                <FiRefreshCw size={13} className={loading ? 'spin' : ''} />
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
              </button>
            </div>

            <button
              type="submit"
              className="signup-submit"
              disabled={loading || otp.length < 6}
            >
              <span>{loading ? 'CREATING ACCOUNT...' : 'VERIFY & CREATE ACCOUNT'}</span>
              <b>→</b>
            </button>
          </form>
        )}

        {/* LOGIN */}
        <div className="signup-login">
          <span>
            Already have an account?
          </span>
          <Link to="/login">
            Login with OTP
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
