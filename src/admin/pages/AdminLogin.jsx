import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import './AdminLogin.css';

export default function AdminLogin() {
    const nav = useNavigate();
    const [email, setEmail] = useState('Clothing@gmail.com');
    const [password, setPassword] = useState('Clothing@1234#');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.success) {
                localStorage.setItem('adminToken', res.token);
                nav('/admin');
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
        <div className="admin-login">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    ✦ SBV ✦<small>ADMIN PANEL</small>
                </div>
                <h1>Welcome Back</h1>
                <p>Sign in to manage your fashion store.</p>
                <form onSubmit={handleLogin}>
                    <div className="field">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && <div style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{error}</div>}
                    <label className="remember"><input type="checkbox" /> Remember me</label>
                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? 'LOGGING IN...' : 'LOGIN TO ADMIN'}
                    </button>
                </form>
            </div>
        </div>
    );
}
