import rateLimit from 'express-rate-limit';

const FIFTEEN_MIN = 15 * 60 * 1000;

// Strict limiter for auth endpoints (login/register).
const authLimiter = rateLimit({
    windowMs: FIFTEEN_MIN,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { errCode: 429, errMessage: 'Too many authentication attempts. Try again later.' }
});

// Generic API limiter applied globally.
const apiLimiter = rateLimit({
    windowMs: FIFTEEN_MIN,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { errCode: 429, errMessage: 'Too many requests. Slow down.' }
});

module.exports = { authLimiter, apiLimiter };
