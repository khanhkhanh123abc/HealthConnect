"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var paypal = require('@paypal/checkout-server-sdk');
var db = require('../models');
var logger = require('../utils/logger')["default"] || require('../utils/logger');
var environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
var client = new paypal.core.PayPalHttpClient(environment);

// Internal: resolve a doctor's authoritative price by joining
// Doctor_Info → allCode (type='PRICE'). Returns numeric USD or null.
var resolveDoctorPriceUsd = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(doctorId) {
    var info, code, cleaned, parsed;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return db.Doctor_Info.findOne({
            where: {
              doctorId: doctorId
            },
            raw: true
          });
        case 1:
          info = _context.v;
          if (info !== null && info !== void 0 && info.priceId) {
            _context.n = 2;
            break;
          }
          return _context.a(2, null);
        case 2:
          _context.n = 3;
          return db.allCode.findOne({
            where: {
              keyMap: info.priceId,
              type: 'PRICE'
            },
            raw: true
          });
        case 3:
          code = _context.v;
          if (code !== null && code !== void 0 && code.value) {
            _context.n = 4;
            break;
          }
          return _context.a(2, null);
        case 4:
          // value examples: "$50", "50.00", "50 USD", "1,000,000 VND". Strip non-numeric.
          cleaned = String(code.value).replace(/[^\d.]/g, '');
          parsed = parseFloat(cleaned);
          if (!(!Number.isFinite(parsed) || parsed <= 0)) {
            _context.n = 5;
            break;
          }
          return _context.a(2, null);
        case 5:
          return _context.a(2, parsed);
      }
    }, _callee);
  }));
  return function resolveDoctorPriceUsd(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Create order. The client cannot influence the amount — server resolves it
// from the booking → doctor → price chain. Caller (controller) must confirm
// req.user.id === booking.patientId before invoking.
var createPaypalOrder = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(bookingId) {
    var backendUrl, frontendUrl, BookingModel, booking, amount, _order$links$find, request, response, order, approvalUrl, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
          frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          if (bookingId) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, {
            errCode: 1,
            errMessage: 'Missing bookingId'
          });
        case 1:
          BookingModel = db.Booking || db.Bookings;
          _context2.n = 2;
          return BookingModel.findOne({
            where: {
              id: bookingId
            },
            raw: true
          });
        case 2:
          booking = _context2.v;
          if (booking) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, {
            errCode: 2,
            errMessage: 'Booking not found'
          });
        case 3:
          if (['S1', 'S2'].includes(booking.statusId)) {
            _context2.n = 4;
            break;
          }
          return _context2.a(2, {
            errCode: 3,
            errMessage: 'Booking is not payable in its current state'
          });
        case 4:
          _context2.n = 5;
          return resolveDoctorPriceUsd(booking.doctorId);
        case 5:
          amount = _context2.v;
          if (amount) {
            _context2.n = 6;
            break;
          }
          logger.error({
            bookingId: bookingId,
            doctorId: booking.doctorId
          }, '[PayPal] cannot resolve price');
          return _context2.a(2, {
            errCode: 4,
            errMessage: 'Price unavailable for this doctor'
          });
        case 6:
          _context2.p = 6;
          request = new paypal.orders.OrdersCreateRequest();
          request.prefer('return=representation');
          request.requestBody({
            intent: 'CAPTURE',
            application_context: {
              brand_name: 'HealthConnect',
              user_action: 'PAY_NOW',
              return_url: "".concat(backendUrl, "/api/paypal-return?bookingId=").concat(bookingId),
              cancel_url: "".concat(frontendUrl, "/payment-result?status=cancelled")
            },
            purchase_units: [{
              reference_id: bookingId.toString(),
              description: "HealthConnect - Booking #".concat(bookingId),
              amount: {
                currency_code: 'USD',
                value: amount.toFixed(2)
              }
            }]
          });
          _context2.n = 7;
          return client.execute(request);
        case 7:
          response = _context2.v;
          order = response.result;
          approvalUrl = (_order$links$find = order.links.find(function (l) {
            return l.rel === 'approve';
          })) === null || _order$links$find === void 0 ? void 0 : _order$links$find.href; // Persist authoritative price on the booking so any later refund uses
          // the same number (avoids re-querying allCode if it has drifted).
          _context2.n = 8;
          return BookingModel.update({
            price: Math.round(amount)
          }, {
            where: {
              id: bookingId
            }
          });
        case 8:
          return _context2.a(2, {
            errCode: 0,
            orderID: order.id,
            approvalUrl: approvalUrl
          });
        case 9:
          _context2.p = 9;
          _t = _context2.v;
          logger.error({
            err: _t,
            statusCode: _t === null || _t === void 0 ? void 0 : _t.statusCode,
            result: _t === null || _t === void 0 ? void 0 : _t.result
          }, '[PayPal] client.execute error');
          throw _t;
        case 10:
          return _context2.a(2);
      }
    }, _callee2, null, [[6, 9]]);
  }));
  return function createPaypalOrder(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// Capture order after user approval and persist transaction details.
var handlePaypalReturn = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(token, bookingId) {
    var frontendUrl, request, response, capture, captureDetail, BookingModel, booking, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          _context3.p = 1;
          request = new paypal.orders.OrdersCaptureRequest(token);
          request.requestBody({});
          _context3.n = 2;
          return client.execute(request);
        case 2:
          response = _context3.v;
          capture = response.result;
          if (!(capture.status !== 'COMPLETED')) {
            _context3.n = 3;
            break;
          }
          return _context3.a(2, {
            errCode: 1,
            redirectUrl: "".concat(frontendUrl, "/payment-result?status=failed")
          });
        case 3:
          captureDetail = capture.purchase_units[0].payments.captures[0];
          BookingModel = db.Booking || db.Bookings;
          _context3.n = 4;
          return BookingModel.findOne({
            where: {
              id: bookingId
            },
            raw: false
          });
        case 4:
          booking = _context3.v;
          if (booking) {
            _context3.n = 5;
            break;
          }
          return _context3.a(2, {
            errCode: 2,
            redirectUrl: "".concat(frontendUrl, "/payment-result?status=failed")
          });
        case 5:
          booking.statusId = 'S2';
          booking.vnpTxnRef = token;
          booking.vnpTransactionNo = captureDetail.id;
          booking.vnpTransactionDate = new Date().toISOString();
          _context3.n = 6;
          return booking.save();
        case 6:
          return _context3.a(2, {
            errCode: 0,
            redirectUrl: "".concat(frontendUrl, "/payment-result?status=success")
          });
        case 7:
          _context3.p = 7;
          _t2 = _context3.v;
          logger.error({
            err: _t2
          }, 'PayPal capture error');
          return _context3.a(2, {
            errCode: -1,
            redirectUrl: "".concat(frontendUrl, "/payment-result?status=error")
          });
      }
    }, _callee3, null, [[1, 7]]);
  }));
  return function handlePaypalReturn(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

// Refund a captured payment in full.
var createRefund = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(booking) {
    var request, response, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          if (booking.vnpTransactionNo) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, {
            success: false,
            message: 'Missing PayPal transaction reference; cannot refund.'
          });
        case 1:
          request = new paypal.payments.CapturesRefundRequest(booking.vnpTransactionNo);
          request.requestBody({
            note_to_payer: 'Refund for cancelled HealthConnect appointment'
          });
          _context4.n = 2;
          return client.execute(request);
        case 2:
          response = _context4.v;
          if (!(response.result.status === 'COMPLETED')) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, {
            success: true,
            refundAmount: booking.price,
            isPending: false
          });
        case 3:
          if (!(response.result.status === 'PENDING')) {
            _context4.n = 4;
            break;
          }
          return _context4.a(2, {
            success: true,
            refundAmount: booking.price,
            isPending: true
          });
        case 4:
          return _context4.a(2, {
            success: false,
            message: "Refund failed: ".concat(response.result.status)
          });
        case 5:
          _context4.p = 5;
          _t3 = _context4.v;
          logger.error({
            err: _t3
          }, 'PayPal refund error');
          return _context4.a(2, {
            success: false,
            message: _t3.message || 'PayPal refund error'
          });
      }
    }, _callee4, null, [[0, 5]]);
  }));
  return function createRefund(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
module.exports = {
  createPaypalOrder: createPaypalOrder,
  handlePaypalReturn: handlePaypalReturn,
  createRefund: createRefund,
  resolveDoctorPriceUsd: resolveDoctorPriceUsd
};