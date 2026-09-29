import React from 'react';
import {
    FiMessageCircle,
    FiMail,
    FiPhone,
    FiHelpCircle
} from 'react-icons/fi';
import './Support.css';
export default function Support(){
    return <div className="support-page container">
        <div className="simple-title">
            <span className="pill">WE’RE HERE TO HELP</span>
            <h1>Support Center</h1>
            <p>Find answers or send our team a message.</p>
            </div>
            <div className="support-grid">
                <div className="support-card">
                    <FiMessageCircle/>
                    <h3>Live Support</h3>
                    <p>Chat with our customer support team.</p>
                    <button className="btn btn-outline">Start Chat</button>
                    </div>
                    <div className="support-card">
                        <FiPhone/>
                        <h3>Call Us</h3>
                        <p>Mon–Sat, 10 AM to 6 PM</p>
                        <b>+91 98765 43210</b>
                        </div>
                        <div className="support-card"><FiMail/>
                        <h3>Email</h3>
                        <p>We reply within 24 hours.</p>
                        <b>hello@sbvstore.in</b>
                        </div>
                        <div className="support-card">
                            <FiHelpCircle/><h3>FAQs</h3>
                            <p>Orders, shipping, returns and payments.</p>
                            <button className="btn btn-outline">View FAQs</button>
                            </div>
                            </div>
                            <div className="support-form">
                                <h2>Send an Inquiry</h2>
                                <div className="form-grid">
                                    <div className="field">
                                        <label>Name</label>
                                        <input/>
                                        </div>
                                        <div className="field">
                                            <label>Email</label>
                                            <input type="email"/>
                                            </div>
                                            <div className="field full">
                                                <label>Message</label>
                                                <textarea rows="5"/></div>
                                                </div><button className="btn btn-primary">Submit Request</button>
                                                </div></div>}
