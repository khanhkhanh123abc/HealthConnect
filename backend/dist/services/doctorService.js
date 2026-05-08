"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _index = _interopRequireDefault(require("../models/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ============================================================
// TRANG CHỦ: Lấy danh sách Bác sĩ nổi bật
// ============================================================
var getTopDoctorHome = function getTopDoctorHome(limitInput) {
  return new Promise(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(resolve, reject) {
      var users, seen, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return _index["default"].User.findAll({
              limit: limitInput,
              where: {
                roleId: 'R2'
              },
              order: [['createdAt', 'DESC']],
              attributes: {
                exclude: ['password']
              },
              include: [{
                model: _index["default"].allCode,
                as: 'positionData',
                attributes: ['value']
              }, {
                model: _index["default"].allCode,
                as: 'genderData',
                attributes: ['value']
              }],
              raw: true,
              nest: true
            });
          case 1:
            users = _context.v;
            // ✅ Deduplicate theo id
            seen = new Set();
            users = users.filter(function (u) {
              if (seen.has(u.id)) return false;
              seen.add(u.id);
              return true;
            });
            resolve({
              errCode: 0,
              data: users
            });
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            reject(_t);
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

// ============================================================
// ADMIN: Lấy TẤT CẢ bác sĩ
// ============================================================
var getAllDoctors = function getAllDoctors() {
  return new Promise(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(resolve, reject) {
      var doctors, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _context2.n = 1;
            return _index["default"].User.findAll({
              where: {
                roleId: 'R2'
              },
              attributes: {
                exclude: ['password', 'image']
              },
              raw: true
            });
          case 1:
            doctors = _context2.v;
            resolve({
              errCode: 0,
              data: doctors
            });
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            reject(_t2);
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
};

// ============================================================
// ADMIN: Lưu thông tin chi tiết Bác sĩ (Markdown + Doctor_Info)
// ============================================================
var saveDetailInforDoctor = function saveDetailInforDoctor(inputData) {
  return new Promise(/*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(resolve, reject) {
      var markdown, doctorInfo, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            if (!(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown)) {
              _context3.n = 1;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: 'Missing required parameters!'
            });
            return _context3.a(2);
          case 1:
            _context3.n = 2;
            return _index["default"].Markdown.findOne({
              where: {
                doctorId: inputData.doctorId
              },
              raw: false
            });
          case 2:
            markdown = _context3.v;
            if (!markdown) {
              _context3.n = 4;
              break;
            }
            markdown.contentHTML = inputData.contentHTML;
            markdown.contentMarkdown = inputData.contentMarkdown;
            markdown.description = inputData.description;
            markdown.specialtyId = inputData.specialtyId;
            markdown.clinicId = inputData.clinicId;
            _context3.n = 3;
            return markdown.save();
          case 3:
            _context3.n = 5;
            break;
          case 4:
            _context3.n = 5;
            return _index["default"].Markdown.create({
              contentHTML: inputData.contentHTML,
              contentMarkdown: inputData.contentMarkdown,
              description: inputData.description,
              doctorId: inputData.doctorId,
              specialtyId: inputData.specialtyId,
              clinicId: inputData.clinicId
            });
          case 5:
            _context3.n = 6;
            return _index["default"].Doctor_Info.findOne({
              where: {
                doctorId: inputData.doctorId
              },
              raw: false
            });
          case 6:
            doctorInfo = _context3.v;
            if (!doctorInfo) {
              _context3.n = 8;
              break;
            }
            doctorInfo.priceId = inputData.priceId;
            doctorInfo.provinceId = inputData.provinceId;
            doctorInfo.paymentId = inputData.paymentId;
            doctorInfo.note = inputData.note;
            _context3.n = 7;
            return doctorInfo.save();
          case 7:
            _context3.n = 9;
            break;
          case 8:
            _context3.n = 9;
            return _index["default"].Doctor_Info.create({
              doctorId: inputData.doctorId,
              priceId: inputData.priceId,
              provinceId: inputData.provinceId,
              paymentId: inputData.paymentId,
              note: inputData.note
            });
          case 9:
            resolve({
              errCode: 0,
              errMessage: 'Save doctor information succeed!'
            });
            _context3.n = 11;
            break;
          case 10:
            _context3.p = 10;
            _t3 = _context3.v;
            reject(_t3);
          case 11:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 10]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
};

// ============================================================
// W8: Lấy thông tin đầy đủ Bác sĩ (Profile, Province, Clinic)
// ============================================================
var getProfileDoctorById = function getProfileDoctorById(inputId) {
  return new Promise(/*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(resolve, reject) {
      var data, plainData, clinic, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            if (inputId) {
              _context4.n = 1;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: 'Missing required parameter'
            });
            return _context4.a(2);
          case 1:
            _context4.n = 2;
            return _index["default"].User.findOne({
              where: {
                id: inputId
              },
              attributes: {
                exclude: ['password']
              },
              include: [{
                model: _index["default"].Markdown,
                attributes: ['description', 'contentHTML', 'contentMarkdown', 'clinicId', 'specialtyId']
              }, {
                model: _index["default"].allCode,
                as: 'positionData',
                attributes: ['value']
              }, {
                model: _index["default"].Doctor_Info,
                attributes: {
                  exclude: ['id', 'doctorId']
                },
                include: [{
                  model: _index["default"].allCode,
                  as: 'priceData',
                  attributes: ['value']
                }, {
                  model: _index["default"].allCode,
                  as: 'provinceData',
                  attributes: ['value']
                }, {
                  model: _index["default"].allCode,
                  as: 'paymentData',
                  attributes: ['value']
                }]
              }],
              raw: false,
              nest: true
            });
          case 2:
            data = _context4.v;
            if (data) {
              _context4.n = 3;
              break;
            }
            resolve({
              errCode: 0,
              data: {}
            });
            return _context4.a(2);
          case 3:
            plainData = data.get({
              plain: true
            }); // Lấy thêm thông tin Phòng khám nếu có clinicId
            if (!(plainData.Markdown && plainData.Markdown.clinicId)) {
              _context4.n = 5;
              break;
            }
            _context4.n = 4;
            return _index["default"].Clinic.findOne({
              where: {
                id: plainData.Markdown.clinicId
              },
              attributes: ['id', 'name', 'address', 'image'],
              raw: true
            });
          case 4:
            clinic = _context4.v;
            plainData.clinicData = clinic || null;
            _context4.n = 6;
            break;
          case 5:
            plainData.clinicData = null;
          case 6:
            resolve({
              errCode: 0,
              data: plainData
            });
            _context4.n = 8;
            break;
          case 7:
            _context4.p = 7;
            _t4 = _context4.v;
            reject(_t4);
          case 8:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 7]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
};

// ============================================================
// W9: Lưu lịch khám hàng loạt (Bác sĩ tạo lịch rảnh)
// ============================================================
var bulkCreateSchedule = function bulkCreateSchedule(data) {
  return new Promise(/*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(resolve, reject) {
      var Op, dateStart, dateEnd, maxNumber, newSchedules, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            if (!(!data.schedules || !data.doctorId || !data.date)) {
              _context5.n = 1;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: 'Missing required parameters!'
            });
            return _context5.a(2);
          case 1:
            if (!(data.schedules.length === 0)) {
              _context5.n = 2;
              break;
            }
            resolve({
              errCode: 2,
              errMessage: 'No schedules to save!'
            });
            return _context5.a(2);
          case 2:
            // Xóa lịch cũ của ngày đó trước khi tạo mới
            Op = _index["default"].Sequelize.Op;
            dateStart = new Date(+data.date);
            dateStart.setHours(0, 0, 0, 0);
            dateEnd = new Date(+data.date);
            dateEnd.setHours(23, 59, 59, 999);
            _context5.n = 3;
            return _index["default"].Schedule.destroy({
              where: {
                doctorId: data.doctorId,
                date: _defineProperty({}, Op.between, [dateStart, dateEnd])
              }
            });
          case 3:
            // Tạo lịch mới với maxNumber từ input (mặc định 1 nếu không truyền)
            maxNumber = data.maxNumber && data.maxNumber > 0 ? +data.maxNumber : 1;
            newSchedules = data.schedules.map(function (item) {
              return {
                doctorId: item.doctorId,
                date: new Date(+item.date),
                timeType: item.timeType,
                maxNumber: maxNumber,
                currentNumber: 0
              };
            });
            _context5.n = 4;
            return _index["default"].Schedule.bulkCreate(newSchedules);
          case 4:
            resolve({
              errCode: 0,
              errMessage: 'Save schedule succeed!'
            });
            _context5.n = 6;
            break;
          case 5:
            _context5.p = 5;
            _t5 = _context5.v;
            reject(_t5);
          case 6:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 5]]);
    }));
    return function (_x9, _x0) {
      return _ref5.apply(this, arguments);
    };
  }());
};

// ============================================================
// W9: Lấy lịch rảnh của Bác sĩ theo ngày (Bệnh nhân xem)
// ============================================================
var getScheduleByDate = function getScheduleByDate(doctorId, date) {
  return new Promise(/*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(resolve, reject) {
      var Op, dateStart, dateEnd, data, _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            _context6.p = 0;
            if (!(!doctorId || !date)) {
              _context6.n = 1;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: 'Missing required parameters!'
            });
            return _context6.a(2);
          case 1:
            // Query theo khoảng thời gian trong ngày để tránh lỗi timezone
            Op = _index["default"].Sequelize.Op;
            dateStart = new Date(+date);
            dateStart.setHours(0, 0, 0, 0);
            dateEnd = new Date(+date);
            dateEnd.setHours(23, 59, 59, 999);
            _context6.n = 2;
            return _index["default"].Schedule.findAll({
              where: {
                doctorId: doctorId,
                date: _defineProperty({}, Op.between, [dateStart, dateEnd]),
                // Chỉ hiển thị slot còn chỗ
                currentNumber: _defineProperty({}, Op.lt, _index["default"].Sequelize.col('maxNumber'))
              },
              include: [{
                model: _index["default"].allCode,
                as: 'timeTypeData',
                attributes: ['value', 'keyMap']
              }],
              raw: false,
              nest: true
            });
          case 2:
            data = _context6.v;
            if (!data) data = [];
            resolve({
              errCode: 0,
              data: data
            });
            _context6.n = 4;
            break;
          case 3:
            _context6.p = 3;
            _t6 = _context6.v;
            reject(_t6);
          case 4:
            return _context6.a(2);
        }
      }, _callee6, null, [[0, 3]]);
    }));
    return function (_x1, _x10) {
      return _ref6.apply(this, arguments);
    };
  }());
};

// ============================================================
// BOOKING FLOW: Lấy Phòng khám theo Chuyên khoa
// Logic: Markdowns lưu specialtyId + clinicId của từng bác sĩ
// → Tìm tất cả clinicId có bác sĩ thuộc specialtyId đó
// ============================================================
var getClinicsBySpecialty = function getClinicsBySpecialty(specialtyId) {
  return new Promise(/*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(resolve, reject) {
      var markdowns, clinicIds, clinics, _t7;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            if (specialtyId) {
              _context7.n = 1;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: 'Missing specialtyId'
            });
            return _context7.a(2);
          case 1:
            _context7.n = 2;
            return _index["default"].Markdown.findAll({
              where: {
                specialtyId: specialtyId
              },
              attributes: ['clinicId'],
              raw: true
            });
          case 2:
            markdowns = _context7.v;
            clinicIds = _toConsumableArray(new Set(markdowns.map(function (m) {
              return m.clinicId;
            }).filter(function (id) {
              return id;
            })));
            if (!(clinicIds.length === 0)) {
              _context7.n = 3;
              break;
            }
            resolve({
              errCode: 0,
              data: []
            });
            return _context7.a(2);
          case 3:
            _context7.n = 4;
            return _index["default"].Clinic.findAll({
              where: {
                id: clinicIds
              },
              attributes: ['id', 'name', 'image', 'address'],
              raw: true
            });
          case 4:
            clinics = _context7.v;
            resolve({
              errCode: 0,
              data: clinics
            });
            _context7.n = 6;
            break;
          case 5:
            _context7.p = 5;
            _t7 = _context7.v;
            reject(_t7);
          case 6:
            return _context7.a(2);
        }
      }, _callee7, null, [[0, 5]]);
    }));
    return function (_x11, _x12) {
      return _ref7.apply(this, arguments);
    };
  }());
};

// ============================================================
// BOOKING FLOW: Lấy Bác sĩ theo Phòng khám + Chuyên khoa
// ============================================================
var getDoctorsByClinicAndSpecialty = function getDoctorsByClinicAndSpecialty(clinicId, specialtyId) {
  return new Promise(/*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(resolve, reject) {
      var markdowns, doctorIds, descMap, doctors, result, _t8;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            _context8.p = 0;
            if (!(!clinicId || !specialtyId)) {
              _context8.n = 1;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: 'Missing parameters'
            });
            return _context8.a(2);
          case 1:
            _context8.n = 2;
            return _index["default"].Markdown.findAll({
              where: {
                clinicId: clinicId,
                specialtyId: specialtyId
              },
              attributes: ['doctorId', 'description'],
              raw: true
            });
          case 2:
            markdowns = _context8.v;
            if (!(markdowns.length === 0)) {
              _context8.n = 3;
              break;
            }
            resolve({
              errCode: 0,
              data: []
            });
            return _context8.a(2);
          case 3:
            doctorIds = markdowns.map(function (m) {
              return m.doctorId;
            });
            descMap = {};
            markdowns.forEach(function (m) {
              descMap[m.doctorId] = m.description;
            });

            // Lấy thông tin bác sĩ
            _context8.n = 4;
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
            doctors = _context8.v;
            result = doctors.map(function (doc) {
              return _objectSpread(_objectSpread({}, doc), {}, {
                description: descMap[doc.id] || ''
              });
            });
            resolve({
              errCode: 0,
              data: result
            });
            _context8.n = 6;
            break;
          case 5:
            _context8.p = 5;
            _t8 = _context8.v;
            reject(_t8);
          case 6:
            return _context8.a(2);
        }
      }, _callee8, null, [[0, 5]]);
    }));
    return function (_x13, _x14) {
      return _ref8.apply(this, arguments);
    };
  }());
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getProfileDoctorById: getProfileDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getClinicsBySpecialty: getClinicsBySpecialty,
  getDoctorsByClinicAndSpecialty: getDoctorsByClinicAndSpecialty
};