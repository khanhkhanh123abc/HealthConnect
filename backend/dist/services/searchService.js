"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _index = _interopRequireDefault(require("../models/index"));
var _sequelize = require("sequelize");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var MAX_QUERY_LEN = 100;
var MAX_LIMIT = 50;
var DEFAULT_LIMIT = 10;
var MIN_KEYWORD_MATCH_LEN = 3;

// Escape SQL LIKE wildcards (% _ \) so user input cannot break out of LIKE pattern.
var escapeLike = function escapeLike(str) {
  return String(str || '').replace(/[\\%_]/g, function (m) {
    return "\\".concat(m);
  });
};
var sanitizeQuery = function sanitizeQuery(raw) {
  return String(raw || '').trim().slice(0, MAX_QUERY_LEN);
};

// Find specialty IDs that have a SymptomKeyword whose value is contained in the
// (lowercased) user query. Requires the keyword to be at least 3 chars long
// to avoid noisy matches like "ho" matching "cough".
var findSpecialtyIdsBySymptom = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(queryLower) {
    var rows, ids, _iterator, _step, row, kw, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (queryLower) {
            _context.n = 1;
            break;
          }
          return _context.a(2, []);
        case 1:
          _context.n = 2;
          return _index["default"].SymptomKeyword.findAll({
            attributes: ['specialtyId', 'keyword'],
            raw: true
          });
        case 2:
          rows = _context.v;
          ids = new Set();
          _iterator = _createForOfIteratorHelper(rows);
          _context.p = 3;
          _iterator.s();
        case 4:
          if ((_step = _iterator.n()).done) {
            _context.n = 7;
            break;
          }
          row = _step.value;
          kw = (row.keyword || '').trim().toLowerCase();
          if (!(kw.length < MIN_KEYWORD_MATCH_LEN)) {
            _context.n = 5;
            break;
          }
          return _context.a(3, 6);
        case 5:
          if (queryLower.includes(kw)) ids.add(row.specialtyId);
        case 6:
          _context.n = 4;
          break;
        case 7:
          _context.n = 9;
          break;
        case 8:
          _context.p = 8;
          _t = _context.v;
          _iterator.e(_t);
        case 9:
          _context.p = 9;
          _iterator.f();
          return _context.f(9);
        case 10:
          return _context.a(2, _toConsumableArray(ids));
      }
    }, _callee, null, [[3, 8, 9, 10]]);
  }));
  return function findSpecialtyIdsBySymptom(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Build a Sequelize WHERE for a doctor name LIKE match.
// Matches firstName, lastName, "lastName firstName", "firstName lastName"
// case-insensitively.
var buildDoctorNameWhere = function buildDoctorNameWhere(rawQuery) {
  var q = sanitizeQuery(rawQuery).toLowerCase();
  var like = "%".concat(escapeLike(q), "%");
  return _defineProperty({}, _sequelize.Op.or, [(0, _sequelize.where)((0, _sequelize.fn)('LOWER', (0, _sequelize.col)('User.firstName')), _defineProperty({}, _sequelize.Op.like, like)), (0, _sequelize.where)((0, _sequelize.fn)('LOWER', (0, _sequelize.col)('User.lastName')), _defineProperty({}, _sequelize.Op.like, like)), (0, _sequelize.where)((0, _sequelize.fn)('LOWER', (0, _sequelize.fn)('CONCAT', (0, _sequelize.col)('User.lastName'), ' ', (0, _sequelize.col)('User.firstName'))), _defineProperty({}, _sequelize.Op.like, like)), (0, _sequelize.where)((0, _sequelize.fn)('LOWER', (0, _sequelize.fn)('CONCAT', (0, _sequelize.col)('User.firstName'), ' ', (0, _sequelize.col)('User.lastName'))), _defineProperty({}, _sequelize.Op.like, like))]);
};

// Build a Sequelize WHERE for specialty by name (case-insensitive English match).
var buildSpecialtyNameWhere = function buildSpecialtyNameWhere(rawQuery) {
  var q = sanitizeQuery(rawQuery).toLowerCase();
  var like = "%".concat(escapeLike(q), "%");
  return (0, _sequelize.where)((0, _sequelize.fn)('LOWER', (0, _sequelize.col)('name')), _defineProperty({}, _sequelize.Op.like, like));
};

// Annotate plain doctor rows with specialty/clinic/price/rating.
// Avoids N+1 by batch-fetching markdown + ratings then merging in memory.
var enrichDoctors = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(doctorRows) {
    var doctorIds, markdowns, markdownByDoctor, _iterator2, _step2, m, specialtyIds, clinicIds, _yield$Promise$all, _yield$Promise$all2, specialties, clinics, doctorInfos, ratings, specById, clinicById, infoByDoctor, ratingByDoctor;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (doctorRows.length) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, []);
        case 1:
          doctorIds = doctorRows.map(function (d) {
            return d.id;
          }); // markdown gives doctor → specialty + clinic mapping (project convention).
          _context2.n = 2;
          return _index["default"].Markdown.findAll({
            where: {
              doctorId: _defineProperty({}, _sequelize.Op["in"], doctorIds)
            },
            attributes: ['doctorId', 'specialtyId', 'clinicId'],
            raw: true
          });
        case 2:
          markdowns = _context2.v;
          markdownByDoctor = {};
          _iterator2 = _createForOfIteratorHelper(markdowns);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              m = _step2.value;
              markdownByDoctor[m.doctorId] = m;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          specialtyIds = _toConsumableArray(new Set(markdowns.map(function (m) {
            return m.specialtyId;
          }).filter(Boolean)));
          clinicIds = _toConsumableArray(new Set(markdowns.map(function (m) {
            return m.clinicId;
          }).filter(Boolean)));
          _context2.n = 3;
          return Promise.all([specialtyIds.length ? _index["default"].Specialty.findAll({
            where: {
              id: _defineProperty({}, _sequelize.Op["in"], specialtyIds)
            },
            attributes: ['id', 'name'],
            raw: true
          }) : [], clinicIds.length ? _index["default"].Clinic.findAll({
            where: {
              id: _defineProperty({}, _sequelize.Op["in"], clinicIds)
            },
            attributes: ['id', 'name'],
            raw: true
          }) : [], _index["default"].Doctor_Info.findAll({
            where: {
              doctorId: _defineProperty({}, _sequelize.Op["in"], doctorIds)
            },
            attributes: ['doctorId', 'priceId'],
            include: [{
              model: _index["default"].allCode,
              as: 'priceData',
              attributes: ['value', 'keyMap']
            }],
            raw: true,
            nest: true
          }), _index["default"].Review.findAll({
            where: {
              doctorId: _defineProperty({}, _sequelize.Op["in"], doctorIds)
            },
            attributes: ['doctorId', [(0, _sequelize.fn)('AVG', (0, _sequelize.col)('rating')), 'averageRating'], [(0, _sequelize.fn)('COUNT', (0, _sequelize.col)('id')), 'reviewCount']],
            group: ['doctorId'],
            raw: true
          })]);
        case 3:
          _yield$Promise$all = _context2.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 4);
          specialties = _yield$Promise$all2[0];
          clinics = _yield$Promise$all2[1];
          doctorInfos = _yield$Promise$all2[2];
          ratings = _yield$Promise$all2[3];
          specById = Object.fromEntries(specialties.map(function (s) {
            return [s.id, s];
          }));
          clinicById = Object.fromEntries(clinics.map(function (c) {
            return [c.id, c];
          }));
          infoByDoctor = Object.fromEntries(doctorInfos.map(function (i) {
            return [i.doctorId, i];
          }));
          ratingByDoctor = Object.fromEntries(ratings.map(function (r) {
            return [r.doctorId, r];
          }));
          return _context2.a(2, doctorRows.map(function (d) {
            var _d$positionData, _info$priceData;
            var md = markdownByDoctor[d.id] || {};
            var spec = specById[md.specialtyId];
            var clinic = clinicById[md.clinicId];
            var info = infoByDoctor[d.id];
            var rating = ratingByDoctor[d.id];
            return {
              id: d.id,
              firstName: d.firstName || '',
              lastName: d.lastName || '',
              name: "".concat(d.lastName || '', " ").concat(d.firstName || '').trim(),
              image: d.image || '',
              position: ((_d$positionData = d.positionData) === null || _d$positionData === void 0 ? void 0 : _d$positionData.value) || '',
              gender: d.gender,
              specialtyId: md.specialtyId || null,
              specialtyName: (spec === null || spec === void 0 ? void 0 : spec.name) || '',
              clinicId: md.clinicId || null,
              clinicName: (clinic === null || clinic === void 0 ? void 0 : clinic.name) || '',
              priceId: (info === null || info === void 0 ? void 0 : info.priceId) || null,
              price: (info === null || info === void 0 || (_info$priceData = info.priceData) === null || _info$priceData === void 0 ? void 0 : _info$priceData.value) || '',
              averageRating: rating ? Number(rating.averageRating) : 0,
              reviewCount: rating ? Number(rating.reviewCount) : 0
            };
          }));
      }
    }, _callee2);
  }));
  return function enrichDoctors(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

// Apply numeric / categorical filters in JS after we already enriched rows.
// Most filters are too cross-table to push into the SQL WHERE cleanly given
// the markdown + doctor_info layout, so we filter in memory after enrichment.
var applyDoctorFilters = function applyDoctorFilters(doctors, filters) {
  var out = doctors;
  if (filters.specialtyId) {
    var ids = Array.isArray(filters.specialtyId) ? filters.specialtyId : [filters.specialtyId];
    var idSet = new Set(ids.map(Number));
    out = out.filter(function (d) {
      return d.specialtyId && idSet.has(d.specialtyId);
    });
  }
  if (filters.clinicId) {
    var _ids = Array.isArray(filters.clinicId) ? filters.clinicId : [filters.clinicId];
    var _idSet = new Set(_ids.map(Number));
    out = out.filter(function (d) {
      return d.clinicId && _idSet.has(d.clinicId);
    });
  }
  if (filters.gender) {
    out = out.filter(function (d) {
      return String(d.gender) === String(filters.gender);
    });
  }
  if (filters.minRating != null) {
    var minR = Number(filters.minRating);
    if (!Number.isNaN(minR)) out = out.filter(function (d) {
      return d.averageRating >= minR;
    });
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    var minP = filters.minPrice != null ? Number(filters.minPrice) : null;
    var maxP = filters.maxPrice != null ? Number(filters.maxPrice) : null;
    out = out.filter(function (d) {
      var p = parseFloat(d.price);
      if (Number.isNaN(p)) return minP == null && maxP == null;
      if (minP != null && p < minP) return false;
      if (maxP != null && p > maxP) return false;
      return true;
    });
  }
  return out;
};
var sortDoctorsDefault = function sortDoctorsDefault(doctors) {
  return _toConsumableArray(doctors).sort(function (a, b) {
    if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
    return b.reviewCount - a.reviewCount;
  });
};

// Public: dropdown-style search returning up to 5 doctors and 5 specialties.
var quickSearch = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(rawQuery) {
    var query, queryLower, _yield$Promise$all3, _yield$Promise$all4, doctorRows, specByName, symptomSpecialtyIds, bySymptom, specMap, _i, _arr, s, specialties, enrichedDoctors;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          query = sanitizeQuery(rawQuery);
          if (!(!query || query.length < 2)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, {
            errCode: 0,
            doctors: [],
            specialties: []
          });
        case 1:
          queryLower = query.toLowerCase();
          _context3.n = 2;
          return Promise.all([_index["default"].User.findAll({
            where: _defineProperty({}, _sequelize.Op.and, [{
              roleId: 'R2'
            }, buildDoctorNameWhere(query)]),
            attributes: ['id', 'firstName', 'lastName', 'image', 'gender', 'positionId'],
            include: [{
              model: _index["default"].allCode,
              as: 'positionData',
              attributes: ['value']
            }],
            limit: 5,
            raw: true,
            nest: true
          }), _index["default"].Specialty.findAll({
            where: buildSpecialtyNameWhere(query),
            attributes: ['id', 'name', 'image'],
            limit: 5,
            raw: true
          }), findSpecialtyIdsBySymptom(queryLower)]);
        case 2:
          _yield$Promise$all3 = _context3.v;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 3);
          doctorRows = _yield$Promise$all4[0];
          specByName = _yield$Promise$all4[1];
          symptomSpecialtyIds = _yield$Promise$all4[2];
          bySymptom = [];
          if (!symptomSpecialtyIds.length) {
            _context3.n = 4;
            break;
          }
          _context3.n = 3;
          return _index["default"].Specialty.findAll({
            where: {
              id: _defineProperty({}, _sequelize.Op["in"], symptomSpecialtyIds)
            },
            attributes: ['id', 'name', 'image'],
            raw: true
          });
        case 3:
          bySymptom = _context3.v;
        case 4:
          specMap = new Map();
          for (_i = 0, _arr = [].concat(_toConsumableArray(specByName), _toConsumableArray(bySymptom)); _i < _arr.length; _i++) {
            s = _arr[_i];
            specMap.set(s.id, s);
          }
          specialties = _toConsumableArray(specMap.values()).slice(0, 5);
          _context3.n = 5;
          return enrichDoctors(doctorRows);
        case 5:
          enrichedDoctors = _context3.v;
          return _context3.a(2, {
            errCode: 0,
            doctors: enrichedDoctors.map(function (d) {
              return {
                id: d.id,
                name: d.name,
                image: d.image,
                position: d.position,
                specialtyName: d.specialtyName
              };
            }),
            specialties: specialties.map(function (s) {
              return {
                id: s.id,
                name: s.name,
                image: s.image
              };
            })
          });
      }
    }, _callee3);
  }));
  return function quickSearch(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

// Public: full search-results query with filters, pagination, and result type.
var search = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(params) {
    var rawQuery, type, page, limit, offset, filters, queryLower, symptomSpecialtyIds, doctors, specialties, doctorWhere, doctorRows, enriched, specMatchedDoctorRows, extraIds, extraRows, extraEnriched, where, ids, total, totalPages, pagedDoctors, pagedSpecialties, merged, slice, _t2;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          rawQuery = sanitizeQuery(params.q);
          type = ['all', 'doctors', 'specialties'].includes(params.type) ? params.type : 'all';
          page = Math.max(1, parseInt(params.page, 10) || 1);
          limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(params.limit, 10) || DEFAULT_LIMIT));
          offset = (page - 1) * limit;
          filters = {
            specialtyId: params.specialtyId,
            clinicId: params.clinicId,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            minRating: params.minRating,
            gender: params.gender
          };
          queryLower = rawQuery.toLowerCase();
          if (!rawQuery) {
            _context4.n = 2;
            break;
          }
          _context4.n = 1;
          return findSpecialtyIdsBySymptom(queryLower);
        case 1:
          _t2 = _context4.v;
          _context4.n = 3;
          break;
        case 2:
          _t2 = [];
        case 3:
          symptomSpecialtyIds = _t2;
          doctors = [];
          specialties = []; // ---- Doctors branch ------------------------------------------------
          if (!(type === 'all' || type === 'doctors')) {
            _context4.n = 10;
            break;
          }
          doctorWhere = {
            roleId: 'R2'
          };
          if (rawQuery) {
            doctorWhere[_sequelize.Op.and] = [buildDoctorNameWhere(rawQuery)];
          }
          _context4.n = 4;
          return _index["default"].User.findAll({
            where: doctorWhere,
            attributes: ['id', 'firstName', 'lastName', 'image', 'gender', 'positionId'],
            include: [{
              model: _index["default"].allCode,
              as: 'positionData',
              attributes: ['value']
            }],
            raw: true,
            nest: true
          });
        case 4:
          doctorRows = _context4.v;
          _context4.n = 5;
          return enrichDoctors(doctorRows);
        case 5:
          enriched = _context4.v;
          if (!(rawQuery && symptomSpecialtyIds.length)) {
            _context4.n = 9;
            break;
          }
          _context4.n = 6;
          return _index["default"].Markdown.findAll({
            where: {
              specialtyId: _defineProperty({}, _sequelize.Op["in"], symptomSpecialtyIds)
            },
            attributes: ['doctorId'],
            raw: true
          });
        case 6:
          specMatchedDoctorRows = _context4.v;
          extraIds = _toConsumableArray(new Set(specMatchedDoctorRows.map(function (m) {
            return m.doctorId;
          }))).filter(function (id) {
            return !enriched.some(function (d) {
              return d.id === id;
            });
          });
          if (!extraIds.length) {
            _context4.n = 9;
            break;
          }
          _context4.n = 7;
          return _index["default"].User.findAll({
            where: {
              id: _defineProperty({}, _sequelize.Op["in"], extraIds),
              roleId: 'R2'
            },
            attributes: ['id', 'firstName', 'lastName', 'image', 'gender', 'positionId'],
            include: [{
              model: _index["default"].allCode,
              as: 'positionData',
              attributes: ['value']
            }],
            raw: true,
            nest: true
          });
        case 7:
          extraRows = _context4.v;
          _context4.n = 8;
          return enrichDoctors(extraRows);
        case 8:
          extraEnriched = _context4.v;
          enriched = [].concat(_toConsumableArray(enriched), _toConsumableArray(extraEnriched));
        case 9:
          enriched = applyDoctorFilters(enriched, filters);
          enriched = sortDoctorsDefault(enriched);
          doctors = enriched;
        case 10:
          if (!(type === 'all' || type === 'specialties')) {
            _context4.n = 12;
            break;
          }
          where = rawQuery ? _defineProperty({}, _sequelize.Op.or, [buildSpecialtyNameWhere(rawQuery), symptomSpecialtyIds.length ? {
            id: _defineProperty({}, _sequelize.Op["in"], symptomSpecialtyIds)
          } : {
            id: -1
          }]) : {};
          if (filters.specialtyId) {
            ids = (Array.isArray(filters.specialtyId) ? filters.specialtyId : [filters.specialtyId]).map(Number);
            where.id = _defineProperty({}, _sequelize.Op["in"], ids);
          }
          _context4.n = 11;
          return _index["default"].Specialty.findAll({
            where: where,
            attributes: ['id', 'name', 'image'],
            raw: true
          });
        case 11:
          specialties = _context4.v;
        case 12:
          // ---- Pagination ---------------------------------------------------
          total = type === 'doctors' ? doctors.length : type === 'specialties' ? specialties.length : doctors.length + specialties.length;
          totalPages = Math.max(1, Math.ceil(total / limit));
          pagedDoctors = doctors;
          pagedSpecialties = specialties;
          if (type === 'doctors') {
            pagedDoctors = doctors.slice(offset, offset + limit);
            pagedSpecialties = [];
          } else if (type === 'specialties') {
            pagedSpecialties = specialties.slice(offset, offset + limit);
            pagedDoctors = [];
          } else {
            // all: paginate the merged stream — specialties first, then doctors.
            merged = [].concat(_toConsumableArray(specialties.map(function (s) {
              return {
                kind: 'specialty',
                data: s
              };
            })), _toConsumableArray(doctors.map(function (d) {
              return {
                kind: 'doctor',
                data: d
              };
            })));
            slice = merged.slice(offset, offset + limit);
            pagedSpecialties = slice.filter(function (x) {
              return x.kind === 'specialty';
            }).map(function (x) {
              return x.data;
            });
            pagedDoctors = slice.filter(function (x) {
              return x.kind === 'doctor';
            }).map(function (x) {
              return x.data;
            });
          }
          return _context4.a(2, {
            errCode: 0,
            total: total,
            page: page,
            totalPages: totalPages,
            limit: limit,
            doctors: pagedDoctors,
            specialties: pagedSpecialties
          });
      }
    }, _callee4);
  }));
  return function search(_x4) {
    return _ref5.apply(this, arguments);
  };
}();
module.exports = {
  quickSearch: quickSearch,
  search: search
};