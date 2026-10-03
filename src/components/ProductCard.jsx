import React, { useState, useEffect } from 'react';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { isInWishlist, toggleWishlist, subscribeWishlist } from '../lib/wishlist';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const nav = useNavigate();
    
    if (!product) return null;

    const productId = product._id || product.id;
    const productSlug = product.slug || (product.name ? product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : productId);
    const priceVal = Math.round(Number(product.price) || 0);
    const mrpVal = Math.round(Number(product.originalPrice || product.mrp) || 0);
    const imgUrl = product.images?.[0] || product.image || '/assets/mencategory1.png';

    const [isWish, setIsWish] = useState(() => isInWishlist(product));

    useEffect(() => {
        setIsWish(isInWishlist(product));
        return subscribeWishlist(() => {
            setIsWish(isInWishlist(product));
        });
    }, [product]);

    const add = () => {
        const c = JSON.parse(localStorage.getItem('sbv-cart') || '[]');
        const safeProduct = { ...product, price: priceVal, mrp: mrpVal };
        localStorage.setItem('sbv-cart', JSON.stringify([...c, safeProduct]));
        window.dispatchEvent(new Event('sbv-cart-updated'));
        window.dispatchEvent(new Event('storage'));
        alert(`${product.name} added to cart`);
    };

    const handleWish = (e) => {
        e.stopPropagation();
        const added = toggleWishlist(product);
        setIsWish(added);
    };

    return (
        <article className="product-card" onClick={() => nav('/product/' + productSlug)} style={{ cursor: 'pointer' }}>
            <div className="product-image">
                <img src={imgUrl} alt={product.name} onError={(e) => { e.target.src = '/assets/mencategory1.png'; }} />
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button 
                    className={`wish ${isWish ? 'active' : ''}`} 
                    onClick={handleWish}
                    title={isWish ? "Remove from wishlist" : "Add to wishlist"}
                    type="button"
                >
                    <FiHeart fill={isWish ? "#ed4765" : "none"} color={isWish ? "#ed4765" : "currentColor"} />
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
