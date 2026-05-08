import clinicService from '../services/clinicService';
import logger from '../utils/logger.js';

const fail500 = (res, label, e) => {
    logger.error({ err: e }, `[${label}]`);
    return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
};

const statusFromErrCode = (errCode) => {
    if (errCode === 0) return 200;
    if (errCode === 1) return 400;
    if (errCode === 2) return 404;
    if (errCode === 3) return 409;
    return 400;
};

const createClinic = async (req, res) => {
    try {
        let info = await clinicService.createClinic(req.body);
        return res.status(statusFromErrCode(info.errCode)).json(info);
    } catch (e) { return fail500(res, 'createClinic', e); }
};

const getAllClinics = async (req, res) => {
    try {
        let info = await clinicService.getAllClinics();
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getAllClinics', e); }
};

const getClinicById = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing id' });
        }
        let info = await clinicService.getClinicById(req.query.id);
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getClinicById', e); }
};

const updateClinic = async (req, res) => {
    try {
        let info = await clinicService.updateClinic(req.body);
        return res.status(statusFromErrCode(info.errCode)).json(info);
    } catch (e) { return fail500(res, 'updateClinic', e); }
};

const deleteClinic = async (req, res) => {
    try {
        let info = await clinicService.deleteClinic(req.query.id);
        return res.status(statusFromErrCode(info.errCode)).json(info);
    } catch (e) { return fail500(res, 'deleteClinic', e); }
};

const getDoctorsByClinic = async (req, res) => {
    try {
        if (!req.query.clinicId) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing clinicId' });
        }
        let info = await clinicService.getDoctorsByClinic(req.query.clinicId);
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getDoctorsByClinic', e); }
};

module.exports = { createClinic, getAllClinics, getClinicById, updateClinic, deleteClinic, getDoctorsByClinic };
