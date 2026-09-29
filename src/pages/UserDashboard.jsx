import React, { useState } from "react";
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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import Wishlist from "./Wishlist";
import Cart from "./Cart";

export default function UserDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState("profile");

  const buttons = [
    ["profile", "Profile", FiUser],
    ["orders", "My Orders", FiPackage],
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
              Welcome back, <em>Fashion Lover</em>
            </h1>

            <p>
              Manage your profile, orders, wishlist and support requests
              from one place.
            </p>
          </div>

          <div className="dashboard-user-mini">
            <div className="dashboard-avatar">
              <FiUser />
            </div>

            <div>
              <strong>SBV Customer</strong>
              <span>Premium Member</span>
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <FiPackage />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>3</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <FiHeart />
            </div>

            <div>
              <span>Wishlist Items</span>
              <strong>8</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <FiShoppingBag />
            </div>

            <div>
              <span>Cart Items</span>
              <strong>2</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <FiShield />
            </div>

            <div>
              <span>Account Status</span>
              <strong className="verified-text">Verified</strong>
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
                <strong>SBV Customer</strong>
                <span>customer@example.com</span>
              </div>
            </div>

            <div className="sidebar-menu">

              <span className="sidebar-label">
                ACCOUNT
              </span>

              {buttons.map(([id, name, Icon]) => (
                <button
                  type="button"
                  key={id}
                  className={tab === id ? "active" : ""}
                  onClick={() => handleNavigation(id)}
                >
                  <span className="sidebar-icon">
                    <Icon />
                  </span>

                  <span className="sidebar-button-text">
                    {name}
                  </span>

                  <FiArrowRight className="sidebar-arrow" />
                </button>
              ))}

              <div className="sidebar-divider" />

              <button
                type="button"
                className="logout-button"
                onClick={() => nav("/")}
              >
                <span className="sidebar-icon">
                  <FiLogOut />
                </span>

                <span className="sidebar-button-text">
                  Logout
                </span>

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
                    <span className="content-eyebrow">
                      ACCOUNT SETTINGS
                    </span>

                    <h2>Profile Details</h2>

                    <p>
                      Update your personal information and account details.
                    </p>
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
                    <strong>SBV Customer</strong>
                    <span>Manage your personal information</span>
                  </div>

                  <button type="button">
                    <FiEdit3 />
                    Edit Profile
                  </button>
                </div>

                <div className="section-small-title">
                  Personal Information
                </div>

                <div className="form-grid">

                  <div className="field">
                    <label>
                      <FiUser />
                      Full Name
                    </label>

                    <input
                      type="text"
                      defaultValue="SBV Customer"
                    />
                  </div>

                  <div className="field">
                    <label>
                      <FiMail />
                      Email Address
                    </label>

                    <input
                      type="email"
                      defaultValue="customer@example.com"
                    />
                  </div>

                  <div className="field">
                    <label>
                      <FiPhone />
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      defaultValue="9876543210"
                    />
                  </div>

                  <div className="field">
                    <label>
                      <FiMapPin />
                      City
                    </label>

                    <input
                      type="text"
                      defaultValue="Rohtak"
                    />
                  </div>

                </div>

                <div className="profile-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn-primary dashboard-save"
                  >
                    Save Changes
                    <FiArrowRight />
                  </button>
                </div>

                <div className="account-security">

                  <div className="security-icon">
                    <FiShield />
                  </div>

                  <div>
                    <strong>Your account is secure</strong>
                    <p>
                      Your personal information is protected with
                      secure account controls.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* ORDERS */}
            {tab === "orders" && (
              <div className="user-card">

                <div className="content-heading">
                  <div>
                    <span className="content-eyebrow">
                      SHOPPING ACTIVITY
                    </span>

                    <h2>My Orders</h2>

                    <p>
                      Track and manage your recent purchases.
                    </p>
                  </div>

                  <div className="content-heading-icon">
                    <FiPackage />
                  </div>
                </div>

                <div className="orders-summary">

                  <div>
                    <span>All Orders</span>
                    <strong>3</strong>
                  </div>

                  <div>
                    <span>Delivered</span>
                    <strong>1</strong>
                  </div>

                  <div>
                    <span>In Transit</span>
                    <strong>2</strong>
                  </div>

                </div>

                <div className="orders-list">

                  {[
                    {
                      id: "SBV10024",
                      date: "Placed 1 day ago",
                      amount: "₹2,499",
                      status: "Delivered",
                      icon: FiCheckCircle,
                    },
                    {
                      id: "SBV10017",
                      date: "Placed 2 days ago",
                      amount: "₹1,299",
                      status: "Shipped",
                      icon: FiTruck,
                    },
                    {
                      id: "SBV10009",
                      date: "Placed 4 days ago",
                      amount: "₹1,299",
                      status: "Shipped",
                      icon: FiClock,
                    },
                  ].map((order) => {
                    const StatusIcon = order.icon;

                    return (
                      <div
                        className="user-order"
                        key={order.id}
                      >
                        <div className="order-product-icon">
                          <FiPackage />
                        </div>

                        <div className="order-main-info">
                          <strong>{order.id}</strong>
                          <span>{order.date}</span>
                        </div>

                        <div className="order-amount">
                          <span>Total Amount</span>
                          <strong>{order.amount}</strong>
                        </div>

                        <div
                          className={`order-status ${
                            order.status === "Delivered"
                              ? "delivered"
                              : "shipped"
                          }`}
                        >
                          <StatusIcon />
                          {order.status}
                        </div>

                        <button
                          type="button"
                          className="order-view-btn"
                        >
                          View
                          <FiArrowRight />
                        </button>
                      </div>
                    );
                  })}

                </div>

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
    </div>
  );
}
