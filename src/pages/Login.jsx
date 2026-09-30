import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiArrowRight,
    FiEye,
    FiEyeOff,
    FiLock,
    FiMail,
    FiShield
} from 'react-icons/fi';
import './Login.css';

export default function Login() {
    const nav = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) return;

        setLoading(true);
        setError('');
        
        try {
            const api = (await import('../lib/api')).default;
            const res = await api.post('/users/login', { email, password });
            
            if (res.success) {
                localStorage.setItem('userToken', res.token);
                localStorage.setItem('userData', JSON.stringify(res.user));
                nav('/dashboard');
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login');
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
                            <span className="pill">WELCOME BACK</span>

                            <h2>Login to your account</h2>

                            <p>
                                Enter your details below to continue your
                                shopping journey.
                            </p>
                        </div>

                        {error && <div style={{color:'red', fontSize:'13px', marginBottom:'15px'}}>{error}</div>}
                        <form
                            className="auth-form login-form"
                            onSubmit={handleSubmit}
                        >

                            {/* EMAIL */}
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
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="field login-field">
                                <div className="password-label-row">
                                    <label htmlFor="login-password">
                                        Password
                                    </label>

                                    <a
                                        href="#forgot-password"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <div className="login-input-wrap">
                                    <FiLock />

                                    <input
                                        id="login-password"
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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

                            {/* REMEMBER */}
                            <label className="remember-row">
                                <input type="checkbox" />
                                <span>Keep me signed in</span>
                            </label>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="btn btn-primary submit login-submit"
                            >
                                <span>{loading ? 'LOGGING IN...' : 'LOGIN TO SBV'}</span>
                                <FiArrowRight />
                            </button>
                        </form>

                        {/* SECURITY */}
                        <div className="login-security">
                            <FiShield />

                            <div>
                                <strong>Secure & Private</strong>
                                <span>
                                    Your account information is protected.
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
