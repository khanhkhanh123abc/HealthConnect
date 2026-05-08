"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _index = _interopRequireDefault(require("../models/index"));
var _sequelize = require("sequelize");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var BookingModel = function BookingModel() {
  return _index["default"].Booking || _index["default"].Bookings;
};

// Fill in missing days with count 0
var fillDays = function fillDays(data, days) {
  var map = {};
  data.forEach(function (r) {
    map[r.date] = parseInt(r.count, 10);
  });
  var result = [];
  for (var i = days - 1; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var key = d.toISOString().split('T')[0];
    result.push({
      date: key,
      count: map[key] || 0
    });
  }
  return result;
};
var getAdminStats = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var now, startOfMonth, endOfMonth, thirtyDaysAgo, BM, _yield$Promise$all, _yield$Promise$all2, revenueResult, totalDoctors, totalPatients, newDoctorsMonth, newPatientsMonth, bookingsByStatus, bookingTrendRaw, allBookings, allMarkdowns, allSpecialties, doctorToSpecialty, specialtyIdToName, specialtyCounts, specialtyDist, statusMap, totalBookings;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          now = new Date();
          startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(now.getDate() - 29);
          thirtyDaysAgo.setHours(0, 0, 0, 0);
          BM = BookingModel();
          _context.n = 1;
          return Promise.all([BM.findOne({
            attributes: [[_index["default"].sequelize.fn('SUM', _index["default"].sequelize.col('price')), 'total']],
            where: {
              statusId: 'S3'
            },
            raw: true
          }), _index["default"].User.count({
            where: {
              roleId: 'R2'
            }
          }), _index["default"].User.count({
            where: {
              roleId: 'R3'
            }
          }), _index["default"].User.count({
            where: {
              roleId: 'R2',
              createdAt: _defineProperty({}, _sequelize.Op.between, [startOfMonth, endOfMonth])
            }
          }), _index["default"].User.count({
            where: {
              roleId: 'R3',
              createdAt: _defineProperty({}, _sequelize.Op.between, [startOfMonth, endOfMonth])
            }
          }), BM.findAll({
            attributes: ['statusId', [_index["default"].sequelize.fn('COUNT', _index["default"].sequelize.col('id')), 'count']],
            group: ['statusId'],
            raw: true
          }), BM.findAll({
            attributes: [[_index["default"].sequelize.fn('DATE', _index["default"].sequelize.col('createdAt')), 'date'], [_index["default"].sequelize.fn('COUNT', _index["default"].sequelize.col('id')), 'count']],
            where: {
              createdAt: _defineProperty({}, _sequelize.Op.gte, thirtyDaysAgo)
            },
            group: [_index["default"].sequelize.fn('DATE', _index["default"].sequelize.col('createdAt'))],
            order: [[_index["default"].sequelize.fn('DATE', _index["default"].sequelize.col('createdAt')), 'ASC']],
            raw: true
          }), BM.findAll({
            attributes: ['doctorId'],
            where: {
              statusId: _defineProperty({}, _sequelize.Op.ne, 'S4')
            },
            raw: true
          }), _index["default"].Markdown.findAll({
            attributes: ['doctorId', 'specialtyId'],
            where: {
              specialtyId: _defineProperty({}, _sequelize.Op.ne, null)
            },
            raw: true
          }), _index["default"].Specialty.findAll({
            attributes: ['id', 'name'],
            raw: true
          })]);
        case 1:
          _yield$Promise$all = _context.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 10);
          revenueResult = _yield$Promise$all2[0];
          totalDoctors = _yield$Promise$all2[1];
          totalPatients = _yield$Promise$all2[2];
          newDoctorsMonth = _yield$Promise$all2[3];
          newPatientsMonth = _yield$Promise$all2[4];
          bookingsByStatus = _yield$Promise$all2[5];
          bookingTrendRaw = _yield$Promise$all2[6];
          allBookings = _yield$Promise$all2[7];
          allMarkdowns = _yield$Promise$all2[8];
          allSpecialties = _yield$Promise$all2[9];
          // Build specialty distribution in JS
          doctorToSpecialty = {};
          allMarkdowns.forEach(function (m) {
            doctorToSpecialty[m.doctorId] = m.specialtyId;
          });
          specialtyIdToName = {};
          allSpecialties.forEach(function (s) {
            specialtyIdToName[s.id] = s.name;
          });
          specialtyCounts = {};
          allBookings.forEach(function (b) {
            var specId = doctorToSpecialty[b.doctorId];
            if (specId) {
              var name = specialtyIdToName[specId] || "Khoa ".concat(specId);
              specialtyCounts[name] = (specialtyCounts[name] || 0) + 1;
            }
          });
          specialtyDist = Object.entries(specialtyCounts).map(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
              name = _ref3[0],
              value = _ref3[1];
            return {
              name: name,
              value: value
            };
          }).sort(function (a, b) {
            return b.value - a.value;
          }).slice(0, 8); // Status map
          statusMap = {
            S1: 0,
            S2: 0,
            S3: 0,
            S4: 0
          };
          bookingsByStatus.forEach(function (r) {
            statusMap[r.statusId] = parseInt(r.count, 10);
          });
          totalBookings = Object.values(statusMap).reduce(function (a, b) {
            return a + b;
          }, 0);
          return _context.a(2, {
            errCode: 0,
            data: {
              kpis: {
                totalRevenue: parseInt((revenueResult === null || revenueResult === void 0 ? void 0 : revenueResult.total) || 0, 10),
                totalDoctors: totalDoctors,
                totalPatients: totalPatients,
                newDoctorsMonth: newDoctorsMonth,
                newPatientsMonth: newPatientsMonth,
                totalBookings: totalBookings,
                completedBookings: statusMap.S3,
                cancelledBookings: statusMap.S4
              },
              bookingTrend: fillDays(bookingTrendRaw, 30),
              statusDist: [{
                name: 'Chờ xác nhận',
                value: statusMap.S1,
                color: '#F59E0B'
              }, {
                name: 'Đã xác nhận',
                value: statusMap.S2,
                color: '#3B82F6'
              }, {
                name: 'Hoàn thành',
                value: statusMap.S3,
                color: '#10B981'
              }, {
                name: 'Đã hủy',
                value: statusMap.S4,
                color: '#EF4444'
              }],
              specialtyDist: specialtyDist
            }
          });
      }
    }, _callee);
  }));
  return function getAdminStats() {
    return _ref.apply(this, arguments);
  };
}();
var getDoctorStats = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(doctorId) {
    var BM, now, startOfToday, endOfToday, sevenDaysAgo, _yield$Promise$all3, _yield$Promise$all4, revenueResult, totalCompleted, pendingCount, todayBookingsRaw, weekTrendRaw, statusBreakdown, patientIds, patients, patientMap, todayBookings, statusMap;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (doctorId) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, {
            errCode: 1,
            errMessage: 'Missing doctorId'
          });
        case 1:
          BM = BookingModel();
          now = new Date();
          startOfToday = new Date(now);
          startOfToday.setHours(0, 0, 0, 0);
          endOfToday = new Date(now);
          endOfToday.setHours(23, 59, 59, 999);
          sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 6);
          sevenDaysAgo.setHours(0, 0, 0, 0);
          _context2.n = 2;
          return Promise.all([BM.findOne({
            attributes: [[_index["default"].sequelize.fn('SUM', _index["default"].sequelize.col('price')), 'total']],
            where: {
              doctorId: doctorId,
              statusId: 'S3'
            },
            raw: true
          }), BM.count({
            where: {
              doctorId: doctorId,
              statusId: 'S3'
            }
          }), BM.count({
            where: {
              doctorId: doctorId,
              statusId: 'S1'
            }
          }), BM.findAll({
            where: {
              doctorId: doctorId,
              date: _defineProperty({}, _sequelize.Op.between, [startOfToday, endOfToday]),
              statusId: _defineProperty({}, _sequelize.Op["in"], ['S1', 'S2', 'S3'])
            },
            include: [{
              model: _index["default"].allCode,
              as: 'timeTypeDataBooking',
              attributes: ['value']
            }],
            order: [['timeType', 'ASC']]
          }), BM.findAll({
            attributes: [[_index["default"].sequelize.fn('DATE', _index["default"].sequelize.col('createdAt')), 'date'], [_index["default"].sequelize.fn('COUNT', _index["default"].sequelize.col('id')), 'count']],
            where: {
              doctorId: doctorId,
              createdAt: _defineProperty({}, _sequelize.Op.gte, sevenDaysAgo)
            },
            group: [_index["default"].sequelize.fn('DATE', _index["default"].sequelize.col('createdAt'))],
            order: [[_index["default"].sequelize.fn('DATE', _index["default"].sequelize.col('createdAt')), 'ASC']],
            raw: true
          }), BM.findAll({
            attributes: ['statusId', [_index["default"].sequelize.fn('COUNT', _index["default"].sequelize.col('id')), 'count']],
            where: {
              doctorId: doctorId
            },
            group: ['statusId'],
            raw: true
          })]);
        case 2:
          _yield$Promise$all3 = _context2.v;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 6);
          revenueResult = _yield$Promise$all4[0];
          totalCompleted = _yield$Promise$all4[1];
          pendingCount = _yield$Promise$all4[2];
          todayBookingsRaw = _yield$Promise$all4[3];
          weekTrendRaw = _yield$Promise$all4[4];
          statusBreakdown = _yield$Promise$all4[5];
          // Fetch patient info for today's bookings
          patientIds = _toConsumableArray(new Set(todayBookingsRaw.map(function (b) {
            return b.patientId;
          })));
          _context2.n = 3;
          return _index["default"].User.findAll({
            where: {
              id: _defineProperty({}, _sequelize.Op["in"], patientIds)
            },
            attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'image'],
            raw: true
          });
        case 3:
          patients = _context2.v;
          patientMap = {};
          patients.forEach(function (p) {
            patientMap[p.id] = p;
          });
          todayBookings = todayBookingsRaw.map(function (b) {
            var _b$timeTypeDataBookin, _patientMap$b$patient, _patientMap$b$patient2;
            return {
              id: b.id,
              patientId: b.patientId,
              statusId: b.statusId,
              timeValue: ((_b$timeTypeDataBookin = b.timeTypeDataBooking) === null || _b$timeTypeDataBookin === void 0 ? void 0 : _b$timeTypeDataBookin.value) || b.timeType,
              reason: b.reason,
              paymentMethod: b.paymentMethod,
              patientName: patientMap[b.patientId] ? "".concat(patientMap[b.patientId].lastName, " ").concat(patientMap[b.patientId].firstName) : 'Bệnh nhân',
              patientPhone: ((_patientMap$b$patient = patientMap[b.patientId]) === null || _patientMap$b$patient === void 0 ? void 0 : _patientMap$b$patient.phoneNumber) || '',
              patientImage: ((_patientMap$b$patient2 = patientMap[b.patientId]) === null || _patientMap$b$patient2 === void 0 ? void 0 : _patientMap$b$patient2.image) || ''
            };
          });
          statusMap = {
            S1: 0,
            S2: 0,
            S3: 0,
            S4: 0
          };
          statusBreakdown.forEach(function (r) {
            statusMap[r.statusId] = parseInt(r.count, 10);
          });
          return _context2.a(2, {
            errCode: 0,
            data: {
              kpis: {
                totalCompleted: totalCompleted,
                totalRevenue: parseInt((revenueResult === null || revenueResult === void 0 ? void 0 : revenueResult.total) || 0, 10),
                pendingCount: pendingCount,
                todayCount: todayBookings.length
              },
              todayBookings: todayBookings,
              weekTrend: fillDays(weekTrendRaw, 7),
              statusDist: [{
                name: 'Chờ xác nhận',
                value: statusMap.S1,
                color: '#F59E0B'
              }, {
                name: 'Đã xác nhận',
                value: statusMap.S2,
                color: '#3B82F6'
              }, {
                name: 'Hoàn thành',
                value: statusMap.S3,
                color: '#10B981'
              }, {
                name: 'Đã hủy',
                value: statusMap.S4,
                color: '#EF4444'
              }]
            }
          });
      }
    }, _callee2);
  }));
  return function getDoctorStats(_x) {
    return _ref4.apply(this, arguments);
  };
}();
module.exports = {
  getAdminStats: getAdminStats,
  getDoctorStats: getDoctorStats
};