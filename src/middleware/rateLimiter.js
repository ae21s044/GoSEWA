const rateLimit = require('express-rate-limit');

// General Limiter: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// Auth Limiter: Stricter for login/register (e.g., 5 per hour to prevent brute force)
// For dev/test convenience, keep it slightly higher or standard for now, 
// but in prod should be strict.
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // Increased for dev/testing
    message: {
        success: false,
        error: 'Too many login attempts from this IP, please try again after an hour'
    }
});

module.exports = { limiter, authLimiter };
