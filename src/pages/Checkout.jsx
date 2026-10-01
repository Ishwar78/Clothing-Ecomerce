import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLock,
  FiTag,
  FiCheckCircle,
  FiCreditCard,
  FiTruck,
  FiAlertCircle,
  FiMapPin,
  FiPlus,
  FiX
} from 'react-icons/fi';
import api from '../lib/api';
import './Checkout.css';

export default function Checkout() {
  const nav = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const [items, setItems] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('userData'));
      if (savedUser) {
        setCurrentUser(savedUser);
        setFormData(prev => ({
          ...prev,
          fullName: savedUser.name || '',
          email: savedUser.email || '',
          phone: savedUser.phone || ''
        }));

        // Fetch saved addresses from server
        const email = savedUser.email || '';
        const userId = savedUser.id || savedUser._id || '';
        api.get(`/users/addresses?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`)
          .then(res => {
            if (res.success && res.addresses && res.addresses.length > 0) {
              setSavedAddresses(res.addresses);
              // Select first address by default
              const firstAddr = res.addresses[0];
              setSelectedAddressId(firstAddr._id);
              setFormData(prev => ({
                ...prev,
                fullName: firstAddr.fullName || prev.fullName,
                phone: firstAddr.phone || prev.phone,
                email: firstAddr.email || prev.email,
                address: firstAddr.address,
                city: firstAddr.city,
                state: firstAddr.state,
                pincode: firstAddr.pincode
              }));
            }
          })
          .catch(err => console.error('Fetch saved addresses error:', err));
      }
    } catch {
      // ignore
    }

    // Load active coupons
    api.get('/coupons?activeOnly=true')
      .then(res => {
        if (res.success) {
          setAvailableCoupons(res.coupons || []);
        }
      })
      .catch(err => console.error('Fetch coupons error:', err));

    try {
      const cart = JSON.parse(localStorage.getItem('sbv-cart') || '[]');
      setItems(cart);
    } catch {
      setItems([]);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setFormData(prev => ({
      ...prev,
      fullName: addr.fullName,
      phone: addr.phone,
      email: addr.email || prev.email,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode
    }));
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId('new');
    setFormData(prev => ({
      ...prev,
      address: '',
      city: '',
      state: '',
      pincode: ''
    }));
  };

  const subtotal = items.reduce((s, p) => s + (Number(p.price) || 0) * (Number(p.quantity) || 1), 0);
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal + shippingFee - discount);

  // Validate and Apply Coupon
  const applyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput || '').trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.post('/coupons/validate', {
        code,
        subtotal
      });

      if (res.success && res.valid) {
        setDiscount(res.discount);
        setAppliedCoupon(res.coupon);
        setCouponInput(code);
        setCouponSuccess(res.message || `Coupon "${code}" applied! Saved ₹${res.discount}`);
      } else {
        setCouponError(res.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError(err.message || 'Failed to validate coupon code');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Load Razorpay script if not already loaded
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!items.length) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim() || !formData.city.trim() || !formData.state.trim()) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        user: {
          id: currentUser?.id || currentUser?._id || '',
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: items.map(item => ({
          productId: item.productId || item.id || item._id,
          name: item.name,
          image: item.image,
          size: item.size || 'M',
          color: item.color || '',
          price: Number(item.price),
          quantity: Number(item.quantity) || 1
        })),
        subtotal,
        shippingFee,
        discount,
        couponCode: appliedCoupon?.code || '',
        totalAmount: total,
        paymentMethod
      };

      // 1. CASH ON DELIVERY FLOW
      if (paymentMethod === 'COD') {
        const res = await api.post('/orders', orderPayload);
        if (res.success) {
          localStorage.removeItem('sbv-cart');
          nav('/thank-you', { state: { orderId: res.order.orderId } });
        } else {
          setError(res.message || 'Failed to place order.');
        }
        setLoading(false);
        return;
      }

      // 2. ONLINE PAYMENT (RAZORPAY) FLOW
      if (paymentMethod === 'Online') {
        const scriptLoaded = await loadRazorpay();
        if (!scriptLoaded) {
          setError('Failed to load Razorpay payment gateway. Please check internet connection or select COD.');
          setLoading(false);
          return;
        }

        // Call backend to create Razorpay Order
        const rzpRes = await api.post('/orders/razorpay-order', { amount: total });
        if (!rzpRes.success || !rzpRes.order) {
          setError(rzpRes.message || 'Could not initiate Razorpay payment.');
          setLoading(false);
          return;
        }

        const rzpOrder = rzpRes.order;
        const keyId = rzpRes.keyId;

        const options = {
          key: keyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency || 'INR',
          name: 'S S Vastralaya',
          description: `Order Payment (#${rzpOrder.id})`,
          order_id: rzpOrder.id,
          prefill: {
            name: formData.fullName,
            email: formData.email || '',
            contact: formData.phone || ''
          },
          theme: {
            color: '#e11b22'
          },
          handler: async function (response) {
            setLoading(true);
            try {
              const fullOrderPayload = {
                ...orderPayload,
                paymentMethod: 'Online',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              };

              const createRes = await api.post('/orders', fullOrderPayload);
              if (createRes.success) {
                localStorage.removeItem('sbv-cart');
                nav('/thank-you', { state: { orderId: createRes.order.orderId } });
              } else {
                setError(createRes.message || 'Payment received but failed to record order.');
              }
            } catch (err) {
              console.error('Order save error after payment:', err);
              setError('Payment was successful, but saving order failed: ' + err.message);
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const paymentWindow = new window.Razorpay(options);
        paymentWindow.on('payment.failed', function (resp) {
          setError(`Payment Failed: ${resp.error.description || resp.error.reason || 'Transaction could not be completed'}`);
          setLoading(false);
        });

        paymentWindow.open();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'An unexpected error occurred during checkout');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-head">
        <span className="pill">SECURE CHECKOUT</span>
        <h1>Complete Your Order</h1>
        <p><FiLock /> Your payment information is 100% protected and encrypted.</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fff1f0',
          border: '1px solid #ffa39e',
          color: '#cf1322',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FiAlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        <section className="checkout-form">

          {/* CONTACT INFO */}
          <div className="checkout-card">
            <h2>Contact Information</h2>
            <div className="form-grid">
              <div className="field">
                <label>Email Address <span style={{ color: '#e11b22' }}>*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="field">
                <label>Phone Number <span style={{ color: '#e11b22' }}>*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          </div>

          {/* DELIVERY ADDRESS (SAVED ADDRESSES OR NEW) */}
          <div className="checkout-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ margin: 0 }}>Delivery Address</h2>
              {savedAddresses.length > 0 && (
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>
                  ✓ {savedAddresses.length} Saved Address{savedAddresses.length > 1 ? 'es' : ''} Found
                </span>
              )}
            </div>

            {/* If user has saved addresses, display selection cards */}
            {savedAddresses.length > 0 && (
              <div className="saved-addresses-list">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                    <div
                      key={addr._id}
                      className={`saved-addr-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectSavedAddress(addr)}
                    >
                      <input
                        type="radio"
                        name="savedAddrRadio"
                        checked={isSelected}
                        onChange={() => handleSelectSavedAddress(addr)}
                      />
                      <div className="saved-addr-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong>{addr.fullName}</strong>
                          {isSelected && <span style={{ fontSize: '10px', background: '#e11b22', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Deliver Here</span>}
                        </div>
                        <p>{addr.address}</p>
                        <p>{addr.city}, {addr.state} - <b>{addr.pincode}</b></p>
                        <small>Phone: {addr.phone}</small>
                      </div>
                    </div>
                  );
                })}

                {/* Option for New Address */}
                <div
                  className={`saved-addr-card ${selectedAddressId === 'new' ? 'selected' : ''}`}
                  onClick={handleSelectNewAddress}
                  style={{ borderStyle: 'dashed' }}
                >
                  <input
                    type="radio"
                    name="savedAddrRadio"
                    checked={selectedAddressId === 'new'}
                    onChange={handleSelectNewAddress}
                  />
                  <div className="saved-addr-details">
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11b22' }}>
                      <FiPlus /> Deliver to a New / Different Address
                    </strong>
                    <small>Enter a new delivery destination for this order</small>
                  </div>
                </div>
              </div>
            )}

            {/* Input fields shown if 'new' address is chosen OR user has no saved addresses */}
            {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
              <div className="form-grid" style={{ marginTop: savedAddresses.length > 0 ? '16px' : '0' }}>
                <div className="field">
                  <label>Full Name <span style={{ color: '#e11b22' }}>*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Receiver's name"
                  />
                </div>

                <div className="field">
                  <label>PIN Code <span style={{ color: '#e11b22' }}>*</span></label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 124001"
                  />
                </div>

                <div className="field full">
                  <label>Complete Address <span style={{ color: '#e11b22' }}>*</span></label>
                  <textarea
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House / Flat No., Street, Landmark, Area..."
                  />
                </div>

                <div className="field">
                  <label>City <span style={{ color: '#e11b22' }}>*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rohtak"
                  />
                </div>

                <div className="field">
                  <label>State <span style={{ color: '#e11b22' }}>*</span></label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Haryana"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD */}
          <div className="checkout-card">
            <h2>Payment Method</h2>

            <label className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="pay"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              <div>
                <strong>Cash on Delivery (COD)</strong>
                <span>Pay in cash when order is delivered to your doorstep. (No extra charges)</span>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'Online' ? 'active' : ''}`} style={{ cursor: 'pointer', marginTop: '10px' }}>
              <input
                type="radio"
                name="pay"
                value="Online"
                checked={paymentMethod === 'Online'}
                onChange={() => setPaymentMethod('Online')}
              />
              <div>
                <strong>UPI / Card / Net Banking (Razorpay)</strong>
                <span>Instant secure payment via Google Pay, PhonePe, Paytm, Cards & NetBanking.</span>
              </div>
            </label>
          </div>

        </section>

        {/* ORDER REVIEW ASIDE */}
        <aside className="order-review">
          <h2>Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</h2>

          <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '15px' }}>
            {items.length ? (
              items.map((p, i) => (
                <div className="review-item" key={i}>
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=150&q=70'}
                    alt={p.name}
                    style={{ width: '55px', height: '65px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <strong>{p.name}</strong>
                    <small>Qty {p.quantity || 1} • Size {p.size || 'M'} {p.color ? `• Color ${p.color}` : ''}</small>
                  </div>
                  <b>₹{((Number(p.price) || 0) * (Number(p.quantity) || 1)).toLocaleString()}</b>
                </div>
              ))
            ) : (
              <p style={{ color: '#888', padding: '15px 0' }}>Your cart is empty.</p>
            )}
          </div>

          {/* COUPON INPUT */}
          <div className="coupon">
            <div>
              <FiTag />
              <input
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <button type="button" onClick={() => applyCoupon(couponInput)}>
              APPLY
            </button>
          </div>

          {/* COUPON FEEDBACK */}
          {couponError && (
            <p style={{ color: '#e11b22', fontSize: '12px', margin: '4px 0 8px' }}>
              ⚠ {couponError}
            </p>
          )}

          {discount > 0 && appliedCoupon && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '6px',
              padding: '6px 10px',
              margin: '6px 0 12px'
            }}>
              <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold' }}>
                ✓ {appliedCoupon.code} applied: -₹{discount}
              </span>
              <button
                type="button"
                onClick={removeCoupon}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <FiX size={14} /> Remove
              </button>
            </div>
          )}

          {/* AVAILABLE COUPONS LIST SHOWN BELOW INPUT */}
          {availableCoupons.length > 0 && (
            <div className="available-coupons-box">
              <div className="available-coupons-title">
                <FiTag size={13} /> Available Coupons for You
              </div>

              <div className="coupon-chips-list">
                {availableCoupons.map((c) => {
                  const isCurrent = appliedCoupon?.code === c.code;
                  const discountLabel = c.discountType === 'percentage'
                    ? `${c.discountValue}% OFF`
                    : `Flat ₹${c.discountValue} OFF`;

                  return (
                    <div className="coupon-chip" key={c._id}>
                      <div className="coupon-chip-left">
                        <span className="coupon-chip-code">{c.code}</span>
                        <span className="coupon-chip-desc">
                          {discountLabel} {c.minOrderAmount > 0 ? `(Orders above ₹${c.minOrderAmount})` : ''}
                        </span>
                      </div>

                      {isCurrent ? (
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>
                          ✓ Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="coupon-chip-apply"
                          onClick={() => applyCoupon(c.code)}
                        >
                          APPLY
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="sum">
            <span>Subtotal</span>
            <b>₹{subtotal.toLocaleString()}</b>
          </div>

          <div className="sum">
            <span>Shipping</span>
            <b>{subtotal >= 999 || subtotal === 0 ? 'FREE' : '₹99'}</b>
          </div>

          {discount > 0 && (
            <div className="sum" style={{ color: '#16a34a' }}>
              <span>Coupon Discount</span>
              <b>-₹{discount.toLocaleString()}</b>
            </div>
          )}

          <hr />

          <div className="sum total">
            <span>Total Payable</span>
            <b style={{ color: '#e11b22', fontSize: '20px' }}>₹{total.toLocaleString()}</b>
          </div>

          <button
            type="submit"
            className="btn btn-primary place"
            disabled={loading || !items.length}
            style={{ width: '100%', marginTop: '15px', padding: '14px', fontSize: '16px', fontWeight: 'bold' }}
          >
            {loading ? 'PROCESSING ORDER...' : paymentMethod === 'Online' ? `PAY WITH RAZORPAY ₹${total.toLocaleString()}` : `PLACE ORDER (COD) ₹${total.toLocaleString()}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
