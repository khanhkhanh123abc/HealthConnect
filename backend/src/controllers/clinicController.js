import clinicService from '../services/clinicService';

let createClinic = async (req, res) => {
    try {
        let info = await clinicService.createClinic(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}
let getAllClinics = async (req, res) => {
    try {
        let info = await clinicService.getAllClinics();
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let getClinicById = async (req, res) => {
    try {
        let info = await clinicService.getClinicById(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let updateClinic = async (req, res) => {
    try {
        let info = await clinicService.updateClinic(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let deleteClinic = async (req, res) => {
    try {
        let info = await clinicService.deleteClinic(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

module.exports = { createClinic, getAllClinics, getClinicById, updateClinic, deleteClinic }