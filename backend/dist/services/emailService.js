"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _logger = _interopRequireDefault(require("../utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Wrap a fire-and-forget email send with one retry after 5 s. Caller passes
// `label` and a context object (bookingId, recipient, etc.) used in the log
// payload so an admin can reconcile failures manually.
var sendWithRetry = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(label, context, sendFn) {
    var _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return sendFn();
        case 1:
          _context2.n = 3;
          break;
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          _logger["default"].warn(_objectSpread({
            err: _t2
          }, context), "[email/".concat(label, "] first attempt failed, retrying in 5s"));
          setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
            var _t;
            return _regenerator().w(function (_context) {
              while (1) switch (_context.p = _context.n) {
                case 0:
                  _context.p = 0;
                  _context.n = 1;
                  return sendFn();
                case 1:
                  _logger["default"].info(_objectSpread({}, context), "[email/".concat(label, "] retry succeeded"));
                  _context.n = 3;
                  break;
                case 2:
                  _context.p = 2;
                  _t = _context.v;
                  _logger["default"].error(_objectSpread({
                    err: _t
                  }, context), "[email/".concat(label, "] retry failed \u2014 manual intervention required"));
                case 3:
                  return _context.a(2);
              }
            }, _callee, null, [[0, 2]]);
          })), 5000);
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function sendWithRetry(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// ===== CẤU HÌNH NODEMAILER =====
var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// ===== HTML EMAIL TEMPLATE =====
var buildBookingEmailHTML = function buildBookingEmailHTML(data) {
  var patientName = data.patientName,
    doctorName = data.doctorName,
    timeValue = data.timeValue,
    dateStr = data.dateStr,
    clinicName = data.clinicName,
    clinicAddress = data.clinicAddress,
    reason = data.reason,
    confirmLink = data.confirmLink;
  return "\n<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>X\xE1c nh\u1EADn l\u1ECBch kh\xE1m</title>\n</head>\n<body style=\"margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f6f9;padding:40px 20px;\">\n    <tr>\n      <td align=\"center\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">\n\n          <!-- HEADER -->\n          <tr>\n            <td style=\"background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;\">\n              <h1 style=\"margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;\">\n                HealthConnect\n              </h1>\n              <p style=\"margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;\">\n                H\u1EC7 th\u1ED1ng \u0111\u1EB7t l\u1ECBch kh\xE1m tr\u1EF1c tuy\u1EBFn\n              </p>\n            </td>\n          </tr>\n\n          <!-- GREETING -->\n          <tr>\n            <td style=\"padding:36px 40px 0;\">\n              <h2 style=\"margin:0 0 8px;color:#1e1b4b;font-size:20px;font-weight:600;\">\n                Xin ch\xE0o, ".concat(patientName, "!\n              </h2>\n              <p style=\"margin:0;color:#6b7280;font-size:15px;line-height:1.6;\">\n                B\u1EA1n v\u1EEBa \u0111\u1EB7t l\u1ECBch kh\xE1m th\xE0nh c\xF4ng. Vui l\xF2ng xem th\xF4ng tin b\xEAn d\u01B0\u1EDBi v\xE0 x\xE1c nh\u1EADn l\u1ECBch h\u1EB9n.\n              </p>\n            </td>\n          </tr>\n\n          <!-- BOOKING INFO CARD -->\n          <tr>\n            <td style=\"padding:24px 40px;\">\n              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"\n                style=\"background:#f8f7ff;border:1px solid #e0e7ff;border-radius:12px;overflow:hidden;\">\n\n                <tr>\n                  <td style=\"background:#4f46e5;padding:14px 24px;\">\n                    <p style=\"margin:0;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;\">\n                      Th\xF4ng tin l\u1ECBch kh\xE1m\n                    </p>\n                  </td>\n                </tr>\n\n                <tr>\n                  <td style=\"padding:20px 24px;\">\n                    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n\n                      <!-- Doctor -->\n                      <tr>\n                        <td style=\"padding:8px 0;border-bottom:1px solid #e5e7eb;\">\n                          <table width=\"100%\"><tr>\n                            <td style=\"color:#6b7280;font-size:14px;width:140px;\">B\xE1c s\u0129 kh\xE1m</td>\n                            <td style=\"color:#111827;font-size:14px;font-weight:600;\">").concat(doctorName, "</td>\n                          </tr></table>\n                        </td>\n                      </tr>\n\n                      <!-- Date -->\n                      <tr>\n                        <td style=\"padding:8px 0;border-bottom:1px solid #e5e7eb;\">\n                          <table width=\"100%\"><tr>\n                            <td style=\"color:#6b7280;font-size:14px;width:140px;\">Ng\xE0y kh\xE1m</td>\n                            <td style=\"color:#111827;font-size:14px;font-weight:600;\">").concat(dateStr, "</td>\n                          </tr></table>\n                        </td>\n                      </tr>\n\n                      <!-- Time -->\n                      <tr>\n                        <td style=\"padding:8px 0;border-bottom:1px solid #e5e7eb;\">\n                          <table width=\"100%\"><tr>\n                            <td style=\"color:#6b7280;font-size:14px;width:140px;\">Khung gi\u1EDD</td>\n                            <td style=\"color:#4f46e5;font-size:14px;font-weight:700;\">").concat(timeValue, "</td>\n                          </tr></table>\n                        </td>\n                      </tr>\n\n                      <!-- Clinic -->\n                      ").concat(clinicName ? "\n                      <tr>\n                        <td style=\"padding:8px 0;border-bottom:1px solid #e5e7eb;\">\n                          <table width=\"100%\"><tr>\n                            <td style=\"color:#6b7280;font-size:14px;width:140px;\">Ph\xF2ng kh\xE1m</td>\n                            <td style=\"color:#111827;font-size:14px;font-weight:600;\">".concat(clinicName, "</td>\n                          </tr></table>\n                        </td>\n                      </tr>") : '', "\n\n                      <!-- Address -->\n                      ").concat(clinicAddress ? "\n                      <tr>\n                        <td style=\"padding:8px 0;border-bottom:1px solid #e5e7eb;\">\n                          <table width=\"100%\"><tr>\n                            <td style=\"color:#6b7280;font-size:14px;width:140px;\">\u0110\u1ECBa ch\u1EC9</td>\n                            <td style=\"color:#111827;font-size:14px;\">".concat(clinicAddress, "</td>\n                          </tr></table>\n                        </td>\n                      </tr>") : '', "\n\n                      <!-- Reason -->\n                      ").concat(reason ? "\n                      <tr>\n                        <td style=\"padding:8px 0;\">\n                          <table width=\"100%\"><tr>\n                            <td style=\"color:#6b7280;font-size:14px;width:140px;\">L\xFD do kh\xE1m</td>\n                            <td style=\"color:#111827;font-size:14px;\">".concat(reason, "</td>\n                          </tr></table>\n                        </td>\n                      </tr>") : '', "\n\n                    </table>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <!-- CONFIRM BUTTON -->\n          <tr>\n            <td style=\"padding:0 40px 36px;text-align:center;\">\n              <p style=\"color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.6;\">\n                B\u1EA5m n\xFAt b\xEAn d\u01B0\u1EDBi \u0111\u1EC3 x\xE1c nh\u1EADn b\u1EA1n s\u1EBD \u0111\u1EBFn kh\xE1m \u0111\xFAng gi\u1EDD.\n              </p>\n              <a href=\"").concat(confirmLink, "\"\n                style=\"display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;\n                  text-decoration:none;padding:14px 40px;border-radius:10px;font-size:16px;\n                  font-weight:700;letter-spacing:0.3px;\">\n                X\xE1c nh\u1EADn l\u1ECBch kh\xE1m\n              </a>\n              <p style=\"color:#9ca3af;font-size:12px;margin:16px 0 0;\">\n                Link c\xF3 hi\u1EC7u l\u1EF1c trong 24 gi\u1EDD\n              </p>\n            </td>\n          </tr>\n\n          <!-- NOTE -->\n          <tr>\n            <td style=\"padding:0 40px 30px;\">\n              <div style=\"background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;\">\n                <p style=\"margin:0;color:#92400e;font-size:13px;line-height:1.6;\">\n                  <strong>L\u01B0u \xFD:</strong> N\u1EBFu b\u1EA1n mu\u1ED1n h\u1EE7y l\u1ECBch, vui l\xF2ng v\xE0o trang\n                  <strong>L\u1ECBch h\u1EB9n c\u1EE7a t\xF4i</strong> tr\xEAn h\u1EC7 th\u1ED1ng \xEDt nh\u1EA5t 2 gi\u1EDD tr\u01B0\u1EDBc gi\u1EDD kh\xE1m.\n                </p>\n              </div>\n            </td>\n          </tr>\n\n          <!-- FOOTER -->\n          <tr>\n            <td style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;\">\n              <p style=\"margin:0;color:#9ca3af;font-size:12px;line-height:1.6;\">\n                Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB h\u1EC7 th\u1ED1ng HealthConnect.<br/>\n                Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.\n              </p>\n            </td>\n          </tr>\n\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>");
};

// ===== GỬI EMAIL ĐẶT LỊCH =====
var sendBookingConfirmEmail = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data) {
    var html, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          html = buildBookingEmailHTML(data);
          _context3.n = 1;
          return transporter.sendMail({
            from: "\"HealthConnect\" <".concat(process.env.EMAIL_APP, ">"),
            to: data.patientEmail,
            subject: "[HealthConnect] X\xE1c nh\u1EADn l\u1ECBch kh\xE1m - ".concat(data.dateStr),
            html: html
          });
        case 1:
          _logger["default"].info({
            recipient: data.patientEmail
          }, 'Booking confirm email sent');
          return _context3.a(2, true);
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          _logger["default"].error({
            err: _t3
          }, 'Send email error');
          return _context3.a(2, false);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function sendBookingConfirmEmail(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

// ===== GỬI EMAIL KHI HỦY LỊCH =====
var sendCancelEmail = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(data) {
    var refundNote, cancelReason, html, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          if (data.patientEmail) {
            _context4.n = 1;
            break;
          }
          _logger["default"].error('sendCancelEmail: missing patientEmail');
          return _context4.a(2, false);
        case 1:
          _context4.p = 1;
          refundNote = data.refundNote, cancelReason = data.cancelReason;
          html = "\n<!DOCTYPE html>\n<html lang=\"vi\">\n<body style=\"font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;\">\n  <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\"\n    style=\"background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">\n    <tr>\n      <td style=\"background:#ef4444;padding:30px 40px;text-align:center;\">\n        <h1 style=\"margin:0;color:#fff;font-size:22px;\">L\u1ECBch kh\xE1m \u0111\xE3 \u0111\u01B0\u1EE3c h\u1EE7y</h1>\n      </td>\n    </tr>\n    <tr>\n      <td style=\"padding:30px 40px;\">\n        <p style=\"color:#374151;font-size:15px;margin:0 0 16px;\">\n          Xin ch\xE0o <strong>".concat(data.patientName, "</strong>,\n        </p>\n        <p style=\"color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;\">\n          L\u1ECBch kh\xE1m c\u1EE7a b\u1EA1n v\u1EDBi <strong>").concat(data.doctorName, "</strong>\n          v\xE0o l\xFAc <strong>").concat(data.timeValue, "</strong>, ng\xE0y <strong>").concat(data.dateStr, "</strong>\n          \u0111\xE3 \u0111\u01B0\u1EE3c h\u1EE7y th\xE0nh c\xF4ng.\n        </p>\n        ").concat(cancelReason ? "\n        <div style=\"background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-bottom:16px;\">\n          <p style=\"margin:0;color:#b91c1c;font-size:13px;\">\n            <strong>L\xFD do h\u1EE7y:</strong> ".concat(cancelReason, "\n          </p>\n        </div>") : '', "\n        ").concat(refundNote ? "\n        <div style=\"background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:12px 16px;margin-bottom:16px;\">\n          <p style=\"margin:0;color:#065f46;font-size:13px;white-space:pre-line;\">".concat(refundNote, "</p>\n        </div>") : '', "\n        <p style=\"color:#6b7280;font-size:14px;margin:0;\">\n          N\u1EBFu b\u1EA1n mu\u1ED1n \u0111\u1EB7t l\u1ECBch kh\xE1c, h\xE3y truy c\u1EADp l\u1EA1i h\u1EC7 th\u1ED1ng HealthConnect.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;\">\n        <p style=\"margin:0;color:#9ca3af;font-size:12px;\">Email t\u1EF1 \u0111\u1ED9ng t\u1EEB HealthConnect.</p>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>");
          _context4.n = 2;
          return transporter.sendMail({
            from: "\"HealthConnect\" <".concat(process.env.EMAIL_APP, ">"),
            to: data.patientEmail,
            subject: "[HealthConnect] L\u1ECBch kh\xE1m \u0111\xE3 h\u1EE7y - ".concat(data.dateStr),
            html: html
          });
        case 2:
          return _context4.a(2, true);
        case 3:
          _context4.p = 3;
          _t4 = _context4.v;
          _logger["default"].error({
            err: _t4
          }, 'Send cancel email error');
          return _context4.a(2, false);
      }
    }, _callee4, null, [[1, 3]]);
  }));
  return function sendCancelEmail(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var sendMedicalRecordEmail = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(data) {
    var html, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          html = "\n<!DOCTYPE html>\n<html lang=\"vi\">\n<body style=\"font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;\">\n  <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\"\n    style=\"background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">\n    <tr>\n      <td style=\"background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:30px 40px;text-align:center;\">\n        <h1 style=\"margin:0;color:#fff;font-size:22px;\">HealthConnect</h1>\n        <p style=\"margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;\">H\u1ED3 s\u01A1 kh\xE1m b\u1EC7nh \u0111i\u1EC7n t\u1EED</p>\n      </td>\n    </tr>\n    <tr>\n      <td style=\"padding:30px 40px;\">\n        <p style=\"color:#374151;font-size:15px;margin:0 0 8px;\">\n          Xin ch\xE0o <strong>".concat(data.patientName, "</strong>,\n        </p>\n        <p style=\"color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;\">\n          <strong>").concat(data.doctorName, "</strong> \u0111\xE3 g\u1EEDi cho b\u1EA1n h\u1ED3 s\u01A1/\u0111\u01A1n thu\u1ED1c sau bu\u1ED5i kh\xE1m (M\xE3 l\u1ECBch: #").concat(data.bookingId, "):\n        </p>\n        <div style=\"background:#f8fafc;border-left:4px solid #4f46e5;border-radius:8px;padding:20px 24px;white-space:pre-wrap;font-family:monospace;font-size:13px;color:#1f2937;line-height:1.8;\">\n").concat(data.content, "\n        </div>\n        <p style=\"color:#9ca3af;font-size:12px;margin:20px 0 0;text-align:center;\">\n          Vui l\xF2ng l\u01B0u gi\u1EEF h\u1ED3 s\u01A1 n\xE0y. Li\xEAn h\u1EC7 ph\xF2ng kh\xE1m n\u1EBFu c\xF3 th\u1EAFc m\u1EAFc.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;\">\n        <p style=\"margin:0;color:#9ca3af;font-size:12px;\">Email t\u1EF1 \u0111\u1ED9ng t\u1EEB HealthConnect.</p>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>");
          _context5.n = 1;
          return transporter.sendMail({
            from: "\"HealthConnect\" <".concat(process.env.EMAIL_APP, ">"),
            to: data.patientEmail,
            subject: "[HealthConnect] H\u1ED3 s\u01A1 kh\xE1m b\u1EC7nh - ".concat(data.doctorName),
            html: html
          });
        case 1:
          return _context5.a(2, true);
        case 2:
          _context5.p = 2;
          _t5 = _context5.v;
          _logger["default"].error({
            err: _t5
          }, 'Send medical record email error');
          return _context5.a(2, false);
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return function sendMedicalRecordEmail(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
// ===== EMAIL THÔNG BÁO CHỜ CHUYỂN KHOẢN =====
var sendBankTransferPendingEmail = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(data) {
    var _data$bookingToken, bankName, bankAccount, bankOwner, transferRef, amountLabel, html, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          if (data.patientEmail) {
            _context6.n = 1;
            break;
          }
          _logger["default"].error('sendBankTransferPendingEmail: missing patientEmail');
          return _context6.a(2, false);
        case 1:
          _context6.p = 1;
          bankName = process.env.BANK_NAME || 'MB Bank';
          bankAccount = process.env.BANK_ACCOUNT_NO || '0123456789';
          bankOwner = process.env.BANK_OWNER || 'PHONG KHAM HEALTHCONNECT';
          transferRef = "TTKHAM ".concat(((_data$bookingToken = data.bookingToken) === null || _data$bookingToken === void 0 || (_data$bookingToken = _data$bookingToken.slice(-8)) === null || _data$bookingToken === void 0 ? void 0 : _data$bookingToken.toUpperCase()) || '');
          amountLabel = data.amountUsd != null ? "$".concat(Number(data.amountUsd).toFixed(2), " USD") : 'Liên hệ phòng khám';
          html = "\n<!DOCTYPE html><html lang=\"vi\">\n<body style=\"font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;\">\n  <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\"\n    style=\"background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">\n    <tr><td style=\"background:linear-gradient(135deg,#f59e0b,#d97706);padding:30px 40px;text-align:center;\">\n      <h1 style=\"margin:0;color:#fff;font-size:22px;\">HealthConnect</h1>\n      <p style=\"margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;\">Ch\u1EDD x\xE1c nh\u1EADn thanh to\xE1n</p>\n    </td></tr>\n    <tr><td style=\"padding:30px 40px;\">\n      <p style=\"color:#374151;font-size:15px;margin:0 0 12px;\">Xin ch\xE0o <strong>".concat(data.patientName, "</strong>,</p>\n      <p style=\"color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;\">\n        Ch\xFAng t\xF4i \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c y\xEAu c\u1EA7u \u0111\u1EB7t l\u1ECBch c\u1EE7a b\u1EA1n v\u1EDBi <strong>").concat(data.doctorName, "</strong>\n        v\xE0o l\xFAc <strong>").concat(data.timeValue, "</strong>, ng\xE0y <strong>").concat(data.dateStr, "</strong>.\n      </p>\n      <div style=\"background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:20px 24px;margin-bottom:20px;\">\n        <p style=\"margin:0 0 10px;color:#92400e;font-size:14px;font-weight:600;\">Th\xF4ng tin chuy\u1EC3n kho\u1EA3n</p>\n        <p style=\"margin:4px 0;color:#78350f;font-size:14px;\">Ng\xE2n h\xE0ng: <strong>").concat(bankName, "</strong></p>\n        <p style=\"margin:4px 0;color:#78350f;font-size:14px;\">S\u1ED1 t\xE0i kho\u1EA3n: <strong>").concat(bankAccount, "</strong></p>\n        <p style=\"margin:4px 0;color:#78350f;font-size:14px;\">T\xEAn t\xE0i kho\u1EA3n: <strong>").concat(bankOwner, "</strong></p>\n        <p style=\"margin:4px 0;color:#78350f;font-size:14px;\">S\u1ED1 ti\u1EC1n: <strong style=\"color:#dc2626;\">").concat(amountLabel, "</strong></p>\n        <p style=\"margin:10px 0 0;color:#92400e;font-size:13px;font-weight:600;\">\n          N\u1ED9i dung CK b\u1EAFt bu\u1ED9c: <span style=\"background:#fef3c7;padding:2px 8px;border-radius:4px;\">").concat(transferRef, "</span>\n        </p>\n      </div>\n      <p style=\"color:#ef4444;font-size:13px;margin:0;\">\n        \u26A0 Vui l\xF2ng chuy\u1EC3n kho\u1EA3n trong v\xF2ng <strong>2 gi\u1EDD</strong> \u0111\u1EC3 gi\u1EEF l\u1ECBch. Sau th\u1EDDi gian n\xE0y l\u1ECBch s\u1EBD t\u1EF1 \u0111\u1ED9ng h\u1EE7y.\n      </p>\n    </td></tr>\n    <tr><td style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;\">\n      <p style=\"margin:0;color:#9ca3af;font-size:12px;\">Email t\u1EF1 \u0111\u1ED9ng t\u1EEB HealthConnect. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi.</p>\n    </td></tr>\n  </table>\n</body></html>");
          _context6.n = 2;
          return transporter.sendMail({
            from: "\"HealthConnect\" <".concat(process.env.EMAIL_APP, ">"),
            to: data.patientEmail,
            subject: "[HealthConnect] Vui l\xF2ng chuy\u1EC3n kho\u1EA3n \u0111\u1EC3 x\xE1c nh\u1EADn l\u1ECBch kh\xE1m - ".concat(data.dateStr),
            html: html
          });
        case 2:
          return _context6.a(2, true);
        case 3:
          _context6.p = 3;
          _t6 = _context6.v;
          _logger["default"].error({
            err: _t6
          }, 'Send bank pending email error');
          return _context6.a(2, false);
      }
    }, _callee6, null, [[1, 3]]);
  }));
  return function sendBankTransferPendingEmail(_x7) {
    return _ref6.apply(this, arguments);
  };
}();

// ===== EMAIL XÁC NHẬN ĐÃ NHẬN TIỀN =====
var sendBankTransferConfirmedEmail = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(data) {
    var html, _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          html = "\n<!DOCTYPE html><html lang=\"vi\">\n<body style=\"font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;\">\n  <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\"\n    style=\"background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">\n    <tr><td style=\"background:linear-gradient(135deg,#10b981,#059669);padding:30px 40px;text-align:center;\">\n      <h1 style=\"margin:0;color:#fff;font-size:22px;\">HealthConnect</h1>\n      <p style=\"margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;\">Thanh to\xE1n th\xE0nh c\xF4ng \u2713</p>\n    </td></tr>\n    <tr><td style=\"padding:30px 40px;\">\n      <p style=\"color:#374151;font-size:15px;margin:0 0 12px;\">Xin ch\xE0o <strong>".concat(data.patientName, "</strong>,</p>\n      <p style=\"color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;\">\n        Ch\xFAng t\xF4i \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c thanh to\xE1n c\u1EE7a b\u1EA1n. L\u1ECBch kh\xE1m v\u1EDBi <strong>").concat(data.doctorName, "</strong>\n        v\xE0o l\xFAc <strong>").concat(data.timeValue, "</strong>, ng\xE0y <strong>").concat(data.dateStr, "</strong>\n        \u0111\xE3 \u0111\u01B0\u1EE3c <strong style=\"color:#059669;\">x\xE1c nh\u1EADn ch\xEDnh th\u1EE9c</strong>.\n      </p>\n      <div style=\"background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:16px 24px;text-align:center;\">\n        <p style=\"margin:0;color:#065f46;font-size:15px;font-weight:600;\">L\u1ECBch kh\xE1m c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c ch\u1ED1t!</p>\n        <p style=\"margin:8px 0 0;color:#047857;font-size:13px;\">Vui l\xF2ng \u0111\u1EBFn \u0111\xFAng gi\u1EDD. Mang theo CMND/CCCD khi \u0111\u1EBFn kh\xE1m.</p>\n      </div>\n    </td></tr>\n    <tr><td style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;\">\n      <p style=\"margin:0;color:#9ca3af;font-size:12px;\">Email t\u1EF1 \u0111\u1ED9ng t\u1EEB HealthConnect. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi.</p>\n    </td></tr>\n  </table>\n</body></html>");
          _context7.n = 1;
          return transporter.sendMail({
            from: "\"HealthConnect\" <".concat(process.env.EMAIL_APP, ">"),
            to: data.patientEmail,
            subject: "[HealthConnect] Thanh to\xE1n th\xE0nh c\xF4ng - L\u1ECBch kh\xE1m \u0111\xE3 \u0111\u01B0\u1EE3c ch\u1ED1t",
            html: html
          });
        case 1:
          return _context7.a(2, true);
        case 2:
          _context7.p = 2;
          _t7 = _context7.v;
          _logger["default"].error({
            err: _t7
          }, 'Send bank confirmed email error');
          return _context7.a(2, false);
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return function sendBankTransferConfirmedEmail(_x8) {
    return _ref7.apply(this, arguments);
  };
}();
// ===== GỬI EMAIL ĐƠN THUỐC (PDF ATTACHMENT) =====
var sendPrescriptionEmail = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(_ref8) {
    var patientEmail, patientName, doctorName, pdfBuffer, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          patientEmail = _ref8.patientEmail, patientName = _ref8.patientName, doctorName = _ref8.doctorName, pdfBuffer = _ref8.pdfBuffer;
          _context8.p = 1;
          _context8.n = 2;
          return transporter.sendMail({
            from: "\"HealthConnect\" <".concat(process.env.EMAIL_APP, ">"),
            to: patientEmail,
            subject: "[HealthConnect] Don thuoc dien tu tu BS. ".concat(doctorName),
            html: "\n        <div style=\"font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;\">\n          <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\"\n            style=\"background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">\n            <tr><td style=\"background:#4f46e5;padding:30px 40px;text-align:center;\">\n              <h1 style=\"margin:0;color:#fff;font-size:22px;\">Don Thuoc Dien Tu</h1>\n              <p style=\"color:#c7d2fe;margin:8px 0 0;\">HealthConnect</p>\n            </td></tr>\n            <tr><td style=\"padding:32px 40px;\">\n              <p style=\"color:#374151;font-size:15px;\">Xin chao <strong>".concat(patientName, "</strong>,</p>\n              <p style=\"color:#374151;font-size:14px;line-height:1.6;\">\n                BS. <strong>").concat(doctorName, "</strong> da gui don thuoc dien tu cua ban qua he thong HealthConnect.<br/>\n                Vui long xem file dinh kem duoi day va thuc hien theo huong dan cua bac si.\n              </p>\n              <div style=\"background:#f0f4ff;border-radius:12px;padding:16px 20px;margin:20px 0;border-left:4px solid #4f46e5;\">\n                <p style=\"margin:0;color:#4f46e5;font-weight:600;font-size:13px;\">\n                  \uD83D\uDCCE File don thuoc duoc dinh kem trong email nay.\n                </p>\n              </div>\n              <p style=\"color:#6b7280;font-size:12px;margin-top:24px;\">\n                Neu co thac mac, vui long lien he phong kham hoac dat lai lich hen qua HealthConnect.\n              </p>\n            </td></tr>\n            <tr><td style=\"background:#f9fafb;padding:20px 40px;text-align:center;\">\n              <p style=\"margin:0;color:#9ca3af;font-size:11px;\">HealthConnect - He thong Y te Thong minh</p>\n            </td></tr>\n          </table>\n        </div>"),
            attachments: [{
              filename: "don-thuoc-".concat(Date.now(), ".pdf"),
              content: pdfBuffer,
              contentType: 'application/pdf'
            }]
          });
        case 2:
          return _context8.a(2, true);
        case 3:
          _context8.p = 3;
          _t8 = _context8.v;
          _logger["default"].error({
            err: _t8
          }, 'Send prescription email error');
          return _context8.a(2, false);
      }
    }, _callee8, null, [[1, 3]]);
  }));
  return function sendPrescriptionEmail(_x9) {
    return _ref9.apply(this, arguments);
  };
}();
module.exports = {
  sendBookingConfirmEmail: sendBookingConfirmEmail,
  sendCancelEmail: sendCancelEmail,
  sendMedicalRecordEmail: sendMedicalRecordEmail,
  sendBankTransferPendingEmail: sendBankTransferPendingEmail,
  sendBankTransferConfirmedEmail: sendBankTransferConfirmedEmail,
  sendPrescriptionEmail: sendPrescriptionEmail,
  sendWithRetry: sendWithRetry
};