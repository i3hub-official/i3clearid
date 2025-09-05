// src/lib/security/cspConfig.ts

export const cspConfig = {
  // Default source for all directives - ADD blob: HERE
  defaultSrc: [
    "'self'",
    "blob:",
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
  ],

  // JavaScript sources - ADD blob: HERE
  scriptSrc: [
    "'self'",
    "'report-sample'",
    "blob:",
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
    "'unsafe-inline'", // Allow inline scripts in development
    "'unsafe-eval'", // Allow eval in development
    "https://apis.google.com", // If using Google APIs
    "https://www.googletagmanager.com", // If using Google Tag Manager
  ],

  // Stylesheets - ADD blob: HERE
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Allow inline styles
    "blob:",
    "https://fonts.googleapis.com", // Google Fonts
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
  ],

  // Images - blob: is already here (good!)
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://ui-avatars.com",
    "https://res.cloudinary.com",
    "https://*.cloudinary.com/",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
    "https://www.google-analytics.com", // Google Analytics
    "https://stats.g.doubleclick.net", // Google Analytics
  ],

  // Fonts - ADD blob: HERE
  fontSrc: [
    "'self'",
    "data:",
    "blob:",
    "https://fonts.gstatic.com", // Google Fonts
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
  ],

  // Connections - ADD blob: HERE
  connectSrc: [
    "'self'",
    "blob:",
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
    "ws://localhost:*", // WebSockets for dev server
    "ws://127.0.0.1:*",
    "ws://192.168.0.159:*",
    "wss://localhost:*",
    "wss://127.0.0.1:*",
    "wss://192.168.0.159:*",
    "https://www.google-analytics.com", // Google Analytics
    "https://stats.g.doubleclick.net", // Google Analytics
  ],

  // Media - blob: is already here (good!)
  mediaSrc: [
    "'self'",
    "blob:",
    "data:",
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
  ],

  // Frames - ADD blob: HERE
  frameSrc: [
    "'self'",
    "blob:",
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
    "https://localhost",
    "http://localhost",
    "https://127.0.0.1",
    "http://127.0.0.1",
    "https://192.168.0.0/16",
    "http://192.168.0.0/16",
    "https://192.168.0.159",
    "http://192.168.0.159",
  ],

  // Objects (flash, etc.)
  objectSrc: ["'none'"], // No object tags allowed

  // Base URI
  baseUri: ["'self'"],

  // Form actions
  formAction: [
    "'self'",
    "https://i3clearid.vercel.app",
    "https://apinigeria.vercel.app",
  ],

  // Additional security headers
  frameAncestors: ["'none'"], // Prevent clickjacking
  upgradeInsecureRequests: true, // Upgrade HTTP to HTTPS
  blockAllMixedContent: true, // Block mixed content

  // Report violations (optional)
  reportUri: ["/api/csp-violation-report"],
};

// Optional: Environment-specific configurations
export const devCspConfig = {
  ...cspConfig,
  // More permissive in development
};

export const prodCspConfig = {
  ...cspConfig,
  // More restrictive in production
  scriptSrc: cspConfig.scriptSrc.filter(
    (src) => src !== "'unsafe-inline'" && src !== "'unsafe-eval'"
  ),
};

export const getCspConfig = () => {
  if (process.env.NODE_ENV === "production") {
    return prodCspConfig;
  }
  return devCspConfig;
};
