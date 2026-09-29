# SBV Fashion Store

Premium React + Vite ecommerce frontend and admin dashboard based on the supplied SBV design references.

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Routes

### Storefront
- `/` Home
- `/shop` Shop
- `/women`, `/men`, `/boys`, `/girls`, `/ethnic-wear`, `/footwear`, `/accessories`, `/new-arrivals`, `/sale`
- `/product/100` Product detail
- `/login`, `/signup`
- `/wishlist`, `/cart`, `/checkout`, `/thank-you`
- `/dashboard`, `/support`

### Admin
- `/admin/login`
- `/admin` Overview
- `/admin/categories`
- `/admin/products`
- `/admin/orders`
- `/admin/users`
- `/admin/coupons`
- `/admin/tickets`
- `/admin/returns`
- `/admin/contact`
- `/admin/inquiries`

## Notes

- Product/category content is kept inside page files as requested; there is no `data.js`.
- `src/lib/api.js` is the single frontend API connector and reads `VITE_API_URL`, defaulting to `http://localhost:6035/api`.
- Cart and wishlist demo state use `localStorage` until a backend is connected.
- Product Add modal includes four steps, seven-image upload input, sizes/measurements, rich-text-style editor area, discount type, and SEO fields.
- Page dimensions, sections and responsive behavior are controlled by each page's own CSS file; `base.css` only contains small global resets/base typography.
