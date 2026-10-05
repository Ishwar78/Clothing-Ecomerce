import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiArrowRight,
    FiSearch,
    FiClock,
    FiCalendar,
    FiHeart,
    FiBookOpen
} from 'react-icons/fi';
import api from '../lib/api';
import './Blog.css';

const DEFAULT_BLOGS = [
    {
        _id: '1',
        title: 'How to Style Ethnic Wear for Every Occasion',
        slug: 'how-to-style-ethnic-wear-for-every-occasion',
        category: 'ETHNIC WEAR',
        createdAt: '2026-09-24',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'From festive celebrations to family gatherings, discover elegant ways to style ethnic outfits and create a graceful look.'
    },
    {
        _id: '2',
        title: '5 Fashion Trends You Should Try This Season',
        slug: '5-fashion-trends-you-should-try-this-season',
        category: 'FASHION',
        createdAt: '2026-09-20',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Explore the latest fashion trends and discover simple ways to bring fresh styles into your everyday wardrobe.'
    },
    {
        _id: '3',
        title: 'The Complete Guide to Choosing the Right Outfit',
        slug: 'the-complete-guide-to-choosing-the-right-outfit',
        category: 'STYLE GUIDE',
        createdAt: '2026-09-16',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Learn how to choose colours, fits, fabrics and accessories that work beautifully together.'
    },
    {
        _id: '4',
        title: 'Everyday Fashion: Comfort Meets Style',
        slug: 'everyday-fashion-comfort-meets-style',
        category: 'LIFESTYLE',
        createdAt: '2026-09-12',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Looking stylish does not have to mean compromising on comfort. Here are our favourite everyday styling ideas.'
    },
    {
        _id: '5',
        title: 'How to Build a Versatile Wardrobe',
        slug: 'how-to-build-a-versatile-wardrobe',
        category: 'STYLE GUIDE',
        createdAt: '2026-09-08',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Build a wardrobe that works for workdays, weekends, celebrations and everything in between.'
    },
    {
        _id: '6',
        title: 'Accessories That Complete Your Look',
        slug: 'accessories-that-complete-your-look',
        category: 'ACCESSORIES',
        createdAt: '2026-09-04',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'A few carefully selected accessories can transform even the simplest outfit into a complete look.'
    }
];

export default function Blog() {
    const nav = useNavigate();
    const [blogsList, setBlogsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('ALL');
    const [search, setSearch] = useState('');
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        document.title = 'Journal & Style Stories | Joyfulmarts (Joyfulmarts)';
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/blogs');
            if (res.success && Array.isArray(res.blogs) && res.blogs.length > 0) {
                setBlogsList(res.blogs);
            } else {
                setBlogsList(DEFAULT_BLOGS);
            }
        } catch (err) {
            console.error('Fetch storefront blogs error:', err);
            setBlogsList(DEFAULT_BLOGS);
        } finally {
            setLoading(false);
        }
    };

    // Extract categories
    const categories = useMemo(() => {
        const set = new Set(['ALL']);
        blogsList.forEach(b => {
            if (b.category) set.add(b.category.toUpperCase());
        });
        return Array.from(set);
    }, [blogsList]);

    const filteredBlogs = useMemo(() => {
        return blogsList.filter((blog) => {
            const blogCat = (blog.category || 'FASHION').toUpperCase();
            const categoryMatch = category === 'ALL' || blogCat === category;

            const searchText = search.trim().toLowerCase();
            const cleanShortDesc = (blog.shortDescription || '').replace(/<[^>]+>/g, '').toLowerCase();

            const searchMatch =
                !searchText ||
                blog.title.toLowerCase().includes(searchText) ||
                blogCat.includes(searchText) ||
                cleanShortDesc.includes(searchText);

            return categoryMatch && searchMatch;
        });
    }, [blogsList, category, search]);

    const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : blogsList[0] || DEFAULT_BLOGS[0];

    const toggleSave = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSavedPosts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    return (
        <main className="blog-page">

            {/* HERO */}
            <section className="blog-hero">
                <div className="blog-hero-content">
                    <span className="blog-pill">Joyfulmarts JOURNAL</span>

                    <h1>
                        Stories, Style
                        <br />
                        <span>&amp; Inspiration</span>
                    </h1>

                    <p>
                        Discover fashion inspiration, styling guides,
                        seasonal trends and stories from the world of
                        Joyfulmarts.
                    </p>
                </div>

                <div className="blog-hero-decoration">
                    <span>✦</span>
                    <span>Joyfulmarts</span>
                    <span>✦</span>
                </div>
            </section>

            {/* FEATURED ARTICLE */}
            {featuredBlog && (
                <section className="blog-container featured-section">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">EDITOR'S PICK</span>
                            <h2>Featured Story</h2>
                        </div>
                    </div>

                    <article className="featured-blog">
                        <Link to={`/blog/${featuredBlog.slug}`} className="featured-image-wrap">
                            <img
                                src={featuredBlog.image}
                                alt={featuredBlog.title}
                                onError={(e) => { e.currentTarget.src = '/assets/women.png'; }}
                            />
                            <span className="featured-category">
                                {featuredBlog.category}
                            </span>
                        </Link>

                        <div className="featured-content">
                            <div className="blog-meta">
                                <span>
                                    <FiCalendar />
                                    {new Date(featuredBlog.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>

                                <span>
                                    <FiClock />
                                    {featuredBlog.readTime || '5 min read'}
                                </span>
                            </div>

                            <h2>
                                <Link to={`/blog/${featuredBlog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {featuredBlog.title}
                                </Link>
                            </h2>

                            <p>
                                {(featuredBlog.shortDescription || '').replace(/<[^>]+>/g, '')}
                            </p>

                            <div className="featured-bottom">
                                <Link to={`/blog/${featuredBlog.slug}`} className="blog-read-btn">
                                    Read Full Story
                                    <FiArrowRight />
                                </Link>

                                <button
                                    type="button"
                                    className={`blog-heart ${savedPosts.includes(featuredBlog._id) ? 'active' : ''}`}
                                    aria-label="Save article"
                                    onClick={(e) => toggleSave(featuredBlog._id, e)}
                                >
                                    <FiHeart fill={savedPosts.includes(featuredBlog._id) ? '#ed4765' : 'none'} color={savedPosts.includes(featuredBlog._id) ? '#ed4765' : 'currentColor'} />
                                </button>
                            </div>
                        </div>
                    </article>
                </section>
            )}

            {/* BLOG LIST */}
            <section className="blog-container articles-section">
                <div className="articles-top">
                    <div className="section-heading">
                        <span className="section-label">LATEST STORIES</span>
                        <h2>From Our Journal</h2>
                        <p>
                            Fashion ideas, styling tips and inspiration
                            curated for you.
                        </p>
                    </div>

                    <div className="blog-search">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* CATEGORY FILTER */}
                <div className="blog-categories">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className={category === item ? 'active' : ''}
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* CARDS */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#8c7b6d' }}>
                        Loading latest journal articles...
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="blog-grid">
                        {filteredBlogs.map((b) => (
                            <article className="blog-card" key={b._id || b.slug}>
                                <Link to={`/blog/${b.slug}`} className="blog-card-image">
                                    <img
                                        src={b.image}
                                        alt={b.title}
                                        onError={(e) => { e.currentTarget.src = '/assets/women.png'; }}
                                    />
                                    <span>{b.category}</span>
                                    <button
                                        type="button"
                                        className={`card-heart ${savedPosts.includes(b._id) ? 'active' : ''}`}
                                        aria-label="Save article"
                                        onClick={(e) => toggleSave(b._id, e)}
                                    >
                                        <FiHeart fill={savedPosts.includes(b._id) ? '#ed4765' : 'none'} color={savedPosts.includes(b._id) ? '#ed4765' : 'currentColor'} />
                                    </button>
                                </Link>

                                <div className="blog-card-content">
                                    <div className="blog-card-meta">
                                        <span>
                                            <FiCalendar />
                                            {new Date(b.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>

                                        <span>
                                            <FiClock />
                                            {b.readTime || '5 min read'}
                                        </span>
                                    </div>

                                    <h3>
                                        <Link to={`/blog/${b.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {b.title}
                                        </Link>
                                    </h3>

                                    <p>
                                        {(b.shortDescription || '').replace(/<[^>]+>/g, '').slice(0, 120)}
                                        {(b.shortDescription || '').length > 120 ? '...' : ''}
                                    </p>

                                    <Link to={`/blog/${b.slug}`} className="read-more">
                                        Read Article
                                        <FiArrowRight />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="no-blogs">
                        <FiBookOpen />
                        <h3>No articles found</h3>
                        <p>
                            Try searching with another keyword or choose
                            another category.
                        </p>

                        <button
                            onClick={() => {
                                setSearch('');
                                setCategory('ALL');
                            }}
                        >
                            View All Articles
                        </button>
                    </div>
                )}
            </section>

            {/* NEWSLETTER / CTA */}
            <section className="blog-cta">
                <div className="blog-cta-inner">
                    <div>
                        <span className="section-label">
                            STAY INSPIRED
                        </span>

                        <h2>
                            Never miss a
                            <span> style story.</span>
                        </h2>

                        <p>
                            Follow our journal for fresh fashion ideas,
                            styling inspiration and new collection updates.
                        </p>
                    </div>

                    <Link to="/shop" className="blog-cta-btn">
                        Explore Collection
                        <FiArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
}