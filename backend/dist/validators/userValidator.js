"use strict";

var _joi = _interopRequireDefault(require("joi"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Patient self-registration: roleId is forced to R3 server-side, never accepted from client.
var registerSchema = _joi["default"].object({
  email: _joi["default"].string().email().max(120).required(),
  password: _joi["default"].string().min(6).max(128).required(),
  firstName: _joi["default"].string().max(60).allow('', null),
  lastName: _joi["default"].string().max(60).allow('', null),
  address: _joi["default"].string().max(255).allow('', null),
  phonenumber: _joi["default"].string().max(20).allow('', null),
  phoneNumber: _joi["default"].string().max(20).allow('', null),
  gender: _joi["default"].alternatives()["try"](_joi["default"].string().valid('M', 'F', '0', '1', 'true', 'false'), _joi["default"]["boolean"]()).allow(null)
});
var loginSchema = _joi["default"].object({
  email: _joi["default"].string().email().max(120).required(),
  password: _joi["default"].string().min(1).max(128).required()
});

// Admin-only create. roleId free.
var createNewUserSchema = _joi["default"].object({
  email: _joi["default"].string().email().max(120).required(),
  password: _joi["default"].string().min(6).max(128).required(),
  firstName: _joi["default"].string().max(60).allow('', null),
  lastName: _joi["default"].string().max(60).allow('', null),
  address: _joi["default"].string().max(255).allow('', null),
  phoneNumber: _joi["default"].string().max(20).allow('', null),
  gender: _joi["default"].alternatives()["try"](_joi["default"].string().valid('0', '1'), _joi["default"]["boolean"](), _joi["default"].number().valid(0, 1)).allow(null),
  roleId: _joi["default"].string().valid('R1', 'R2', 'R3').required(),
  positionId: _joi["default"].string().max(20).allow('', null),
  image: _joi["default"].string().allow('', null)
});

// Edit. roleId allowed only if the caller is admin (enforced at controller level
// after this validator passes — base shape is permissive).
var editUserSchema = _joi["default"].object({
  id: _joi["default"].number().integer().positive().required(),
  firstName: _joi["default"].string().max(60).allow('', null),
  lastName: _joi["default"].string().max(60).allow('', null),
  address: _joi["default"].string().max(255).allow('', null),
  phoneNumber: _joi["default"].string().max(20).allow('', null),
  gender: _joi["default"].alternatives()["try"](_joi["default"].string().valid('M', 'F', '0', '1', 'true', 'false', ''), _joi["default"]["boolean"](), _joi["default"].number().valid(0, 1)).allow(null),
  roleId: _joi["default"].string().valid('R1', 'R2', 'R3').optional(),
  positionId: _joi["default"].string().max(20).allow('', null),
  image: _joi["default"].string().allow('', null)
});
module.exports = {
  registerSchema: registerSchema,
  loginSchema: loginSchema,
  createNewUserSchema: createNewUserSchema,
  editUserSchema: editUserSchema
};