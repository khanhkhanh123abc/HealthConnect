"use strict";

var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var FIFTEEN_MIN = 15 * 60 * 1000;

// Strict limiter for auth endpoints (login/register).
var authLimiter = (0, _expressRateLimit["default"])({
  windowMs: FIFTEEN_MIN,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errCode: 429,
    errMessage: 'Too many authentication attempts. Try again later.'
  }
});

// Generic API limiter applied globally.
var apiLimiter = (0, _expressRateLimit["default"])({
  windowMs: FIFTEEN_MIN,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errCode: 429,
    errMessage: 'Too many requests. Slow down.'
  }
});
module.exports = {
  authLimiter: authLimiter,
  apiLimiter: apiLimiter
};