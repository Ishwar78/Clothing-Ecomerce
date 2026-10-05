import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiUser,
  FiTag,
  FiShare2,
  FiCheck,
  FiBookOpen,
  FiFacebook,
  FiTwitter
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../lib/api';
import './BlogDetails.css';

export default function BlogDetails() {
  const { slug } = useParams();
  const nav = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs/${slug}`);
      if (res.success && res.blog) {
        setBlog(res.blog);
        setRelatedBlogs(res.relatedBlogs || []);
        applySeoTags(res.blog);
      } else {
        setBlog(null);
      }
    } catch (err) {
      console.error('Fetch blog details error:', err);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper to dynamically inject and update SEO tags in document <head>
  const applySeoTags = (blogData) => {
    const metaTitle = blogData.seoTitle || `${blogData.title} | Joyfulmarts (Joyfulmarts)`;
    const rawShortDesc = blogData.shortDescription ? blogData.shortDescription.replace(/<[^>]+>/g, '') : '';
    const metaDesc = blogData.seoDescription || rawShortDesc || blogData.title;
    const metaKeywords = blogData.seoKeywords || `${blogData.category}, fashion, ethnic wear, clothing, Joyfulmarts`;

    // 1. Update Document Title
    document.title = metaTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (nameAttr, nameVal, contentVal) => {
      let meta = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameAttr, nameVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentVal);
    };

    setMetaTag('name', 'description', metaDesc);
    setMetaTag('name', 'keywords', metaKeywords);
    setMetaTag('property', 'og:title', metaTitle);
    setMetaTag('property', 'og:description', metaDesc);
    if (blogData.image) {
      setMetaTag('property', 'og:image', blogData.image);
    }

    // 3. Log SEO details in console as requested by user
    console.group('%c✦ [Joyfulmarts BLOG SEO TAGS APPLIED] ✦', 'color: #ed4765; font-weight: bold; font-size: 13px;');
    console.log('📌 Title:', metaTitle);
    console.log('📝 Description:', metaDesc);
    console.log('🏷️ Keywords:', metaKeywords);
    console.log('🔗 Slug Route:', `/blog/${blogData.slug}`);
    console.log('🖼️ Featured Image:', blogData.image);
    console.log('✅ Document <head> meta tags updated successfully.');
    console.groupEnd();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <main className="blog-details-page">
        <div className="blog-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="blog-details-page">
        <div className="blog-not-found container">
          <FiBookOpen size={48} color="#ed4765" />
          <h2>Article Not Found</h2>
          <p>The story you are looking for may have been moved or unpublished.</p>
          <Link to="/blog" className="btn btn-primary">
            <FiArrowLeft /> Back to Blog Journal
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const pageUrl = window.location.href;
  const shareTitle = encodeURIComponent(blog.title);

  return (
    <main className="blog-details-page">
      {/* BREADCRUMB */}
      <nav className="blog-breadcrumb-wrap">
        <div className="container blog-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/blog">Journal</Link>
          <span>/</span>
          <span className="current-crumb">{blog.title}</span>
        </div>
      </nav>

      {/* ARTICLE HEADER */}
      <header className="blog-details-header container">
        <span className="blog-detail-category">{blog.category}</span>

        <h1 className="blog-detail-title">{blog.title}</h1>

        <div className="blog-detail-meta-bar">
          <div className="meta-left">
            <div className="author-avatar">
              <FiUser />
            </div>
            <div className="author-info">
              <strong>{blog.author || 'Joyfulmarts Editorial'}</strong>
              <span>Fashion & Style Editor</span>
            </div>
          </div>

          <div className="meta-divider"></div>

          <div className="meta-pill">
            <FiCalendar />
            <span>{formattedDate}</span>
          </div>

          <div className="meta-pill">
            <FiClock />
            <span>{blog.readTime || '5 min read'}</span>
          </div>
        </div>
      </header>

      {/* FEATURED BANNER */}
      <section className="blog-featured-media container">
        <div className="featured-banner-wrap">
          <img
            src={blog.image}
            alt={blog.title}
            onError={(e) => { e.currentTarget.src = '/assets/women.png'; }}
          />
        </div>
      </section>

      {/* ARTICLE BODY */}
      <article className="blog-body-container container">
        {/* SHORT DESCRIPTION LEAD */}
        {blog.shortDescription && (
          <div
            className="blog-lead-box"
            dangerouslySetInnerHTML={{ __html: blog.shortDescription }}
          />
        )}

        {/* FULL RICH TEXT CONTENT */}
        <div
          className="blog-rich-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* SOCIAL SHARE & TAGS */}
        <div className="blog-article-footer">
          <div className="blog-tags-row">
            <FiTag />
            <span className="tag-pill">{blog.category}</span>
            {blog.seoKeywords && blog.seoKeywords.split(',').slice(0, 3).map((kw, idx) => (
              <span key={idx} className="tag-pill">{kw.trim()}</span>
            ))}
          </div>

          <div className="blog-share-row">
            <span className="share-label"><FiShare2 /> Share:</span>
            <a
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${pageUrl}`}
              target="_blank"
              rel="noreferrer"
              className="share-btn whatsapp"
              title="Share on WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
              target="_blank"
              rel="noreferrer"
              className="share-btn facebook"
              title="Share on Facebook"
            >
              <FiFacebook />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${pageUrl}`}
              target="_blank"
              rel="noreferrer"
              className="share-btn twitter"
              title="Share on Twitter"
            >
              <FiTwitter />
            </a>
            <button
              type="button"
              className="share-btn copy"
              onClick={handleCopyLink}
              title="Copy Link"
            >
              {copied ? <FiCheck color="#16a34a" /> : <FiShare2 />}
            </button>
            {copied && <span className="copied-bubble">Copied!</span>}
          </div>
        </div>

        {/* AUTHOR BIO CARD */}
        <div className="blog-author-bio-card">
          <div className="author-card-avatar">
            <FiUser size={28} />
          </div>
          <div className="author-card-text">
            <h4>{blog.author || 'Joyfulmarts Editorial'}</h4>
            <p>
              Curated by the stylists and fashion directors at Joyfulmarts.
              Dedicated to celebrating India's rich handloom traditions with timeless contemporary style.
            </p>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="back-to-blogs-wrap">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => nav('/blog')}
          >
            <FiArrowLeft /> Back to All Articles
          </button>
        </div>
      </article>

      {/* RELATED ARTICLES */}
      {relatedBlogs.length > 0 && (
        <section className="related-blogs-section container">
          <div className="section-heading">
            <div>
              <span className="section-label">RECOMMENDED STORIES</span>
              <h2>You Might Also Enjoy</h2>
            </div>
            <Link to="/blog" className="view-all-link">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="related-blogs-grid">
            {relatedBlogs.map((rel) => (
              <article key={rel._id || rel.slug} className="blog-card">
                <Link to={`/blog/${rel.slug}`} className="blog-card-image">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    onError={(e) => { e.currentTarget.src = '/assets/women.png'; }}
                  />
                  <span>{rel.category}</span>
                </Link>

                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span>
                      <FiCalendar /> {new Date(rel.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>
                      <FiClock /> {rel.readTime || '5 min read'}
                    </span>
                  </div>

                  <h3>
                    <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h3>

                  <p>
                    {rel.shortDescription ? rel.shortDescription.replace(/<[^>]+>/g, '').slice(0, 110) + '...' : ''}
                  </p>

                  <Link to={`/blog/${rel.slug}`} className="read-more">
                    Read Article <FiArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
