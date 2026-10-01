import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';
import api from '../../lib/api';
import './AdminPages.css';
import './Overview.css';

export default function Overview() {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Fetch products
    api.get('/products')
      .then(res => {
        if (res.success) {
          setStats(prev => ({ ...prev, productsCount: res.products?.length || 0 }));
        }
      })
      .catch(() => {});

    // Fetch users
    api.get('/users/all')
      .then(res => {
        if (res.success) {
          setStats(prev => ({ ...prev, usersCount: res.users?.length || 0 }));
        }
      })
      .catch(() => {});

    // Fetch orders
    api.get('/orders')
      .then(res => {
        if (res.success && res.orders) {
          const orders = res.orders;
          const rev = orders
            .filter(o => o.paymentStatus === 'Paid')
            .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
          setStats(prev => ({
            ...prev,
            revenue: rev,
            ordersCount: orders.length
          }));
          setRecentOrders(orders.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  const statCards = [
    [FiDollarSign, 'Revenue', `₹${stats.revenue.toLocaleString()}`],
    [FiShoppingBag, 'Orders', stats.ordersCount.toString()],
    [FiPackage, 'Products', stats.productsCount.toString()],
    [FiUsers, 'Customers', stats.usersCount.toString()]
  ];

  return (
    <div>
      <div className="admin-title">
        <div>
          <h2>Overview</h2>
          <p>Today’s store performance at a glance.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        {statCards.map(([Icon, label, value]) => (
          <div className="admin-stat" key={label}>
            <Icon className="stat-icon" />
            <span>{label}</span>
            <strong>{value}</strong>
            <small>Live sync</small>
          </div>
        ))}
      </div>

      <div className="admin-two-col">
        <div className="admin-card">
          <h3>Recent Orders</h3>
          {!recentOrders.length ? (
            <p style={{ color: '#888', padding: '20px 0' }}>No orders placed yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>#{o.orderId}</td>
                    <td>{o.shippingAddress?.fullName || o.user?.name || 'Customer'}</td>
                    <td>₹{Number(o.totalAmount || 0).toLocaleString()}</td>
                    <td>
                      <span className={'admin-badge ' + (o.orderStatus === 'Processing' ? 'warn' : o.orderStatus === 'Delivered' ? 'success' : '')}>
                        {o.orderStatus || 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <h3>Top Categories</h3>
          {[
            ['Women', 82],
            ['Men', 68],
            ['Ethnic Wear', 57],
            ['Kids', 34],
            ['Footwear', 28]
          ].map(([n, v]) => (
            <div className="bar-row" key={n}>
              <span>{n}</span>
              <div>
                <i style={{ width: v + '%' }} />
              </div>
              <b>{v}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
