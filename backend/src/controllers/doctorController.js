import doctorService from '../services/doctorService';
import logger from '../utils/logger.js';

const fail500 = (res, label, e) => {
    logger.error({ err: e }, `[${label}]`);
    return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
};

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) { return fail500(res, 'getTopDoctorHome', e); }
};

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) { return fail500(res, 'getAllDoctors', e); }
};

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) { return fail500(res, 'postInforDoctor', e); }
};

let getProfileDoctorById = async (req, res) => {
    try {
        if (!req.query.doctorId) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing doctorId' });
        }
        let info = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getProfileDoctorById', e); }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'bulkCreateSchedule', e); }
};

let getScheduleByDate = async (req, res) => {
    try {
        if (!req.query.doctorId || !req.query.date) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing parameters' });
        }
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getScheduleByDate', e); }
};

// ===== BOOKING FLOW =====
let getClinicsBySpecialty = async (req, res) => {
    try {
        if (!req.query.specialtyId) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing specialtyId' });
        }
        let info = await doctorService.getClinicsBySpecialty(req.query.specialtyId);
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getClinicsBySpecialty', e); }
};

let getDoctorsByClinicAndSpecialty = async (req, res) => {
    try {
        if (!req.query.clinicId || !req.query.specialtyId) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing parameters' });
        }
        let info = await doctorService.getDoctorsByClinicAndSpecialty(
            req.query.clinicId,
            req.query.specialtyId
        );
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getDoctorsByClinicAndSpecialty', e); }
};

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctor,
    getProfileDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getClinicsBySpecialty,
    getDoctorsByClinicAndSpecialty,
};
