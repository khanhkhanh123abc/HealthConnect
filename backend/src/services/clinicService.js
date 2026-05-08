import db from "../models/index";

const createClinic = async (data) => {
    if (!data.name || !data.address || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
        return { errCode: 1, errMessage: 'Missing required parameters!' };
    }
    await db.Clinic.create({
        name: data.name,
        address: data.address,
        image: data.image,
        descriptionHTML: data.descriptionHTML,
        descriptionMarkdown: data.descriptionMarkdown
    });
    return { errCode: 0, errMessage: 'Save clinic succeed!' };
};

const getAllClinics = async () => {
    let data = await db.Clinic.findAll({
        attributes: ['id', 'name', 'address', 'image']
    });
    return { errCode: 0, data };
};

const getClinicById = async (id) => {
    if (!id) return { errCode: 1, errMessage: 'Missing id' };
    let data = await db.Clinic.findOne({ where: { id } });
    return { errCode: 0, data: data || {} };
};

const updateClinic = async (data) => {
    if (!data.id) return { errCode: 1, errMessage: 'Missing id' };
    let clinic = await db.Clinic.findOne({ where: { id: data.id }, raw: false });
    if (!clinic) return { errCode: 2, errMessage: 'Clinic not found' };
    if (data.name) clinic.name = data.name;
    if (data.address) clinic.address = data.address;
    if (data.image) clinic.image = data.image;
    if (data.descriptionHTML) clinic.descriptionHTML = data.descriptionHTML;
    if (data.descriptionMarkdown) clinic.descriptionMarkdown = data.descriptionMarkdown;
    await clinic.save();
    return { errCode: 0, errMessage: 'Update clinic succeed!' };
};

const deleteClinic = async (id) => {
    if (!id) return { errCode: 1, errMessage: 'Missing id' };

    const clinic = await db.Clinic.findByPk(id);
    if (!clinic) return { errCode: 2, errMessage: 'Clinic not found' };

    // Block deletion if doctors still link to this clinic (via Markdown or DCS).
    const [markdownCount, dcsCount] = await Promise.all([
        db.Markdown.count({ where: { clinicId: id } }),
        db.Doctor_Clinic_Specialty.count({ where: { clinicId: id } })
    ]);
    if (markdownCount > 0 || dcsCount > 0) {
        return {
            errCode: 3,
            errMessage: `Clinic is in use by ${markdownCount || dcsCount} doctor(s). Detach the doctors first.`
        };
    }

    await clinic.destroy();
    return { errCode: 0, errMessage: 'Delete clinic succeed!' };
};

const getDoctorsByClinic = async (clinicId) => {
    if (!clinicId) return { errCode: 1, errMessage: 'Missing clinicId' };

    let markdowns = await db.Markdown.findAll({
        where: { clinicId },
        attributes: ['doctorId', 'specialtyId', 'description'],
        raw: true
    });

    if (!markdowns.length) return { errCode: 0, data: [] };

    const doctorIds = [...new Set(markdowns.map(m => m.doctorId).filter(Boolean))];
    const descMap = {};
    const specialtyMap = {};
    markdowns.forEach(m => {
        if (m.doctorId) {
            descMap[m.doctorId] = m.description;
            specialtyMap[m.doctorId] = m.specialtyId;
        }
    });

    let doctors = await db.User.findAll({
        where: { id: doctorIds, roleId: 'R2' },
        attributes: ['id', 'firstName', 'lastName', 'image'],
        include: [{ model: db.allCode, as: 'positionData', attributes: ['value'] }],
        raw: true,
        nest: true
    });

    const specialtyIds = [...new Set(Object.values(specialtyMap).filter(Boolean))];
    let specialties = specialtyIds.length
        ? await db.Specialty.findAll({ where: { id: specialtyIds }, attributes: ['id', 'name'], raw: true })
        : [];

    const specialtyNameMap = {};
    specialties.forEach(s => { specialtyNameMap[s.id] = s.name; });

    return {
        errCode: 0,
        data: doctors.map(doc => ({
            ...doc,
            description: descMap[doc.id] || '',
            specialtyId: specialtyMap[doc.id] || null,
            specialtyName: specialtyNameMap[specialtyMap[doc.id]] || ''
        }))
    };
};

module.exports = { createClinic, getAllClinics, getClinicById, updateClinic, deleteClinic, getDoctorsByClinic };
