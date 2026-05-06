import db from "../models/index";

const createSpecialty = async (data) => {
    if (!data.name || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
        return { errCode: 1, errMessage: 'Missing required parameters!' };
    }
    await db.Specialty.create({
        name: data.name,
        image: data.image,
        descriptionHTML: data.descriptionHTML,
        descriptionMarkdown: data.descriptionMarkdown
    });
    return { errCode: 0, errMessage: 'Save specialty succeed!' };
};

const getAllSpecialty = async () => {
    let data = await db.Specialty.findAll({
        attributes: ['id', 'name', 'image', 'descriptionHTML', 'descriptionMarkdown']
    });
    return { errCode: 0, data };
};

const updateSpecialty = async (data) => {
    if (!data.id) return { errCode: 1, errMessage: 'Missing id' };
    let specialty = await db.Specialty.findOne({ where: { id: data.id }, raw: false });
    if (!specialty) return { errCode: 2, errMessage: 'Specialty not found' };
    if (data.name) specialty.name = data.name;
    if (data.image) specialty.image = data.image;
    if (data.descriptionHTML) specialty.descriptionHTML = data.descriptionHTML;
    if (data.descriptionMarkdown) specialty.descriptionMarkdown = data.descriptionMarkdown;
    await specialty.save();
    return { errCode: 0, errMessage: 'Update specialty succeed!' };
};

const deleteSpecialty = async (id) => {
    if (!id) return { errCode: 1, errMessage: 'Missing id' };
    await db.Specialty.destroy({ where: { id } });
    return { errCode: 0, errMessage: 'Delete specialty succeed!' };
};

module.exports = { createSpecialty, getAllSpecialty, updateSpecialty, deleteSpecialty };
