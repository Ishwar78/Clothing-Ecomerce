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
  FiCheck,
  FiRefreshCw,
  FiUpload,
  FiMessageSquare,
  FiAlertCircle,
  FiDollarSign,
  FiCornerUpLeft,
  FiSend,
  FiMaximize2,
  FiFileText
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import api from "../lib/api";
import InvoiceModal from "../components/InvoiceModal";

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
  const [invoiceOrder, setInvoiceOrder] = useState(null);

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

  // Return Requests state
  const [userReturns, setUserReturns] = useState([]);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [previewReturnDefect, setPreviewReturnDefect] = useState(null);
  const [returnForm, setReturnForm] = useState({
    orderId: '',
    productName: '',
    productImage: '',
    productPrice: '',
    productSize: '',
    productColor: '',
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPhone: user?.phone || '',
    reason: 'Defective / Damaged Item',
    message: '',
    defectImage: '',
    refundMethod: 'UPI',
    upiId: '',
    bankDetails: {
      accountHolderName: user?.name || '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    }
  });

  // Support Tickets state
  const [userTickets, setUserTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [selectedTicketDetail, setSelectedTicketDetail] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Order Issue',
    orderId: '',
    priority: 'Medium',
    message: ''
  });

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

  // Fetch user return requests
  const fetchUserReturns = async () => {
    if (!user) return;
    setReturnsLoading(true);
    try {
      const email = user.email || '';
      const userId = user.id || user._id || '';
      const res = await api.get(`/returns/my-returns?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`);
      if (res.success) {
        setUserReturns(res.returns || []);
      }
    } catch (err) {
      console.error('Failed to fetch returns:', err);
    } finally {
      setReturnsLoading(false);
    }
  };

  // Fetch user support tickets
  const fetchUserTickets = async () => {
    if (!user) return;
    setTicketsLoading(true);
    try {
      const email = user.email || '';
      const userId = user.id || user._id || '';
      const res = await api.get(`/tickets/my-tickets?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`);
      if (res.success) {
        setUserTickets(res.tickets || []);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    fetchSavedAddresses();
    fetchUserReturns();
    fetchUserTickets();

    try {
      const w = JSON.parse(localStorage.getItem('Joyfulmarts-wishlist') || '[]');
      setWishlistCount(w.length);
    } catch {
      setWishlistCount(0);
    }

    try {
      const c = JSON.parse(localStorage.getItem('Joyfulmarts-cart') || '[]');
      setCartCount(c.length);
    } catch {
      setCartCount(0);
    }
  }, [user]);

  // Delivered orders for return dropdown
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered');

  const openReturnModalForOrder = (order, item) => {
    const selectedItem = item || order.items?.[0] || {};
    setReturnForm({
      orderId: order.orderId || order._id,
      productName: selectedItem.name || '',
      productImage: selectedItem.image || selectedItem.images?.[0] || '',
      productPrice: selectedItem.price || '',
      productSize: selectedItem.size || '',
      productColor: selectedItem.color || '',
      userName: user?.name || '',
      userEmail: user?.email || '',
      userPhone: user?.phone || '',
      reason: 'Defective / Damaged Item',
      message: '',
      defectImage: '',
      refundMethod: 'UPI',
      upiId: '',
      bankDetails: {
        accountHolderName: user?.name || '',
        accountNumber: '',
        bankName: '',
        ifscCode: ''
      }
    });
    setShowReturnModal(true);
  };

  const openNewReturnModal = () => {
    const firstDelivered = deliveredOrders[0];
    const firstItem = firstDelivered?.items?.[0];

    setReturnForm({
      orderId: firstDelivered?.orderId || '',
      productName: firstItem?.name || '',
      productImage: firstItem?.image || firstItem?.images?.[0] || '',
      productPrice: firstItem?.price || '',
      productSize: firstItem?.size || '',
      productColor: firstItem?.color || '',
      userName: user?.name || '',
      userEmail: user?.email || '',
      userPhone: user?.phone || '',
      reason: 'Defective / Damaged Item',
      message: '',
      defectImage: '',
      refundMethod: 'UPI',
      upiId: '',
      bankDetails: {
        accountHolderName: user?.name || '',
        accountNumber: '',
        bankName: '',
        ifscCode: ''
      }
    });
    setShowReturnModal(true);
  };

  const handleDefectImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReturnForm(prev => ({ ...prev, defectImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!returnForm.orderId || !returnForm.productName || !returnForm.reason || !returnForm.message) {
      alert('Please fill all required return fields (Order, Product, Reason, and Problem Message)');
      return;
    }

    if (returnForm.refundMethod === 'UPI' && !returnForm.upiId.trim()) {
      alert('Please enter your UPI ID for refund transfer');
      return;
    }

    if (returnForm.refundMethod === 'Bank Account') {
      const { accountHolderName, accountNumber, bankName, ifscCode } = returnForm.bankDetails;
      if (!accountHolderName || !accountNumber || !bankName || !ifscCode) {
        alert('Please fill all bank details (Account Holder, Account Number, Bank Name, IFSC)');
        return;
      }
    }

    setSubmittingReturn(true);
    try {
      const res = await api.post('/returns', {
        ...returnForm,
        userId: user?.id || user?._id
      });

      if (res.success) {
        setUserReturns(prev => [res.returnRequest, ...prev]);
        setShowReturnModal(false);
        setTab('returns');
        alert('Return request submitted successfully! Ticket ID: ' + res.returnRequest.returnId);
      } else {
        alert(res.message || 'Failed to submit return request');
      }
    } catch (err) {
      alert('Error submitting return request: ' + err.message);
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      alert('Please enter ticket subject and message');
      return;
    }

    setSubmittingTicket(true);
    try {
      const res = await api.post('/tickets', {
        ...ticketForm,
        userName: user?.name || 'Customer',
        userEmail: user?.email || '',
        userPhone: user?.phone || '',
        userId: user?.id || user?._id
      });

      if (res.success) {
        setUserTickets(prev => [res.ticket, ...prev]);
        setShowTicketModal(false);
        setTicketForm({
          subject: '',
          category: 'Order Issue',
          orderId: '',
          priority: 'Medium',
          message: ''
        });
        setTab('support');
        alert('Support ticket created successfully! Ticket ID: ' + res.ticket.ticketId);
      } else {
        alert(res.message || 'Failed to create support ticket');
      }
    } catch (err) {
      alert('Error creating ticket: ' + err.message);
    } finally {
      setSubmittingTicket(false);
    }
  };

  const buttons = [
    ["profile", "Profile", FiUser],
    ["orders", "My Orders", FiPackage],
    ["returns", "Return Request", FiRefreshCw],
    ["support", "Support Helpdesk", FiHeadphones],
    ["addresses", "Saved Addresses", FiMapPin],
    ["wishlist", "Wishlist", FiHeart],
    ["cart", "Cart", FiShoppingBag],
  ];

  const handleNavigation = (id) => {
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
              <strong>{user?.name || 'Joyfulmarts Customer'}</strong>
              <span>{user?.email || 'Premium Member'}</span>
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>

          <div className="dashboard-stat-card" onClick={() => setTab('orders')} style={{ cursor: 'pointer' }}>
            <div className="dashboard-stat-icon">
              <FiPackage />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card" onClick={() => setTab('returns')} style={{ cursor: 'pointer' }}>
            <div className="dashboard-stat-icon" style={{ background: '#e0e7ff', color: '#6366f1' }}>
              <FiCornerUpLeft />
            </div>

            <div>
              <span>Return Requests</span>
              <strong>{userReturns.length}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card" onClick={() => setTab('support')} style={{ cursor: 'pointer' }}>
            <div className="dashboard-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <FiHeadphones />
            </div>

            <div>
              <span>Support Tickets</span>
              <strong>{userTickets.length}</strong>
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
                <strong>{user?.name || 'Joyfulmarts Customer'}</strong>
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
                    {id === 'returns' && userReturns.length > 0 && (
                      <span className="sidebar-badge" style={{ backgroundColor: '#6366f1' }}>{userReturns.length}</span>
                    )}
                    {id === 'support' && userTickets.length > 0 && (
                      <span className="sidebar-badge" style={{ backgroundColor: '#f59e0b' }}>{userTickets.length}</span>
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
                    <strong>{user?.name || 'Joyfulmarts Customer'}</strong>
                    <span>Member since 2026</span>
                  </div>
                </div>

                <div className="section-small-title">Personal Information</div>

                <div className="form-grid">
                  <div className="field">
                    <label><FiUser /> Full Name</label>
                    <input type="text" readOnly value={user?.name || "Joyfulmarts Customer"} />
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
                            {order.orderStatus === 'Delivered' && (
                              <button
                                type="button"
                                className="order-track-btn"
                                onClick={() => openReturnModalForOrder(order)}
                                title="Request Return or Defect Replacement"
                                style={{ background: '#fff1f2', color: '#e11b22', borderColor: '#fecdd3' }}
                              >
                                <FiCornerUpLeft /> Return
                              </button>
                            )}
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
                            <button
                              type="button"
                              className="order-view-btn"
                              onClick={() => setInvoiceOrder(order)}
                              title="View / Print Tax Bill"
                              style={{ background: '#fdf2f4', color: '#e11b22', borderColor: '#fed7de', fontWeight: '700' }}
                            >
                              <FiFileText size={12} /> Bill
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

            {/* RETURN REQUESTS TAB */}
            {tab === "returns" && (
              <div className="user-card">
                <div className="content-heading">
                  <div>
                    <span className="content-eyebrow">EASY 7-DAY RETURNS & EXCHANGES</span>
                    <h2>Return Requests & Refunds</h2>
                    <p>Track your return status, defective item claims, and refund payouts.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openNewReturnModal}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FiPlus /> New Return Request
                  </button>
                </div>

                <div className="orders-summary">
                  <div>
                    <span>Total Returns</span>
                    <strong>{userReturns.length}</strong>
                  </div>
                  <div>
                    <span>Under Review</span>
                    <strong>{userReturns.filter(r => r.status === 'Requested').length}</strong>
                  </div>
                  <div>
                    <span>Refunded / Approved</span>
                    <strong>{userReturns.filter(r => r.status === 'Refund Completed' || r.status === 'Approved').length}</strong>
                  </div>
                </div>

                {returnsLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <FiRefreshCw className="spin" style={{ fontSize: '24px', marginBottom: '8px' }} />
                    <div>Loading return requests...</div>
                  </div>
                ) : !userReturns.length ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
                    <FiCornerUpLeft size={44} style={{ color: '#ccc', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '17px', color: '#333' }}>No Return Requests Found</h3>
                    <p style={{ fontSize: '13px', margin: '6px 0 20px', maxWidth: '420px', marginInline: 'auto' }}>
                      Received a defective, wrong size or damaged product from any delivered order? You can easily raise a return request and receive refund via UPI or Direct Bank Transfer!
                    </p>
                    <button className="btn btn-primary" onClick={openNewReturnModal}>
                      <FiPlus /> Request a Return
                    </button>
                  </div>
                ) : (
                  <div className="return-requests-list">
                    {userReturns.map((ret) => (
                      <div className="user-return-card" key={ret._id || ret.returnId}>
                        <div className="card-top-bar">
                          <div className="card-top-left">
                            <b>#{ret.returnId}</b>
                            <span>• Order <b>#{ret.orderId}</b></span>
                            <span>• {new Date(ret.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className={`return-status-badge ${ret.status === 'Refund Completed' ? 'refunded' : ret.status === 'Approved' ? 'approved' : ret.status === 'Rejected' ? 'rejected' : 'requested'}`}>
                            {ret.status === 'Refund Completed' ? '✓ Refund Credited' : ret.status === 'Approved' ? '✓ Return Approved' : ret.status === 'Rejected' ? '✕ Request Declined' : '⏳ Under Review'}
                          </span>
                        </div>

                        <div className="return-product-grid">
                          {ret.productImage ? (
                            <img src={ret.productImage} alt={ret.productName} className="return-product-img" />
                          ) : (
                            <div className="return-product-img" style={{ display: 'grid', placeItems: 'center', background: '#f3f4f6', color: '#9ca3af' }}>
                              <FiPackage size={28} />
                            </div>
                          )}

                          <div>
                            <strong style={{ fontSize: '14px', color: '#111827', display: 'block' }}>{ret.productName}</strong>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                              {ret.productSize && <span>Size: <b>{ret.productSize}</b></span>}
                              {ret.productColor && <span style={{ marginLeft: '10px' }}>Color: <b>{ret.productColor}</b></span>}
                              {ret.productPrice > 0 && <span style={{ marginLeft: '10px', color: '#dc2626', fontWeight: 'bold' }}>₹{Number(ret.productPrice).toLocaleString('en-IN')}</span>}
                            </div>
                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                                Reason: {ret.reason}
                              </span>
                              {ret.defectImage && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewReturnDefect(ret.defectImage)}
                                  style={{ border: 'none', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}
                                >
                                  <FiMaximize2 /> View Proof Image
                                </button>
                              )}
                            </div>
                            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#4b5563', lineHeight: '1.5' }}>
                              <b>Problem Description:</b> {ret.message}
                            </p>
                          </div>
                        </div>

                        <div className="refund-dest-box">
                          {ret.refundMethod === 'UPI' ? (
                            <div>
                              <span style={{ fontWeight: 'bold', color: '#16a34a' }}>UPI Refund Destination:</span>{' '}
                              <code>{ret.upiId}</code>
                            </div>
                          ) : (
                            <div>
                              <span style={{ fontWeight: 'bold', color: '#2563eb' }}>Bank Transfer Refund:</span>{' '}
                              <span>{ret.bankDetails?.accountHolderName} • A/C: {ret.bankDetails?.accountNumber} • {ret.bankDetails?.bankName} ({ret.bankDetails?.ifscCode})</span>
                            </div>
                          )}
                        </div>

                        {ret.adminNotes && (
                          <div className={`admin-feedback-box ${ret.status === 'Rejected' ? 'warn' : ''}`}>
                            <b>Store Resolution Update:</b> {ret.adminNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUPPORT HELPDESK TAB */}
            {tab === "support" && (
              <div className="user-card">
                <div className="content-heading">
                  <div>
                    <span className="content-eyebrow">CUSTOMER CARE & ASSISTANCE</span>
                    <h2>Support Helpdesk</h2>
                    <p>Have an inquiry, feedback, or need help with your order? Our team is here to assist.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowTicketModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FiPlus /> Raise New Ticket
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', margin: '0 28px 24px' }}>
                  <div style={{ background: '#fdf2f4', border: '1px solid #fce7eb', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#e11b22', fontWeight: 'bold' }}>CALL ASSISTANCE</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>+91 98765 43210</div>
                    <small style={{ color: '#6b7280' }}>Mon-Sat (10 AM - 6 PM)</small>
                  </div>

                  <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>EMAIL SUPPORT</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>hello@Joyfulmartsstore.in</div>
                    <small style={{ color: '#6b7280' }}>Guaranteed response in 24 hrs</small>
                  </div>

                  <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>MY TICKETS</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>{userTickets.length} Raised</div>
                    <small style={{ color: '#6b7280' }}>Track all conversation replies</small>
                  </div>
                </div>

                {ticketsLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <FiRefreshCw className="spin" style={{ fontSize: '24px', marginBottom: '8px' }} />
                    <div>Loading support tickets...</div>
                  </div>
                ) : !userTickets.length ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
                    <FiHeadphones size={44} style={{ color: '#ccc', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '17px', color: '#333' }}>No Support Tickets Raised</h3>
                    <p style={{ fontSize: '13px', margin: '6px 0 20px', maxWidth: '400px', marginInline: 'auto' }}>
                      Need help with payment issues, order delays, or product exchanges? Raise a ticket and get resolved directly by our team.
                    </p>
                    <button className="btn btn-primary" onClick={() => setShowTicketModal(true)}>
                      <FiPlus /> Raise a Ticket
                    </button>
                  </div>
                ) : (
                  <div className="support-tickets-list">
                    {userTickets.map((t) => (
                      <div className="user-ticket-card" key={t._id || t.ticketId}>
                        <div className="card-top-bar">
                          <div className="card-top-left">
                            <b>#{t.ticketId}</b>
                            <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                              {t.category}
                            </span>
                            {t.orderId && <span>• Order <b>#{t.orderId}</b></span>}
                            <span>• {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className={`ticket-status-badge ${t.status === 'Resolved' ? 'resolved' : t.status === 'In Progress' ? 'inprogress' : t.status === 'Closed' ? 'closed' : 'open'}`}>
                            {t.status === 'Resolved' ? '✓ Resolved' : t.status === 'In Progress' ? '⏳ In Progress' : t.status === 'Closed' ? 'Closed' : '● Open'}
                          </span>
                        </div>

                        <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#111827' }}>{t.subject}</h4>
                        <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                          {t.message}
                        </p>

                        {t.adminReply ? (
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 14px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>
                              <FiCheckCircle /> Joyfulmarts Support Team Response:
                            </div>
                            <div style={{ fontSize: '12px', color: '#14532d', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                              {t.adminReply}
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', marginTop: '6px' }}>
                            ⏳ Waiting for support team response. We usually reply within 24 hours.
                          </div>
                        )}
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
                  <p>Your order details have been verified and processed by Joyfulmarts.</p>
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
                  className="order-track-btn"
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  style={{ padding: '6px 12px', background: '#fdf2f4', color: '#e11b22', borderColor: '#fed7de' }}
                  title="View / Print Tax Invoice"
                >
                  <FiFileText /> View Bill
                </button>
                {selectedOrder.orderStatus === 'Delivered' && (
                  <button
                    type="button"
                    className="order-track-btn"
                    onClick={() => {
                      const o = selectedOrder;
                      setSelectedOrder(null);
                      openReturnModalForOrder(o);
                    }}
                    style={{ padding: '6px 12px', background: '#fff1f2', color: '#e11b22', borderColor: '#fecdd3' }}
                  >
                    <FiCornerUpLeft /> Return Item
                  </button>
                )}
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

      {/* =========================================================
          RETURN REQUEST MODAL
      ========================================================= */}
      {showReturnModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 99999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px'
          }}
          onClick={() => setShowReturnModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Easy Return & Refund
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: '#111827' }}>Submit Product Return Request</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn}>
              {/* SELECT DELIVERED ORDER PRODUCT */}
              {deliveredOrders.length > 0 && (
                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                    Quick Select from Delivered Orders:
                  </label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const [ordId, itemIdx] = val.split(':::');
                      const ord = orders.find(o => o.orderId === ordId);
                      const itm = ord?.items?.[parseInt(itemIdx, 10)];
                      if (ord && itm) {
                        setReturnForm(prev => ({
                          ...prev,
                          orderId: ord.orderId,
                          productName: itm.name,
                          productImage: itm.image || itm.images?.[0] || '',
                          productPrice: itm.price || 0,
                          productSize: itm.size || '',
                          productColor: itm.color || ''
                        }));
                      }
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">-- Choose Delivered Item --</option>
                    {deliveredOrders.map(ord =>
                      ord.items?.map((item, idx) => (
                        <option key={`${ord.orderId}-${idx}`} value={`${ord.orderId}:::${idx}`}>
                          Order #{ord.orderId} - {item.name} ({item.size || 'M'}) - ₹{Number(item.price || 0).toLocaleString()}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {/* PRODUCT DETAILS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Order ID *
                  </label>
                  <input
                    required
                    placeholder="e.g. Joyfulmarts-10024"
                    value={returnForm.orderId}
                    onChange={(e) => setReturnForm({ ...returnForm, orderId: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Product Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Embroidered Anarkali Kurti"
                    value={returnForm.productName}
                    onChange={(e) => setReturnForm({ ...returnForm, productName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* CUSTOMER DETAILS (AUTO-FILLED) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Your Name (Auto-filled)
                  </label>
                  <input
                    readOnly
                    value={returnForm.userName}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', background: '#f9fafb', borderRadius: '7px', fontSize: '13px', color: '#6b7280' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Your Email (Auto-filled)
                  </label>
                  <input
                    readOnly
                    value={returnForm.userEmail}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', background: '#f9fafb', borderRadius: '7px', fontSize: '13px', color: '#6b7280' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Phone Number
                  </label>
                  <input
                    placeholder="10-digit contact number"
                    value={returnForm.userPhone}
                    onChange={(e) => setReturnForm({ ...returnForm, userPhone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* REASON & PROBLEM MESSAGE */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                  Reason for Return *
                </label>
                <select
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px', background: '#fff' }}
                >
                  <option value="Defective / Damaged Item">Defective / Damaged Item</option>
                  <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                  <option value="Size / Fit Not Correct">Size / Fit Not Correct</option>
                  <option value="Fabric Quality Issue">Fabric Quality Issue</option>
                  <option value="Missing Accessories / Parts">Missing Accessories / Parts</option>
                  <option value="Item Not Matching Picture">Item Not Matching Picture</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                  Problem Description / Message *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe the issue with the delivered item (torn cloth, broken stitch, wrong color, etc.)..."
                  value={returnForm.message}
                  onChange={(e) => setReturnForm({ ...returnForm, message: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              {/* DEFECT IMAGE UPLOAD */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                  Upload Defective / Damaged Product Photo:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '7px',
                      border: '1px dashed #ef4444',
                      background: '#fff5f5',
                      color: '#e11b22',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    <FiUpload /> Choose Image File
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleDefectImageUpload}
                    />
                  </label>
                  {returnForm.defectImage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={returnForm.defectImage}
                        alt="Defect Preview"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ef4444' }}
                      />
                      <button
                        type="button"
                        onClick={() => setReturnForm(prev => ({ ...prev, defectImage: '' }))}
                        style={{ border: 'none', background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* REFUND METHOD SELECTION (UPI OR BANK ACCOUNT) */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                  Choose Refund Transfer Destination *
                </label>
                <div className="refund-mode-group">
                  <button
                    type="button"
                    className={`refund-mode-btn ${returnForm.refundMethod === 'UPI' ? 'active' : ''}`}
                    onClick={() => setReturnForm({ ...returnForm, refundMethod: 'UPI' })}
                  >
                    <FiCreditCard /> Instant UPI Refund
                  </button>
                  <button
                    type="button"
                    className={`refund-mode-btn ${returnForm.refundMethod === 'Bank Account' ? 'active' : ''}`}
                    onClick={() => setReturnForm({ ...returnForm, refundMethod: 'Bank Account' })}
                  >
                    <FiDollarSign /> Bank Account Transfer
                  </button>
                </div>

                {returnForm.refundMethod === 'UPI' ? (
                  <div style={{ marginTop: '14px', background: '#f0fdf4', padding: '14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#166534', marginBottom: '4px' }}>
                      Enter Your UPI ID (VPA) *
                    </label>
                    <input
                      required={returnForm.refundMethod === 'UPI'}
                      placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                      value={returnForm.upiId}
                      onChange={(e) => setReturnForm({ ...returnForm, upiId: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #86efac', borderRadius: '6px', fontSize: '13px', background: '#fff' }}
                    />
                    <small style={{ color: '#15803d', display: 'block', marginTop: '4px' }}>
                      Refund will be sent directly to this UPI ID upon approval.
                    </small>
                  </div>
                ) : (
                  <div style={{ marginTop: '14px', background: '#eff6ff', padding: '14px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
                      Bank Account Details for NEFT/IMPS:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '3px' }}>
                          Account Holder Name *
                        </label>
                        <input
                          required={returnForm.refundMethod === 'Bank Account'}
                          placeholder="Name as per bank passbook"
                          value={returnForm.bankDetails.accountHolderName}
                          onChange={(e) => setReturnForm({ ...returnForm, bankDetails: { ...returnForm.bankDetails, accountHolderName: e.target.value } })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '12px', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '3px' }}>
                          Bank Account Number *
                        </label>
                        <input
                          required={returnForm.refundMethod === 'Bank Account'}
                          placeholder="Account Number"
                          value={returnForm.bankDetails.accountNumber}
                          onChange={(e) => setReturnForm({ ...returnForm, bankDetails: { ...returnForm.bankDetails, accountNumber: e.target.value } })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '12px', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '3px' }}>
                          Bank Name *
                        </label>
                        <input
                          required={returnForm.refundMethod === 'Bank Account'}
                          placeholder="e.g. HDFC Bank, SBI"
                          value={returnForm.bankDetails.bankName}
                          onChange={(e) => setReturnForm({ ...returnForm, bankDetails: { ...returnForm.bankDetails, bankName: e.target.value } })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '12px', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '3px' }}>
                          IFSC Code *
                        </label>
                        <input
                          required={returnForm.refundMethod === 'Bank Account'}
                          placeholder="e.g. HDFC0001234"
                          value={returnForm.bankDetails.ifscCode}
                          onChange={(e) => setReturnForm({ ...returnForm, bankDetails: { ...returnForm.bankDetails, ifscCode: e.target.value.toUpperCase() } })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '12px', background: '#fff', textTransform: 'uppercase' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReturnModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReturn}
                >
                  {submittingReturn ? 'Submitting...' : 'Submit Return Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          SUPPORT TICKET MODAL
      ========================================================= */}
      {showTicketModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 99999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px'
          }}
          onClick={() => setShowTicketModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Helpdesk Support
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: '#111827' }}>Raise a New Support Ticket</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Customer Name
                  </label>
                  <input
                    readOnly
                    value={user?.name || 'Customer'}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', background: '#f9fafb', borderRadius: '7px', fontSize: '13px', color: '#6b7280' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Customer Email
                  </label>
                  <input
                    readOnly
                    value={user?.email || ''}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', background: '#f9fafb', borderRadius: '7px', fontSize: '13px', color: '#6b7280' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                  Ticket Subject *
                </label>
                <input
                  required
                  placeholder="e.g. Delivery status not updating, wrong color delivered, payment deducted"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Category
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Order Issue">Order Issue</option>
                    <option value="Payment & Refund">Payment & Refund</option>
                    <option value="Delivery Tracking">Delivery Tracking</option>
                    <option value="Product Query">Product Query</option>
                    <option value="Size & Exchange">Size & Exchange</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                    Related Order ID (Optional)
                  </label>
                  <input
                    placeholder="e.g. Joyfulmarts-10024"
                    value={ticketForm.orderId}
                    onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>
                  Detailed Message / Inquiry *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Explain your inquiry or issue in detail so our support staff can resolve it quickly..."
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '7px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTicketModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingTicket}
                >
                  <FiSend /> {submittingTicket ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL DEFECT IMAGE PREVIEW */}
      {previewReturnDefect && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 100000,
            display: 'grid',
            placeItems: 'center',
            padding: '20px'
          }}
          onClick={() => setPreviewReturnDefect(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              type="button"
              onClick={() => setPreviewReturnDefect(null)}
              style={{ position: 'absolute', top: '-40px', right: 0, background: 'transparent', color: '#fff', border: 'none', fontSize: '32px', cursor: 'pointer' }}
            >
              ×
            </button>
            <img
              src={previewReturnDefect}
              alt="Defect Proof Full"
              style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>
      )}

      {/* TAX BILL / INVOICE MODAL */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
