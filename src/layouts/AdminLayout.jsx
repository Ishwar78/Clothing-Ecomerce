import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FiGrid,
    FiTag,
    FiPackage,
    FiImage,
    FiShoppingBag,
    FiUsers,
    FiPercent,
    FiMessageSquare,
    FiRotateCcw,
    FiPhone,
    FiHelpCircle,
    FiMenu, FiX,
    FiLogOut,
    FiStar,
    FiInstagram,
    FiFileText,
    FiCamera,
    FiBookOpen
} from 'react-icons/fi';
import './AdminLayout.css';
const links = [
    ['/admin', 'Overview', FiGrid],
    ['/admin/categories', 'Categories', FiTag],
    ['/admin/products', 'Products', FiPackage],
    ['/admin/banners', 'Home Banner', FiImage],
    ['/admin/influencers', 'Fashion Influencer', FiInstagram],
    ['/admin/style-share', 'Style It & Share It', FiCamera],
    ['/admin/blogs', 'Blogs & Articles', FiBookOpen],
    ['/admin/orders', 'Orders', FiShoppingBag],
    ['/admin/users', 'Users', FiUsers],
    ['/admin/coupons', 'Coupon Codes', FiPercent],
    ['/admin/tickets', 'Support Tickets', FiMessageSquare],
    ['/admin/returns', 'Return Requests', FiRotateCcw],
    ['/admin/contact', 'Contact', FiPhone],
    ['/admin/inquiries', 'Inquiries', FiHelpCircle],
    ['/admin/reviews', 'Reviews', FiStar],
    ['/admin/company', 'Company & Bill', FiFileText]
];
export function AdminLayout({ children }) {
    const nav = useNavigate(), loc = useLocation();
    const [open, setOpen] = useState(false);
    return <div className="admin-shell">
        <aside className={open ? 'admin-side open' : 'admin-side'}>
            <div className="admin-logo">
                <span>✦ Joyfulmarts ✦</span>
                <small>ADMIN PANEL</small>
            </div>{links.map(([p, n, I]) =>
                <button key={p} className={loc.pathname === p ? 'active' : ''} onClick={() => { nav(p); setOpen(false) }}><I />{n}</button>)}
            <button onClick={() => nav('/admin/login')}>
                <FiLogOut /> Logout</button>
        </aside><div className="admin-main">
            <header className="admin-top">
                <button className="admin-menu" onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</button>
                <div><h1>Joyfulmarts</h1>
                    <p>Store Administration</p>
                </div><div className="admin-user">Admin <span>SB</span>
                </div>
            </header>
            <section className="admin-content">{children}</section>
        </div>
    </div>
}
