import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import './styles/base.css';
import './styles/main.css';
import ScrollToTop from "./components/ScrollToTop";
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export { categories } from './components/Navbar';

function Layout({ children }) {
    return <>
        <Navbar />
        <main>{children}</main>
        <Footer />
    </>
}
export { Layout };

function App() { return <AppRoutes /> }
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <ScrollToTop />
        <App />
    </BrowserRouter>
);
