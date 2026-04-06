import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

// ===== BOOKING FLOW =====
let getClinicsBySpecialty = async (req, res) => {
    try {
        let info = await doctorService.getClinicsBySpecialty(req.query.specialtyId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

let getDoctorsByClinicAndSpecialty = async (req, res) => {
    try {
        let info = await doctorService.getDoctorsByClinicAndSpecialty(
            req.query.clinicId,
            req.query.specialtyId
        );
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctor,
    getProfileDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getClinicsBySpecialty,
    getDoctorsByClinicAndSpecialty,
}