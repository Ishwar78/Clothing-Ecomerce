import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import './Cart.css';

export default function Cart({ inDashboard = false }) {
  const nav = useNavigate();
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sbv-cart') || '[]');
    } catch {
      return [];
    }
  });

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('sbv-cart', JSON.stringify(newItems));
  };

  const updateQty = (index, delta) => {
    const updated = [...items];
    const newQty = (updated[index].quantity || 1) + delta;
    if (newQty <= 0) {
      remove(index);
    } else {
      updated[index].quantity = newQty;
      saveItems(updated);
    }
  };

  const remove = (i) => {
    const updated = items.filter((_, idx) => idx !== i);
    saveItems(updated);
  };

  const subtotal = items.reduce((s, p) => s + (Number(p.price) || 0) * (Number(p.quantity) || 1), 0);
  const shippingFee = subtotal >= 999 ? 0 : (subtotal > 0 ? 99 : 0);
  const total = subtotal + shippingFee;

  return (
    <div className={`cart-page container ${inDashboard ? 'in-dashboard' : ''}`} style={inDashboard ? { padding: '20px' } : {}}>
      {!inDashboard && (
        <div className="simple-title">
          <span className="pill">YOUR BAG</span>
          <h1>Shopping Cart</h1>
        </div>
      )}

      {!items.length ? (
        <div className="empty" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: '#888', margin: '10px 0 20px' }}>Looks like you haven't added anything to your cart yet.</p>
          <button className="btn btn-primary" onClick={() => nav('/shop')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            {items.map((p, i) => (
              <div className="cart-item" key={i}>
                <img
                  src={p.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=400&q=80'}
                  alt={p.name}
                  style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1, paddingLeft: '15px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '16px' }}>{p.name}</h3>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                    <span>Size: <b>{p.size || 'M'}</b></span>
                    {p.color && <span style={{ marginLeft: '12px' }}>Color: <b>{p.color}</b></span>}
                  </div>
                  <strong style={{ color: '#e11b22', fontSize: '15px' }}>₹{Number(p.price || 0).toLocaleString()}</strong>
                </div>

                <div className="qty" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button type="button" onClick={() => updateQty(i, -1)} style={{ cursor: 'pointer', padding: '4px 8px' }}>
                    <FiMinus />
                  </button>
                  <b>{p.quantity || 1}</b>
                  <button type="button" onClick={() => updateQty(i, 1)} style={{ cursor: 'pointer', padding: '4px 8px' }}>
                    <FiPlus />
                  </button>
                </div>

                <button className="remove" onClick={() => remove(i)} title="Remove item" style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#888' }}>
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </section>

          <aside className="summary">
            <h2>Order Summary</h2>
            <div>
              <span>Subtotal</span>
              <b>₹{subtotal.toLocaleString()}</b>
            </div>
            <div>
              <span>Shipping</span>
              <b>{subtotal >= 999 ? 'FREE' : '₹99'}</b>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <b>₹{total.toLocaleString()}</b>
            </div>
            <button className="btn btn-primary checkout" onClick={() => nav('/checkout')}>
              Proceed to Checkout <FiArrowRight />
            </button>
            <p>Secure checkout • COD available • Easy 7-day returns</p>
          </aside>
        </div>
      )}
    </div>
  );
}
