import specialtyService from '../services/specialtyService';
import logger from '../utils/logger.js';

const fail500 = (res, label, e) => {
    logger.error({ err: e }, `[${label}]`);
    return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
};

const statusFromErrCode = (errCode) => {
    if (errCode === 0) return 200;
    if (errCode === 1) return 400;       // missing param
    if (errCode === 2) return 404;       // not found
    if (errCode === 3) return 409;       // conflict (in-use)
    return 400;
};

let createSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.createSpecialty(req.body);
        return res.status(statusFromErrCode(info.errCode)).json(info);
    } catch (e) { return fail500(res, 'createSpecialty', e); }
};

let getAllSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.getAllSpecialty();
        return res.status(200).json(info);
    } catch (e) { return fail500(res, 'getAllSpecialty', e); }
};

let updateSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.updateSpecialty(req.body);
        return res.status(statusFromErrCode(info.errCode)).json(info);
    } catch (e) { return fail500(res, 'updateSpecialty', e); }
};

let deleteSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.deleteSpecialty(req.query.id);
        return res.status(statusFromErrCode(info.errCode)).json(info);
    } catch (e) { return fail500(res, 'deleteSpecialty', e); }
};

module.exports = { createSpecialty, getAllSpecialty, updateSpecialty, deleteSpecialty };
