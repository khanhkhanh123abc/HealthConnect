"use strict";

var _index = _interopRequireDefault(require("../models/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
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
var createSpecialty = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(!data.name || !data.image || !data.descriptionHTML || !data.descriptionMarkdown)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, {
            errCode: 1,
            errMessage: 'Missing required parameters!'
          });
        case 1:
          _context.n = 2;
          return _index["default"].Specialty.create({
            name: data.name,
            image: data.image,
            descriptionHTML: data.descriptionHTML,
            descriptionMarkdown: data.descriptionMarkdown
          });
        case 2:
          return _context.a(2, {
            errCode: 0,
            errMessage: 'Save specialty succeed!'
          });
      }
    }, _callee);
  }));
  return function createSpecialty(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getAllSpecialty = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var data;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return _index["default"].Specialty.findAll({
            attributes: ['id', 'name', 'image', 'descriptionHTML', 'descriptionMarkdown']
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
  return function getAllSpecialty() {
    return _ref2.apply(this, arguments);
  };
}();
var updateSpecialty = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data) {
    var specialty;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (data.id) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, {
            errCode: 1,
            errMessage: 'Missing id'
          });
        case 1:
          _context3.n = 2;
          return _index["default"].Specialty.findOne({
            where: {
              id: data.id
            },
            raw: false
          });
        case 2:
          specialty = _context3.v;
          if (specialty) {
            _context3.n = 3;
            break;
          }
          return _context3.a(2, {
            errCode: 2,
            errMessage: 'Specialty not found'
          });
        case 3:
          if (data.name) specialty.name = data.name;
          if (data.image) specialty.image = data.image;
          if (data.descriptionHTML) specialty.descriptionHTML = data.descriptionHTML;
          if (data.descriptionMarkdown) specialty.descriptionMarkdown = data.descriptionMarkdown;
          _context3.n = 4;
          return specialty.save();
        case 4:
          return _context3.a(2, {
            errCode: 0,
            errMessage: 'Update specialty succeed!'
          });
      }
    }, _callee3);
  }));
  return function updateSpecialty(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteSpecialty = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(id) {
    var specialty, _yield$Promise$all, _yield$Promise$all2, markdownCount, dcsCount;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (id) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, {
            errCode: 1,
            errMessage: 'Missing id'
          });
        case 1:
          _context4.n = 2;
          return _index["default"].Specialty.findByPk(id);
        case 2:
          specialty = _context4.v;
          if (specialty) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, {
            errCode: 2,
            errMessage: 'Specialty not found'
          });
        case 3:
          _context4.n = 4;
          return Promise.all([_index["default"].Markdown.count({
            where: {
              specialtyId: id
            }
          }), _index["default"].Doctor_Clinic_Specialty.count({
            where: {
              specialtyId: id
            }
          })]);
        case 4:
          _yield$Promise$all = _context4.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          markdownCount = _yield$Promise$all2[0];
          dcsCount = _yield$Promise$all2[1];
          if (!(markdownCount > 0 || dcsCount > 0)) {
            _context4.n = 5;
            break;
          }
          return _context4.a(2, {
            errCode: 3,
            errMessage: "Specialty is in use by ".concat(markdownCount || dcsCount, " doctor(s). Detach the doctors first.")
          });
        case 5:
          _context4.n = 6;
          return specialty.destroy();
        case 6:
          return _context4.a(2, {
            errCode: 0,
            errMessage: 'Delete specialty succeed!'
          });
      }
    }, _callee4);
  }));
  return function deleteSpecialty(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  updateSpecialty: updateSpecialty,
  deleteSpecialty: deleteSpecialty
};