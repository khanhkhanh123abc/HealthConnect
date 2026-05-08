"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _nodeCron = _interopRequireDefault(require("node-cron"));
var _index = _interopRequireDefault(require("../models/index"));
var _sequelize = require("sequelize");
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _logger = _interopRequireDefault(require("../utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});
var DAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
var formatDate = function formatDate(date) {
  var d = new Date(date);
  return "".concat(DAY_LABELS[d.getDay()], ", ").concat(d.getDate(), "/").concat(d.getMonth() + 1, "/").concat(d.getFullYear());
};

// ✅ Email thông báo hủy do hết thời gian xác nhận
var sendExpiredEmail = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(_ref) {
    var patientEmail, patientName, doctorName, timeValue, dateStr, html, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          patientEmail = _ref.patientEmail, patientName = _ref.patientName, doctorName = _ref.doctorName, timeValue = _ref.timeValue, dateStr = _ref.dateStr;
          _context.p = 1;
          html = "\n<!DOCTYPE html>\n<html lang=\"vi\">\n<head><meta charset=\"UTF-8\"></head>\n<body style=\"font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;margin:0\">\n  <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\"\n    style=\"background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08)\">\n\n    <!-- Header -->\n    <tr>\n      <td style=\"background:#f59e0b;padding:30px 40px;text-align:center\">\n        <h1 style=\"margin:0;color:#fff;font-size:20px;font-weight:700\">\n          \u23F0 L\u1ECBch kh\xE1m \u0111\xE3 h\u1EBFt h\u1EA1n x\xE1c nh\u1EADn\n        </h1>\n      </td>\n    </tr>\n\n    <!-- Body -->\n    <tr>\n      <td style=\"padding:30px 40px\">\n        <p style=\"color:#374151;font-size:15px;margin:0 0 16px\">\n          Xin ch\xE0o <strong>".concat(patientName, "</strong>,\n        </p>\n        <p style=\"color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7\">\n          L\u1ECBch kh\xE1m c\u1EE7a b\u1EA1n \u0111\xE3 b\u1ECB <strong style=\"color:#ef4444\">t\u1EF1 \u0111\u1ED9ng h\u1EE7y</strong>\n          v\xEC b\u1EA1n kh\xF4ng x\xE1c nh\u1EADn trong v\xF2ng <strong>10 ph\xFAt</strong>.\n        </p>\n\n        <!-- Booking info -->\n        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"\n          style=\"background:#fef3c7;border:1px solid #fde68a;border-radius:10px;margin-bottom:20px\">\n          <tr>\n            <td style=\"padding:16px 20px\">\n              <p style=\"margin:0 0 8px;font-size:13px;color:#92400e;font-weight:600;text-transform:uppercase\">\n                Th\xF4ng tin l\u1ECBch \u0111\xE3 h\u1EE7y\n              </p>\n              <p style=\"margin:4px 0;font-size:14px;color:#78350f\">\n                \uD83E\uDE7A <strong>B\xE1c s\u0129:</strong> ").concat(doctorName, "\n              </p>\n              <p style=\"margin:4px 0;font-size:14px;color:#78350f\">\n                \uD83D\uDCC5 <strong>Ng\xE0y:</strong> ").concat(dateStr, "\n              </p>\n              <p style=\"margin:4px 0;font-size:14px;color:#78350f\">\n                \u23F0 <strong>Gi\u1EDD:</strong> ").concat(timeValue, "\n              </p>\n            </td>\n          </tr>\n        </table>\n\n        <p style=\"color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7\">\n          N\u1EBFu b\u1EA1n v\u1EABn mu\u1ED1n kh\xE1m, h\xE3y \u0111\u1EB7t l\u1ECBch m\u1EDBi tr\xEAn h\u1EC7 th\u1ED1ng HealthConnect\n          v\xE0 <strong>nh\u1EDB x\xE1c nh\u1EADn qua email trong 10 ph\xFAt</strong> nh\xE9!\n        </p>\n\n        <!-- CTA -->\n        <div style=\"text-align:center;margin:24px 0\">\n          <a href=\"").concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/booking\"\n            style=\"display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;\n              padding:12px 32px;border-radius:10px;font-size:15px;font-weight:700\">\n            \u0110\u1EB7t l\u1ECBch m\u1EDBi \u2192\n          </a>\n        </div>\n      </td>\n    </tr>\n\n    <!-- Footer -->\n    <tr>\n      <td style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center\">\n        <p style=\"margin:0;color:#9ca3af;font-size:12px\">\n          Email t\u1EF1 \u0111\u1ED9ng t\u1EEB HealthConnect. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.\n        </p>\n      </td>\n    </tr>\n\n  </table>\n</body>\n</html>");
          _context.n = 2;
          return transporter.sendMail({
            from: "\"HealthConnect\" <".concat(process.env.EMAIL_APP, ">"),
            to: patientEmail,
            subject: "[HealthConnect] L\u1ECBch kh\xE1m \u0111\xE3 h\u1EE7y do h\u1EBFt th\u1EDDi gian x\xE1c nh\u1EADn",
            html: html
          });
        case 2:
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          _logger["default"].error({
            err: _t
          }, '[CRON] sendExpiredEmail error');
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[1, 3]]);
  }));
  return function sendExpiredEmail(_x) {
    return _ref2.apply(this, arguments);
  };
}();

// ✅ Cron chạy mỗi phút
var startAutoCancelCron = function startAutoCancelCron() {
  _nodeCron["default"].schedule('* * * * *', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var BookingModel, tenMinutesAgo, expiredBookings, _iterator, _step, _loop, _t4, _t5;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          BookingModel = _index["default"].Booking || _index["default"].Bookings;
          tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
          _context4.n = 1;
          return BookingModel.findAll({
            where: {
              statusId: 'S1',
              createdAt: _defineProperty({}, _sequelize.Op.lt, tenMinutesAgo)
            },
            raw: false
          });
        case 1:
          expiredBookings = _context4.v;
          if (!(expiredBookings.length === 0)) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2);
        case 2:
          _logger["default"].info({
            count: expiredBookings.length
          }, '[CRON] expired bookings detected');
          _iterator = _createForOfIteratorHelper(expiredBookings);
          _context4.p = 3;
          _loop = /*#__PURE__*/_regenerator().m(function _loop() {
            var booking, t, dateStart, dateEnd, schedule, _t3;
            return _regenerator().w(function (_context3) {
              while (1) switch (_context3.p = _context3.n) {
                case 0:
                  booking = _step.value;
                  _context3.n = 1;
                  return _index["default"].sequelize.transaction();
                case 1:
                  t = _context3.v;
                  _context3.p = 2;
                  // Hủy booking
                  booking.statusId = 'S4';
                  _context3.n = 3;
                  return booking.save({
                    transaction: t
                  });
                case 3:
                  // Trả lại slot
                  dateStart = new Date(booking.date);
                  dateStart.setHours(0, 0, 0, 0);
                  dateEnd = new Date(booking.date);
                  dateEnd.setHours(23, 59, 59, 999);
                  _context3.n = 4;
                  return _index["default"].Schedule.findOne({
                    where: {
                      doctorId: booking.doctorId,
                      date: _defineProperty({}, _sequelize.Op.between, [dateStart, dateEnd]),
                      timeType: booking.timeType
                    },
                    transaction: t,
                    raw: false
                  });
                case 4:
                  schedule = _context3.v;
                  if (!(schedule && schedule.currentNumber > 0)) {
                    _context3.n = 5;
                    break;
                  }
                  schedule.currentNumber -= 1;
                  _context3.n = 5;
                  return schedule.save({
                    transaction: t
                  });
                case 5:
                  _context3.n = 6;
                  return t.commit();
                case 6:
                  _logger["default"].info({
                    bookingId: booking.id
                  }, '[CRON] booking auto-cancelled');

                  // ✅ Gửi email thông báo (sau commit, non-blocking)
                  _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
                    var _yield$Promise$all, _yield$Promise$all2, patient, doctor, timeTypeData, _t2;
                    return _regenerator().w(function (_context2) {
                      while (1) switch (_context2.p = _context2.n) {
                        case 0:
                          _context2.p = 0;
                          _context2.n = 1;
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
                          _yield$Promise$all = _context2.v;
                          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3);
                          patient = _yield$Promise$all2[0];
                          doctor = _yield$Promise$all2[1];
                          timeTypeData = _yield$Promise$all2[2];
                          if (!(patient !== null && patient !== void 0 && patient.email)) {
                            _context2.n = 3;
                            break;
                          }
                          _context2.n = 2;
                          return sendExpiredEmail({
                            patientEmail: patient.email,
                            patientName: "".concat(patient.lastName || '', " ").concat(patient.firstName || '').trim(),
                            doctorName: doctor ? "BS. ".concat(doctor.lastName || '', " ").concat(doctor.firstName || '').trim() : 'Bác sĩ',
                            timeValue: (timeTypeData === null || timeTypeData === void 0 ? void 0 : timeTypeData.value) || booking.timeType,
                            dateStr: formatDate(booking.date)
                          });
                        case 2:
                          _logger["default"].info({
                            recipient: patient.email,
                            bookingId: booking.id
                          }, '[CRON] expired email sent');
                        case 3:
                          _context2.n = 5;
                          break;
                        case 4:
                          _context2.p = 4;
                          _t2 = _context2.v;
                          _logger["default"].error({
                            err: _t2,
                            bookingId: booking.id
                          }, '[CRON] expired email failed');
                        case 5:
                          return _context2.a(2);
                      }
                    }, _callee2, null, [[0, 4]]);
                  }))();
                  _context3.n = 9;
                  break;
                case 7:
                  _context3.p = 7;
                  _t3 = _context3.v;
                  _context3.n = 8;
                  return t.rollback();
                case 8:
                  _logger["default"].error({
                    err: _t3,
                    bookingId: booking.id
                  }, '[CRON] cancel booking failed');
                case 9:
                  return _context3.a(2);
              }
            }, _loop, null, [[2, 7]]);
          });
          _iterator.s();
        case 4:
          if ((_step = _iterator.n()).done) {
            _context4.n = 6;
            break;
          }
          return _context4.d(_regeneratorValues(_loop()), 5);
        case 5:
          _context4.n = 4;
          break;
        case 6:
          _context4.n = 8;
          break;
        case 7:
          _context4.p = 7;
          _t4 = _context4.v;
          _iterator.e(_t4);
        case 8:
          _context4.p = 8;
          _iterator.f();
          return _context4.f(8);
        case 9:
          _context4.n = 11;
          break;
        case 10:
          _context4.p = 10;
          _t5 = _context4.v;
          _logger["default"].error({
            err: _t5
          }, '[CRON] cron iteration failed');
        case 11:
          return _context4.a(2);
      }
    }, _callee3, null, [[3, 7, 8, 9], [0, 10]]);
  })));
  _logger["default"].info('[CRON] auto-cancel cron started (1 min interval)');
};
module.exports = {
  startAutoCancelCron: startAutoCancelCron
};