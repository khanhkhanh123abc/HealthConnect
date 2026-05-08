'use strict';

// Initial English seed: keywords grouped by specialty name.
// On migration the script attempts to find each specialty by case-insensitive
// name match. Rows with no matching specialty are skipped (admin can re-add
// later through the symptom-keyword management UI).
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var SEED = [{
  specialty: 'Neurology',
  keywords: ['headache', 'migraine', 'dizziness', 'numbness', 'insomnia', 'seizure', 'epilepsy']
}, {
  specialty: 'Cardiology',
  keywords: ['chest pain', 'palpitations', 'shortness of breath', 'blood pressure', 'heart rate', 'heart failure']
}, {
  specialty: 'Gastroenterology',
  keywords: ['stomach pain', 'diarrhea', 'constipation', 'nausea', 'vomiting', 'reflux', 'gastritis']
}, {
  specialty: 'Dermatology',
  keywords: ['rash', 'itching', 'acne', 'hair loss', 'psoriasis', 'skin fungus']
}, {
  specialty: 'Ent',
  keywords: ['sore throat', 'runny nose', 'stuffy nose', 'tinnitus', 'cough', 'tonsillitis', 'voice loss']
}, {
  specialty: 'Ophthalmology',
  keywords: ['blurred vision', 'eye pain', 'red eye', 'watery eye', 'glaucoma']
}, {
  specialty: 'Orthopedics',
  keywords: ['back pain', 'joint pain', 'arthritis', 'muscle pain', 'shoulder pain', 'neck pain']
}, {
  specialty: 'Pediatrics',
  keywords: ['child', 'newborn', 'infant', 'kid', 'baby']
}, {
  specialty: 'Endocrinology',
  keywords: ['diabetes', 'obesity', 'thyroid', 'hormone']
}, {
  specialty: 'Obstetrics',
  keywords: ['gynecology', 'menstruation', 'pregnancy', 'fertility', 'cyst']
}, {
  specialty: 'Dentistry',
  keywords: ['toothache', 'cavity', 'wisdom tooth', 'sensitive teeth', 'gum']
}];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function up(queryInterface, Sequelize) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var now, _loop, _i, _SEED;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return queryInterface.createTable('SymptomKeywords', {
              id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
              },
              keyword: {
                type: Sequelize.STRING,
                allowNull: false
              },
              specialtyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: 'Specialties',
                  key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
              },
              createdAt: {
                allowNull: false,
                type: Sequelize.DATE
              },
              updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
              }
            });
          case 1:
            _context2.n = 2;
            return queryInterface.addIndex('SymptomKeywords', ['keyword'], {
              name: 'symptom_keywords_keyword_idx'
            });
          case 2:
            _context2.n = 3;
            return queryInterface.addIndex('SymptomKeywords', ['specialtyId'], {
              name: 'symptom_keywords_specialty_id_idx'
            });
          case 3:
            // Seed: look up each specialty by name (case-insensitive); insert keyword rows.
            now = new Date();
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var group, _yield$queryInterface, _yield$queryInterface2, matches, specialtyId, rows;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.n) {
                  case 0:
                    group = _SEED[_i];
                    _context.n = 1;
                    return queryInterface.sequelize.query('SELECT id FROM Specialties WHERE LOWER(name) = LOWER(:n) LIMIT 1', {
                      replacements: {
                        n: group.specialty
                      }
                    });
                  case 1:
                    _yield$queryInterface = _context.v;
                    _yield$queryInterface2 = _slicedToArray(_yield$queryInterface, 1);
                    matches = _yield$queryInterface2[0];
                    if (matches.length) {
                      _context.n = 2;
                      break;
                    }
                    return _context.a(2, 1);
                  case 2:
                    specialtyId = matches[0].id;
                    rows = group.keywords.map(function (kw) {
                      return {
                        keyword: kw.toLowerCase(),
                        specialtyId: specialtyId,
                        createdAt: now,
                        updatedAt: now
                      };
                    });
                    _context.n = 3;
                    return queryInterface.bulkInsert('SymptomKeywords', rows);
                  case 3:
                    return _context.a(2);
                }
              }, _loop);
            });
            _i = 0, _SEED = SEED;
          case 4:
            if (!(_i < _SEED.length)) {
              _context2.n = 7;
              break;
            }
            return _context2.d(_regeneratorValues(_loop()), 5);
          case 5:
            if (!_context2.v) {
              _context2.n = 6;
              break;
            }
            return _context2.a(3, 6);
          case 6:
            _i++;
            _context2.n = 4;
            break;
          case 7:
            return _context2.a(2);
        }
      }, _callee);
    }))();
  },
  down: function down(queryInterface) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return queryInterface.dropTable('SymptomKeywords');
          case 1:
            return _context3.a(2);
        }
      }, _callee2);
    }))();
  }
};