/** @type {import('next').NextConfig} */
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
      { source: "/admin/homepage",                destination: "/admin-dashboard-pages/homepage",      permanent: true },
      { source: "/admin/categories",              destination: "/admin-dashboard-pages/categories",    permanent: true },
      { source: "/admin/categories/tours",        destination: "/admin-dashboard-pages/categories/tours",   permanent: true },
      { source: "/admin/categories/resorts",      destination: "/admin-dashboard-pages/categories/resorts", permanent: true },
      { source: "/admin/tours",                   destination: "/admin-dashboard-pages/tours",         permanent: true },
      { source: "/admin/resorts",                 destination: "/admin-dashboard-pages/resorts",       permanent: true },
      { source: "/admin/experiences",             destination: "/admin-dashboard-pages/experiences",   permanent: true },
      { source: "/admin/users",                   destination: "/admin-dashboard-pages/users",         permanent: true },
    ];
  },
};

export default nextConfig;

