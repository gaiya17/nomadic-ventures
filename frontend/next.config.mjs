/** @type {import('next').NextConfig} */

// Every external host this app actually talks to from the browser, gathered by
// auditing the codebase rather than guessed — get this wrong and pages silently
// break (fonts don't load, uploads fail) instead of showing an obvious error.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' is required because Next.js hydrates with small inline
  // <script> blocks; a stricter nonce-based policy is possible but needs
  // per-request wiring in middleware and careful testing across every page.
  "script-src 'self' 'unsafe-inline'",
  // 'unsafe-inline' is required because this app uses React inline style={{}}
  // props extensively; the two remote hosts serve the @import'ed CSS for
  // Clash Display and Inter in globals.css.
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
  "font-src 'self' data: https://cdn.fontshare.com https://fonts.gstatic.com",
  "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com https://via.placeholder.com",
  // The admin wizards upload images directly from the browser to Cloudinary.
  "connect-src 'self' https://api.cloudinary.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

// next dev's Fast Refresh relies on eval() and blob: script loading internally —
// neither exists in a real production build, so the strict CSP only makes sense
// (and is only tested against) `next start`. Applying it in dev breaks hot-reload.
const securityHeaders = [
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Content-Security-Policy', value: CSP }]
    : []),
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/gallery",                       destination: "/experiences",                         permanent: true },
      { source: "/about",                         destination: "/why-nomadic",                         permanent: true },
      { source: "/contact",                       destination: "/plan-trip",                           permanent: true },
      { source: "/resorts/maldives",              destination: "/maldives-resort",                     permanent: true },
      { source: "/resorts/maldives/:slug",        destination: "/maldives-resort/:slug",               permanent: true },
      { source: "/admin",                         destination: "/admin-dashboard",                     permanent: true },
      { source: "/admin/login",                   destination: "/login",                               permanent: true },
      { source: "/admin-dashboard/login",         destination: "/login",                               permanent: true },
      { source: "/admin/dashboard",               destination: "/admin-dashboard",                     permanent: true },
      { source: "/admin/homepage",                destination: "/admin-dashboard/homepage",      permanent: true },
      { source: "/admin/categories",              destination: "/admin-dashboard/categories",    permanent: true },
      { source: "/admin/categories/tours",        destination: "/admin-dashboard/categories/tours",   permanent: true },
      { source: "/admin/categories/resorts",      destination: "/admin-dashboard/categories/resorts", permanent: true },
      { source: "/admin/tours",                   destination: "/admin-dashboard/tours",         permanent: true },
      { source: "/admin/resorts",                 destination: "/admin-dashboard/resorts",       permanent: true },
      { source: "/admin/experiences",             destination: "/admin-dashboard/experiences",   permanent: true },
      { source: "/admin/users",                   destination: "/admin-dashboard/users",         permanent: true },
    ];
  },
};

export default nextConfig;

