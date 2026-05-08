import express from 'express';
import userController from '../controllers/userController.js';
import doctorController from '../controllers/doctorController.js';
import specialtyController from '../controllers/specialtyController.js';
import clinicController from '../controllers/clinicController.js';
import bookingController from '../controllers/bookingController.js';
import searchController from '../controllers/searchController.js';
import statsController from '../controllers/statsController.js';
import symptomKeywordController from '../controllers/symptomKeywordController.js';
import reviewController from '../controllers/reviewController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import {
    registerSchema,
    loginSchema,
    createNewUserSchema,
    editUserSchema
} from '../validators/userValidator.js';
import {
    createBookingSchema,
    cancelBookingSchema,
    createPaypalOrderSchema
} from '../validators/bookingValidator.js';

let router = express.Router();

const initWebRoutes = (app) => {

    // ─────────── PUBLIC ───────────
    router.post('/api/login',    authLimiter, validate(loginSchema),    userController.handleLogin);
    router.post('/api/register', authLimiter, validate(registerSchema), userController.handleRegister);
    router.get('/api/allcode', userController.getAllCode);

    // Public reads (no auth) — homepage / browsing.
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-clinics-by-specialty', doctorController.getClinicsBySpecialty);
    router.get('/api/get-doctors-by-clinic', doctorController.getDoctorsByClinicAndSpecialty);

    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-all-clinic', clinicController.getAllClinics);
    router.get('/api/get-clinic-by-id', clinicController.getClinicById);
    router.get('/api/get-doctors-by-clinic-id', clinicController.getDoctorsByClinic);

    router.get('/api/global-search', searchController.globalSearch);
    router.get('/api/search', searchController.fullSearch);
    router.get('/api/review/by-doctor', reviewController.getByDoctor);

    // PayPal callback — public (PayPal hits this).
    router.get('/api/paypal-return', bookingController.paypalReturn);
    // Booking confirm via email link — public token-based.
    router.get('/api/confirm-booking', bookingController.confirmBooking);

    // ─────────── AUTHENTICATED (any role) ───────────
    router.get('/api/get-schedule-doctor-by-date', verifyToken, doctorController.getScheduleByDate);
    router.get('/api/get-schedule-with-slots',     verifyToken, bookingController.getScheduleWithSlots);
    router.get('/api/review/by-booking',           verifyToken, reviewController.getByBooking);

    // ─────────── ADMIN (R1) ───────────
    router.get('/api/get-all-users',   verifyToken, requireRole('R1'), userController.handleGetAllUsers);
    router.post('/api/create-new-user', verifyToken, requireRole('R1'), validate(createNewUserSchema), userController.handleCreateNewUser);
    router.put('/api/edit-user',        verifyToken, requireRole('R1'), validate(editUserSchema),       userController.handleEditUser);
    router.delete('/api/delete-user',   verifyToken, requireRole('R1'), userController.handleDeleteUser);

    router.get('/api/admin-stats',                    verifyToken, requireRole('R1'), statsController.getAdminStats);
    router.get('/api/get-pending-bank-bookings',      verifyToken, requireRole('R1'), bookingController.getPendingBankBookings);
    router.put('/api/confirm-payment',                verifyToken, requireRole('R1'), bookingController.confirmPayment);

    router.post('/api/save-info-doctors',    verifyToken, requireRole('R1'), doctorController.postInforDoctor);
    router.post('/api/bulk-create-schedule', verifyToken, requireRole('R1', 'R2'), doctorController.bulkCreateSchedule);

    router.post('/api/create-new-specialty', verifyToken, requireRole('R1'), specialtyController.createSpecialty);
    router.put('/api/update-specialty',      verifyToken, requireRole('R1'), specialtyController.updateSpecialty);
    router.delete('/api/delete-specialty',   verifyToken, requireRole('R1'), specialtyController.deleteSpecialty);

    router.post('/api/create-new-clinic', verifyToken, requireRole('R1'), clinicController.createClinic);
    router.put('/api/update-clinic',      verifyToken, requireRole('R1'), clinicController.updateClinic);
    router.delete('/api/delete-clinic',   verifyToken, requireRole('R1'), clinicController.deleteClinic);

    router.post('/api/symptom-keyword',   verifyToken, requireRole('R1'), symptomKeywordController.create);
    router.put('/api/symptom-keyword',    verifyToken, requireRole('R1'), symptomKeywordController.update);
    router.delete('/api/symptom-keyword', verifyToken, requireRole('R1'), symptomKeywordController.remove);
    router.get('/api/symptom-keyword',    verifyToken, requireRole('R1'), symptomKeywordController.getAll);

    // ─────────── DOCTOR (R2) ───────────
    router.get('/api/get-bookings-by-doctor',  verifyToken, requireRole('R2', 'R1'), bookingController.getBookingsByDoctor);
    router.put('/api/complete-booking',        verifyToken, requireRole('R2', 'R1'), bookingController.completeBooking);
    router.post('/api/send-medical-record',    verifyToken, requireRole('R2', 'R1'), bookingController.sendMedicalRecord);
    router.post('/api/send-prescription',      verifyToken, requireRole('R2', 'R1'), bookingController.sendPrescription);
    router.put('/api/doctor-cancel-booking',   verifyToken, requireRole('R2', 'R1'), bookingController.doctorCancelBooking);
    router.get('/api/doctor-stats',            verifyToken, requireRole('R2', 'R1'), statsController.getDoctorStats);

    // ─────────── PATIENT or ADMIN (R3 / R1) ───────────
    router.get('/api/get-bookings-by-patient', verifyToken, requireRole('R3', 'R1'), bookingController.getBookingsByPatient);
    router.put('/api/cancel-booking',          verifyToken, requireRole('R3', 'R1'), validate(cancelBookingSchema), bookingController.cancelBooking);
    router.post('/api/create-booking',         verifyToken, requireRole('R3', 'R1'), validate(createBookingSchema), bookingController.createBooking);
    router.post('/api/create-paypal-order',    verifyToken, requireRole('R3', 'R1'), validate(createPaypalOrderSchema), bookingController.createPaypalOrder);

    router.post('/api/review',  verifyToken, requireRole('R3', 'R1'), reviewController.create);
    router.delete('/api/review', verifyToken, requireRole('R3', 'R1'), reviewController.remove);

    return app.use('/', router);
};

module.exports = initWebRoutes;
