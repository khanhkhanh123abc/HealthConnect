import db from "../models/index";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Validate: Bắt buộc phải có cả địa chỉ (address)
            if (!data.name || !data.address || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address, // Thêm trường địa chỉ
                    image: data.image,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Save clinic succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}
let getAllClinics = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                attributes: ['id', 'name', 'address'] // Chỉ lấy id, tên và địa chỉ cho nhẹ
            });
            resolve({ errCode: 0, errMessage: 'Ok', data });
        } catch (e) {
            reject(e);
        }
    });
}      

module.exports = {
    createClinic: createClinic,
    getAllClinics: getAllClinics
}