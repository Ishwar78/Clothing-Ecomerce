import React, { useState } from 'react';
import {
    FiMessageCircle,
    FiMail,
    FiPhone,
    FiHelpCircle,
    FiSend,
    FiCheckCircle
} from 'react-icons/fi';
import api from '../lib/api';
import './Support.css';

export default function Support(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            alert('Please fill in your name, email, and message.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/tickets', {
                userName: name.trim(),
                userEmail: email.trim(),
                subject: subject.trim() || 'Website Support Inquiry',
                category: 'General Inquiry',
                message: message.trim(),
                priority: 'Medium'
            });

            if (res.success) {
                setSubmitted(true);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
                alert('Support request submitted successfully! Ticket ID: ' + res.ticket.ticketId);
            } else {
                alert(res.message || 'Failed to submit inquiry');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="support-page container">
            <div className="simple-title">
                <span className="pill">WE’RE HERE TO HELP</span>
                <h1>Support Center</h1>
                <p>Find answers or send our team a direct message.</p>
            </div>
            <div className="support-grid">
                <div className="support-card">
                    <FiMessageCircle/>
                    <h3>Live Support</h3>
                    <p>Chat with our customer support team.</p>
                    <a href="mailto:hello@Joyfulmartsstore.in" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>Contact Us</a>
                </div>
                <div className="support-card">
                    <FiPhone/>
                    <h3>Call Us</h3>
                    <p>Mon–Sat, 10 AM to 6 PM</p>
                    <b>+91 98765 43210</b>
                </div>
                <div className="support-card">
                    <FiMail/>
                    <h3>Email</h3>
                    <p>We reply within 24 hours.</p>
                    <b>hello@Joyfulmartsstore.in</b>
                </div>
                <div className="support-card">
                    <FiHelpCircle/>
                    <h3>FAQs</h3>
                    <p>Orders, shipping, returns and payments.</p>
                    <a href="/faq" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>View FAQs</a>
                </div>
            </div>

            <div className="support-form">
                <h2>Send an Inquiry</h2>
                {submitted && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', color: '#166534', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiCheckCircle /> Your ticket has been received! Our support team will reach out to you shortly.
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field">
                            <label>Name *</label>
                            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                        </div>
                        <div className="field">
                            <label>Email *</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" />
                        </div>
                        <div className="field full">
                            <label>Subject</label>
                            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Topic of your inquiry" />
                        </div>
                        <div className="field full">
                            <label>Message *</label>
                            <textarea required rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder="How can our customer support team help you?" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '12px' }}>
                        <FiSend /> {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
