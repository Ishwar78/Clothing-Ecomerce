import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiShoppingBag,
  FiHeadphones,
  FiLogOut,
  FiEdit3,
  FiMapPin,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiShield,
  FiX,
  FiCreditCard,
  FiPlus,
  FiTrash2,
  FiBox,
  FiCheck
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import api from "../lib/api";

export default function UserDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState('profile');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userData')); } catch { return null; }
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Fetch user orders
  const fetchUserOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const email = user.email || '';
      const userId = user.id || user._id || '';
      const phone = user.phone || '';
      const res = await api.get(`/orders/my-orders?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}&phone=${encodeURIComponent(phone)}`);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch saved addresses
  const fetchSavedAddresses = async () => {
    if (!user) return;
    setAddressesLoading(true);
    try {
      const email = user.email || '';
      const userId = user.id || user._id || '';
      const res = await api.get(`/users/addresses?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`);
      if (res.success) {
        setSavedAddresses(res.addresses || []);
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    fetchSavedAddresses();

    try {
      const w = JSON.parse(localStorage.getItem('sbv-wishlist') || '[]');
      setWishlistCount(w.length);
    } catch {
      setWishlistCount(0);
    }

    try {
      const c = JSON.parse(localStorage.getItem('sbv-cart') || '[]');
      setCartCount(c.length);
    } catch {
      setCartCount(0);
    }
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.address || !newAddr.pincode || !newAddr.city || !newAddr.state) {
      alert('Please fill all address fields');
      return;
    }

    try {
      const res = await api.post('/users/addresses', {
        email: user.email,
        userId: user.id || user._id,
        address: newAddr
      });

      if (res.success) {
        setSavedAddresses(res.addresses || []);
        setShowAddAddress(false);
        setNewAddr({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });
        alert('Address saved successfully!');
      } else {
        alert(res.message || 'Failed to save address');
      }
    } catch (err) {
      alert('Error saving address: ' + err.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      const res = await api.delete(`/users/addresses/${addressId}?email=${encodeURIComponent(user.email)}&userId=${encodeURIComponent(user.id || user._id || '')}`);
      if (res.success) {
        setSavedAddresses(res.addresses || []);
      }
    } catch (err) {
      alert('Error removing address: ' + err.message);
    }
  };

  const buttons = [
    ["profile", "Profile", FiUser],
    ["orders", "My Orders", FiPackage],
    ["addresses", "Saved Addresses", FiMapPin],
    ["wishlist", "Wishlist", FiHeart],
    ["cart", "Cart", FiShoppingBag],
    ["support", "Support", FiHeadphones],
  ];

  const handleNavigation = (id) => {
    if (id === "support") {
      nav('/contact-us');
      return;
    }
    setTab(id);
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return FiCheckCircle;
      case 'Shipped':
        return FiTruck;
      default:
        return FiClock;
    }
  };

  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;
  const inTransitCount = orders.filter(o => o.orderStatus === 'Shipped' || o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed').length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* HEADER */}
        <section className="dashboard-head">
          <div className="dashboard-welcome">
            <span className="dashboard-pill">
              <FiUser />
              MY ACCOUNT
            </span>

            <h1>
              Welcome back, <em>{user?.name ? user.name.split(' ')[0] : 'Fashion Lover'}</em>
            </h1>

            <p>
              Manage your profile, live orders, saved addresses, wishlist and support requests.
            </p>
          </div>

          <div className="dashboard-user-mini">
            <div className="dashboard-avatar">
              <FiUser />
            </div>

            <div>
              <strong>{user?.name || 'SBV Customer'}</strong>
              <span>{user?.email || 'Premium Member'}</span>
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="dashboard-stats">

          <div className="dashboard-stat-card" onClick={() => setTab('orders')} style={{ cursor: 'pointer' }}>
            <div className="dashboard-stat-icon">
              <FiPackage />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card" onClick={() => setTab('addresses')} style={{ cursor: 'pointer' }}>
            <div className="dashboard-stat-icon">
              <FiMapPin />
            </div>

            <div>
              <span>Saved Addresses</span>
              <strong>{savedAddresses.length}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card" onClick={() => setTab('wishlist')} style={{ cursor: 'pointer' }}>
            <div className="dashboard-stat-icon">
              <FiHeart />
            </div>

            <div>
              <span>Wishlist Items</span>
              <strong>{wishlistCount}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card" onClick={() => setTab('cart')} style={{ cursor: 'pointer' }}>
            <div className="dashboard-stat-icon">
              <FiShoppingBag />
            </div>

            <div>
              <span>Cart Items</span>
              <strong>{cartCount}</strong>
            </div>
          </div>

        </section>

        {/* MAIN LAYOUT */}
        <div className="dashboard-layout">

          {/* SIDEBAR */}
          <aside className="user-sidebar">

            <div className="sidebar-profile">
              <div className="sidebar-avatar">
                <FiUser />
              </div>

              <div>
                <strong>{user?.name || 'SBV Customer'}</strong>
                <span>{user?.phone || 'Customer'}</span>
              </div>
            </div>

            <div className="sidebar-menu">
              <span className="sidebar-label">NAVIGATION</span>
              {buttons.map(([id, label, Icon]) => {
                const isActive = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    className={isActive ? "active" : ""}
                    onClick={() => handleNavigation(id)}
                  >
                    <span className="sidebar-icon">
                      <Icon />
                    </span>
                    <span className="sidebar-button-text">{label}</span>
                    {id === 'orders' && orders.length > 0 && (
                      <span className="sidebar-badge">{orders.length}</span>
                    )}
                    {id === 'addresses' && savedAddresses.length > 0 && (
                      <span className="sidebar-badge" style={{ backgroundColor: '#2563eb' }}>{savedAddresses.length}</span>
                    )}
                    {id === 'wishlist' && wishlistCount > 0 && (
                      <span className="sidebar-badge" style={{ backgroundColor: '#db2777' }}>{wishlistCount}</span>
                    )}
                    <FiArrowRight className="sidebar-arrow" />
                  </button>
                );
              })}

              <div className="sidebar-divider" />

              <button
                type="button"
                className="logout-button"
                onClick={() => {
                  localStorage.removeItem('userToken');
                  localStorage.removeItem('userData');
                  nav('/');
                }}
              >
                <span className="sidebar-icon">
                  <FiLogOut />
                </span>
                <span className="sidebar-button-text">Logout</span>
                <FiArrowRight className="sidebar-arrow" />
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="user-content">

            {/* PROFILE */}
            {tab === "profile" && (
              <div className="user-card profile-card">
                <div className="content-heading">
                  <div>
                    <span className="content-eyebrow">ACCOUNT SETTINGS</span>
                    <h2>Profile Details</h2>
                    <p>Your verified customer contact details.</p>
                  </div>
                  <div className="content-heading-icon">
                    <FiEdit3 />
                  </div>
                </div>

                <div className="profile-banner">
                  <div className="profile-banner-avatar">
                    <FiUser />
                  </div>
                  <div>
                    <strong>{user?.name || 'SBV Customer'}</strong>
                    <span>Member since 2026</span>
                  </div>
                </div>

                <div className="section-small-title">Personal Information</div>

                <div className="form-grid">
                  <div className="field">
                    <label><FiUser /> Full Name</label>
                    <input type="text" readOnly value={user?.name || "SBV Customer"} />
                  </div>

                  <div className="field">
                    <label><FiMail /> Email Address</label>
                    <input type="email" readOnly value={user?.email || "customer@example.com"} />
                  </div>

                  <div className="field">
                    <label><FiPhone /> Phone Number</label>
                    <input type="tel" readOnly value={user?.phone || "9876543210"} />
                  </div>

                  <div className="field">
                    <label><FiMapPin /> Default Delivery Address</label>
                    <input
                      type="text"
                      readOnly
                      value={savedAddresses[0] ? `${savedAddresses[0].city}, ${savedAddresses[0].state} (${savedAddresses[0].pincode})` : "Not added yet"}
                    />
                  </div>
                </div>

                <div className="account-security" style={{ marginTop: '25px' }}>
                  <div className="security-icon">
                    <FiShield />
                  </div>
                  <div>
                    <strong>Your account is secure</strong>
                    <p>Orders and payment data are protected with secure SSL encryption.</p>
                  </div>
                </div>
              </div>
            )}

            {/* MY ORDERS */}
            {tab === "orders" && (
              <div className="user-card">
                <div className="content-heading">
                  <div>
                    <span className="content-eyebrow">SHOPPING ACTIVITY</span>
                    <h2>My Orders</h2>
                    <p>Track your delivery progress and review order history.</p>
                  </div>
                  <div className="content-heading-icon">
                    <FiPackage />
                  </div>
                </div>

                <div className="orders-summary">
                  <div>
                    <span>All Orders</span>
                    <strong>{orders.length}</strong>
                  </div>
                  <div>
                    <span>Delivered</span>
                    <strong>{deliveredCount}</strong>
                  </div>
                  <div>
                    <span>In Progress</span>
                    <strong>{inTransitCount}</strong>
                  </div>
                </div>

                {ordersLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                    Loading your orders...
                  </div>
                ) : !orders.length ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                    <FiPackage size={45} style={{ color: '#ccc', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '18px', color: '#333' }}>No orders yet</h3>
                    <p style={{ fontSize: '13px', margin: '6px 0 20px' }}>
                      You haven't placed any orders yet. Discover our latest collections today!
                    </p>
                    <button className="btn-primary" onClick={() => nav('/shop')}>
                      Start Shopping <FiArrowRight />
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => {
                      const StatusIcon = getOrderStatusIcon(order.orderStatus);
                      const firstItem = order.items?.[0] || {};
                      const formattedDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Recent';

                      return (
                        <div className="user-order" key={order._id || order.orderId}>
                          <div className="order-product-icon" style={{ overflow: 'hidden', padding: 0 }}>
                            {firstItem.image ? (
                              <img
                                src={firstItem.image}
                                alt={firstItem.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '11px' }}
                              />
                            ) : (
                              <FiPackage />
                            )}
                          </div>

                          <div className="order-main-info">
                            <strong>#{order.orderId}</strong>
                            <span>{formattedDate} • {order.items?.length || 1} item{(order.items?.length || 1) > 1 ? 's' : ''}</span>
                          </div>

                          <div className="order-amount">
                            <span>Total Amount</span>
                            <strong>₹{Number(order.totalAmount || 0).toLocaleString()}</strong>
                          </div>

                          <div
                            className={`order-status ${
                              order.orderStatus === "Delivered"
                                ? "delivered"
                                : order.orderStatus === "Shipped"
                                ? "shipped"
                                : "processing"
                            }`}
                          >
                            <StatusIcon />
                            {order.orderStatus || 'Processing'}
                          </div>

                          <div className="order-actions-cell">
                            <button
                              type="button"
                              className="order-track-btn"
                              onClick={() => setTrackingOrder(order)}
                              title="Track Order Progress"
                            >
                              <FiTruck /> Track
                            </button>
                            <button
                              type="button"
                              className="order-view-btn"
                              onClick={() => setSelectedOrder(order)}
                              title="View Order Details"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {tab === "addresses" && (
              <div className="user-card">
                <div className="content-heading">
                  <div>
                    <span className="content-eyebrow">DELIVERY ADDRESSES</span>
                    <h2>Saved Addresses</h2>
                    <p>Addresses saved here are automatically available during checkout.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FiPlus /> {showAddAddress ? 'Close Form' : 'Add New Address'}
                  </button>
                </div>

                {/* ADD ADDRESS FORM */}
                {showAddAddress && (
                  <form onSubmit={handleSaveAddress} style={{ background: '#fff8f6', borderBottom: '1px solid #fed7d0', padding: '24px 28px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#222' }}>New Delivery Address</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Full Name *</label>
                        <input
                          required
                          placeholder="Receiver's name"
                          value={newAddr.fullName}
                          onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '7px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Phone Number *</label>
                        <input
                          required
                          placeholder="10-digit phone"
                          value={newAddr.phone}
                          onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '7px' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Address (House/Street/Area) *</label>
                        <input
                          required
                          placeholder="House No, Street, Landmark"
                          value={newAddr.address}
                          onChange={e => setNewAddr({ ...newAddr, address: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '7px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>City *</label>
                        <input
                          required
                          placeholder="City / District"
                          value={newAddr.city}
                          onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '7px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>State *</label>
                        <input
                          required
                          placeholder="State"
                          value={newAddr.state}
                          onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '7px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>PIN Code *</label>
                        <input
                          required
                          placeholder="6-digit PIN"
                          value={newAddr.pincode}
                          onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '7px' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowAddAddress(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {addressesLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    Loading saved addresses...
                  </div>
                ) : !savedAddresses.length ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
                    <FiMapPin size={40} style={{ color: '#ccc', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '16px', color: '#333' }}>No addresses saved yet</h3>
                    <p style={{ fontSize: '13px', margin: '4px 0 16px' }}>
                      When you place an order, your delivery address is automatically saved here!
                    </p>
                    <button className="btn btn-primary" onClick={() => setShowAddAddress(true)}>
                      <FiPlus /> Add First Address
                    </button>
                  </div>
                ) : (
                  <div className="addresses-grid">
                    {savedAddresses.map((addr, idx) => (
                      <div className={`user-address-card ${idx === 0 ? 'default-addr' : ''}`} key={addr._id || idx}>
                        {idx === 0 && <span className="addr-badge">Default Delivery Address</span>}
                        <div className="addr-name">{addr.fullName}</div>
                        <div className="addr-text">{addr.address}</div>
                        <div className="addr-text">{addr.city}, {addr.state} - <b>{addr.pincode}</b></div>
                        <div className="addr-phone"><b>Phone:</b> {addr.phone}</div>

                        <div className="addr-actions">
                          <button
                            type="button"
                            className="addr-delete-btn"
                            onClick={() => handleDeleteAddress(addr._id)}
                            title="Remove address"
                          >
                            <FiTrash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "wishlist" && (
              <div className="user-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Wishlist inDashboard={true} />
              </div>
            )}

            {tab === "cart" && (
              <div className="user-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Cart inDashboard={true} />
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ORDER TRACKING MODAL */}
      {trackingOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 99999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px'
          }}
          onClick={() => setTrackingOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              maxWidth: '580px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tracking Head */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '14px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Live Order Tracking
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '20px', color: '#1f2937' }}>
                  #{trackingOrder.orderId}
                </h3>
                <small style={{ color: '#6b7280' }}>
                  Courier: <b>BlueDart Express</b> • Track ID: <b>BLUEDART-{trackingOrder.orderId.replace(/[^0-9]/g, '') || '982734'}</b>
                </small>
              </div>

              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Tracking Status Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Current Status</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: trackingOrder.orderStatus === 'Delivered' ? '#16a34a' : '#2563eb', marginTop: '2px' }}>
                    {trackingOrder.orderStatus === 'Delivered'
                      ? 'Delivered Successfully'
                      : trackingOrder.orderStatus === 'Shipped'
                      ? 'Package in Transit / Shipped'
                      : 'Order Confirmed & Processing'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Estimated Delivery</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginTop: '2px' }}>
                    Within 3-5 Working Days
                  </div>
                </div>
              </div>
            </div>

            {/* TRACKING TIMELINE STEPPER */}
            <div className="track-timeline">
              {/* Step 1: Order Confirmed */}
              <div className="track-step completed">
                <div className="track-node-col">
                  <div className="track-node">
                    <FiCheck size={18} />
                  </div>
                  <div className="track-line" />
                </div>
                <div className="track-content">
                  <h4>Order Placed & Confirmed</h4>
                  <p>Your order details have been verified and processed by S S Vastralaya.</p>
                  <small>
                    {trackingOrder.createdAt ? new Date(trackingOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Confirmed'}
                  </small>
                </div>
              </div>

              {/* Step 2: Processing & Packed */}
              <div className={`track-step ${trackingOrder.orderStatus === 'Shipped' || trackingOrder.orderStatus === 'Delivered' ? 'completed' : 'current'}`}>
                <div className="track-node-col">
                  <div className="track-node">
                    {trackingOrder.orderStatus === 'Shipped' || trackingOrder.orderStatus === 'Delivered' ? <FiCheck size={18} /> : <FiBox size={18} />}
                  </div>
                  <div className="track-line" />
                </div>
                <div className="track-content">
                  <h4>Garments Packed & Verified</h4>
                  <p>Quality check completed and packaged with secure tamper-proof packaging.</p>
                  <small>
                    {trackingOrder.orderStatus === 'Processing' ? 'In progress at central warehouse' : 'Packing completed'}
                  </small>
                </div>
              </div>

              {/* Step 3: Shipped / In Transit */}
              <div className={`track-step ${trackingOrder.orderStatus === 'Delivered' ? 'completed' : trackingOrder.orderStatus === 'Shipped' ? 'current' : ''}`}>
                <div className="track-node-col">
                  <div className="track-node">
                    {trackingOrder.orderStatus === 'Delivered' ? <FiCheck size={18} /> : <FiTruck size={18} />}
                  </div>
                  <div className="track-line" />
                </div>
                <div className="track-content">
                  <h4>Handed Over to Courier / In Transit</h4>
                  <p>Dispatched with courier partner. Moving towards your local hub.</p>
                  <small>
                    {trackingOrder.orderStatus === 'Shipped' ? 'Package is on the way' : trackingOrder.orderStatus === 'Delivered' ? 'Transit completed' : 'Expected dispatch soon'}
                  </small>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className={`track-step ${trackingOrder.orderStatus === 'Delivered' ? 'completed' : ''}`}>
                <div className="track-node-col">
                  <div className="track-node">
                    <FiCheckCircle size={18} />
                  </div>
                </div>
                <div className="track-content">
                  <h4>Out for Delivery & Delivered</h4>
                  <p>Package safely handed over to receiver at destination address.</p>
                  <small>
                    {trackingOrder.orderStatus === 'Delivered' ? 'Delivered successfully' : 'Pending courier arrival'}
                  </small>
                </div>
              </div>
            </div>

            {/* Destination Address Info */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiMapPin style={{ color: '#e11b22' }} /> Delivery Destination:
              </div>
              <div style={{ fontSize: '13px', color: '#1e293b', marginTop: '4px' }}>
                <b>{trackingOrder.shippingAddress?.fullName}</b> ({trackingOrder.shippingAddress?.phone})<br />
                {trackingOrder.shippingAddress?.address}, {trackingOrder.shippingAddress?.city}, {trackingOrder.shippingAddress?.state} - <b>{trackingOrder.shippingAddress?.pincode}</b>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            zIndex: 99999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '14px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Head */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#e11b22', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Order Details
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '20px', color: '#222' }}>
                  #{selectedOrder.orderId}
                </h3>
                <small style={{ color: '#888' }}>
                  Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </small>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="order-track-btn"
                  onClick={() => {
                    const o = selectedOrder;
                    setSelectedOrder(null);
                    setTrackingOrder(o);
                  }}
                  style={{ padding: '6px 12px' }}
                >
                  <FiTruck /> Track Order
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: '#f2f2f2',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Status & Payment Tag */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: selectedOrder.orderStatus === 'Delivered' ? '#dcfce7' : '#fef3c7',
                  color: selectedOrder.orderStatus === 'Delivered' ? '#15803d' : '#b45309'
                }}
              >
                Status: {selectedOrder.orderStatus || 'Processing'}
              </span>

              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: selectedOrder.paymentMethod === 'Online' ? '#eff6ff' : '#f3f4f6',
                  color: selectedOrder.paymentMethod === 'Online' ? '#1d4ed8' : '#374151'
                }}
              >
                Payment: {selectedOrder.paymentMethod === 'Online' ? 'Razorpay (Online)' : 'Cash on Delivery (COD)'} • {selectedOrder.paymentStatus}
              </span>
            </div>

            {/* Delivery Address */}
            <div style={{ backgroundColor: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
              <strong style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <FiMapPin style={{ color: '#e11b22' }} /> Delivery Address
              </strong>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.5 }}>
                <div><b>{selectedOrder.shippingAddress?.fullName}</b> ({selectedOrder.shippingAddress?.phone})</div>
                <div>{selectedOrder.shippingAddress?.address}</div>
                <div>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</div>
              </div>
            </div>

            {/* Products List */}
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#333' }}>
              Items in Order ({selectedOrder.items?.length || 0})
            </h4>

            <div style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px' }}>
              {selectedOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid #eee'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=150&q=70'}
                    alt={item.name}
                    style={{ width: '56px', height: '68px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#222' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                      <span>Size: <b>{item.size || 'M'}</b></span>
                      {item.color && <span style={{ marginLeft: '10px' }}>Color: <b>{item.color}</b></span>}
                      <span style={{ marginLeft: '10px' }}>Qty: <b>{item.quantity || 1}</b></span>
                    </div>
                  </div>
                  <strong style={{ color: '#e11b22', fontSize: '14px' }}>
                    ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            {/* Order Cost Breakdown */}
            <div style={{ backgroundColor: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '3px 0' }}>
                <span>Subtotal</span>
                <b>₹{Number(selectedOrder.subtotal || 0).toLocaleString()}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '3px 0' }}>
                <span>Shipping Fee</span>
                <b>{Number(selectedOrder.shippingFee || 0) === 0 ? 'FREE' : `₹${selectedOrder.shippingFee}`}</b>
              </div>
              {Number(selectedOrder.discount || 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '3px 0', color: '#2563eb' }}>
                  <span>Discount</span>
                  <b>-₹{Number(selectedOrder.discount).toLocaleString()}</b>
                </div>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold' }}>
                <span>Total Amount Paid</span>
                <span style={{ color: '#e11b22' }}>₹{Number(selectedOrder.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
