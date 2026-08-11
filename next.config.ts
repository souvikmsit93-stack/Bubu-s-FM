import type { NextConfig } from "next";

/**
 * The page embeds a YouTube IFrame player, loads Google Analytics, and self-hosts its
 * fonts, so the CSP has to allow those three origins and nothing else. Inline styles and
 * the gtag bootstrap need 'unsafe-inline'; there is no user-supplied markup anywhere on
 * the site, so the XSS surface it would otherwise cover does not exist here.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  // googletagmanager is in img-src too: gtag reports some signals via a tracking pixel.
  "img-src 'self' data: https://i.ytimg.com https://yt3.ggpht.com https://*.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
