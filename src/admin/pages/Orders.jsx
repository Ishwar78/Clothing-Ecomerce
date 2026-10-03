import React, { useState, useEffect } from 'react';
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiCreditCard,
  FiDollarSign,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiFileText,
  FiPrinter
} from 'react-icons/fi';
import api from '../../lib/api';
import InvoiceModal from '../../components/InvoiceModal';
import './DataPages.css';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Status edit state for modal
  const [editOrderStatus, setEditOrderStatus] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setEditOrderStatus(order.orderStatus || 'Processing');
    setEditPaymentStatus(order.paymentStatus || 'Pending');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await api.put(`/orders/${selectedOrder._id}/status`, {
        orderStatus: editOrderStatus,
        paymentStatus: editPaymentStatus
      });

      if (res.success) {
        // Update local list
        setOrders(prev =>
          prev.map(o => (o._id === selectedOrder._id ? res.order : o))
        );
        setSelectedOrder(res.order);
        alert('Order status updated successfully!');
      } else {
        alert(res.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.phone || '').includes(search) ||
      (order.shippingAddress?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.shippingAddress?.phone || '').includes(search);

    const matchesStatus =
      statusFilter === 'ALL' ||
      order.orderStatus?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level stats
  const totalOrders = orders.length;
  const processingCount = orders.filter(o => o.orderStatus === 'Processing').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'admin-badge warn';
      case 'Confirmed':
        return 'admin-badge info';
      case 'Shipped':
        return 'admin-badge primary';
      case 'Delivered':
        return 'admin-badge success';
      case 'Cancelled':
        return 'admin-badge danger';
      default:
        return 'admin-badge';
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-title">
        <div>
          <h2>Order Management</h2>
          <p>Real-time customer orders, Razorpay payments, and fulfillment tracking.</p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="btn-refresh"
          title="Refresh Orders"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            border: '1px solid #eadbd8',
            borderRadius: '8px',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="admin-stat-grid" style={{ marginBottom: '20px' }}>
        <div className="admin-stat">
          <FiPackage className="stat-icon" />
          <span>Total Orders</span>
          <strong>{totalOrders}</strong>
          <small>Dynamic orders in system</small>
        </div>

        <div className="admin-stat">
          <FiClock className="stat-icon" style={{ color: '#d97706' }} />
          <span>Processing</span>
          <strong style={{ color: '#d97706' }}>{processingCount}</strong>
          <small>Pending shipment</small>
        </div>

        <div className="admin-stat">
          <FiTruck className="stat-icon" style={{ color: '#2563eb' }} />
          <span>In Transit / Shipped</span>
          <strong style={{ color: '#2563eb' }}>{shippedCount}</strong>
          <small>Dispatched</small>
        </div>

        <div className="admin-stat">
          <FiCheckCircle className="stat-icon" style={{ color: '#16a34a' }} />
          <span>Delivered</span>
          <strong style={{ color: '#16a34a' }}>{deliveredCount}</strong>
          <small>Completed orders</small>
        </div>

        <div className="admin-stat">
          <FiDollarSign className="stat-icon" style={{ color: '#dc2626' }} />
          <span>Paid Revenue</span>
          <strong style={{ color: '#dc2626' }}>₹{totalRevenue.toLocaleString()}</strong>
          <small>Collected via Razorpay / COD</small>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
        <div className="admin-search" style={{ flex: 1, minWidth: '260px' }}>
          <FiSearch />
          <input
            placeholder="Search by Order ID, Customer name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            border: '1px solid #eadbd8',
            borderRadius: '8px',
            background: '#fff',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Order Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="admin-card" style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #efddda', padding: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
            <FiRefreshCw className="spin" size={28} style={{ display: 'block', margin: '0 auto 12px' }} />
            Loading orders from database...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
            <FiPackage size={40} style={{ color: '#ccc', marginBottom: '12px' }} />
            <h3>No orders found</h3>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>
              {search || statusFilter !== 'ALL' ? 'Try changing your search or filter.' : 'Customer orders will show up here dynamically.'}
            </p>
          </div>
        ) : (
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f2e4e1', color: '#6d5a57' }}>
                <th style={{ padding: '12px 10px' }}>Order ID & Date</th>
                <th style={{ padding: '12px 10px' }}>Customer</th>
                <th style={{ padding: '12px 10px' }}>Items Summary</th>
                <th style={{ padding: '12px 10px' }}>Payment</th>
                <th style={{ padding: '12px 10px' }}>Total</th>
                <th style={{ padding: '12px 10px' }}>Order Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const firstItem = order.items?.[0] || {};
                const moreItemsCount = (order.items?.length || 1) - 1;
                const formattedDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'Recent';

                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f6edeb', verticalAlign: 'middle' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <strong style={{ color: '#2d2424', fontSize: '14px' }}>#{order.orderId}</strong>
                      <small style={{ display: 'block', color: '#888', marginTop: '3px' }}>{formattedDate}</small>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ fontWeight: '600', color: '#333' }}>
                        {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                      </span>
                      <small style={{ display: 'block', color: '#777' }}>
                        {order.shippingAddress?.phone || order.user?.phone || 'No phone'}
                      </small>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={firstItem.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=150&q=70'}
                          alt={firstItem.name}
                          style={{ width: '42px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {firstItem.name || 'Product'}
                          </div>
                          <small style={{ color: '#777', fontSize: '11px' }}>
                            Size: <b>{firstItem.size || 'M'}</b> {firstItem.color ? `• Color: ${firstItem.color}` : ''} • Qty: <b>{firstItem.quantity || 1}</b>
                          </small>
                          {moreItemsCount > 0 && (
                            <span style={{ display: 'inline-block', fontSize: '11px', color: '#e11b22', fontWeight: '600', marginLeft: '4px' }}>
                              +{moreItemsCount} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: order.paymentMethod === 'Online' ? '#2563eb' : '#4b5563' }}>
                        {order.paymentMethod === 'Online' ? 'Razorpay' : 'COD'}
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          marginTop: '3px',
                          fontWeight: '600',
                          backgroundColor: order.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                          color: order.paymentStatus === 'Paid' ? '#15803d' : '#b45309'
                        }}
                      >
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <strong style={{ color: '#e11b22', fontSize: '15px' }}>
                        ₹{(Number(order.totalAmount) || 0).toLocaleString()}
                      </strong>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span className={getStatusBadgeClass(order.orderStatus)}>
                        {order.orderStatus || 'Processing'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <button
                        className="icon-btn"
                        onClick={() => openOrderModal(order)}
                        title="View Full Order Details"
                        style={{ cursor: 'pointer' }}
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => setInvoiceOrder(order)}
                        title="View & Print Bill / Invoice"
                        style={{ cursor: 'pointer', color: '#e11b22', marginLeft: '6px' }}
                      >
                        <FiFileText size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* FULL ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="admin-modal" style={{ maxWidth: '780px', width: '95vw', padding: '24px', borderRadius: '14px' }}>
            <div className="modal-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#e11b22', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Order Details
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '22px', color: '#222' }}>
                  #{selectedOrder.orderId}
                </h3>
                <small style={{ color: '#888' }}>
                  Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('en-IN') : 'N/A'}
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff1f2',
                    color: '#e11b22',
                    border: '1px solid #fecdd3',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  <FiPrinter /> Print Bill / Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* STATUS UPDATE CONTROLS */}
            <div
              style={{
                backgroundColor: '#fff7f5',
                border: '1px solid #ffdcd6',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px', fontWeight: 'bold' }}>
                    Order Status
                  </label>
                  <select
                    value={editOrderStatus}
                    onChange={(e) => setEditOrderStatus(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px', fontWeight: 'bold' }}>
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating}
                style={{
                  backgroundColor: '#e11b22',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '9px 18px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {updating ? 'Updating...' : 'Save Status'}
              </button>
            </div>

            {/* CUSTOMER & SHIPPING & PAYMENT INFO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '8px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#444' }}>
                  <FiMapPin style={{ color: '#e11b22' }} /> Delivery Address
                </h4>
                <p style={{ margin: '3px 0', fontSize: '13px', fontWeight: '600' }}>
                  {selectedOrder.shippingAddress?.fullName}
                </p>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#555' }}>
                  {selectedOrder.shippingAddress?.address}
                </p>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#555' }}>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#333' }}>
                  <b>Phone:</b> {selectedOrder.shippingAddress?.phone}
                </p>
                {selectedOrder.shippingAddress?.email && (
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#333' }}>
                    <b>Email:</b> {selectedOrder.shippingAddress?.email}
                  </p>
                )}
              </div>

              <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '8px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#444' }}>
                  <FiCreditCard style={{ color: '#e11b22' }} /> Payment & Customer Details
                </h4>
                <p style={{ margin: '3px 0', fontSize: '13px' }}>
                  <b>Method:</b> {selectedOrder.paymentMethod === 'Online' ? 'Razorpay (Online)' : 'Cash on Delivery (COD)'}
                </p>
                <p style={{ margin: '3px 0', fontSize: '13px' }}>
                  <b>Payment Status:</b> <span style={{ fontWeight: '600', color: selectedOrder.paymentStatus === 'Paid' ? '#16a34a' : '#d97706' }}>{selectedOrder.paymentStatus}</span>
                </p>
                {selectedOrder.razorpayPaymentId && (
                  <p style={{ margin: '3px 0', fontSize: '12px', wordBreak: 'break-all', color: '#555' }}>
                    <b>Razorpay Payment ID:</b> {selectedOrder.razorpayPaymentId}
                  </p>
                )}
                {selectedOrder.razorpayOrderId && (
                  <p style={{ margin: '3px 0', fontSize: '12px', wordBreak: 'break-all', color: '#555' }}>
                    <b>Razorpay Order ID:</b> {selectedOrder.razorpayOrderId}
                  </p>
                )}
              </div>
            </div>

            {/* ORDERED ITEMS LIST */}
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#222' }}>
              Ordered Items ({selectedOrder.items?.length || 0})
            </h4>

            <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              {selectedOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid #eee',
                    background: '#fff'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=200&q=70'}
                    alt={item.name}
                    style={{ width: '60px', height: '72px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 4px', fontSize: '14px', color: '#222' }}>
                      {item.name}
                    </h5>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#666' }}>
                      <span>Size: <b style={{ color: '#222' }}>{item.size || 'M'}</b></span>
                      {item.color && (
                        <span>Color: <b style={{ color: '#222' }}>{item.color}</b></span>
                      )}
                      <span>Qty: <b style={{ color: '#222' }}>{item.quantity || 1}</b></span>
                      <span>Unit Price: <b style={{ color: '#222' }}>₹{Number(item.price || 0).toLocaleString()}</b></span>
                    </div>
                  </div>
                  <strong style={{ color: '#e11b22', fontSize: '15px' }}>
                    ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            {/* FINANCIAL SUMMARY */}
            <div style={{ background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '13px' }}>
                <span>Subtotal</span>
                <b>₹{Number(selectedOrder.subtotal || 0).toLocaleString()}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '13px' }}>
                <span>Shipping Fee</span>
                <b>{Number(selectedOrder.shippingFee || 0) === 0 ? 'FREE' : `₹${selectedOrder.shippingFee}`}</b>
              </div>
              {Number(selectedOrder.discount || 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '13px', color: '#2563eb' }}>
                  <span>Discount</span>
                  <b>-₹{Number(selectedOrder.discount).toLocaleString()}</b>
                </div>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                <span>Total Amount</span>
                <span style={{ color: '#e11b22' }}>₹{Number(selectedOrder.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE BILL / INVOICE MODAL */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
