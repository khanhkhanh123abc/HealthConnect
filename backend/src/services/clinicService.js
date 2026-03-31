import db from "../models/index";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' });
                return;
            }
            await db.Clinic.create({
                name: data.name,
                address: data.address,
                image: data.image,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown
            });
            resolve({ errCode: 0, errMessage: 'Save clinic succeed!' });
        } catch (e) { reject(e); }
    });
}

let getAllClinics = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                attributes: ['id', 'name', 'address', 'image']
            });
            resolve({ errCode: 0, errMessage: 'Ok', data });
        } catch (e) { reject(e); }
    });
}

let getClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) { resolve({ errCode: 1, errMessage: 'Missing id' }); return; }
            let data = await db.Clinic.findOne({ where: { id } });
            resolve({ errCode: 0, data: data || {} });
        } catch (e) { reject(e); }
    });
}

let updateClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) { resolve({ errCode: 1, errMessage: 'Missing id' }); return; }
            let clinic = await db.Clinic.findOne({ where: { id: data.id }, raw: false });
            if (!clinic) { resolve({ errCode: 2, errMessage: 'Clinic not found' }); return; }
            clinic.name = data.name || clinic.name;
            clinic.address = data.address || clinic.address;
            if (data.image) clinic.image = data.image;
            if (data.descriptionHTML) clinic.descriptionHTML = data.descriptionHTML;
            if (data.descriptionMarkdown) clinic.descriptionMarkdown = data.descriptionMarkdown;
            await clinic.save();
            resolve({ errCode: 0, errMessage: 'Update clinic succeed!' });
        } catch (e) { reject(e); }
    });
}

let deleteClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) { resolve({ errCode: 1, errMessage: 'Missing id' }); return; }
            await db.Clinic.destroy({ where: { id } });
            resolve({ errCode: 0, errMessage: 'Delete clinic succeed!' });
        } catch (e) { reject(e); }
    });
}

module.exports = { createClinic, getAllClinics, getClinicById, updateClinic, deleteClinic }