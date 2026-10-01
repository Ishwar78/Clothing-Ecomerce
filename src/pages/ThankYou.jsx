import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheck, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import './ThankYou.css';

export default function ThankYou() {
  const nav = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || `SBV-${Math.floor(100000 + Math.random() * 899999)}`;

  return (
    <div className="thank-page">
      <div className="thank-card">
        <div className="check"><FiCheck /></div>
        <span className="pill">ORDER CONFIRMED</span>
        <h1>Thank You for Shopping!</h1>
        <p>Your order has been placed successfully. We’ve sent the order details to your email and registered account.</p>
        <div className="order-number">Order #{orderId}</div>
        <div className="thank-actions">
          <button className="btn btn-primary" onClick={() => nav('/dashboard')}>
            <FiShoppingBag /> View My Orders
          </button>
          <button className="btn btn-outline" onClick={() => nav('/shop')}>
            Continue Shopping <FiArrowRight />
          </button>
        </div>
        <small>Need help? Visit our Support page anytime.</small>
      </div>
    </div>
  );
}
