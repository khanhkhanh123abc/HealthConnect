"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _index = _interopRequireDefault(require("../models/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var createClinic = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(!data.name || !data.address || !data.image || !data.descriptionHTML || !data.descriptionMarkdown)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, {
            errCode: 1,
            errMessage: 'Missing required parameters!'
          });
        case 1:
          _context.n = 2;
          return _index["default"].Clinic.create({
            name: data.name,
            address: data.address,
            image: data.image,
            descriptionHTML: data.descriptionHTML,
            descriptionMarkdown: data.descriptionMarkdown
          });
        case 2:
          return _context.a(2, {
            errCode: 0,
            errMessage: 'Save clinic succeed!'
          });
      }
    }, _callee);
  }));
  return function createClinic(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getAllClinics = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var data;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return _index["default"].Clinic.findAll({
            attributes: ['id', 'name', 'address', 'image']
          });
        case 1:
          data = _context2.v;
          return _context2.a(2, {
            errCode: 0,
            data: data
          });
      }
    }, _callee2);
  }));
  return function getAllClinics() {
    return _ref2.apply(this, arguments);
  };
}();
var getClinicById = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(id) {
    var data;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (id) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, {
            errCode: 1,
            errMessage: 'Missing id'
          });
        case 1:
          _context3.n = 2;
          return _index["default"].Clinic.findOne({
            where: {
              id: id
            }
          });
        case 2:
          data = _context3.v;
          return _context3.a(2, {
            errCode: 0,
            data: data || {}
          });
      }
    }, _callee3);
  }));
  return function getClinicById(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var updateClinic = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(data) {
    var clinic;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (data.id) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, {
            errCode: 1,
            errMessage: 'Missing id'
          });
        case 1:
          _context4.n = 2;
          return _index["default"].Clinic.findOne({
            where: {
              id: data.id
            },
            raw: false
          });
        case 2:
          clinic = _context4.v;
          if (clinic) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, {
            errCode: 2,
            errMessage: 'Clinic not found'
          });
        case 3:
          if (data.name) clinic.name = data.name;
          if (data.address) clinic.address = data.address;
          if (data.image) clinic.image = data.image;
          if (data.descriptionHTML) clinic.descriptionHTML = data.descriptionHTML;
          if (data.descriptionMarkdown) clinic.descriptionMarkdown = data.descriptionMarkdown;
          _context4.n = 4;
          return clinic.save();
        case 4:
          return _context4.a(2, {
            errCode: 0,
            errMessage: 'Update clinic succeed!'
          });
      }
    }, _callee4);
  }));
  return function updateClinic(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
var deleteClinic = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(id) {
    var clinic, _yield$Promise$all, _yield$Promise$all2, markdownCount, dcsCount;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          if (id) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, {
            errCode: 1,
            errMessage: 'Missing id'
          });
        case 1:
          _context5.n = 2;
          return _index["default"].Clinic.findByPk(id);
        case 2:
          clinic = _context5.v;
          if (clinic) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, {
            errCode: 2,
            errMessage: 'Clinic not found'
          });
        case 3:
          _context5.n = 4;
          return Promise.all([_index["default"].Markdown.count({
            where: {
              clinicId: id
            }
          }), _index["default"].Doctor_Clinic_Specialty.count({
            where: {
              clinicId: id
            }
          })]);
        case 4:
          _yield$Promise$all = _context5.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          markdownCount = _yield$Promise$all2[0];
          dcsCount = _yield$Promise$all2[1];
          if (!(markdownCount > 0 || dcsCount > 0)) {
            _context5.n = 5;
            break;
          }
          return _context5.a(2, {
            errCode: 3,
            errMessage: "Clinic is in use by ".concat(markdownCount || dcsCount, " doctor(s). Detach the doctors first.")
          });
        case 5:
          _context5.n = 6;
          return clinic.destroy();
        case 6:
          return _context5.a(2, {
            errCode: 0,
            errMessage: 'Delete clinic succeed!'
          });
      }
    }, _callee5);
  }));
  return function deleteClinic(_x4) {
    return _ref5.apply(this, arguments);
  };
}();
var getDoctorsByClinic = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(clinicId) {
    var markdowns, doctorIds, descMap, specialtyMap, doctors, specialtyIds, specialties, specialtyNameMap, _t;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          if (clinicId) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, {
            errCode: 1,
            errMessage: 'Missing clinicId'
          });
        case 1:
          _context6.n = 2;
          return _index["default"].Markdown.findAll({
            where: {
              clinicId: clinicId
            },
            attributes: ['doctorId', 'specialtyId', 'description'],
            raw: true
          });
        case 2:
          markdowns = _context6.v;
          if (markdowns.length) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, {
            errCode: 0,
            data: []
          });
        case 3:
          doctorIds = _toConsumableArray(new Set(markdowns.map(function (m) {
            return m.doctorId;
          }).filter(Boolean)));
          descMap = {};
          specialtyMap = {};
          markdowns.forEach(function (m) {
            if (m.doctorId) {
              descMap[m.doctorId] = m.description;
              specialtyMap[m.doctorId] = m.specialtyId;
            }
          });
          _context6.n = 4;
          return _index["default"].User.findAll({
            where: {
              id: doctorIds,
              roleId: 'R2'
            },
            attributes: ['id', 'firstName', 'lastName', 'image'],
            include: [{
              model: _index["default"].allCode,
              as: 'positionData',
              attributes: ['value']
            }],
            raw: true,
            nest: true
          });
        case 4:
          doctors = _context6.v;
          specialtyIds = _toConsumableArray(new Set(Object.values(specialtyMap).filter(Boolean)));
          if (!specialtyIds.length) {
            _context6.n = 6;
            break;
          }
          _context6.n = 5;
          return _index["default"].Specialty.findAll({
            where: {
              id: specialtyIds
            },
            attributes: ['id', 'name'],
            raw: true
          });
        case 5:
          _t = _context6.v;
          _context6.n = 7;
          break;
        case 6:
          _t = [];
        case 7:
          specialties = _t;
          specialtyNameMap = {};
          specialties.forEach(function (s) {
            specialtyNameMap[s.id] = s.name;
          });
          return _context6.a(2, {
            errCode: 0,
            data: doctors.map(function (doc) {
              return _objectSpread(_objectSpread({}, doc), {}, {
                description: descMap[doc.id] || '',
                specialtyId: specialtyMap[doc.id] || null,
                specialtyName: specialtyNameMap[specialtyMap[doc.id]] || ''
              });
            })
          });
      }
    }, _callee6);
  }));
  return function getDoctorsByClinic(_x5) {
    return _ref6.apply(this, arguments);
  };
}();
module.exports = {
  createClinic: createClinic,
  getAllClinics: getAllClinics,
  getClinicById: getClinicById,
  updateClinic: updateClinic,
  deleteClinic: deleteClinic,
  getDoctorsByClinic: getDoctorsByClinic
};