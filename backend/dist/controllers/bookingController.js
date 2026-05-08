"use strict";

var _bookingService = _interopRequireDefault(require("../services/bookingService"));
var _paypalService = _interopRequireDefault(require("../services/paypalService"));
var _index = _interopRequireDefault(require("../models/index"));
var _logger = _interopRequireDefault(require("../utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var createBooking = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user, _req$user2, callerId, callerRole, info, status, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          // Force the booking onto the authenticated user (block patientId override).
          callerId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
          callerRole = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.roleId;
          if (callerRole === 'R3' && callerId) {
            req.body.patientId = callerId;
          }
          _context.n = 1;
          return _bookingService["default"].createBooking(req.body);
        case 1:
          info = _context.v;
          status = info.errCode === 0 ? 200 : info.errCode === 4 ? 409 : 400;
          return _context.a(2, res.status(status).json(info));
        case 2:
          _context.p = 2;
          _t = _context.v;
          _logger["default"].error('[createBooking]', _t.message);
          return _context.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function createBooking(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var confirmBooking = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var info, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return _bookingService["default"].confirmBookingByToken(req.query.token);
        case 1:
          info = _context2.v;
          return _context2.a(2, res.status(200).json(info));
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          _logger["default"].error('[confirmBooking]', _t2.message);
          return _context2.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function confirmBooking(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var getBookingsByPatient = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$user3, requestedPatientId, info, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          requestedPatientId = Number(req.query.patientId); // R3 can only read their own bookings; R1 may read anyone's.
          if (!(((_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.roleId) === 'R3' && Number(req.user.id) !== requestedPatientId)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 1:
          _context3.n = 2;
          return _bookingService["default"].getBookingsByPatient(requestedPatientId);
        case 2:
          info = _context3.v;
          return _context3.a(2, res.status(200).json(info));
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
          _logger["default"].error('[getBookingsByPatient]', _t3.message);
          return _context3.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee3, null, [[0, 3]]);
  }));
  return function getBookingsByPatient(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var cancelBooking = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$user4, _req$body, bookingId, patientId, info, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _req$body = req.body, bookingId = _req$body.bookingId, patientId = _req$body.patientId;
          if (!(((_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.roleId) === 'R3' && Number(req.user.id) !== Number(patientId))) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 1:
          _context4.n = 2;
          return _bookingService["default"].cancelBooking(bookingId, patientId);
        case 2:
          info = _context4.v;
          return _context4.a(2, res.status(200).json(info));
        case 3:
          _context4.p = 3;
          _t4 = _context4.v;
          _logger["default"].error('[cancelBooking]', _t4.message);
          return _context4.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return function cancelBooking(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var doctorCancelBooking = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$user5, result, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          if (!(((_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.roleId) === 'R2' && Number(req.user.id) !== Number(req.body.doctorId))) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 1:
          _context5.n = 2;
          return _bookingService["default"].doctorCancelBooking(req.body.bookingId, req.body.doctorId, req.body.cancelReason);
        case 2:
          result = _context5.v;
          return _context5.a(2, res.status(200).json(result));
        case 3:
          _context5.p = 3;
          _t5 = _context5.v;
          _logger["default"].error('[doctorCancelBooking]', _t5.message);
          return _context5.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee5, null, [[0, 3]]);
  }));
  return function doctorCancelBooking(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
var getScheduleWithSlots = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var info, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return _bookingService["default"].getScheduleWithSlots(req.query.doctorId, req.query.date);
        case 1:
          info = _context6.v;
          return _context6.a(2, res.status(200).json(info));
        case 2:
          _context6.p = 2;
          _t6 = _context6.v;
          _logger["default"].error('[getScheduleWithSlots]', _t6.message);
          return _context6.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function getScheduleWithSlots(_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();
var getBookingsByDoctor = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var _req$user6, info, _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          if (!(((_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.roleId) === 'R2' && Number(req.user.id) !== Number(req.query.doctorId))) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 1:
          _context7.n = 2;
          return _bookingService["default"].getBookingsByDoctor(req.query.doctorId, req.query.weekStart);
        case 2:
          info = _context7.v;
          return _context7.a(2, res.status(200).json(info));
        case 3:
          _context7.p = 3;
          _t7 = _context7.v;
          _logger["default"].error('[getBookingsByDoctor]', _t7.message);
          return _context7.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee7, null, [[0, 3]]);
  }));
  return function getBookingsByDoctor(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();
var completeBooking = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var _req$user7, _req$body2, bookingId, doctorId, info, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _req$body2 = req.body, bookingId = _req$body2.bookingId, doctorId = _req$body2.doctorId;
          if (!(((_req$user7 = req.user) === null || _req$user7 === void 0 ? void 0 : _req$user7.roleId) === 'R2' && Number(req.user.id) !== Number(doctorId))) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 1:
          _context8.n = 2;
          return _bookingService["default"].completeBooking(bookingId, doctorId);
        case 2:
          info = _context8.v;
          return _context8.a(2, res.status(200).json(info));
        case 3:
          _context8.p = 3;
          _t8 = _context8.v;
          _logger["default"].error('[completeBooking]', _t8.message);
          return _context8.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee8, null, [[0, 3]]);
  }));
  return function completeBooking(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();
var sendMedicalRecord = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var _req$user8, _req$body3, bookingId, doctorId, content, info, _t9;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          _req$body3 = req.body, bookingId = _req$body3.bookingId, doctorId = _req$body3.doctorId, content = _req$body3.content;
          if (!(((_req$user8 = req.user) === null || _req$user8 === void 0 ? void 0 : _req$user8.roleId) === 'R2' && Number(req.user.id) !== Number(doctorId))) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 1:
          _context9.n = 2;
          return _bookingService["default"].sendMedicalRecord(bookingId, doctorId, content);
        case 2:
          info = _context9.v;
          return _context9.a(2, res.status(200).json(info));
        case 3:
          _context9.p = 3;
          _t9 = _context9.v;
          _logger["default"].error('[sendMedicalRecord]', _t9.message);
          return _context9.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee9, null, [[0, 3]]);
  }));
  return function sendMedicalRecord(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();
var confirmPayment = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var bookingId, info, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          bookingId = req.body.bookingId;
          _context0.n = 1;
          return _bookingService["default"].confirmPayment(bookingId);
        case 1:
          info = _context0.v;
          return _context0.a(2, res.status(200).json(info));
        case 2:
          _context0.p = 2;
          _t0 = _context0.v;
          _logger["default"].error('[confirmPayment]', _t0.message);
          return _context0.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee0, null, [[0, 2]]);
  }));
  return function confirmPayment(_x17, _x18) {
    return _ref0.apply(this, arguments);
  };
}();
var getPendingBankBookings = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
    var info, _t1;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          _context1.n = 1;
          return _bookingService["default"].getPendingBankBookings();
        case 1:
          info = _context1.v;
          return _context1.a(2, res.status(200).json(info));
        case 2:
          _context1.p = 2;
          _t1 = _context1.v;
          _logger["default"].error('[getPendingBankBookings]', _t1.message);
          return _context1.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee1, null, [[0, 2]]);
  }));
  return function getPendingBankBookings(_x19, _x20) {
    return _ref1.apply(this, arguments);
  };
}();

// Trusted PayPal flow: amount resolved server-side; client only sends bookingId.
var createPaypalOrder = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var _req$user9, _req$user0, bookingId, BookingModel, booking, info, status, _t10;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          bookingId = req.body.bookingId;
          if (bookingId) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2, res.status(400).json({
            errCode: 1,
            errMessage: 'Missing bookingId'
          }));
        case 1:
          // Verify the caller owns this booking (or is admin).
          BookingModel = _index["default"].Booking || _index["default"].Bookings;
          _context10.n = 2;
          return BookingModel.findOne({
            where: {
              id: bookingId
            },
            raw: true
          });
        case 2:
          booking = _context10.v;
          if (booking) {
            _context10.n = 3;
            break;
          }
          return _context10.a(2, res.status(404).json({
            errCode: 2,
            errMessage: 'Booking not found'
          }));
        case 3:
          if (!(((_req$user9 = req.user) === null || _req$user9 === void 0 ? void 0 : _req$user9.roleId) !== 'R1' && Number((_req$user0 = req.user) === null || _req$user0 === void 0 ? void 0 : _req$user0.id) !== Number(booking.patientId))) {
            _context10.n = 4;
            break;
          }
          return _context10.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 4:
          _context10.n = 5;
          return _paypalService["default"].createPaypalOrder(bookingId);
        case 5:
          info = _context10.v;
          status = info.errCode === 0 ? 200 : 400;
          return _context10.a(2, res.status(status).json(info));
        case 6:
          _context10.p = 6;
          _t10 = _context10.v;
          _logger["default"].error('[createPaypalOrder]', (_t10 === null || _t10 === void 0 ? void 0 : _t10.message) || _t10);
          return _context10.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee10, null, [[0, 6]]);
  }));
  return function createPaypalOrder(_x21, _x22) {
    return _ref10.apply(this, arguments);
  };
}();
var sendPrescription = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
    var _req$user1, _req$body4, bookingId, doctorId, diagnosis, medications, instructions, info, _t11;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          _context11.p = 0;
          _req$body4 = req.body, bookingId = _req$body4.bookingId, doctorId = _req$body4.doctorId, diagnosis = _req$body4.diagnosis, medications = _req$body4.medications, instructions = _req$body4.instructions;
          if (!(((_req$user1 = req.user) === null || _req$user1 === void 0 ? void 0 : _req$user1.roleId) === 'R2' && Number(req.user.id) !== Number(doctorId))) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2, res.status(403).json({
            errCode: 403,
            errMessage: 'Forbidden'
          }));
        case 1:
          _context11.n = 2;
          return _bookingService["default"].sendPrescription(bookingId, doctorId, {
            diagnosis: diagnosis,
            medications: medications,
            instructions: instructions
          });
        case 2:
          info = _context11.v;
          return _context11.a(2, res.status(200).json(info));
        case 3:
          _context11.p = 3;
          _t11 = _context11.v;
          _logger["default"].error('[sendPrescription]', _t11.message);
          return _context11.a(2, res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error'
          }));
      }
    }, _callee11, null, [[0, 3]]);
  }));
  return function sendPrescription(_x23, _x24) {
    return _ref11.apply(this, arguments);
  };
}();

// PayPal redirect target after user approval.
var paypalReturn = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
    var _req$query, token, bookingId, result, frontendUrl, _t12;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 0;
          _req$query = req.query, token = _req$query.token, bookingId = _req$query.bookingId;
          _context12.n = 1;
          return _paypalService["default"].handlePaypalReturn(token, bookingId);
        case 1:
          result = _context12.v;
          return _context12.a(2, res.redirect(result.redirectUrl));
        case 2:
          _context12.p = 2;
          _t12 = _context12.v;
          frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          return _context12.a(2, res.redirect("".concat(frontendUrl, "/payment-result?status=error")));
      }
    }, _callee12, null, [[0, 2]]);
  }));
  return function paypalReturn(_x25, _x26) {
    return _ref12.apply(this, arguments);
  };
}();
module.exports = {
  createBooking: createBooking,
  doctorCancelBooking: doctorCancelBooking,
  confirmBooking: confirmBooking,
  getBookingsByPatient: getBookingsByPatient,
  cancelBooking: cancelBooking,
  getScheduleWithSlots: getScheduleWithSlots,
  getBookingsByDoctor: getBookingsByDoctor,
  completeBooking: completeBooking,
  sendMedicalRecord: sendMedicalRecord,
  confirmPayment: confirmPayment,
  getPendingBankBookings: getPendingBankBookings,
  createPaypalOrder: createPaypalOrder,
  paypalReturn: paypalReturn,
  sendPrescription: sendPrescription
};