"use strict";

var _joi = _interopRequireDefault(require("joi"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var createBookingSchema = _joi["default"].object({
  doctorId: _joi["default"].number().integer().positive().required(),
  patientId: _joi["default"].number().integer().positive().required(),
  date: _joi["default"].alternatives()["try"](_joi["default"].number().integer().positive(), _joi["default"].string().pattern(/^\d+$/), _joi["default"].date()).required(),
  timeType: _joi["default"].string().max(20).required(),
  reason: _joi["default"].string().max(2000).allow('', null),
  paymentMethod: _joi["default"].string().valid('CASH', 'BANK')["default"]('CASH')
});
var cancelBookingSchema = _joi["default"].object({
  bookingId: _joi["default"].number().integer().positive().required(),
  patientId: _joi["default"].number().integer().positive().required()
});
var createPaypalOrderSchema = _joi["default"].object({
  bookingId: _joi["default"].number().integer().positive().required()
  // amountUsd intentionally NOT accepted — server resolves authoritative price.
});
module.exports = {
  createBookingSchema: createBookingSchema,
  cancelBookingSchema: cancelBookingSchema,
  createPaypalOrderSchema: createPaypalOrderSchema
};