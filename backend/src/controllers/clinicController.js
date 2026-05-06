import clinicService from '../services/clinicService';

const createClinic = async (req, res) => {
    try {
        let info = await clinicService.createClinic(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const getAllClinics = async (req, res) => {
    try {
        let info = await clinicService.getAllClinics();
        return res.status(200).json(info);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const getClinicById = async (req, res) => {
    try {
        let info = await clinicService.getClinicById(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const updateClinic = async (req, res) => {
    try {
        let info = await clinicService.updateClinic(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const deleteClinic = async (req, res) => {
    try {
        let info = await clinicService.deleteClinic(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const getDoctorsByClinic = async (req, res) => {
    try {
        let info = await clinicService.getDoctorsByClinic(req.query.clinicId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

module.exports = { createClinic, getAllClinics, getClinicById, updateClinic, deleteClinic, getDoctorsByClinic };
