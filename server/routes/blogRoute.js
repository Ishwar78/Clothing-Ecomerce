const express = require('express');
const Blog = require('../models/Blog');

const router = express.Router();

// Helper to generate a clean URL-friendly slug
function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Initial seed articles (matching the existing blog list from Blog.jsx)
const initialSeedBlogs = [
    {
        title: 'How to Style Ethnic Wear for Every Occasion',
        slug: 'how-to-style-ethnic-wear-for-every-occasion',
        category: 'ETHNIC WEAR',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'From festive celebrations to family gatherings, discover elegant ways to style ethnic outfits and create a graceful look.',
        content: `
            <h2>Embrace Elegance with Contemporary Ethnic Wear</h2>
            <p>Ethnic wear holds a special place in every wardrobe, carrying the rich heritage of Indian craftsmanship with modern silhouettes. Whether attending a grand wedding or a low-key family gathering, the right styling elevates your complete outfit.</p>
            
            <h3>1. Mix Traditional Kurtas with Contemporary Cuts</h3>
            <p>Pairing heavy embroidered anarkalis or straight-cut kurtis with cigarette pants or flowy palazzos strikes the ideal balance between heritage and comfort. Opt for breathable fabrics like chanderi, georgette, and pure cotton.</p>
            
            <blockquote>"True fashion is when tradition meets modern effortless comfort."</blockquote>
            
            <h3>2. The Magic of Statement Dupattas</h3>
            <p>A contrasting Banarasi or phulkari dupatta instantly transforms a simple monochrome suit into a festive showstopper. Drape it neatly over one shoulder or let it flow gracefully across both arms.</p>
            
            <h3>3. Choosing the Right Accessories</h3>
            <p>Complete your attire with antique oxidized jhumkas, embellished juttis, and an embellished potli bag. Keep makeup glowing and natural with soft kohl-rimmed eyes.</p>
        `,
        author: 'Joyfulmarts Editorial Team',
        readTime: '5 min read',
        seoTitle: 'How to Style Ethnic Wear for Every Occasion | Joyfulmarts Fashion',
        seoDescription: 'Discover elegant ways to style traditional ethnic wear for weddings, festivals, and parties with Joyfulmarts Vastralaya.',
        seoKeywords: 'ethnic wear, styling guide, kurti styling, wedding outfits, traditional fashion, Joyfulmarts vastralaya',
        isActive: true
    },
    {
        title: '5 Fashion Trends You Should Try This Season',
        slug: '5-fashion-trends-you-should-try-this-season',
        category: 'FASHION',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Explore the latest fashion trends and discover simple ways to bring fresh styles into your everyday wardrobe.',
        content: `
            <h2>Refresh Your Wardrobe with This Season's Top Trends</h2>
            <p>Fashion moves fast, but personal style remains forever. This season is all about blending ease with refined aesthetics. Here are 5 standout trends making waves right now.</p>
            
            <h3>1. Earthy Neutrals & Warm Pastels</h3>
            <p>Soft sage greens, terracotta shades, and creamy beiges are reigning supreme. They offer versatility and can be paired across casual wear and formal office outfits effortlessly.</p>
            
            <h3>2. Statement Sleeves and Ruffled Detailing</h3>
            <p>Bishop sleeves, balloon silhouettes, and subtle ruffle necklines give tops and kurtis an elevated couture touch without going overboard.</p>
            
            <h3>3. Co-ord Sets for Effortless Styling</h3>
            <p>Matching sets in printed cotton and rayon remain the ultimate cheat-code for looking polished in seconds.</p>
        `,
        author: 'Priya Sharma',
        readTime: '4 min read',
        seoTitle: '5 Fashion Trends You Should Try This Season | Style Report',
        seoDescription: 'Explore modern seasonal fashion trends including pastel co-ords, statement sleeves, and earth tone styling.',
        seoKeywords: 'fashion trends, seasonal styles, coord sets, women clothing trends, Joyfulmarts fashion',
        isActive: true
    },
    {
        title: 'The Complete Guide to Choosing the Right Outfit',
        slug: 'the-complete-guide-to-choosing-the-right-outfit',
        category: 'STYLE GUIDE',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Learn how to choose colours, fits, fabrics and accessories that work beautifully together.',
        content: `
            <h2>Mastering the Fundamentals of Personal Styling</h2>
            <p>Finding outfits that flatter your personality and body silhouette starts with understanding color palettes, fabric drape, and occasion suitability.</p>
            
            <h3>Understand Your Color Season</h3>
            <p>Warm skin undertones sparkle in rich mustard, rust, olive green, and gold accents. Cool undertones pop in jewel tones like royal blue, magenta, emerald, and silver trims.</p>
            
            <h3>Prioritize Fabric Quality</h3>
            <p>Invest in natural breathable textiles like pure mulmul, modal, linen, and silk blends for long-lasting charm and unmatched all-day comfort.</p>
        `,
        author: 'Aman Verma',
        readTime: '6 min read',
        seoTitle: 'The Complete Guide to Choosing the Right Outfit | Fashion Tips',
        seoDescription: 'Master how to select perfect colors, fits and fabrics for every occasion with this comprehensive style guide.',
        seoKeywords: 'style guide, how to choose outfit, dress matching, fashion tips, clothes guide',
        isActive: true
    },
    {
        title: 'Everyday Fashion: Comfort Meets Style',
        slug: 'everyday-fashion-comfort-meets-style',
        category: 'LIFESTYLE',
        image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Looking stylish does not have to mean compromising on comfort. Here are our favourite everyday styling ideas.',
        content: `
            <h2>Dressing Well for the Daily Hustle</h2>
            <p>Gone are the days when casual everyday wear meant shapeless tees. Today, elevated basics deliver comfort while keeping you photo-ready wherever you go.</p>
            <p>Pair tailored cotton pants with relaxed kurtas or breathable tunics for a chic look that effortlessly transitions from morning work to evening coffee outings.</p>
        `,
        author: 'Neha Kapoor',
        readTime: '4 min read',
        seoTitle: 'Everyday Fashion: Comfort Meets Style | Daily Wear Guide',
        seoDescription: 'How to look effortlessly chic every day without compromising on all-day comfort and movement.',
        seoKeywords: 'daily wear, casual clothes, comfortable fashion, everyday style, Joyfulmarts collection',
        isActive: true
    },
    {
        title: 'How to Build a Versatile Wardrobe',
        slug: 'how-to-build-a-versatile-wardrobe',
        category: 'STYLE GUIDE',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'Build a wardrobe that works for workdays, weekends, celebrations and everything in between.',
        content: `
            <h2>The Capsule Wardrobe Strategy</h2>
            <p>A smart wardrobe does not require hundreds of items; it needs versatile pieces that seamlessly mix and match. With 10 well-chosen foundation pieces, you can create over 30 distinct looks.</p>
        `,
        author: 'Joyfulmarts Styling Team',
        readTime: '7 min read',
        seoTitle: 'How to Build a Versatile Wardrobe | Capsule Collection',
        seoDescription: 'Learn how to build a flexible wardrobe for work, weekends and parties with curated essentials.',
        seoKeywords: 'capsule wardrobe, versatile clothing, wardrobe essentials, fashion advice',
        isActive: true
    },
    {
        title: 'Accessories That Complete Your Look',
        slug: 'accessories-that-complete-your-look',
        category: 'ACCESSORIES',
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85',
        shortDescription: 'A few carefully selected accessories can transform even the simplest outfit into a complete look.',
        content: `
            <h2>The Power of Curated Accents</h2>
            <p>The right pair of earrings, a classic leather belt, or a finely embroidered stole can breathe new life into everyday outfits. Discover how subtle details make the biggest difference.</p>
        `,
        author: 'Kavita Roy',
        readTime: '5 min read',
        seoTitle: 'Accessories That Complete Your Look | Jewelry & Stoles',
        seoDescription: 'Discover the essential fashion accessories that transform everyday clothing into runway-ready looks.',
        seoKeywords: 'fashion accessories, jewelry styling, stoles, bags, completing the outfit',
        isActive: true
    }
];

// Helper to auto-seed initial blogs if collection is empty
async function seedIfEmpty() {
    try {
        const count = await Blog.countDocuments();
        if (count === 0) {
            await Blog.insertMany(initialSeedBlogs);
            console.log('Seeded initial blogs successfully');
        }
    } catch (err) {
        console.error('Error seeding blogs:', err);
    }
}

// 1. Get active blogs for Storefront (supports category filter & search)
router.get('/', async (req, res) => {
    try {
        await seedIfEmpty();
        const { category, search } = req.query;
        let query = { isActive: true };

        if (category && category !== 'ALL') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: regex },
                { shortDescription: regex },
                { category: regex }
            ];
        }

        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        console.error('Fetch blogs error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching blogs' });
    }
});

// 2. Get all blogs for Admin (includes inactive/drafts)
router.get('/all', async (req, res) => {
    try {
        await seedIfEmpty();
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        console.error('Fetch all blogs error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching blogs' });
    }
});

// 3. Get single blog by Slug (or ID)
router.get('/:slug', async (req, res) => {
    try {
        await seedIfEmpty();
        const { slug } = req.params;

        let blog = await Blog.findOne({ slug: slug.toLowerCase() });

        // If not found by slug and slug looks like a valid Mongo ObjectId, try finding by ID
        if (!blog && slug.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await Blog.findById(slug);
        }

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog article not found' });
        }

        // Fetch 3 related blogs
        const relatedBlogs = await Blog.find({
            _id: { $ne: blog._id },
            isActive: true,
            $or: [
                { category: blog.category },
                {}
            ]
        }).limit(3).sort({ createdAt: -1 });

        res.json({ success: true, blog, relatedBlogs });
    } catch (error) {
        console.error('Fetch single blog error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching blog' });
    }
});

// 4. Create new blog (Admin)
router.post('/', async (req, res) => {
    try {
        const {
            title,
            slug,
            category,
            image,
            shortDescription,
            content,
            author,
            readTime,
            seoTitle,
            seoDescription,
            seoKeywords,
            isActive
        } = req.body;

        if (!title || !image) {
            return res.status(400).json({ success: false, message: 'Title and image are required.' });
        }

        // Generate and verify slug
        let baseSlug = slug ? generateSlug(slug) : generateSlug(title);
        if (!baseSlug) baseSlug = 'blog-' + Date.now();

        // Check if slug exists
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await Blog.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newBlog = new Blog({
            title: title.trim(),
            slug: uniqueSlug,
            category: (category || 'Fashion').trim(),
            image: image.trim(),
            shortDescription: shortDescription || '',
            content: content || '',
            author: (author || 'Joyfulmarts Editorial').trim(),
            readTime: (readTime || '5 min read').trim(),
            seoTitle: seoTitle || title.trim(),
            seoDescription: seoDescription || (shortDescription ? shortDescription.replace(/<[^>]+>/g, '').slice(0, 160) : ''),
            seoKeywords: seoKeywords || '',
            isActive: isActive !== undefined ? isActive : true
        });

        await newBlog.save();
        res.status(201).json({ success: true, blog: newBlog, message: 'Blog published successfully' });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error creating blog' });
    }
});

// 5. Update existing blog (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.slug) {
            updates.slug = generateSlug(updates.slug);
            // Check if slug belongs to another blog
            const existingWithSlug = await Blog.findOne({ slug: updates.slug, _id: { $ne: id } });
            if (existingWithSlug) {
                return res.status(400).json({ success: false, message: 'This slug is already used by another article.' });
            }
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog article not found' });
        }

        res.json({ success: true, blog, message: 'Blog updated successfully' });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error updating blog' });
    }
});

// 6. Delete blog (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog article not found' });
        }

        res.json({ success: true, message: 'Blog article deleted successfully' });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error deleting blog' });
    }
});

module.exports = router;
