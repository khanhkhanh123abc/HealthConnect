"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _index = _interopRequireDefault(require("../models/index"));
var _sequelize = require("sequelize");
var _uuid = require("uuid");
var _emailService = require("./emailService");
var _paypalService = require("./paypalService");
var _logger = _interopRequireDefault(require("../utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var DAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
var formatDate = function formatDate(date) {
  var d = new Date(date);
  return "".concat(DAY_LABELS[d.getDay()], ", ").concat(d.getDate(), "/").concat(d.getMonth() + 1, "/").concat(d.getFullYear());
};
var getBookingModel = function getBookingModel() {
  return _index["default"].Booking || _index["default"].Bookings;
};

// Resolve doctor's authoritative price (USD) from Doctor_Info → allCode (PRICE).
// Returns 0 when missing — booking is still created, payment will be enforced
// at the PayPal flow.
var resolvePriceUsd = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(doctorId) {
    var info, code, cleaned, parsed, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return _index["default"].Doctor_Info.findOne({
            where: {
              doctorId: doctorId
            },
            attributes: ['priceId'],
            raw: true
          });
        case 1:
          info = _context.v;
          if (info !== null && info !== void 0 && info.priceId) {
            _context.n = 2;
            break;
          }
          return _context.a(2, 0);
        case 2:
          _context.n = 3;
          return _index["default"].allCode.findOne({
            where: {
              keyMap: info.priceId,
              type: 'PRICE'
            },
            attributes: ['value'],
            raw: true
          });
        case 3:
          code = _context.v;
          if (code !== null && code !== void 0 && code.value) {
            _context.n = 4;
            break;
          }
          return _context.a(2, 0);
        case 4:
          cleaned = String(code.value).replace(/[^\d.]/g, '');
          parsed = parseFloat(cleaned);
          return _context.a(2, Number.isFinite(parsed) ? parsed : 0);
        case 5:
          _context.p = 5;
          _t = _context.v;
          _logger["default"].error({
            err: _t,
            doctorId: doctorId
          }, '[resolvePriceUsd] error');
          return _context.a(2, 0);
      }
    }, _callee, null, [[0, 5]]);
  }));
  return function resolvePriceUsd(_x) {
    return _ref.apply(this, arguments);
  };
}();
function createBooking(_x2) {
  return _createBooking.apply(this, arguments);
}
function _createBooking() {
  _createBooking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data) {
    var t, dateStart, dateEnd, schedule, BookingModel, activeBooking, cancelledBooking, confirmToken, savedBookingId, newBooking, priceAmountUsd, _t3, _t4, _t5;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.n = 1;
          return _index["default"].sequelize.transaction();
        case 1:
          t = _context3.v;
          _context3.p = 2;
          if (!(!data.doctorId || !data.date || !data.timeType || !data.patientId)) {
            _context3.n = 4;
            break;
          }
          _context3.n = 3;
          return t.rollback();
        case 3:
          return _context3.a(2, {
            errCode: 1,
            errMessage: 'Thiếu thông tin đặt lịch!'
          });
        case 4:
          dateStart = new Date(+data.date);
          dateStart.setHours(0, 0, 0, 0);
          dateEnd = new Date(+data.date);
          dateEnd.setHours(23, 59, 59, 999);
          _context3.n = 5;
          return _index["default"].Schedule.findOne({
            where: {
              doctorId: data.doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [dateStart, dateEnd]),
              timeType: data.timeType
            },
            lock: t.LOCK.UPDATE,
            transaction: t,
            raw: false
          });
        case 5:
          schedule = _context3.v;
          if (schedule) {
            _context3.n = 7;
            break;
          }
          _context3.n = 6;
          return t.rollback();
        case 6:
          return _context3.a(2, {
            errCode: 2,
            errMessage: 'Khung giờ này không tồn tại!'
          });
        case 7:
          if (!(schedule.currentNumber >= schedule.maxNumber)) {
            _context3.n = 9;
            break;
          }
          _context3.n = 8;
          return t.rollback();
        case 8:
          return _context3.a(2, {
            errCode: 3,
            errMessage: 'Khung giờ này đã hết chỗ!'
          });
        case 9:
          BookingModel = getBookingModel(); // Block duplicate active booking for the same slot.
          _context3.n = 10;
          return BookingModel.findOne({
            where: {
              patientId: data.patientId,
              doctorId: data.doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [dateStart, dateEnd]),
              timeType: data.timeType,
              statusId: _defineProperty({}, _sequelize.Op["in"], ['S1', 'S2'])
            },
            transaction: t
          });
        case 10:
          activeBooking = _context3.v;
          if (!activeBooking) {
            _context3.n = 12;
            break;
          }
          _context3.n = 11;
          return t.rollback();
        case 11:
          return _context3.a(2, {
            errCode: 4,
            errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!'
          });
        case 12:
          _context3.n = 13;
          return BookingModel.findOne({
            where: {
              patientId: data.patientId,
              doctorId: data.doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [dateStart, dateEnd]),
              timeType: data.timeType,
              statusId: 'S4'
            },
            transaction: t,
            raw: false
          });
        case 13:
          cancelledBooking = _context3.v;
          confirmToken = (0, _uuid.v4)();
          if (!cancelledBooking) {
            _context3.n = 15;
            break;
          }
          cancelledBooking.statusId = 'S1';
          cancelledBooking.reason = data.reason || '';
          cancelledBooking.token = confirmToken;
          cancelledBooking.paymentMethod = data.paymentMethod || 'CASH';
          _context3.n = 14;
          return cancelledBooking.save({
            transaction: t
          });
        case 14:
          savedBookingId = cancelledBooking.id;
          _context3.n = 17;
          break;
        case 15:
          _context3.n = 16;
          return BookingModel.create({
            statusId: 'S1',
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: new Date(+data.date),
            timeType: data.timeType,
            reason: data.reason || '',
            token: confirmToken,
            paymentMethod: data.paymentMethod || 'CASH'
          }, {
            transaction: t
          });
        case 16:
          newBooking = _context3.v;
          savedBookingId = newBooking.id;
        case 17:
          schedule.currentNumber += 1;
          _context3.n = 18;
          return schedule.save({
            transaction: t
          });
        case 18:
          _context3.n = 19;
          return t.commit();
        case 19:
          _context3.n = 20;
          return resolvePriceUsd(data.doctorId);
        case 20:
          priceAmountUsd = _context3.v;
          _context3.p = 21;
          _context3.n = 22;
          return BookingModel.update({
            price: Math.round(priceAmountUsd)
          }, {
            where: {
              id: savedBookingId
            }
          });
        case 22:
          _context3.n = 24;
          break;
        case 23:
          _context3.p = 23;
          _t3 = _context3.v;
          _logger["default"].error({
            err: _t3,
            bookingId: savedBookingId
          }, '[createBooking] price update failed');
        case 24:
          // Fire-and-forget email notification (must not block the response).
          // eslint-disable-next-line no-floating-promise/no-floating-promise
          _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
            var _yield$Promise$all, _yield$Promise$all2, patient, doctor, timeTypeData, markdown, clinicName, clinicAddress, clinic, doctorName, patientName, timeValue, dateStr, confirmLink, _t2;
            return _regenerator().w(function (_context2) {
              while (1) switch (_context2.p = _context2.n) {
                case 0:
                  _context2.p = 0;
                  _context2.n = 1;
                  return Promise.all([_index["default"].User.findOne({
                    where: {
                      id: data.patientId
                    },
                    attributes: ['firstName', 'lastName', 'email'],
                    raw: true
                  }), _index["default"].User.findOne({
                    where: {
                      id: data.doctorId
                    },
                    attributes: ['firstName', 'lastName'],
                    raw: true
                  }), _index["default"].allCode.findOne({
                    where: {
                      keyMap: data.timeType,
                      type: 'TIME'
                    },
                    attributes: ['value'],
                    raw: true
                  }), _index["default"].Markdown.findOne({
                    where: {
                      doctorId: data.doctorId
                    },
                    attributes: ['clinicId'],
                    raw: true
                  })]);
                case 1:
                  _yield$Promise$all = _context2.v;
                  _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 4);
                  patient = _yield$Promise$all2[0];
                  doctor = _yield$Promise$all2[1];
                  timeTypeData = _yield$Promise$all2[2];
                  markdown = _yield$Promise$all2[3];
                  clinicName = '', clinicAddress = '';
                  if (!(markdown !== null && markdown !== void 0 && markdown.clinicId)) {
                    _context2.n = 3;
                    break;
                  }
                  _context2.n = 2;
                  return _index["default"].Clinic.findOne({
                    where: {
                      id: markdown.clinicId
                    },
                    attributes: ['name', 'address'],
                    raw: true
                  });
                case 2:
                  clinic = _context2.v;
                  clinicName = (clinic === null || clinic === void 0 ? void 0 : clinic.name) || '';
                  clinicAddress = (clinic === null || clinic === void 0 ? void 0 : clinic.address) || '';
                case 3:
                  doctorName = doctor ? "BS. ".concat(doctor.lastName || '', " ").concat(doctor.firstName || '').trim() : 'Bác sĩ';
                  patientName = patient ? "".concat(patient.lastName || '', " ").concat(patient.firstName || '').trim() : 'Bạn';
                  timeValue = (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || data.timeType;
                  dateStr = formatDate(data.date);
                  if (!(data.paymentMethod === 'BANK')) {
                    _context2.n = 5;
                    break;
                  }
                  _context2.n = 4;
                  return (0, _emailService.sendWithRetry)('bankTransferPending', {
                    bookingId: savedBookingId,
                    recipient: patient === null || patient === void 0 ? void 0 : patient.email
                  }, function () {
                    return (0, _emailService.sendBankTransferPendingEmail)({
                      patientEmail: patient === null || patient === void 0 ? void 0 : patient.email,
                      patientName: patientName,
                      doctorName: doctorName,
                      timeValue: timeValue,
                      dateStr: dateStr,
                      clinicName: clinicName,
                      clinicAddress: clinicAddress,
                      reason: data.reason || '',
                      bookingToken: confirmToken,
                      amountUsd: priceAmountUsd
                    });
                  });
                case 4:
                  _context2.n = 6;
                  break;
                case 5:
                  confirmLink = "".concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/confirm-booking?token=").concat(confirmToken);
                  _context2.n = 6;
                  return (0, _emailService.sendWithRetry)('bookingConfirm', {
                    bookingId: savedBookingId,
                    recipient: patient === null || patient === void 0 ? void 0 : patient.email
                  }, function () {
                    return (0, _emailService.sendBookingConfirmEmail)({
                      patientEmail: patient === null || patient === void 0 ? void 0 : patient.email,
                      patientName: patientName,
                      doctorName: doctorName,
                      timeValue: timeValue,
                      dateStr: dateStr,
                      clinicName: clinicName,
                      clinicAddress: clinicAddress,
                      reason: data.reason || '',
                      confirmLink: confirmLink
                    });
                  });
                case 6:
                  _context2.n = 8;
                  break;
                case 7:
                  _context2.p = 7;
                  _t2 = _context2.v;
                  _logger["default"].error({
                    err: _t2,
                    bookingId: savedBookingId
                  }, 'Email send failed (non-blocking)');
                case 8:
                  return _context2.a(2);
              }
            }, _callee2, null, [[0, 7]]);
          }))();
          return _context3.a(2, {
            errCode: 0,
            errMessage: 'Đặt lịch thành công!',
            remainingSlots: schedule.maxNumber - schedule.currentNumber,
            token: confirmToken,
            bookingId: savedBookingId,
            amountUsd: priceAmountUsd
          });
        case 25:
          _context3.p = 25;
          _t4 = _context3.v;
          _context3.p = 26;
          _context3.n = 27;
          return t.rollback();
        case 27:
          _context3.n = 29;
          break;
        case 28:
          _context3.p = 28;
          _t5 = _context3.v;
        case 29:
          if (!(_t4.name === 'SequelizeUniqueConstraintError')) {
            _context3.n = 30;
            break;
          }
          return _context3.a(2, {
            errCode: 4,
            errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!'
          });
        case 30:
          _logger["default"].error({
            err: _t4
          }, 'createBooking error');
          throw _t4;
        case 31:
          return _context3.a(2);
      }
    }, _callee3, null, [[26, 28], [21, 23], [2, 25]]);
  }));
  return _createBooking.apply(this, arguments);
}
function confirmBookingByToken(_x3) {
  return _confirmBookingByToken.apply(this, arguments);
}
function _confirmBookingByToken() {
  _confirmBookingByToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(token) {
    var BookingModel, booking;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (token) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, {
            errCode: 1,
            errMessage: 'Token không hợp lệ!'
          });
        case 1:
          BookingModel = getBookingModel();
          _context4.n = 2;
          return BookingModel.findOne({
            where: {
              token: token
            },
            raw: false
          });
        case 2:
          booking = _context4.v;
          if (booking) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, {
            errCode: 2,
            errMessage: 'Lịch hẹn không tồn tại hoặc link đã hết hiệu lực!'
          });
        case 3:
          if (!(booking.statusId === 'S2')) {
            _context4.n = 4;
            break;
          }
          return _context4.a(2, {
            errCode: 0,
            errMessage: 'Lịch hẹn đã được xác nhận trước đó!',
            alreadyConfirmed: true
          });
        case 4:
          if (!(booking.statusId === 'S4')) {
            _context4.n = 5;
            break;
          }
          return _context4.a(2, {
            errCode: 3,
            errMessage: 'Lịch hẹn này đã bị hủy!'
          });
        case 5:
          booking.statusId = 'S2';
          _context4.n = 6;
          return booking.save();
        case 6:
          return _context4.a(2, {
            errCode: 0,
            errMessage: 'Xác nhận lịch khám thành công!'
          });
      }
    }, _callee4);
  }));
  return _confirmBookingByToken.apply(this, arguments);
}
function getBookingsByPatient(_x4) {
  return _getBookingsByPatient.apply(this, arguments);
}
function _getBookingsByPatient() {
  _getBookingsByPatient = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(patientId) {
    var BookingModel, bookings, result;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          if (patientId) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, {
            errCode: 1,
            errMessage: 'Missing required parameter'
          });
        case 1:
          BookingModel = getBookingModel();
          _context6.n = 2;
          return BookingModel.findAll({
            where: {
              patientId: patientId
            },
            order: [['date', 'DESC']],
            raw: true
          });
        case 2:
          bookings = _context6.v;
          _context6.n = 3;
          return Promise.all(bookings.map(/*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(booking) {
              var _yield$Promise$all3, _yield$Promise$all4, doctor, timeTypeData, markdown, clinicName, clinicAddress, clinic;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    _context5.n = 1;
                    return Promise.all([_index["default"].User.findOne({
                      where: {
                        id: booking.doctorId
                      },
                      attributes: ['firstName', 'lastName', 'image'],
                      raw: true
                    }), _index["default"].allCode.findOne({
                      where: {
                        keyMap: booking.timeType,
                        type: 'TIME'
                      },
                      attributes: ['value'],
                      raw: true
                    }), _index["default"].Markdown.findOne({
                      where: {
                        doctorId: booking.doctorId
                      },
                      attributes: ['clinicId'],
                      raw: true
                    })["catch"](function () {
                      return null;
                    })]);
                  case 1:
                    _yield$Promise$all3 = _context5.v;
                    _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 3);
                    doctor = _yield$Promise$all4[0];
                    timeTypeData = _yield$Promise$all4[1];
                    markdown = _yield$Promise$all4[2];
                    clinicName = '', clinicAddress = '';
                    if (!(markdown !== null && markdown !== void 0 && markdown.clinicId)) {
                      _context5.n = 3;
                      break;
                    }
                    _context5.n = 2;
                    return _index["default"].Clinic.findOne({
                      where: {
                        id: markdown.clinicId
                      },
                      attributes: ['name', 'address'],
                      raw: true
                    });
                  case 2:
                    clinic = _context5.v;
                    clinicName = (clinic === null || clinic === void 0 ? void 0 : clinic.name) || '';
                    clinicAddress = (clinic === null || clinic === void 0 ? void 0 : clinic.address) || '';
                  case 3:
                    return _context5.a(2, _objectSpread(_objectSpread({}, booking), {}, {
                      timeValue: (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || booking.timeType,
                      doctorName: doctor ? "BS. ".concat(doctor.lastName || '', " ").concat(doctor.firstName || '').trim() : 'Bác sĩ',
                      doctorImage: (doctor === null || doctor === void 0 ? void 0 : doctor.image) || '',
                      clinicName: clinicName,
                      clinicAddress: clinicAddress
                    }));
                }
              }, _callee5);
            }));
            return function (_x21) {
              return _ref4.apply(this, arguments);
            };
          }()));
        case 3:
          result = _context6.v;
          return _context6.a(2, {
            errCode: 0,
            data: result
          });
      }
    }, _callee6);
  }));
  return _getBookingsByPatient.apply(this, arguments);
}
function cancelBooking(_x5, _x6) {
  return _cancelBooking.apply(this, arguments);
}
function _cancelBooking() {
  _cancelBooking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(bookingId, patientId) {
    var t, BookingModel, booking, isPaid, refundResult, dateStart, dateEnd, schedule, message, _t7, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          if (!(!bookingId || !patientId)) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2, {
            errCode: 1,
            errMessage: 'Missing required parameters'
          });
        case 1:
          _context8.n = 2;
          return _index["default"].sequelize.transaction();
        case 2:
          t = _context8.v;
          _context8.p = 3;
          BookingModel = getBookingModel();
          _context8.n = 4;
          return BookingModel.findOne({
            where: {
              id: bookingId,
              patientId: patientId
            },
            transaction: t,
            raw: false
          });
        case 4:
          booking = _context8.v;
          if (booking) {
            _context8.n = 6;
            break;
          }
          _context8.n = 5;
          return t.rollback();
        case 5:
          return _context8.a(2, {
            errCode: 2,
            errMessage: 'Không tìm thấy lịch hẹn!'
          });
        case 6:
          if (['S1', 'S2'].includes(booking.statusId)) {
            _context8.n = 8;
            break;
          }
          _context8.n = 7;
          return t.rollback();
        case 7:
          return _context8.a(2, {
            errCode: 3,
            errMessage: 'Không thể hủy lịch ở trạng thái này!'
          });
        case 8:
          isPaid = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';
          refundResult = null;
          if (!isPaid) {
            _context8.n = 12;
            break;
          }
          _context8.n = 9;
          return (0, _paypalService.createRefund)(booking);
        case 9:
          refundResult = _context8.v;
          if (refundResult.success) {
            _context8.n = 11;
            break;
          }
          _context8.n = 10;
          return t.rollback();
        case 10:
          return _context8.a(2, {
            errCode: 4,
            errMessage: 'Hoàn tiền thất bại: ' + refundResult.message
          });
        case 11:
          booking.refundAmount = refundResult.refundAmount || booking.price;
          booking.refundStatus = refundResult.isPending ? 'PENDING' : 'REFUNDED';
        case 12:
          booking.statusId = 'S4';
          _context8.n = 13;
          return booking.save({
            transaction: t
          });
        case 13:
          // Free up the schedule slot.
          dateStart = new Date(booking.date);
          dateStart.setHours(0, 0, 0, 0);
          dateEnd = new Date(booking.date);
          dateEnd.setHours(23, 59, 59, 999);
          _context8.n = 14;
          return _index["default"].Schedule.findOne({
            where: {
              doctorId: booking.doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [dateStart, dateEnd]),
              timeType: booking.timeType
            },
            transaction: t,
            raw: false
          });
        case 14:
          schedule = _context8.v;
          if (!(schedule && schedule.currentNumber > 0)) {
            _context8.n = 15;
            break;
          }
          schedule.currentNumber -= 1;
          _context8.n = 15;
          return schedule.save({
            transaction: t
          });
        case 15:
          _context8.n = 16;
          return t.commit();
        case 16:
          // Fire-and-forget cancellation email.
          _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
            var _yield$Promise$all5, _yield$Promise$all6, patient, doctor, timeTypeData, refundNote, _t6;
            return _regenerator().w(function (_context7) {
              while (1) switch (_context7.p = _context7.n) {
                case 0:
                  _context7.p = 0;
                  _context7.n = 1;
                  return Promise.all([_index["default"].User.findOne({
                    where: {
                      id: patientId
                    },
                    attributes: ['firstName', 'lastName', 'email'],
                    raw: true
                  }), _index["default"].User.findOne({
                    where: {
                      id: booking.doctorId
                    },
                    attributes: ['firstName', 'lastName'],
                    raw: true
                  }), _index["default"].allCode.findOne({
                    where: {
                      keyMap: booking.timeType,
                      type: 'TIME'
                    },
                    attributes: ['value'],
                    raw: true
                  })]);
                case 1:
                  _yield$Promise$all5 = _context7.v;
                  _yield$Promise$all6 = _slicedToArray(_yield$Promise$all5, 3);
                  patient = _yield$Promise$all6[0];
                  doctor = _yield$Promise$all6[1];
                  timeTypeData = _yield$Promise$all6[2];
                  refundNote = isPaid ? "\nS\u1ED1 ti\u1EC1n ".concat((booking.refundAmount || 0).toLocaleString('vi-VN'), "\u0111 \u0111ang \u0111\u01B0\u1EE3c x\u1EED l\xFD ho\xE0n v\u1EC1 t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n.") : '';
                  _context7.n = 2;
                  return (0, _emailService.sendWithRetry)('patientCancel', {
                    bookingId: booking.id,
                    recipient: patient === null || patient === void 0 ? void 0 : patient.email
                  }, function () {
                    return (0, _emailService.sendCancelEmail)({
                      patientEmail: patient === null || patient === void 0 ? void 0 : patient.email,
                      patientName: "".concat((patient === null || patient === void 0 ? void 0 : patient.lastName) || '', " ").concat((patient === null || patient === void 0 ? void 0 : patient.firstName) || '').trim(),
                      doctorName: "BS. ".concat((doctor === null || doctor === void 0 ? void 0 : doctor.lastName) || '', " ").concat((doctor === null || doctor === void 0 ? void 0 : doctor.firstName) || '').trim(),
                      timeValue: (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || booking.timeType,
                      dateStr: formatDate(booking.date),
                      refundNote: refundNote
                    });
                  });
                case 2:
                  _context7.n = 4;
                  break;
                case 3:
                  _context7.p = 3;
                  _t6 = _context7.v;
                  _logger["default"].error({
                    err: _t6,
                    bookingId: booking.id
                  }, 'Send cancel email error');
                case 4:
                  return _context7.a(2);
              }
            }, _callee7, null, [[0, 3]]);
          }))();
          message = 'Hủy lịch thành công!';
          if (isPaid) message += ' Yêu cầu hoàn tiền đã được gửi.';
          return _context8.a(2, {
            errCode: 0,
            errMessage: message,
            refundStatus: booking.refundStatus,
            refundAmount: booking.refundAmount
          });
        case 17:
          _context8.p = 17;
          _t7 = _context8.v;
          _context8.p = 18;
          _context8.n = 19;
          return t.rollback();
        case 19:
          _context8.n = 21;
          break;
        case 20:
          _context8.p = 20;
          _t8 = _context8.v;
        case 21:
          _logger["default"].error({
            err: _t7
          }, 'cancelBooking error');
          throw _t7;
        case 22:
          return _context8.a(2);
      }
    }, _callee8, null, [[18, 20], [3, 17]]);
  }));
  return _cancelBooking.apply(this, arguments);
}
function doctorCancelBooking(_x7, _x8, _x9) {
  return _doctorCancelBooking.apply(this, arguments);
}
function _doctorCancelBooking() {
  _doctorCancelBooking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(bookingId, doctorId, cancelReason) {
    var t, BookingModel, booking, isPaid, refundResult, dateStart, dateEnd, schedule, message, _t0, _t1;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          if (!(!bookingId || !doctorId)) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2, {
            errCode: 1,
            errMessage: 'Missing parameters'
          });
        case 1:
          _context0.n = 2;
          return _index["default"].sequelize.transaction();
        case 2:
          t = _context0.v;
          _context0.p = 3;
          BookingModel = getBookingModel();
          _context0.n = 4;
          return BookingModel.findOne({
            where: {
              id: bookingId,
              doctorId: doctorId
            },
            transaction: t,
            raw: false
          });
        case 4:
          booking = _context0.v;
          if (booking) {
            _context0.n = 6;
            break;
          }
          _context0.n = 5;
          return t.rollback();
        case 5:
          return _context0.a(2, {
            errCode: 2,
            errMessage: 'Không tìm thấy lịch hẹn!'
          });
        case 6:
          if (['S1', 'S2'].includes(booking.statusId)) {
            _context0.n = 8;
            break;
          }
          _context0.n = 7;
          return t.rollback();
        case 7:
          return _context0.a(2, {
            errCode: 3,
            errMessage: 'Không thể hủy lịch ở trạng thái này!'
          });
        case 8:
          isPaid = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';
          refundResult = null;
          if (!isPaid) {
            _context0.n = 12;
            break;
          }
          _context0.n = 9;
          return (0, _paypalService.createRefund)(booking);
        case 9:
          refundResult = _context0.v;
          if (refundResult.success) {
            _context0.n = 11;
            break;
          }
          _context0.n = 10;
          return t.rollback();
        case 10:
          return _context0.a(2, {
            errCode: 4,
            errMessage: 'Hoàn tiền thất bại: ' + refundResult.message
          });
        case 11:
          booking.refundAmount = refundResult.refundAmount || booking.price;
          booking.refundStatus = refundResult.isPending ? 'PENDING' : 'REFUNDED';
        case 12:
          booking.statusId = 'S4';
          _context0.n = 13;
          return booking.save({
            transaction: t
          });
        case 13:
          dateStart = new Date(booking.date);
          dateStart.setHours(0, 0, 0, 0);
          dateEnd = new Date(booking.date);
          dateEnd.setHours(23, 59, 59, 999);
          _context0.n = 14;
          return _index["default"].Schedule.findOne({
            where: {
              doctorId: booking.doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [dateStart, dateEnd]),
              timeType: booking.timeType
            },
            transaction: t,
            raw: false
          });
        case 14:
          schedule = _context0.v;
          if (!(schedule && schedule.currentNumber > 0)) {
            _context0.n = 15;
            break;
          }
          schedule.currentNumber -= 1;
          _context0.n = 15;
          return schedule.save({
            transaction: t
          });
        case 15:
          _context0.n = 16;
          return t.commit();
        case 16:
          // Fire-and-forget cancellation email.
          _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
            var _yield$Promise$all7, _yield$Promise$all8, patient, doctor, timeTypeData, refundNote, _t9;
            return _regenerator().w(function (_context9) {
              while (1) switch (_context9.p = _context9.n) {
                case 0:
                  _context9.p = 0;
                  _context9.n = 1;
                  return Promise.all([_index["default"].User.findOne({
                    where: {
                      id: booking.patientId
                    },
                    attributes: ['firstName', 'lastName', 'email'],
                    raw: true
                  }), _index["default"].User.findOne({
                    where: {
                      id: doctorId
                    },
                    attributes: ['firstName', 'lastName'],
                    raw: true
                  }), _index["default"].allCode.findOne({
                    where: {
                      keyMap: booking.timeType,
                      type: 'TIME'
                    },
                    attributes: ['value'],
                    raw: true
                  })]);
                case 1:
                  _yield$Promise$all7 = _context9.v;
                  _yield$Promise$all8 = _slicedToArray(_yield$Promise$all7, 3);
                  patient = _yield$Promise$all8[0];
                  doctor = _yield$Promise$all8[1];
                  timeTypeData = _yield$Promise$all8[2];
                  refundNote = isPaid ? "\nS\u1ED1 ti\u1EC1n ".concat((booking.refundAmount || 0).toLocaleString('vi-VN'), "\u0111 \u0111ang \u0111\u01B0\u1EE3c x\u1EED l\xFD ho\xE0n v\u1EC1 t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n.") : '';
                  _context9.n = 2;
                  return (0, _emailService.sendWithRetry)('doctorCancel', {
                    bookingId: booking.id,
                    recipient: patient === null || patient === void 0 ? void 0 : patient.email
                  }, function () {
                    return (0, _emailService.sendCancelEmail)({
                      patientEmail: patient === null || patient === void 0 ? void 0 : patient.email,
                      patientName: "".concat((patient === null || patient === void 0 ? void 0 : patient.lastName) || '', " ").concat((patient === null || patient === void 0 ? void 0 : patient.firstName) || '').trim(),
                      doctorName: "BS. ".concat((doctor === null || doctor === void 0 ? void 0 : doctor.lastName) || '', " ").concat((doctor === null || doctor === void 0 ? void 0 : doctor.firstName) || '').trim(),
                      timeValue: (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || booking.timeType,
                      dateStr: formatDate(booking.date),
                      refundNote: refundNote,
                      cancelReason: cancelReason || 'Bác sĩ hủy lịch'
                    });
                  });
                case 2:
                  _context9.n = 4;
                  break;
                case 3:
                  _context9.p = 3;
                  _t9 = _context9.v;
                  _logger["default"].error({
                    err: _t9,
                    bookingId: booking.id
                  }, 'Doctor cancel email error');
                case 4:
                  return _context9.a(2);
              }
            }, _callee9, null, [[0, 3]]);
          }))();
          message = 'Bác sĩ đã hủy lịch thành công!';
          if (isPaid) message += ' Yêu cầu hoàn tiền đã được gửi.';
          return _context0.a(2, {
            errCode: 0,
            errMessage: message,
            refundStatus: booking.refundStatus,
            refundAmount: booking.refundAmount
          });
        case 17:
          _context0.p = 17;
          _t0 = _context0.v;
          _context0.p = 18;
          _context0.n = 19;
          return t.rollback();
        case 19:
          _context0.n = 21;
          break;
        case 20:
          _context0.p = 20;
          _t1 = _context0.v;
        case 21:
          _logger["default"].error({
            err: _t0
          }, 'doctorCancelBooking error');
          throw _t0;
        case 22:
          return _context0.a(2);
      }
    }, _callee0, null, [[18, 20], [3, 17]]);
  }));
  return _doctorCancelBooking.apply(this, arguments);
}
function getScheduleWithSlots(_x0, _x1) {
  return _getScheduleWithSlots.apply(this, arguments);
}
function _getScheduleWithSlots() {
  _getScheduleWithSlots = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(doctorId, date) {
    var dateStart, dateEnd, schedules, result;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          if (!(!doctorId || !date)) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2, {
            errCode: 1,
            errMessage: 'Missing parameters'
          });
        case 1:
          dateStart = new Date(+date);
          dateStart.setHours(0, 0, 0, 0);
          dateEnd = new Date(+date);
          dateEnd.setHours(23, 59, 59, 999);
          _context1.n = 2;
          return _index["default"].Schedule.findAll({
            where: {
              doctorId: doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [dateStart, dateEnd])
            },
            include: [{
              model: _index["default"].allCode,
              as: 'timeTypeData',
              attributes: ['value', 'keyMap']
            }],
            raw: false,
            nest: true
          });
        case 2:
          schedules = _context1.v;
          result = schedules.map(function (s) {
            var _s$timeTypeData;
            return {
              timeType: s.timeType,
              timeValue: ((_s$timeTypeData = s.timeTypeData) === null || _s$timeTypeData === void 0 ? void 0 : _s$timeTypeData.value) || s.timeType,
              maxNumber: s.maxNumber,
              currentNumber: s.currentNumber,
              remainingSlots: s.maxNumber - s.currentNumber,
              isFull: s.currentNumber >= s.maxNumber
            };
          });
          return _context1.a(2, {
            errCode: 0,
            data: result
          });
      }
    }, _callee1);
  }));
  return _getScheduleWithSlots.apply(this, arguments);
}
function getBookingsByDoctor(_x10, _x11) {
  return _getBookingsByDoctor.apply(this, arguments);
}
function _getBookingsByDoctor() {
  _getBookingsByDoctor = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(doctorId, weekStart) {
    var startDate, endDate, BookingModel, bookings, result;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          if (doctorId) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2, {
            errCode: 1,
            errMessage: 'Missing doctorId'
          });
        case 1:
          startDate = weekStart ? new Date(+weekStart) : function () {
            var d = new Date();
            var day = d.getDay();
            var diff = day === 0 ? -6 : 1 - day;
            d.setDate(d.getDate() + diff);
            d.setHours(0, 0, 0, 0);
            return d;
          }();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          BookingModel = getBookingModel();
          _context11.n = 2;
          return BookingModel.findAll({
            where: {
              doctorId: doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [startDate, endDate]),
              statusId: _defineProperty({}, _sequelize.Op["in"], ['S1', 'S2', 'S3'])
            },
            order: [['date', 'ASC'], ['timeType', 'ASC']],
            raw: true
          });
        case 2:
          bookings = _context11.v;
          _context11.n = 3;
          return Promise.all(bookings.map(/*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(booking) {
              var _yield$Promise$all9, _yield$Promise$all0, patient, timeTypeData;
              return _regenerator().w(function (_context10) {
                while (1) switch (_context10.n) {
                  case 0:
                    _context10.n = 1;
                    return Promise.all([_index["default"].User.findOne({
                      where: {
                        id: booking.patientId
                      },
                      attributes: ['firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'address', 'image'],
                      raw: true
                    }), _index["default"].allCode.findOne({
                      where: {
                        keyMap: booking.timeType,
                        type: 'TIME'
                      },
                      attributes: ['value'],
                      raw: true
                    })]);
                  case 1:
                    _yield$Promise$all9 = _context10.v;
                    _yield$Promise$all0 = _slicedToArray(_yield$Promise$all9, 2);
                    patient = _yield$Promise$all0[0];
                    timeTypeData = _yield$Promise$all0[1];
                    return _context10.a(2, _objectSpread(_objectSpread({}, booking), {}, {
                      timeValue: (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || booking.timeType,
                      patientName: patient ? "".concat(patient.lastName || '', " ").concat(patient.firstName || '').trim() : 'Bệnh nhân',
                      patientEmail: (patient === null || patient === void 0 ? void 0 : patient.email) || '',
                      patientPhone: (patient === null || patient === void 0 ? void 0 : patient.phoneNumber) || '',
                      patientAddress: (patient === null || patient === void 0 ? void 0 : patient.address) || '',
                      patientImage: (patient === null || patient === void 0 ? void 0 : patient.image) || '',
                      reason: booking.reason || ''
                    }));
                }
              }, _callee10);
            }));
            return function (_x22) {
              return _ref7.apply(this, arguments);
            };
          }()));
        case 3:
          result = _context11.v;
          return _context11.a(2, {
            errCode: 0,
            data: result
          });
      }
    }, _callee11);
  }));
  return _getBookingsByDoctor.apply(this, arguments);
}
function completeBooking(_x12, _x13) {
  return _completeBooking.apply(this, arguments);
}
function _completeBooking() {
  _completeBooking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(bookingId, doctorId) {
    var BookingModel, booking;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          if (!(!bookingId || !doctorId)) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2, {
            errCode: 1,
            errMessage: 'Missing parameters'
          });
        case 1:
          BookingModel = getBookingModel();
          _context12.n = 2;
          return BookingModel.findOne({
            where: {
              id: bookingId,
              doctorId: doctorId
            },
            raw: false
          });
        case 2:
          booking = _context12.v;
          if (booking) {
            _context12.n = 3;
            break;
          }
          return _context12.a(2, {
            errCode: 2,
            errMessage: 'Không tìm thấy lịch hẹn!'
          });
        case 3:
          if (!(booking.statusId !== 'S2')) {
            _context12.n = 4;
            break;
          }
          return _context12.a(2, {
            errCode: 3,
            errMessage: 'Chỉ có thể hoàn thành lịch đã xác nhận!'
          });
        case 4:
          booking.statusId = 'S3';
          _context12.n = 5;
          return booking.save();
        case 5:
          return _context12.a(2, {
            errCode: 0,
            errMessage: 'Đã đánh dấu hoàn thành!'
          });
      }
    }, _callee12);
  }));
  return _completeBooking.apply(this, arguments);
}
function sendMedicalRecord(_x14, _x15, _x16) {
  return _sendMedicalRecord.apply(this, arguments);
}
function _sendMedicalRecord() {
  _sendMedicalRecord = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(bookingId, doctorId, content) {
    var BookingModel, booking, _yield$Promise$all1, _yield$Promise$all10, patient, doctor;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          if (!(!bookingId || !doctorId || !content)) {
            _context13.n = 1;
            break;
          }
          return _context13.a(2, {
            errCode: 1,
            errMessage: 'Missing parameters'
          });
        case 1:
          BookingModel = getBookingModel();
          _context13.n = 2;
          return BookingModel.findOne({
            where: {
              id: bookingId,
              doctorId: doctorId
            },
            raw: true
          });
        case 2:
          booking = _context13.v;
          if (booking) {
            _context13.n = 3;
            break;
          }
          return _context13.a(2, {
            errCode: 2,
            errMessage: 'Không tìm thấy lịch hẹn!'
          });
        case 3:
          _context13.n = 4;
          return Promise.all([_index["default"].User.findOne({
            where: {
              id: booking.patientId
            },
            attributes: ['firstName', 'lastName', 'email'],
            raw: true
          }), _index["default"].User.findOne({
            where: {
              id: doctorId
            },
            attributes: ['firstName', 'lastName'],
            raw: true
          })]);
        case 4:
          _yield$Promise$all1 = _context13.v;
          _yield$Promise$all10 = _slicedToArray(_yield$Promise$all1, 2);
          patient = _yield$Promise$all10[0];
          doctor = _yield$Promise$all10[1];
          if (patient !== null && patient !== void 0 && patient.email) {
            _context13.n = 5;
            break;
          }
          return _context13.a(2, {
            errCode: 3,
            errMessage: 'Không tìm thấy email bệnh nhân!'
          });
        case 5:
          _context13.n = 6;
          return (0, _emailService.sendMedicalRecordEmail)({
            patientEmail: patient.email,
            patientName: "".concat(patient.lastName || '', " ").concat(patient.firstName || '').trim(),
            doctorName: "BS. ".concat((doctor === null || doctor === void 0 ? void 0 : doctor.lastName) || '', " ").concat((doctor === null || doctor === void 0 ? void 0 : doctor.firstName) || '').trim(),
            content: content,
            bookingId: bookingId
          });
        case 6:
          return _context13.a(2, {
            errCode: 0,
            errMessage: 'Đã gửi hồ sơ qua email!'
          });
      }
    }, _callee13);
  }));
  return _sendMedicalRecord.apply(this, arguments);
}
function confirmPayment(_x17) {
  return _confirmPayment.apply(this, arguments);
}
function _confirmPayment() {
  _confirmPayment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(bookingId) {
    var BookingModel, booking;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          if (bookingId) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2, {
            errCode: 1,
            errMessage: 'Missing bookingId!'
          });
        case 1:
          BookingModel = getBookingModel();
          _context15.n = 2;
          return BookingModel.findOne({
            where: {
              id: bookingId
            },
            raw: false
          });
        case 2:
          booking = _context15.v;
          if (booking) {
            _context15.n = 3;
            break;
          }
          return _context15.a(2, {
            errCode: 2,
            errMessage: 'Không tìm thấy lịch hẹn!'
          });
        case 3:
          if (!(booking.paymentMethod !== 'BANK')) {
            _context15.n = 4;
            break;
          }
          return _context15.a(2, {
            errCode: 3,
            errMessage: 'Lịch này không phải thanh toán chuyển khoản!'
          });
        case 4:
          if (!(booking.statusId === 'S2')) {
            _context15.n = 5;
            break;
          }
          return _context15.a(2, {
            errCode: 0,
            errMessage: 'Lịch đã được xác nhận trước đó!',
            alreadyConfirmed: true
          });
        case 5:
          if (!(booking.statusId === 'S4')) {
            _context15.n = 6;
            break;
          }
          return _context15.a(2, {
            errCode: 4,
            errMessage: 'Lịch đã bị hủy, không thể xác nhận!'
          });
        case 6:
          booking.statusId = 'S2';
          _context15.n = 7;
          return booking.save();
        case 7:
          _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
            var _yield$Promise$all11, _yield$Promise$all12, patient, doctor, timeTypeData, _t10;
            return _regenerator().w(function (_context14) {
              while (1) switch (_context14.p = _context14.n) {
                case 0:
                  _context14.p = 0;
                  _context14.n = 1;
                  return Promise.all([_index["default"].User.findOne({
                    where: {
                      id: booking.patientId
                    },
                    attributes: ['firstName', 'lastName', 'email'],
                    raw: true
                  }), _index["default"].User.findOne({
                    where: {
                      id: booking.doctorId
                    },
                    attributes: ['firstName', 'lastName'],
                    raw: true
                  }), _index["default"].allCode.findOne({
                    where: {
                      keyMap: booking.timeType,
                      type: 'TIME'
                    },
                    attributes: ['value'],
                    raw: true
                  })]);
                case 1:
                  _yield$Promise$all11 = _context14.v;
                  _yield$Promise$all12 = _slicedToArray(_yield$Promise$all11, 3);
                  patient = _yield$Promise$all12[0];
                  doctor = _yield$Promise$all12[1];
                  timeTypeData = _yield$Promise$all12[2];
                  _context14.n = 2;
                  return (0, _emailService.sendWithRetry)('bankTransferConfirmed', {
                    bookingId: booking.id,
                    recipient: patient === null || patient === void 0 ? void 0 : patient.email
                  }, function () {
                    return (0, _emailService.sendBankTransferConfirmedEmail)({
                      patientEmail: patient === null || patient === void 0 ? void 0 : patient.email,
                      patientName: "".concat((patient === null || patient === void 0 ? void 0 : patient.lastName) || '', " ").concat((patient === null || patient === void 0 ? void 0 : patient.firstName) || '').trim(),
                      doctorName: "BS. ".concat((doctor === null || doctor === void 0 ? void 0 : doctor.lastName) || '', " ").concat((doctor === null || doctor === void 0 ? void 0 : doctor.firstName) || '').trim(),
                      timeValue: (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || booking.timeType,
                      dateStr: formatDate(booking.date)
                    });
                  });
                case 2:
                  _context14.n = 4;
                  break;
                case 3:
                  _context14.p = 3;
                  _t10 = _context14.v;
                  _logger["default"].error({
                    err: _t10,
                    bookingId: booking.id
                  }, 'Email confirm payment failed');
                case 4:
                  return _context14.a(2);
              }
            }, _callee14, null, [[0, 3]]);
          }))();
          return _context15.a(2, {
            errCode: 0,
            errMessage: 'Xác nhận thanh toán thành công! Lịch đã được chốt.'
          });
      }
    }, _callee15);
  }));
  return _confirmPayment.apply(this, arguments);
}
function getPendingBankBookings() {
  return _getPendingBankBookings.apply(this, arguments);
}
function _getPendingBankBookings() {
  _getPendingBankBookings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
    var BookingModel, bookings, result;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          BookingModel = getBookingModel();
          _context17.n = 1;
          return BookingModel.findAll({
            where: {
              paymentMethod: 'BANK',
              statusId: 'S1'
            },
            order: [['createdAt', 'ASC']],
            raw: true
          });
        case 1:
          bookings = _context17.v;
          _context17.n = 2;
          return Promise.all(bookings.map(/*#__PURE__*/function () {
            var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(booking) {
              var _yield$Promise$all13, _yield$Promise$all14, patient, doctor, timeTypeData;
              return _regenerator().w(function (_context16) {
                while (1) switch (_context16.n) {
                  case 0:
                    _context16.n = 1;
                    return Promise.all([_index["default"].User.findOne({
                      where: {
                        id: booking.patientId
                      },
                      attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
                      raw: true
                    }), _index["default"].User.findOne({
                      where: {
                        id: booking.doctorId
                      },
                      attributes: ['firstName', 'lastName'],
                      raw: true
                    }), _index["default"].allCode.findOne({
                      where: {
                        keyMap: booking.timeType,
                        type: 'TIME'
                      },
                      attributes: ['value'],
                      raw: true
                    })]);
                  case 1:
                    _yield$Promise$all13 = _context16.v;
                    _yield$Promise$all14 = _slicedToArray(_yield$Promise$all13, 3);
                    patient = _yield$Promise$all14[0];
                    doctor = _yield$Promise$all14[1];
                    timeTypeData = _yield$Promise$all14[2];
                    return _context16.a(2, _objectSpread(_objectSpread({}, booking), {}, {
                      timeValue: (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || booking.timeType,
                      patientName: patient ? "".concat(patient.lastName || '', " ").concat(patient.firstName || '').trim() : 'Bệnh nhân',
                      patientEmail: (patient === null || patient === void 0 ? void 0 : patient.email) || '',
                      patientPhone: (patient === null || patient === void 0 ? void 0 : patient.phoneNumber) || '',
                      doctorName: doctor ? "BS. ".concat(doctor.lastName || '', " ").concat(doctor.firstName || '').trim() : 'Bác sĩ'
                    }));
                }
              }, _callee16);
            }));
            return function (_x23) {
              return _ref9.apply(this, arguments);
            };
          }()));
        case 2:
          result = _context17.v;
          return _context17.a(2, {
            errCode: 0,
            data: result
          });
      }
    }, _callee17);
  }));
  return _getPendingBankBookings.apply(this, arguments);
}
function sendPrescription(_x18, _x19, _x20) {
  return _sendPrescription.apply(this, arguments);
}
function _sendPrescription() {
  _sendPrescription = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(bookingId, doctorId, _ref2) {
    var diagnosis, medications, instructions, BookingModel, booking, _yield$Promise$all15, _yield$Promise$all16, patient, doctor, patientName, doctorName, _require, generatePrescriptionPdf, pdfBuffer;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          diagnosis = _ref2.diagnosis, medications = _ref2.medications, instructions = _ref2.instructions;
          if (!(!bookingId || !doctorId || !diagnosis)) {
            _context18.n = 1;
            break;
          }
          return _context18.a(2, {
            errCode: 1,
            errMessage: 'Missing parameters'
          });
        case 1:
          BookingModel = getBookingModel();
          _context18.n = 2;
          return BookingModel.findOne({
            where: {
              id: bookingId,
              doctorId: doctorId
            },
            raw: true
          });
        case 2:
          booking = _context18.v;
          if (booking) {
            _context18.n = 3;
            break;
          }
          return _context18.a(2, {
            errCode: 2,
            errMessage: 'Không tìm thấy lịch hẹn!'
          });
        case 3:
          _context18.n = 4;
          return Promise.all([_index["default"].User.findOne({
            where: {
              id: booking.patientId
            },
            attributes: ['firstName', 'lastName', 'email'],
            raw: true
          }), _index["default"].User.findOne({
            where: {
              id: doctorId
            },
            attributes: ['firstName', 'lastName'],
            raw: true
          })]);
        case 4:
          _yield$Promise$all15 = _context18.v;
          _yield$Promise$all16 = _slicedToArray(_yield$Promise$all15, 2);
          patient = _yield$Promise$all16[0];
          doctor = _yield$Promise$all16[1];
          if (patient !== null && patient !== void 0 && patient.email) {
            _context18.n = 5;
            break;
          }
          return _context18.a(2, {
            errCode: 3,
            errMessage: 'Không tìm thấy email bệnh nhân!'
          });
        case 5:
          patientName = "".concat(patient.lastName || '', " ").concat(patient.firstName || '').trim();
          doctorName = "BS. ".concat((doctor === null || doctor === void 0 ? void 0 : doctor.lastName) || '', " ").concat((doctor === null || doctor === void 0 ? void 0 : doctor.firstName) || '').trim();
          _require = require('./prescriptionService'), generatePrescriptionPdf = _require.generatePrescriptionPdf;
          _context18.n = 6;
          return generatePrescriptionPdf({
            doctorName: doctorName,
            patientName: patientName,
            diagnosis: diagnosis,
            medications: medications,
            instructions: instructions,
            date: new Date().toLocaleDateString('vi-VN')
          });
        case 6:
          pdfBuffer = _context18.v;
          _context18.n = 7;
          return (0, _emailService.sendPrescriptionEmail)({
            patientEmail: patient.email,
            patientName: patientName,
            doctorName: doctorName,
            pdfBuffer: pdfBuffer
          });
        case 7:
          return _context18.a(2, {
            errCode: 0,
            errMessage: 'Đã gửi đơn thuốc qua email!'
          });
      }
    }, _callee18);
  }));
  return _sendPrescription.apply(this, arguments);
}
module.exports = {
  createBooking: createBooking,
  confirmBookingByToken: confirmBookingByToken,
  getBookingsByPatient: getBookingsByPatient,
  cancelBooking: cancelBooking,
  getPendingBankBookings: getPendingBankBookings,
  getScheduleWithSlots: getScheduleWithSlots,
  confirmPayment: confirmPayment,
  getBookingsByDoctor: getBookingsByDoctor,
  completeBooking: completeBooking,
  sendMedicalRecord: sendMedicalRecord,
  doctorCancelBooking: doctorCancelBooking,
  sendPrescription: sendPrescription
};