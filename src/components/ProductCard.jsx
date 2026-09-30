import React from 'react';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const nav = useNavigate();
    
    if (!product) return null;

    const productId = product._id || product.id;
    const priceVal = Number(product.price) || 0;
    const mrpVal = Number(product.originalPrice || product.mrp) || 0;
    const imgUrl = product.images?.[0] || product.image || '/assets/mencategory1.png';

    const add = () => {
        const c = JSON.parse(localStorage.getItem('sbv-cart') || '[]');
        localStorage.setItem('sbv-cart', JSON.stringify([...c, product]));
        alert(`${product.name} added to cart`);
    };

    const wish = () => {
        const w = JSON.parse(localStorage.getItem('sbv-wishlist') || '[]');
        localStorage.setItem('sbv-wishlist', JSON.stringify([...w.filter(x => (x._id || x.id) !== productId), product]));
        alert('Added to wishlist');
    };

    return (
        <article className="product-card" onClick={() => nav('/product/' + productId)} style={{ cursor: 'pointer' }}>
            <div className="product-image">
                <img src={imgUrl} alt={product.name} onError={(e) => { e.target.src = '/assets/mencategory1.png'; }} />
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button className="wish" onClick={e => { e.stopPropagation(); wish(); }}>
                    <FiHeart />
                </button>
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <small>{product.category} {product.subcategory ? `• ${product.subcategory}` : ''}</small>
                <div className="rating">
                    <FiStar fill="currentColor" /> {product.rating || 4.5} <span>({product.reviews || 64})</span>
                </div>
                <div className="price">
                    ₹{priceVal.toLocaleString('en-IN')}
                    {mrpVal > priceVal && <del> ₹{mrpVal.toLocaleString('en-IN')}</del>}
                </div>
                <div className="product-card-actions">
                    <button className="add-cart" onClick={(e) => { e.stopPropagation(); add(); }}>
                        <FiShoppingBag /> Add to Cart
                    </button>
                    <button className="buy-now" onClick={(e) => { e.stopPropagation(); add(); nav('/checkout'); }}>
                        Buy Now
                    </button>
                </div>
            </div>
        </article>
    );
}
