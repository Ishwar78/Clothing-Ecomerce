// Unified Wishlist Helper for SBV Fashion Store

export const getWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem('sbv-wishlist') || '[]');
    } catch {
        return [];
    }
};

export const getProductId = (product) => {
    if (!product) return '';
    return String(product._id || product.id || product.slug || '');
};

export const getProductSlug = (product) => {
    if (!product) return '';
    if (product.slug) return product.slug;
    if (product.name) {
        return product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    return getProductId(product);
};

export const isInWishlist = (product) => {
    if (!product) return false;
    const list = getWishlist();
    const pid = getProductId(product);
    const pslug = getProductSlug(product);
    const pname = (product.name || '').toLowerCase().trim();

    return list.some(item => {
        const iid = getProductId(item);
        const islug = getProductSlug(item);
        const iname = (item.name || '').toLowerCase().trim();
        return (pid && iid && pid === iid) || (pslug && islug && pslug === islug) || (pname && iname && pname === iname);
    });
};

export const toggleWishlist = (product) => {
    if (!product) return false;
    const list = getWishlist();
    const exists = isInWishlist(product);
    const pid = getProductId(product);
    const pslug = getProductSlug(product);
    const pname = (product.name || '').toLowerCase().trim();

    let updated;
    let added = false;

    if (exists) {
        updated = list.filter(item => {
            const iid = getProductId(item);
            const islug = getProductSlug(item);
            const iname = (item.name || '').toLowerCase().trim();
            const match = (pid && iid && pid === iid) || (pslug && islug && pslug === islug) || (pname && iname && pname === iname);
            return !match;
        });
        added = false;
    } else {
        const safeProduct = {
            ...product,
            _id: product._id || product.id,
            id: product.id || product._id,
            slug: pslug,
            price: Math.round(Number(product.price) || 0),
            originalPrice: Math.round(Number(product.originalPrice || product.mrp) || 0),
            mrp: Math.round(Number(product.originalPrice || product.mrp) || 0),
            image: product.images?.[0] || product.image || '/assets/mencategory1.png',
            images: product.images && product.images.length > 0 ? product.images : [product.image || '/assets/mencategory1.png']
        };
        updated = [...list, safeProduct];
        added = true;
    }

    try {
        localStorage.setItem('sbv-wishlist', JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save wishlist:', e);
    }

    // Notify all components across the app
    window.dispatchEvent(new CustomEvent('sbv-wishlist-updated', { detail: { list: updated, added, product } }));
    window.dispatchEvent(new Event('storage'));

    return added;
};

export const removeFromWishlist = (idOrSlug) => {
    const list = getWishlist();
    const target = String(idOrSlug).toLowerCase().trim();
    const updated = list.filter(item => {
        const iid = String(item._id || item.id || '').toLowerCase().trim();
        const islug = String(item.slug || '').toLowerCase().trim();
        return iid !== target && islug !== target;
    });

    localStorage.setItem('sbv-wishlist', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sbv-wishlist-updated', { detail: { list: updated, added: false } }));
    window.dispatchEvent(new Event('storage'));
    return updated;
};

export const subscribeWishlist = (callback) => {
    const handler = (e) => {
        callback(getWishlist(), e?.detail);
    };
    window.addEventListener('sbv-wishlist-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
        window.removeEventListener('sbv-wishlist-updated', handler);
        window.removeEventListener('storage', handler);
    };
};
