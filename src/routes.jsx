import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './main';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import UserDashboard from './pages/UserDashboard';
import Support from './pages/Support';
import Women from './pages/Women';
import Men from './pages/Men';
import Boys from './pages/Boys';
import Girls from './pages/Girls';
import EthnicWear from './pages/EthnicWear';
import Footwear from './pages/Footwear';
import Accessories from './pages/Accessories';
import NewArrivals from './pages/NewArrivals';
import Sale from './pages/Sale';
import ContactPage from './pages/Contact';
import TermsConditions from './pages/TermsConditions';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnRefund from './pages/ReturnRefund';
import FAQ from './pages/FAQ';



import { AdminLayout } from './layouts/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Overview from './admin/pages/Overview';
import Categories from './admin/pages/Categories';
import Products from './admin/pages/Products';
import Banners from './admin/pages/Banners';
import Orders from './admin/pages/Orders';
import Users from './admin/pages/Users';
import Coupons from './admin/pages/Coupons';
import Tickets from './admin/pages/Tickets';
import Returns from './admin/pages/Returns';
import Contact from './admin/pages/Contact';
import Inquiries from './admin/pages/Inquiries';
import Reviews from './admin/pages/Reviews';
import Influencers from './admin/pages/Influencers';
import StyleShare from './admin/pages/StyleShare';
import Blogs from './admin/pages/Blogs';
import CompanySettings from './admin/pages/CompanySettings';
import { FaQ } from 'react-icons/fa6';
export default function AppRoutes() {
    return <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/women" element={<Layout><Women /></Layout>} />
        <Route path="/men" element={<Layout><Men /></Layout>} />
        <Route path="/boys" element={<Layout><Boys /></Layout>} />
        <Route path="/girls" element={<Layout><Girls /></Layout>} />
        <Route path="/ethnic-wear" element={<Layout><EthnicWear /></Layout>} />
        <Route path="/footwear" element={<Layout><Footwear /></Layout>} />
        <Route path="/accessories" element={<Layout><Accessories /></Layout>} />
        <Route path="/new-arrivals" element={<Layout><NewArrivals /></Layout>} />
        <Route path="/sale" element={<Layout><Sale /></Layout>} />
        <Route path="/contact-us" element={<Layout><ContactPage /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
         <Route path='/term-&-condition' element={<Layout><TermsConditions /></Layout>} />
         <Route path='/privacy-policy' element={<Layout><PrivacyPolicy /></Layout>} />
         <Route path='/blog' element={<Layout><Blog /></Layout>} />
         <Route path='/blog/:slug' element={<Layout><BlogDetails /></Layout>} />
         <Route path='/about-us' element={<Layout><About /></Layout>}  />
         <Route path='/shipping-policy' element={<Layout><ShippingPolicy /></Layout>} />
         <Route path='/return-&-refund' element={<Layout><ReturnRefund /></Layout>} />
         <Route path='/faq' element={<Layout><FAQ /></Layout>} />
    



        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/thank-you" element={<Layout><ThankYou /></Layout>} />
        <Route path="/dashboard" element={<Layout><UserDashboard /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout><Overview /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><Categories /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><Products /></AdminLayout>} />
        <Route path="/admin/banners" element={<AdminLayout><Banners /></AdminLayout>} />
        <Route path="/admin/influencers" element={<AdminLayout><Influencers /></AdminLayout>} />
        <Route path="/admin/style-share" element={<AdminLayout><StyleShare /></AdminLayout>} />
        <Route path="/admin/blogs" element={<AdminLayout><Blogs /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
        <Route path="/admin/coupons" element={<AdminLayout><Coupons /></AdminLayout>} />
        <Route path="/admin/tickets" element={<AdminLayout><Tickets /></AdminLayout>} />
        <Route path="/admin/returns" element={<AdminLayout><Returns /></AdminLayout>} />
        <Route path="/admin/contact" element={<AdminLayout><Contact /></AdminLayout>} />
        <Route path="/admin/inquiries" element={<AdminLayout><Inquiries /></AdminLayout>} />
        <Route path="/admin/reviews" element={<AdminLayout><Reviews /></AdminLayout>} />
        <Route path="/admin/company" element={<AdminLayout><CompanySettings /></AdminLayout>} />
        <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/:slug" element={<Layout><CategoryPage /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
}
