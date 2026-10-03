import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiArrowRight,
    FiArrowLeft,
    FiMail,
    FiShield,
    FiKey,
    FiCheckCircle,
    FiRefreshCw
} from 'react-icons/fi';
import api from '../lib/api';
import './Login.css';

export default function Login() {
    const nav = useNavigate();

    const [step, setStep] = useState('email'); // 'email' | 'otp'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [infoMsg, setInfoMsg] = useState('');
    const [countdown, setCountdown] = useState(0);

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // Send OTP handler
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        setError('');
        setInfoMsg('');

        try {
            const res = await api.post('/users/send-login-otp', { email: cleanEmail });
            if (res.success) {
                setStep('otp');
                setCountdown(60);
                setInfoMsg(res.message || `Verification code sent to ${cleanEmail}`);
            } else {
                setError(res.message || 'Failed to send verification code.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while sending OTP.');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP & Login
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        const cleanOtp = otp.trim();

        if (!cleanOtp || cleanOtp.length < 6) {
            setError('Please enter the 6-digit verification code.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/users/verify-login-otp', {
                email: cleanEmail,
                otp: cleanOtp
            });

            if (res.success && res.token) {
                localStorage.setItem('userToken', res.token);
                localStorage.setItem('userData', JSON.stringify(res.user));
                nav('/dashboard');
            } else {
                setError(res.message || 'Invalid or expired verification code.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-shell">

                {/* LEFT VISUAL */}
                <section className="login-visual">
                    <div className="login-visual-overlay"></div>

                    <div className="login-visual-content">
                        <div className="login-brand-mark">
                            <span>✦</span>
                            <strong>SBV</strong>
                            <span>✦</span>
                        </div>

                        <span className="login-kicker">
                            SBV MEMBERS
                        </span>

                        <h1>
                            Style begins
                            <br />
                            <em>with you.</em>
                        </h1>

                        <p>
                            Discover your personal style, manage your orders
                            and keep all your favourite fashion in one place.
                        </p>

                        <div className="login-visual-line"></div>

                        <div className="login-visual-meta">
                            <span>Premium Fashion</span>
                            <span>•</span>
                            <span>SS Vastralaya</span>
                        </div>
                    </div>

                    <div className="login-visual-bottom">
                        <span>EST. 2026</span>
                        <span>TRADITION MEETS TREND</span>
                    </div>
                </section>

                {/* RIGHT LOGIN */}
                <section className="login-form-area">
                    <div className="auth-card login-card">

                        <div className="mobile-login-logo">
                            <span>✦</span>
                            <strong>SBV</strong>
                            <span>✦</span>
                        </div>

                        <div className="login-heading">
                            <span className="pill">
                                {step === 'email' ? 'WELCOME BACK' : 'EMAIL VERIFICATION'}
                            </span>

                            <h2>
                                {step === 'email' ? 'Login with OTP' : 'Enter Verification Code'}
                            </h2>

                            <p>
                                {step === 'email'
                                    ? 'Enter your registered email to receive a secure login code.'
                                    : `We sent a 6-digit code to ${email}`}
                            </p>
                        </div>

                        {/* STATUS ALERTS */}
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

                        {/* STEP 1: ENTER EMAIL */}
                        {step === 'email' && (
                            <form className="auth-form login-form" onSubmit={handleSendOtp}>
                                <div className="field login-field">
                                    <label htmlFor="login-email">
                                        Email Address
                                    </label>

                                    <div className="login-input-wrap">
                                        <FiMail />
                                        <input
                                            id="login-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary submit login-submit"
                                    disabled={loading}
                                >
                                    <span>{loading ? 'SENDING CODE...' : 'SEND LOGIN CODE'}</span>
                                    <FiArrowRight />
                                </button>
                            </form>
                        )}

                        {/* STEP 2: ENTER OTP */}
                        {step === 'otp' && (
                            <form className="auth-form login-form" onSubmit={handleVerifyOtp}>
                                <div className="field login-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label htmlFor="login-otp" style={{ margin: 0 }}>
                                            6-Digit OTP Code
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => { setStep('email'); setError(''); }}
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
                                            Change Email
                                        </button>
                                    </div>

                                    <div className="login-input-wrap">
                                        <FiKey />
                                        <input
                                            id="login-otp"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            required
                                            placeholder="• • • • • •"
                                            autoFocus
                                            style={{
                                                letterSpacing: '8px',
                                                fontSize: '20px',
                                                fontWeight: '700'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                    <span style={{ color: '#888' }}>Didn't receive code?</span>
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
                                    className="btn btn-primary submit login-submit"
                                    disabled={loading || otp.length < 6}
                                >
                                    <span>{loading ? 'VERIFYING...' : 'VERIFY & LOGIN'}</span>
                                    <FiArrowRight />
                                </button>
                            </form>
                        )}

                        {/* SECURITY */}
                        <div className="login-security">
                            <FiShield />
                            <div>
                                <strong>Secure & Private</strong>
                                <span>
                                    Passwordless authentication powered by email OTP.
                                </span>
                            </div>
                        </div>

                        {/* SIGNUP */}
                        <div className="login-register">
                            <span>Don't have an account?</span>
                            <Link to="/signup">
                                Create Account
                                <FiArrowRight />
                            </Link>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}
