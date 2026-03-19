import clinicService from '../services/clinicService';

let createClinic = async (req, res) => {
    try {
        let info = await clinicService.createClinic(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
}
let getAllClinics = async (req, res) => {
    try {
        let info = await clinicService.getAllClinics();
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
// Nhớ export

module.exports = {
    createClinic: createClinic,
    getAllClinics: getAllClinics
}