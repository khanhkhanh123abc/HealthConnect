"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _index = _interopRequireDefault(require("../models/index.js"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _sequelize = require("sequelize");
var _logger = _interopRequireDefault(require("../utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var salt = _bcryptjs["default"].genSaltSync(10);
var ACTIVE_BOOKING_STATUSES = ['S1', 'S2'];
var TOKEN_TTL = '7d';
var signToken = function signToken(user) {
  var secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return _jsonwebtoken["default"].sign({
    id: user.id,
    roleId: user.roleId,
    email: user.email
  }, secret, {
    expiresIn: TOKEN_TTL
  });
};
var hashUserPassword = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(password) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          return _context.a(2, _bcryptjs["default"].hashSync(password, salt));
      }
    }, _callee);
  }));
  return function hashUserPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();
var checkUserEmail = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(email) {
    var user;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return _index["default"].User.findOne({
            where: {
              email: email
            }
          });
        case 1:
          user = _context2.v;
          return _context2.a(2, !!user);
      }
    }, _callee2);
  }));
  return function checkUserEmail(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var handleUserLogin = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(email, password) {
    var isExist, user, check, token;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return checkUserEmail(email);
        case 1:
          isExist = _context3.v;
          if (isExist) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, {
            errCode: 1,
            errMessage: "Your's email isn't exist in our system. Please try other email!"
          });
        case 2:
          _context3.n = 3;
          return _index["default"].User.findOne({
            where: {
              email: email
            },
            attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName', 'address', 'phoneNumber', 'gender', 'image'],
            raw: true
          });
        case 3:
          user = _context3.v;
          if (user) {
            _context3.n = 4;
            break;
          }
          return _context3.a(2, {
            errCode: 2,
            errMessage: "User's not found!"
          });
        case 4:
          _context3.n = 5;
          return _bcryptjs["default"].compare(password, user.password);
        case 5:
          check = _context3.v;
          if (check) {
            _context3.n = 6;
            break;
          }
          return _context3.a(2, {
            errCode: 3,
            errMessage: 'Wrong password'
          });
        case 6:
          delete user.password;
          token = signToken(user);
          return _context3.a(2, {
            errCode: 0,
            errMessage: 'OK',
            user: user,
            token: token
          });
      }
    }, _callee3);
  }));
  return function handleUserLogin(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
var registerUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(data) {
    var check, hashPasswordFromLib;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return checkUserEmail(data.email);
        case 1:
          check = _context4.v;
          if (!check) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, {
            errCode: 1,
            errMessage: 'This email is already registered. Please try another email.'
          });
        case 2:
          _context4.n = 3;
          return hashUserPassword(data.password);
        case 3:
          hashPasswordFromLib = _context4.v;
          _context4.n = 4;
          return _index["default"].User.create({
            email: data.email,
            password: hashPasswordFromLib,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phonenumber: data.phonenumber,
            gender: data.gender,
            roleId: 'R3'
          });
        case 4:
          return _context4.a(2, {
            errCode: 0,
            message: 'Account registration successful!'
          });
      }
    }, _callee4);
  }));
  return function registerUser(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var getAllUsers = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId) {
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          if (!(userId === 'All')) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, _index["default"].User.findAll({
            attributes: {
              exclude: ['password']
            },
            raw: true
          }));
        case 1:
          return _context5.a(2, _index["default"].User.findOne({
            where: {
              id: userId
            },
            attributes: {
              exclude: ['password']
            }
          }));
      }
    }, _callee5);
  }));
  return function getAllUsers(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
var createNewUser = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(data) {
    var check, hashPasswordFromBcrypt;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return checkUserEmail(data.email);
        case 1:
          check = _context6.v;
          if (!check) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2, {
            errCode: 1,
            errMessage: 'The email is already in use'
          });
        case 2:
          _context6.n = 3;
          return hashUserPassword(data.password);
        case 3:
          hashPasswordFromBcrypt = _context6.v;
          _context6.n = 4;
          return _index["default"].User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender === '1' ? true : false,
            roleId: data.roleId
          });
        case 4:
          return _context6.a(2, {
            errCode: 0,
            message: 'ok create a new user successfully'
          });
      }
    }, _callee6);
  }));
  return function createNewUser(_x7) {
    return _ref6.apply(this, arguments);
  };
}();
var updateUserData = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(data, requesterRoleId) {
    var user;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          if (data.id) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, {
            errCode: 2,
            errMessage: 'Missing required parameters'
          });
        case 1:
          _context7.n = 2;
          return _index["default"].User.findOne({
            where: {
              id: data.id
            },
            raw: false
          });
        case 2:
          user = _context7.v;
          if (user) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2, {
            errCode: 1,
            errMessage: "User's not found!"
          });
        case 3:
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.address = data.address;
          user.phoneNumber = data.phoneNumber;
          user.gender = data.gender === '1' ? true : false;
          // Only an admin caller may change the user's roleId.
          if (data.roleId && requesterRoleId === 'R1') user.roleId = data.roleId;
          user.positionId = data.positionId;
          user.image = data.image;
          _context7.n = 4;
          return user.save();
        case 4:
          return _context7.a(2, {
            errCode: 0,
            message: 'Update the user succeeds!'
          });
      }
    }, _callee7);
  }));
  return function updateUserData(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();

// Defensive delete: block when active bookings exist; otherwise cascade-clean
// non-FK-enforced satellite tables before destroying the user. Reviews are
// removed automatically through the Reviews FK CASCADE constraint.
var deleteUser = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(userId) {
    var user, bookingWhere, activeCount, noun, t, _t;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          if (userId) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2, {
            errCode: 1,
            errMessage: 'Missing user id'
          });
        case 1:
          _context8.n = 2;
          return _index["default"].User.findByPk(userId);
        case 2:
          user = _context8.v;
          if (user) {
            _context8.n = 3;
            break;
          }
          return _context8.a(2, {
            errCode: 1,
            errMessage: "User's not found!"
          });
        case 3:
          bookingWhere = user.roleId === 'R2' ? {
            doctorId: userId,
            statusId: _defineProperty({}, _sequelize.Op["in"], ACTIVE_BOOKING_STATUSES)
          } : user.roleId === 'R3' ? {
            patientId: userId,
            statusId: _defineProperty({}, _sequelize.Op["in"], ACTIVE_BOOKING_STATUSES)
          } : null;
          if (!bookingWhere) {
            _context8.n = 5;
            break;
          }
          _context8.n = 4;
          return _index["default"].Bookings.count({
            where: bookingWhere
          });
        case 4:
          activeCount = _context8.v;
          if (!(activeCount > 0)) {
            _context8.n = 5;
            break;
          }
          noun = user.roleId === 'R2' ? 'doctor' : 'patient';
          return _context8.a(2, {
            errCode: 2,
            errMessage: "This ".concat(noun, " has ").concat(activeCount, " active booking(s). Cancel or complete them before deleting.")
          });
        case 5:
          _context8.n = 6;
          return _index["default"].sequelize.transaction();
        case 6:
          t = _context8.v;
          _context8.p = 7;
          if (!(user.roleId === 'R2')) {
            _context8.n = 8;
            break;
          }
          _context8.n = 8;
          return Promise.all([_index["default"].Markdown.destroy({
            where: {
              doctorId: userId
            },
            transaction: t
          }), _index["default"].Doctor_Info.destroy({
            where: {
              doctorId: userId
            },
            transaction: t
          }), _index["default"].Doctor_Clinic_Specialty.destroy({
            where: {
              doctorId: userId
            },
            transaction: t
          }), _index["default"].Schedule.destroy({
            where: {
              doctorId: userId
            },
            transaction: t
          })]);
        case 8:
          _context8.n = 9;
          return user.destroy({
            transaction: t
          });
        case 9:
          _context8.n = 10;
          return t.commit();
        case 10:
          return _context8.a(2, {
            errCode: 0,
            message: 'Delete the user succeeds!'
          });
        case 11:
          _context8.p = 11;
          _t = _context8.v;
          _context8.n = 12;
          return t.rollback();
        case 12:
          _logger["default"].error({
            err: _t
          }, '[deleteUser]');
          throw _t;
        case 13:
          return _context8.a(2);
      }
    }, _callee8, null, [[7, 11]]);
  }));
  return function deleteUser(_x0) {
    return _ref8.apply(this, arguments);
  };
}();
var getAllCodeService = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(typeInput) {
    var allcode;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          if (typeInput) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2, {
            errCode: 1,
            errMessage: 'Missing required parameters!'
          });
        case 1:
          _context9.n = 2;
          return _index["default"].allCode.findAll({
            where: {
              type: typeInput
            }
          });
        case 2:
          allcode = _context9.v;
          return _context9.a(2, {
            errCode: 0,
            data: allcode
          });
      }
    }, _callee9);
  }));
  return function getAllCodeService(_x1) {
    return _ref9.apply(this, arguments);
  };
}();
module.exports = {
  handleUserLogin: handleUserLogin,
  checkUserEmail: checkUserEmail,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  updateUserData: updateUserData,
  deleteUser: deleteUser,
  getAllCodeService: getAllCodeService,
  registerUser: registerUser,
  hashUserPassword: hashUserPassword,
  signToken: signToken
};