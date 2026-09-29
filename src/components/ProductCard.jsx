import React from 'react';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
export default function ProductCard({ product }) {
    const nav = useNavigate(); const add = () => {
        const c = JSON.parse(localStorage.getItem('sbv-cart') || '[]');
        localStorage.setItem('sbv-cart', JSON.stringify([...c, product])); alert('Added to cart');
    };
    const wish = () => { const w = JSON.parse(localStorage.getItem('sbv-wishlist') || '[]'); localStorage.setItem('sbv-wishlist', JSON.stringify([...w.filter(x => x.id !== product.id), product])); alert('Added to wishlist'); };
    return <article className="product-card" onClick={() => nav('/product/' + product.id)} style={{ cursor: 'pointer' }}>
        <div className="product-image">
            <img src={product.image} alt={product.name} />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <button className="wish" onClick={e => { e.stopPropagation(); wish() }}><FiHeart />
            </button>
        </div>
        <div className="product-info"><h3>{product.name}</h3>
            <small>{product.category}</small>
            <div className="rating">
                <FiStar fill="currentColor" /> {product.rating || 4.5} <span>({product.reviews || 64})</span>
            </div>
            <div className="price">₹{product.price.toLocaleString()} <del>₹{product.mrp.toLocaleString()}</del>
            </div>
            <div className="product-card-actions">
                <button className="add-cart" onClick={(e) => { e.stopPropagation(); add(); }}><FiShoppingBag /> Add to Cart</button>
                <button className="buy-now" onClick={(e) => { e.stopPropagation(); add(); nav('/checkout'); }}>Buy Now</button>
            </div>
        </div></article>
}
