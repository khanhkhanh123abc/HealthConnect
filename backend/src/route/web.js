import express from 'express';
import homeController from '../controllers/homeController.js';
import userController from '../controllers/userController.js';
import doctorController from '../controllers/doctorController.js';
import specialtyController from '../controllers/specialtyController.js';
import clinicController from '../controllers/clinicController.js';
import bookingController from '../controllers/bookingController.js';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);

    // User
    router.post('/api/login', userController.handleLogin);
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
    // Booking flow
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
    router.put('/api/update-clinic', clinicController.updateClinic);
    router.delete('/api/delete-clinic', clinicController.deleteClinic);

    // Booking
    router.post('/api/create-booking', bookingController.createBooking);
    router.get('/api/confirm-booking', bookingController.confirmBooking);
    router.get('/api/get-bookings-by-patient', bookingController.getBookingsByPatient);
    router.put('/api/cancel-booking', bookingController.cancelBooking);
    router.get('/api/get-schedule-with-slots', bookingController.getScheduleWithSlots);
    router.get('/api/get-bookings-by-doctor', bookingController.getBookingsByDoctor);
    router.put('/api/complete-booking', bookingController.completeBooking);
    router.post('/api/send-medical-record', bookingController.sendMedicalRecord);

    return app.use('/', router);
}

module.exports = initWebRoutes;