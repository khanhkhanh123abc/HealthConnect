import express from 'express';
import homeController from '../controllers/homeController.js';
import userController from '../controllers/userController.js';
import doctorController from '../controllers/doctorController.js';
import specialtyController from '../controllers/specialtyController.js';
import clinicController from '../controllers/clinicController.js';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);


    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);


    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);


    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-all-clinic', clinicController.getAllClinics);

    router.post('/api/save-info-doctors', doctorController.postInforDoctor);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);



    return app.use('/', router);
}


module.exports = initWebRoutes;