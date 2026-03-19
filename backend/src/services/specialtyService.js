import db from "../models/index";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check điều kiện đầu vào
            if (!data.name || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                // Lưu vào database bằng Sequelize
                await db.Specialty.create({
                    name: data.name,
                    image: data.image,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Save specialty succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                attributes: ['id', 'name'] // Chỉ lấy id và tên cho nhẹ
            });
            resolve({ errCode: 0, errMessage: 'Ok', data });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty
}