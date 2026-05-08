"use strict";

var _express = _interopRequireDefault(require("express"));
var _userController = _interopRequireDefault(require("../controllers/userController.js"));
var _doctorController = _interopRequireDefault(require("../controllers/doctorController.js"));
var _specialtyController = _interopRequireDefault(require("../controllers/specialtyController.js"));
var _clinicController = _interopRequireDefault(require("../controllers/clinicController.js"));
var _bookingController = _interopRequireDefault(require("../controllers/bookingController.js"));
var _searchController = _interopRequireDefault(require("../controllers/searchController.js"));
var _statsController = _interopRequireDefault(require("../controllers/statsController.js"));
var _symptomKeywordController = _interopRequireDefault(require("../controllers/symptomKeywordController.js"));
var _reviewController = _interopRequireDefault(require("../controllers/reviewController.js"));
var _auth = require("../middleware/auth.js");
var _rateLimit = require("../middleware/rateLimit.js");
var _validate = require("../middleware/validate.js");
var _userValidator = require("../validators/userValidator.js");
var _bookingValidator = require("../validators/bookingValidator.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
var initWebRoutes = function initWebRoutes(app) {
  // ─────────── PUBLIC ───────────
  router.post('/api/login', _rateLimit.authLimiter, (0, _validate.validate)(_userValidator.loginSchema), _userController["default"].handleLogin);
  router.post('/api/register', _rateLimit.authLimiter, (0, _validate.validate)(_userValidator.registerSchema), _userController["default"].handleRegister);
  router.get('/api/allcode', _userController["default"].getAllCode);

  // Public reads (no auth) — homepage / browsing.
  router.get('/api/top-doctor-home', _doctorController["default"].getTopDoctorHome);
  router.get('/api/get-all-doctors', _doctorController["default"].getAllDoctors);
  router.get('/api/get-profile-doctor-by-id', _doctorController["default"].getProfileDoctorById);
  router.get('/api/get-clinics-by-specialty', _doctorController["default"].getClinicsBySpecialty);
  router.get('/api/get-doctors-by-clinic', _doctorController["default"].getDoctorsByClinicAndSpecialty);
  router.get('/api/get-all-specialty', _specialtyController["default"].getAllSpecialty);
  router.get('/api/get-all-clinic', _clinicController["default"].getAllClinics);
  router.get('/api/get-clinic-by-id', _clinicController["default"].getClinicById);
  router.get('/api/get-doctors-by-clinic-id', _clinicController["default"].getDoctorsByClinic);
  router.get('/api/global-search', _searchController["default"].globalSearch);
  router.get('/api/search', _searchController["default"].fullSearch);
  router.get('/api/review/by-doctor', _reviewController["default"].getByDoctor);

  // PayPal callback — public (PayPal hits this).
  router.get('/api/paypal-return', _bookingController["default"].paypalReturn);
  // Booking confirm via email link — public token-based.
  router.get('/api/confirm-booking', _bookingController["default"].confirmBooking);

  // ─────────── AUTHENTICATED (any role) ───────────
  router.get('/api/get-schedule-doctor-by-date', _auth.verifyToken, _doctorController["default"].getScheduleByDate);
  router.get('/api/get-schedule-with-slots', _auth.verifyToken, _bookingController["default"].getScheduleWithSlots);
  router.get('/api/review/by-booking', _auth.verifyToken, _reviewController["default"].getByBooking);

  // ─────────── ADMIN (R1) ───────────
  router.get('/api/get-all-users', _auth.verifyToken, (0, _auth.requireRole)('R1'), _userController["default"].handleGetAllUsers);
  router.post('/api/create-new-user', _auth.verifyToken, (0, _auth.requireRole)('R1'), (0, _validate.validate)(_userValidator.createNewUserSchema), _userController["default"].handleCreateNewUser);
  router.put('/api/edit-user', _auth.verifyToken, (0, _auth.requireRole)('R1'), (0, _validate.validate)(_userValidator.editUserSchema), _userController["default"].handleEditUser);
  router["delete"]('/api/delete-user', _auth.verifyToken, (0, _auth.requireRole)('R1'), _userController["default"].handleDeleteUser);
  router.get('/api/admin-stats', _auth.verifyToken, (0, _auth.requireRole)('R1'), _statsController["default"].getAdminStats);
  router.get('/api/get-pending-bank-bookings', _auth.verifyToken, (0, _auth.requireRole)('R1'), _bookingController["default"].getPendingBankBookings);
  router.put('/api/confirm-payment', _auth.verifyToken, (0, _auth.requireRole)('R1'), _bookingController["default"].confirmPayment);
  router.post('/api/save-info-doctors', _auth.verifyToken, (0, _auth.requireRole)('R1'), _doctorController["default"].postInforDoctor);
  router.post('/api/bulk-create-schedule', _auth.verifyToken, (0, _auth.requireRole)('R1', 'R2'), _doctorController["default"].bulkCreateSchedule);
  router.post('/api/create-new-specialty', _auth.verifyToken, (0, _auth.requireRole)('R1'), _specialtyController["default"].createSpecialty);
  router.put('/api/update-specialty', _auth.verifyToken, (0, _auth.requireRole)('R1'), _specialtyController["default"].updateSpecialty);
  router["delete"]('/api/delete-specialty', _auth.verifyToken, (0, _auth.requireRole)('R1'), _specialtyController["default"].deleteSpecialty);
  router.post('/api/create-new-clinic', _auth.verifyToken, (0, _auth.requireRole)('R1'), _clinicController["default"].createClinic);
  router.put('/api/update-clinic', _auth.verifyToken, (0, _auth.requireRole)('R1'), _clinicController["default"].updateClinic);
  router["delete"]('/api/delete-clinic', _auth.verifyToken, (0, _auth.requireRole)('R1'), _clinicController["default"].deleteClinic);
  router.post('/api/symptom-keyword', _auth.verifyToken, (0, _auth.requireRole)('R1'), _symptomKeywordController["default"].create);
  router.put('/api/symptom-keyword', _auth.verifyToken, (0, _auth.requireRole)('R1'), _symptomKeywordController["default"].update);
  router["delete"]('/api/symptom-keyword', _auth.verifyToken, (0, _auth.requireRole)('R1'), _symptomKeywordController["default"].remove);
  router.get('/api/symptom-keyword', _auth.verifyToken, (0, _auth.requireRole)('R1'), _symptomKeywordController["default"].getAll);

  // ─────────── DOCTOR (R2) ───────────
  router.get('/api/get-bookings-by-doctor', _auth.verifyToken, (0, _auth.requireRole)('R2', 'R1'), _bookingController["default"].getBookingsByDoctor);
  router.put('/api/complete-booking', _auth.verifyToken, (0, _auth.requireRole)('R2', 'R1'), _bookingController["default"].completeBooking);
  router.post('/api/send-medical-record', _auth.verifyToken, (0, _auth.requireRole)('R2', 'R1'), _bookingController["default"].sendMedicalRecord);
  router.post('/api/send-prescription', _auth.verifyToken, (0, _auth.requireRole)('R2', 'R1'), _bookingController["default"].sendPrescription);
  router.put('/api/doctor-cancel-booking', _auth.verifyToken, (0, _auth.requireRole)('R2', 'R1'), _bookingController["default"].doctorCancelBooking);
  router.get('/api/doctor-stats', _auth.verifyToken, (0, _auth.requireRole)('R2', 'R1'), _statsController["default"].getDoctorStats);

  // ─────────── PATIENT or ADMIN (R3 / R1) ───────────
  router.get('/api/get-bookings-by-patient', _auth.verifyToken, (0, _auth.requireRole)('R3', 'R1'), _bookingController["default"].getBookingsByPatient);
  router.put('/api/cancel-booking', _auth.verifyToken, (0, _auth.requireRole)('R3', 'R1'), (0, _validate.validate)(_bookingValidator.cancelBookingSchema), _bookingController["default"].cancelBooking);
  router.post('/api/create-booking', _auth.verifyToken, (0, _auth.requireRole)('R3', 'R1'), (0, _validate.validate)(_bookingValidator.createBookingSchema), _bookingController["default"].createBooking);
  router.post('/api/create-paypal-order', _auth.verifyToken, (0, _auth.requireRole)('R3', 'R1'), (0, _validate.validate)(_bookingValidator.createPaypalOrderSchema), _bookingController["default"].createPaypalOrder);
  router.post('/api/review', _auth.verifyToken, (0, _auth.requireRole)('R3', 'R1'), _reviewController["default"].create);
  router["delete"]('/api/review', _auth.verifyToken, (0, _auth.requireRole)('R3', 'R1'), _reviewController["default"].remove);
  return app.use('/', router);
};
module.exports = initWebRoutes;