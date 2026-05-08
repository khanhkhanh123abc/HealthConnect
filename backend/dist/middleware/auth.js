"use strict";

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _logger = _interopRequireDefault(require("../utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Verify "Authorization: Bearer <token>". Decoded payload exposed at req.user.
var verifyToken = function verifyToken(req, res, next) {
  var header = req.headers.authorization || req.headers.Authorization || '';
  var match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) {
    return res.status(401).json({
      errCode: 401,
      errMessage: 'Unauthorized'
    });
  }
  var token = match[1].trim();
  var secret = process.env.JWT_SECRET;
  if (!secret) {
    // Production-grade misconfiguration: refuse rather than verify with a default.
    _logger["default"].error('[auth] JWT_SECRET is not set');
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Auth not configured'
    });
  }
  try {
    var decoded = _jsonwebtoken["default"].verify(token, secret);
    req.user = {
      id: decoded.id,
      roleId: decoded.roleId,
      email: decoded.email
    };
    return next();
  } catch (e) {
    return res.status(401).json({
      errCode: 401,
      errMessage: 'Unauthorized'
    });
  }
};

// Factory: middleware that ensures req.user.roleId is in the allowed list.
var requireRole = function requireRole() {
  for (var _len = arguments.length, allowedRoles = new Array(_len), _key = 0; _key < _len; _key++) {
    allowedRoles[_key] = arguments[_key];
  }
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({
        errCode: 403,
        errMessage: 'Forbidden'
      });
    }
    return next();
  };
};
module.exports = {
  verifyToken: verifyToken,
  requireRole: requireRole
};