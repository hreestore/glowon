/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://glowon.com.np",
  generateRobotsTxt: true,
  exclude: [
    "/cart",
    "/checkout/*",
    "/profile/*",
    "/order/*",
    "/wishlist",
    "/auth/*",
  ],
  robotsTxtOptions: {
    additionalSitemaps: ["https://glowon.com.np/sitemap.xml"],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
  },
};
