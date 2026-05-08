"use strict";

var _index = _interopRequireDefault(require("../models/index"));
var _sequelize = require("sequelize");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var COMPLETED_STATUS = 'S3';
var createReview = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
    var _ref2, bookingId, patientId, rating, comment, ratingInt, booking, existing, review;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _ref2 = data || {}, bookingId = _ref2.bookingId, patientId = _ref2.patientId, rating = _ref2.rating, comment = _ref2.comment;
          if (!(!bookingId || !patientId || !rating)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, {
            errCode: 1,
            errMessage: 'Missing required parameters!'
          });
        case 1:
          ratingInt = parseInt(rating, 10);
          if (!(Number.isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5)) {
            _context.n = 2;
            break;
          }
          return _context.a(2, {
            errCode: 2,
            errMessage: 'Rating must be between 1 and 5'
          });
        case 2:
          _context.n = 3;
          return _index["default"].Bookings.findByPk(bookingId);
        case 3:
          booking = _context.v;
          if (booking) {
            _context.n = 4;
            break;
          }
          return _context.a(2, {
            errCode: 3,
            errMessage: 'Booking not found'
          });
        case 4:
          if (!(booking.patientId !== Number(patientId))) {
            _context.n = 5;
            break;
          }
          return _context.a(2, {
            errCode: 4,
            errMessage: 'Booking does not belong to this patient'
          });
        case 5:
          if (!(booking.statusId !== COMPLETED_STATUS)) {
            _context.n = 6;
            break;
          }
          return _context.a(2, {
            errCode: 5,
            errMessage: 'Only completed appointments can be reviewed'
          });
        case 6:
          _context.n = 7;
          return _index["default"].Review.findOne({
            where: {
              bookingId: bookingId
            }
          });
        case 7:
          existing = _context.v;
          if (!existing) {
            _context.n = 8;
            break;
          }
          return _context.a(2, {
            errCode: 6,
            errMessage: 'This appointment has already been reviewed'
          });
        case 8:
          _context.n = 9;
          return _index["default"].Review.create({
            doctorId: booking.doctorId,
            patientId: booking.patientId,
            bookingId: bookingId,
            rating: ratingInt,
            comment: (comment || '').trim() || null
          });
        case 9:
          review = _context.v;
          return _context.a(2, {
            errCode: 0,
            errMessage: 'Review submitted',
            data: review
          });
      }
    }, _callee);
  }));
  return function createReview(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getReviewsByDoctor = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(doctorId) {
    var _ref4,
      _ref4$page,
      page,
      _ref4$limit,
      limit,
      p,
      l,
      _yield$db$Review$find,
      rows,
      count,
      aggregate,
      _args2 = arguments;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _ref4 = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {}, _ref4$page = _ref4.page, page = _ref4$page === void 0 ? 1 : _ref4$page, _ref4$limit = _ref4.limit, limit = _ref4$limit === void 0 ? 10 : _ref4$limit;
          if (doctorId) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, {
            errCode: 1,
            errMessage: 'Missing doctorId'
          });
        case 1:
          p = Math.max(1, parseInt(page, 10) || 1);
          l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
          _context2.n = 2;
          return _index["default"].Review.findAndCountAll({
            where: {
              doctorId: doctorId
            },
            include: [{
              model: _index["default"].User,
              as: 'patient',
              attributes: ['id', 'firstName', 'lastName', 'image']
            }],
            order: [['createdAt', 'DESC']],
            limit: l,
            offset: (p - 1) * l
          });
        case 2:
          _yield$db$Review$find = _context2.v;
          rows = _yield$db$Review$find.rows;
          count = _yield$db$Review$find.count;
          _context2.n = 3;
          return _index["default"].Review.findOne({
            where: {
              doctorId: doctorId
            },
            attributes: [[(0, _sequelize.fn)('AVG', (0, _sequelize.col)('rating')), 'averageRating'], [(0, _sequelize.fn)('COUNT', (0, _sequelize.col)('id')), 'reviewCount']],
            raw: true
          });
        case 3:
          aggregate = _context2.v;
          return _context2.a(2, {
            errCode: 0,
            total: count,
            page: p,
            totalPages: Math.max(1, Math.ceil(count / l)),
            averageRating: aggregate !== null && aggregate !== void 0 && aggregate.averageRating ? Number(aggregate.averageRating) : 0,
            reviewCount: aggregate !== null && aggregate !== void 0 && aggregate.reviewCount ? Number(aggregate.reviewCount) : 0,
            data: rows
          });
      }
    }, _callee2);
  }));
  return function getReviewsByDoctor(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var getReviewByBooking = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(bookingId) {
    var review;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (bookingId) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, {
            errCode: 1,
            errMessage: 'Missing bookingId'
          });
        case 1:
          _context3.n = 2;
          return _index["default"].Review.findOne({
            where: {
              bookingId: bookingId
            }
          });
        case 2:
          review = _context3.v;
          return _context3.a(2, {
            errCode: 0,
            data: review
          });
      }
    }, _callee3);
  }));
  return function getReviewByBooking(_x3) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteReview = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(id, requesterId) {
    var review;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (!(!id || !requesterId)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, {
            errCode: 1,
            errMessage: 'Missing parameters'
          });
        case 1:
          _context4.n = 2;
          return _index["default"].Review.findByPk(id);
        case 2:
          review = _context4.v;
          if (review) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, {
            errCode: 2,
            errMessage: 'Review not found'
          });
        case 3:
          if (!(review.patientId !== Number(requesterId))) {
            _context4.n = 4;
            break;
          }
          return _context4.a(2, {
            errCode: 3,
            errMessage: 'You may only delete your own review'
          });
        case 4:
          _context4.n = 5;
          return review.destroy();
        case 5:
          return _context4.a(2, {
            errCode: 0,
            errMessage: 'Deleted'
          });
      }
    }, _callee4);
  }));
  return function deleteReview(_x4, _x5) {
    return _ref6.apply(this, arguments);
  };
}();
module.exports = {
  createReview: createReview,
  getReviewsByDoctor: getReviewsByDoctor,
  getReviewByBooking: getReviewByBooking,
  deleteReview: deleteReview
};