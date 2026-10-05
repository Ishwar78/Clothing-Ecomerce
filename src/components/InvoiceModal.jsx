import React, { useState, useEffect } from 'react';
import { FiPrinter, FiX, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import api from '../lib/api';
import './InvoiceModal.css';

export default function InvoiceModal({ order, onClose }) {
  const [company, setCompany] = useState({
    companyName: 'Shree Balaji Vastraalaya',
    tagline: 'Joyfulmarts Fashion Store - Complete Family Wear',
    gstin: '06ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    phone: '+91 98765 43210',
    email: 'billing@shreebalaji.com',
    address: 'Shop No. 12-14, Shree Balaji Complex, Main Cloth Market',
    city: 'Rohtak',
    state: 'Haryana',
    pincode: '124001',
    invoicePrefix: 'INV-Joyfulmarts-',
    terms: '1. Goods once sold can be returned/exchanged within 7 days in unused condition with original tags.\n2. All disputes are subject to Rohtak jurisdiction.\n3. This is a computer-generated tax invoice.',
    authorizedSignatory: 'For Shree Balaji Vastraalaya'
  });

  useEffect(() => {
    api.get('/company').then((res) => {
      if (res.success && res.company) {
        setCompany(res.company);
      }
    }).catch(err => console.error('Error fetching company for invoice:', err));
  }, []);

  if (!order) return null;

  const orderId = order.orderId || order._id || 'ORD-000000';
  const prefix = company.invoicePrefix || 'INV-Joyfulmarts-';
  const invoiceNum = prefix + (orderId.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000));
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const address = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Math.round(Number(order.subtotal || order.totalAmount || 0));
  const discount = Math.round(Number(order.discount || 0));
  const shippingFee = Math.round(Number(order.shippingFee || 0));
  const total = Math.round(Number(order.totalAmount || subtotal - discount + shippingFee));

  const isOnline = order.paymentMethod === 'Online';
  const isPaid = order.paymentStatus === 'Paid' || isOnline;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-container" onClick={e => e.stopPropagation()}>
        
        {/* TOP BAR (NOT PRINTED) */}
        <div className="invoice-modal-actions no-print">
          <div className="invoice-actions-left">
            <FiFileText size={18} />
            <span>Tax Invoice / Retail Bill</span>
          </div>
          <div className="invoice-actions-right">
            <button type="button" className="invoice-print-btn" onClick={handlePrint}>
              <FiPrinter /> Print / Save PDF
            </button>
            <button type="button" className="invoice-close-btn" onClick={onClose} title="Close">
              <FiX />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE SHEET */}
        <div className="invoice-sheet" id="printable-invoice">
          
          {/* HEADER */}
          <div className="invoice-header">
            <div className="invoice-brand">
              <div className="invoice-logo-badge">✦ Joyfulmarts ✦</div>
              <h2>{company.companyName}</h2>
              <p className="invoice-tagline">{company.tagline}</p>
              <p className="invoice-address-line">
                {company.address}, {company.city}, {company.state} - {company.pincode}
              </p>
              <p className="invoice-contact-line">
                <span>Phone: <b>{company.phone}</b></span> • <span>Email: <b>{company.email}</b></span>
              </p>
              <div className="invoice-gst-badge">
                GSTIN: <strong>{company.gstin}</strong> {company.panNumber ? ` | PAN: ${company.panNumber}` : ''}
              </div>
            </div>

            <div className="invoice-meta-box">
              <div className="invoice-type-tag">TAX INVOICE</div>
              <div className="invoice-meta-row">
                <span>Invoice No:</span>
                <strong>{invoiceNum}</strong>
              </div>
              <div className="invoice-meta-row">
                <span>Order ID:</span>
                <strong>{orderId}</strong>
              </div>
              <div className="invoice-meta-row">
                <span>Date:</span>
                <strong>{orderDate}</strong>
              </div>
              <div className="invoice-meta-row">
                <span>Payment Mode:</span>
                <span className={`payment-pill ${isOnline ? 'online' : 'cod'}`}>
                  {isOnline ? 'Online (Prepaid)' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="invoice-meta-row">
                <span>Payment Status:</span>
                <span className={`status-pill-small ${isPaid ? 'paid' : 'pending'}`}>
                  {isPaid ? 'PAID' : 'PENDING (COD)'}
                </span>
              </div>
            </div>
          </div>

          <div className="invoice-divider" />

          {/* CUSTOMER & SHIPPING DETAILS */}
          <div className="invoice-parties">
            <div className="invoice-party-col">
              <h4>Billed To & Shipped To:</h4>
              <p className="customer-name">{address.fullName || order.user?.name || 'Customer'}</p>
              <p className="customer-addr">
                {address.address}<br />
                {address.city ? `${address.city}, ` : ''}{address.state ? `${address.state} - ` : ''}{address.pincode || ''}
              </p>
              <p className="customer-contact">
                <strong>Phone:</strong> {address.phone || order.user?.phone || 'N/A'}<br />
                {address.email || order.user?.email ? (
                  <><strong>Email:</strong> {address.email || order.user?.email}</>
                ) : null}
              </p>
            </div>

            <div className="invoice-party-col right">
              <h4>Order Summary Details:</h4>
              <div className="mini-meta">
                <p><strong>Order Status:</strong> {order.orderStatus || 'Processing'}</p>
                <p><strong>Total Items:</strong> {items.reduce((s, it) => s + (Number(it.quantity) || 1), 0)} pcs</p>
                {order.razorpayPaymentId && (
                  <p><strong>Razorpay Ref:</strong> {order.razorpayPaymentId}</p>
                )}
                <p><strong>Place of Supply:</strong> {address.state || company.state}</p>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Item Description</th>
                <th style={{ width: '70px', textAlign: 'center' }}>Size</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Color</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Unit Price</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const itemPrice = Math.round(Number(item.price) || 0);
                const itemQty = Number(item.quantity) || 1;
                const itemTotal = itemPrice * itemQty;
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="invoice-item-desc">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="invoice-item-img no-print" 
                            onError={e => { e.target.style.display = 'none'; }} 
                          />
                        )}
                        <div>
                          <strong>{item.name}</strong>
                          {item.productId && <small className="item-sku">Item ID: {item.productId.slice(-8)}</small>}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="spec-badge">{item.size || 'Free Size'}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {item.color ? (
                        <span className="spec-badge color">{item.color}</span>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>{itemQty}</td>
                    <td style={{ textAlign: 'right' }}>₹{itemPrice.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>₹{itemTotal.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* TOTALS & SUMMARY */}
          <div className="invoice-summary-wrap">
            <div className="invoice-terms-col">
              <h5>Terms & Conditions:</h5>
              <pre className="invoice-terms-text">{company.terms}</pre>
            </div>

            <div className="invoice-totals-col">
              <div className="total-row">
                <span>Subtotal (MRP/Items Total):</span>
                <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
              </div>

              {discount > 0 && (
                <div className="total-row discount">
                  <span>Coupon / Instant Discount:</span>
                  <strong>- ₹{discount.toLocaleString('en-IN')}</strong>
                </div>
              )}

              <div className="total-row">
                <span>Shipping / Delivery:</span>
                <strong style={{ color: shippingFee > 0 ? '#333' : '#059669' }}>
                  {shippingFee > 0 ? `₹${shippingFee.toLocaleString('en-IN')}` : 'FREE'}
                </strong>
              </div>

              <div className="total-row grand-total">
                <span>Final Payable Amount:</span>
                <strong>₹{total.toLocaleString('en-IN')}</strong>
              </div>

              <div className="tax-inclusive-note">
                (Inclusive of all applicable GST & Taxes)
              </div>
            </div>
          </div>

          {/* SIGNATURE & FOOTER */}
          <div className="invoice-footer-sign">
            <div className="invoice-sign-left">
              <p>Thank you for shopping with <strong>{company.companyName}</strong>!</p>
              <small>For any queries, WhatsApp or Call: {company.phone}</small>
            </div>
            <div className="invoice-sign-right">
              <p className="auth-sign-title">{company.authorizedSignatory}</p>
              <div className="sign-stamp-box">
                <span>[ Digitally Verified ]</span>
              </div>
              <small>Authorized Signatory</small>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
