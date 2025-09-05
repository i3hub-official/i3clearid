// src/lib/security/cspConfig.ts
export const cspConfig = {
  defaultSrc: [
    "'self'",
    "https://localhost",
    "https://127.0.0.1",
    "https://192.168.0.0/16",
  ],
  scriptSrc: [
    "'self'",
    "'report-sample'",
    "https://*.vercel.app",
    "https://localhost",
    "https://127.0.0.1",
    "https://192.168.0.0/16",
    "'unsafe-inline'", // allow inline scripts in dev
    "'unsafe-eval'", // allow eval in dev
  ],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https://ui-avatars.com",
    "https://res.cloudinary.com",
    "https://*.cloudinary.com/",
    "https://localhost",
    "https://127.0.0.1",
    "https://192.168.0.0/16",
  ],
  fontSrc: ["'self'", "data:"],
  connectSrc: [
    "'self'",
    "https://*.vercel.app",
    "https://localhost",
    "https://127.0.0.1",
    "https://192.168.0.0/16",
  ],
  frameSrc: [
    "'self'",
    "https://localhost",
    "https://127.0.0.1",
    "https://192.168.0.0/16",
  ],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
};
