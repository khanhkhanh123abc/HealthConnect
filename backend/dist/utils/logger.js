"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _pino = _interopRequireDefault(require("pino"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Structured logger. Use logger.info / logger.error / logger.warn / logger.debug.
// Sensitive headers and field paths are redacted before serialization so we
// never accidentally leak JWTs, passwords, or per-booking confirm tokens.
var logger = (0, _pino["default"])({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname'
    }
  } : undefined,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token', 'token', 'password', 'JWT_SECRET', 'EMAIL_APP_PASSWORD', 'PAYPAL_CLIENT_SECRET'],
    censor: '[REDACTED]'
  }
});
var _default = exports["default"] = logger;