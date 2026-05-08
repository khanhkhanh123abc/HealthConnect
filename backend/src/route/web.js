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

let router = express.Router();

const initWebRoutes = (app) => {

    router.post('/crud', userController.handleCrud);

    // User
    router.post('/api/login', userController.handleLogin);
    router.post('/api/register', userController.handleRegister);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);

    // Doctor
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctors', doctorController.postInforDoctor);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-clinics-by-specialty', doctorController.getClinicsBySpecialty);
    router.get('/api/get-doctors-by-clinic', doctorController.getDoctorsByClinicAndSpecialty);

    // Specialty
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.put('/api/update-specialty', specialtyController.updateSpecialty);
    router.delete('/api/delete-specialty', specialtyController.deleteSpecialty);

    // Clinic
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinics);
    router.get('/api/get-clinic-by-id', clinicController.getClinicById);
    router.put('/api/update-clinic', clinicController.updateClinic);
    router.delete('/api/delete-clinic', clinicController.deleteClinic);
    router.get('/api/get-doctors-by-clinic-id', clinicController.getDoctorsByClinic);

    // Booking
    router.post('/api/create-booking', bookingController.createBooking);
    router.get('/api/confirm-booking', bookingController.confirmBooking);
    router.get('/api/get-bookings-by-patient', bookingController.getBookingsByPatient);
    router.put('/api/cancel-booking', bookingController.cancelBooking);
    router.get('/api/get-schedule-with-slots', bookingController.getScheduleWithSlots);
    router.get('/api/get-bookings-by-doctor', bookingController.getBookingsByDoctor);
    router.put('/api/complete-booking', bookingController.completeBooking);
    router.post('/api/send-medical-record', bookingController.sendMedicalRecord);
    router.put('/api/confirm-payment', bookingController.confirmPayment);
    router.get('/api/get-pending-bank-bookings', bookingController.getPendingBankBookings);
    router.put('/api/doctor-cancel-booking', bookingController.doctorCancelBooking);
    router.post('/api/create-paypal-order', bookingController.createPaypalOrder);
    router.get('/api/paypal-return', bookingController.paypalReturn);
    router.post('/api/send-prescription', bookingController.sendPrescription);

    // Search
    router.get('/api/global-search', searchController.globalSearch);
    router.get('/api/search', searchController.fullSearch);

    // Symptom keyword (admin)
    router.get('/api/symptom-keyword', symptomKeywordController.getAll);
    router.post('/api/symptom-keyword', symptomKeywordController.create);
    router.put('/api/symptom-keyword', symptomKeywordController.update);
    router.delete('/api/symptom-keyword', symptomKeywordController.remove);

    // Review
    router.post('/api/review', reviewController.create);
    router.get('/api/review/by-doctor', reviewController.getByDoctor);
    router.get('/api/review/by-booking', reviewController.getByBooking);
    router.delete('/api/review', reviewController.remove);

    // Stats
    router.get('/api/admin-stats', statsController.getAdminStats);
    router.get('/api/doctor-stats', statsController.getDoctorStats);

    return app.use('/', router);
};

module.exports = initWebRoutes;
