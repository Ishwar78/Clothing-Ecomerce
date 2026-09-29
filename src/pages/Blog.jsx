import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiArrowRight,
    FiSearch,
    FiClock,
    FiCalendar,
    FiHeart,
    FiBookOpen
} from 'react-icons/fi';
import './Blog.css';

const BLOGS = [
    {
        id: 1,
        title: 'How to Style Ethnic Wear for Every Occasion',
        category: 'ETHNIC WEAR',
        date: 'September 24, 2026',
        readTime: '5 min read',
        image:
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
        excerpt:
            'From festive celebrations to family gatherings, discover elegant ways to style ethnic outfits and create a graceful look.'
    },
    {
        id: 2,
        title: '5 Fashion Trends You Should Try This Season',
        category: 'FASHION',
        date: 'September 20, 2026',
        readTime: '4 min read',
        image:
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
        excerpt:
            'Explore the latest fashion trends and discover simple ways to bring fresh styles into your everyday wardrobe.'
    },
    {
        id: 3,
        title: 'The Complete Guide to Choosing the Right Outfit',
        category: 'STYLE GUIDE',
        date: 'September 16, 2026',
        readTime: '6 min read',
        image:
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
        excerpt:
            'Learn how to choose colours, fits, fabrics and accessories that work beautifully together.'
    },
    {
        id: 4,
        title: 'Everyday Fashion: Comfort Meets Style',
        category: 'LIFESTYLE',
        date: 'September 12, 2026',
        readTime: '4 min read',
        image:
            'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
        excerpt:
            'Looking stylish does not have to mean compromising on comfort. Here are our favourite everyday styling ideas.'
    },
    {
        id: 5,
        title: 'How to Build a Versatile Wardrobe',
        category: 'STYLE GUIDE',
        date: 'September 08, 2026',
        readTime: '7 min read',
        image:
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
        excerpt:
            'Build a wardrobe that works for workdays, weekends, celebrations and everything in between.'
    },
    {
        id: 6,
        title: 'Accessories That Complete Your Look',
        category: 'ACCESSORIES',
        date: 'September 04, 2026',
        readTime: '5 min read',
        image:
            'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85',
        excerpt:
            'A few carefully selected accessories can transform even the simplest outfit into a complete look.'
    }
];

const CATEGORIES = [
    'ALL',
    'FASHION',
    'ETHNIC WEAR',
    'STYLE GUIDE',
    'LIFESTYLE',
    'ACCESSORIES'
];

export default function Blog() {
    const [category, setCategory] = useState('ALL');
    const [search, setSearch] = useState('');

    const filteredBlogs = useMemo(() => {
        return BLOGS.filter((blog) => {
            const categoryMatch =
                category === 'ALL' || blog.category === category;

            const searchText = search.trim().toLowerCase();

            const searchMatch =
                !searchText ||
                blog.title.toLowerCase().includes(searchText) ||
                blog.category.toLowerCase().includes(searchText) ||
                blog.excerpt.toLowerCase().includes(searchText);

            return categoryMatch && searchMatch;
        });
    }, [category, search]);

    const featuredBlog = BLOGS[0];

    return (
        <main className="blog-page">

            {/* HERO */}
            <section className="blog-hero">
                <div className="blog-hero-content">
                    <span className="blog-pill">SBV JOURNAL</span>

                    <h1>
                        Stories, Style
                        <br />
                        <span>&amp; Inspiration</span>
                    </h1>

                    <p>
                        Discover fashion inspiration, styling guides,
                        seasonal trends and stories from the world of
                        SS Vastralaya.
                    </p>
                </div>

                <div className="blog-hero-decoration">
                    <span>✦</span>
                    <span>SBV</span>
                    <span>✦</span>
                </div>
            </section>

            {/* FEATURED ARTICLE */}
            <section className="blog-container featured-section">

                <div className="section-heading">
                    <div>
                        <span className="section-label">EDITOR'S PICK</span>
                        <h2>Featured Story</h2>
                    </div>
                </div>

                <article className="featured-blog">

                    <div className="featured-image-wrap">
                        <img
                            src={featuredBlog.image}
                            alt={featuredBlog.title}
                        />

                        <span className="featured-category">
                            {featuredBlog.category}
                        </span>
                    </div>

                    <div className="featured-content">

                        <div className="blog-meta">
                            <span>
                                <FiCalendar />
                                {featuredBlog.date}
                            </span>

                            <span>
                                <FiClock />
                                {featuredBlog.readTime}
                            </span>
                        </div>

                        <h2>{featuredBlog.title}</h2>

                        <p>{featuredBlog.excerpt}</p>

                        <div className="featured-bottom">
                            <button className="blog-read-btn">
                                Read Full Story
                                <FiArrowRight />
                            </button>

                            <button className="blog-heart" aria-label="Save article">
                                <FiHeart />
                            </button>
                        </div>
                    </div>
                </article>
            </section>

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
                    {CATEGORIES.map((item) => (
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
                {filteredBlogs.length > 0 ? (
                    <div className="blog-grid">

                        {filteredBlogs.map((blog) => (
                            <article className="blog-card" key={blog.id}>

                                <div className="blog-card-image">

                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                    />

                                    <span>
                                        {blog.category}
                                    </span>

                                    <button
                                        className="card-heart"
                                        aria-label="Save article"
                                    >
                                        <FiHeart />
                                    </button>
                                </div>

                                <div className="blog-card-content">

                                    <div className="blog-card-meta">
                                        <span>
                                            <FiCalendar />
                                            {blog.date}
                                        </span>

                                        <span>
                                            <FiClock />
                                            {blog.readTime}
                                        </span>
                                    </div>

                                    <h3>{blog.title}</h3>

                                    <p>{blog.excerpt}</p>

                                    <button className="read-more">
                                        Read Article
                                        <FiArrowRight />
                                    </button>

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