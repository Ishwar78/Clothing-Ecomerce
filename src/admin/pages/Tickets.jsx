import React, { useState, useEffect } from 'react';
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiSend
} from 'react-icons/fi';
import api from '../../lib/api';
import './DataPages.css';
import './Tickets.css';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Modal edit state
  const [editStatus, setEditStatus] = useState('Open');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets');
      if (res.success) {
        setTickets(res.tickets || []);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status || 'Open');
    setAdminReplyText(ticket.adminReply || '');
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    setSaving(true);
    try {
      const res = await api.put(`/tickets/${selectedTicket._id}/status`, {
        status: editStatus,
        adminReply: adminReplyText
      });

      if (res.success) {
        setTickets(prev =>
          prev.map(t => (t._id === selectedTicket._id ? res.ticket : t))
        );
        setSelectedTicket(res.ticket);
        alert('Ticket updated successfully!');
      } else {
        alert(res.message || 'Failed to update ticket');
      }
    } catch (err) {
      console.error('Update ticket error:', err);
      alert('Error updating ticket: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this support ticket?')) return;
    try {
      const res = await api.delete(`/tickets/${ticketId}`);
      if (res.success) {
        setTickets(prev => prev.filter(t => t._id !== ticketId));
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(null);
        }
        alert('Ticket deleted successfully');
      } else {
        alert(res.message || 'Failed to delete ticket');
      }
    } catch (err) {
      alert('Error deleting ticket: ' + err.message);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      (t.ticketId || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.message || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || t.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="admin-badge warn">Open</span>;
      case 'In Progress':
        return <span className="admin-badge info">In Progress</span>;
      case 'Resolved':
        return <span className="admin-badge success">Resolved</span>;
      case 'Closed':
        return <span className="admin-badge">Closed</span>;
      default:
        return <span className="admin-badge">{status}</span>;
    }
  };

  return (
    <div className="admin-tickets-page">
      {/* HEADER */}
      <div className="admin-title">
        <div>
          <h2>Support Tickets</h2>
          <p>Customer help inquiries, order complaints, and live issue tracking.</p>
        </div>
        <button
          type="button"
          className="admin-btn secondary"
          onClick={fetchTickets}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* STATS STRIP */}
      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiMessageSquare />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>TOTAL TICKETS</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>{tickets.length}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#f59e0b', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiClock />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>OPEN (PENDING)</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#d97706' }}>{openCount}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dbeafe', color: '#3b82f6', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiAlertCircle />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>IN PROGRESS</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#2563eb' }}>{inProgressCount}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#d1fae5', color: '#10b981', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
            <FiCheckCircle />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>RESOLVED</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>{resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="admin-card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }}>
            <FiSearch style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by Ticket ID, Customer, Subject, Order #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', background: '#fff' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', background: '#fff' }}
            >
              <option value="ALL">All Categories</option>
              <option value="Order Issue">Order Issue</option>
              <option value="Payment & Refund">Payment & Refund</option>
              <option value="Delivery Tracking">Delivery Tracking</option>
              <option value="Product Query">Product Query</option>
              <option value="Size & Exchange">Size & Exchange</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
        </div>
      </div>

      {/* TICKETS TABLE */}
      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <FiRefreshCw className="spin" style={{ fontSize: '24px', marginBottom: '8px' }} />
            <div>Loading support tickets...</div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6b7280' }}>
            <FiMessageSquare style={{ fontSize: '36px', color: '#d1d5db', marginBottom: '12px' }} />
            <h3>No Support Tickets Found</h3>
            <p>Tickets submitted by customers will show up here automatically.</p>
          </div>
        ) : (
          <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Category & Subject</th>
                  <th>Related Order</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td>
                      <b style={{ color: '#ef4444', letterSpacing: '0.5px' }}>{ticket.ticketId}</b>
                      {ticket.priority && (
                        <small style={{ 
                          display: 'inline-block', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '10px', 
                          fontWeight: 'bold',
                          marginTop: '3px',
                          background: ticket.priority === 'Urgent' || ticket.priority === 'High' ? '#fee2e2' : '#f3f4f6',
                          color: ticket.priority === 'Urgent' || ticket.priority === 'High' ? '#dc2626' : '#4b5563'
                        }}>
                          {ticket.priority}
                        </small>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#111827' }}>{ticket.userName}</div>
                      <small style={{ color: '#6b7280' }}>{ticket.userEmail}</small>
                      {ticket.userPhone && <small style={{ color: '#9ca3af' }}>{ticket.userPhone}</small>}
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontWeight: '600', display: 'inline-block', marginBottom: '4px' }}>
                        {ticket.category || 'General'}
                      </span>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#374151' }}>{ticket.subject}</div>
                      <small style={{ color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ticket.message}
                      </small>
                    </td>
                    <td>
                      {ticket.orderId ? (
                        <span style={{ fontWeight: '600', color: '#4f46e5', background: '#eef2ff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {ticket.orderId}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <small style={{ whiteSpace: 'nowrap' }}>
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </small>
                    </td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="admin-action-btn view"
                          title="View & Reply"
                          onClick={() => openTicketModal(ticket)}
                        >
                          <FiEye /> View
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn delete"
                          title="Delete Ticket"
                          onClick={() => handleDeleteTicket(ticket._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TICKET DETAILS & REPLY MODAL */}
      {selectedTicket && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="admin-modal" style={{ maxWidth: '650px', width: '100%', borderRadius: '16px', padding: '26px' }}>
            <div className="modal-head" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0 }}>Ticket #{selectedTicket.ticketId}</h3>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <small style={{ color: '#6b7280' }}>
                  Created on {new Date(selectedTicket.createdAt).toLocaleString('en-IN')}
                </small>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedTicket(null)} 
                style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}
              >
                ×
              </button>
            </div>

            {/* CUSTOMER INFO */}
            <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '10px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Customer Name</span>
                <strong style={{ fontSize: '13px', color: '#111827' }}><FiUser style={{ verticalAlign: '-1px' }} /> {selectedTicket.userName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Email Address</span>
                <strong style={{ fontSize: '13px', color: '#111827' }}><FiMail style={{ verticalAlign: '-1px' }} /> {selectedTicket.userEmail}</strong>
              </div>
              {selectedTicket.userPhone && (
                <div>
                  <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Phone</span>
                  <strong style={{ fontSize: '13px', color: '#111827' }}><FiPhone style={{ verticalAlign: '-1px' }} /> {selectedTicket.userPhone}</strong>
                </div>
              )}
              {selectedTicket.orderId && (
                <div>
                  <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Related Order</span>
                  <strong style={{ fontSize: '13px', color: '#4f46e5' }}>{selectedTicket.orderId}</strong>
                </div>
              )}
            </div>

            {/* SUBJECT & CATEGORY */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                  {selectedTicket.category || 'General'}
                </span>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#111827' }}>{selectedTicket.subject}</h4>
              </div>
            </div>

            {/* CUSTOMER MESSAGE */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Customer Message:
              </label>
              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '14px', fontSize: '13px', lineHeight: '1.6', color: '#2d3748', whiteSpace: 'pre-wrap' }}>
                {selectedTicket.message}
              </div>
            </div>

            {/* ADMIN REPLY & STATUS UPDATE FORM */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Update Ticket Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Admin Reply / Resolution Notes (Visible to Customer):
                </label>
                <textarea
                  rows="4"
                  placeholder="Type response to the customer regarding this ticket..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', lineHeight: '1.5', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setSelectedTicket(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn primary"
                  disabled={saving}
                  onClick={handleUpdateTicket}
                >
                  <FiSend /> {saving ? 'Saving...' : 'Update & Send Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
