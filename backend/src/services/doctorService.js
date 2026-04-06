import db from "../models/index";

// ============================================================
// TRANG CHỦ: Lấy danh sách Bác sĩ nổi bật
// ============================================================
let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['password'] },
                include: [
                    { model: db.allCode, as: 'positionData', attributes: ['value'] },
                    { model: db.allCode, as: 'genderData', attributes: ['value'] }
                ],
                raw: true,
                nest: true
            });

            // ✅ Deduplicate theo id
            const seen = new Set();
            users = users.filter(u => {
                if (seen.has(u.id)) return false;
                seen.add(u.id);
                return true;
            });

            resolve({ errCode: 0, data: users });
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================
// ADMIN: Lấy TẤT CẢ bác sĩ
// ============================================================
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password', 'image'] },
                raw: true
            });
            resolve({ errCode: 0, data: doctors });
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================
// ADMIN: Lưu thông tin chi tiết Bác sĩ (Markdown + Doctor_Info)
// ============================================================
let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' });
                return;
            }

            // 1. Xử lý bảng Markdown
            let markdown = await db.Markdown.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false
            });

            if (markdown) {
                markdown.contentHTML = inputData.contentHTML;
                markdown.contentMarkdown = inputData.contentMarkdown;
                markdown.description = inputData.description;
                markdown.specialtyId = inputData.specialtyId;
                markdown.clinicId = inputData.clinicId;
                await markdown.save();
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                    specialtyId: inputData.specialtyId,
                    clinicId: inputData.clinicId
                });
            }

            // 2. Xử lý bảng Doctor_Info
            let doctorInfo = await db.Doctor_Info.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false
            });

            if (doctorInfo) {
                doctorInfo.priceId = inputData.priceId;
                doctorInfo.provinceId = inputData.provinceId;
                doctorInfo.paymentId = inputData.paymentId;
                doctorInfo.note = inputData.note;
                await doctorInfo.save();
            } else {
                await db.Doctor_Info.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.priceId,
                    provinceId: inputData.provinceId,
                    paymentId: inputData.paymentId,
                    note: inputData.note,
                });
            }

            resolve({ errCode: 0, errMessage: 'Save doctor information succeed!' });
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================
// W8: Lấy thông tin đầy đủ Bác sĩ (Profile, Province, Clinic)
// ============================================================
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({ errCode: 1, errMessage: 'Missing required parameter' });
                return;
            }

            let data = await db.User.findOne({
                where: { id: inputId },
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown', 'clinicId', 'specialtyId']
                    },
                    {
                        model: db.allCode,
                        as: 'positionData',
                        attributes: ['value']
                    },
                    {
                        model: db.Doctor_Info,
                        attributes: { exclude: ['id', 'doctorId'] },
                        include: [
                            { model: db.allCode, as: 'priceData', attributes: ['value'] },
                            { model: db.allCode, as: 'provinceData', attributes: ['value'] },
                            { model: db.allCode, as: 'paymentData', attributes: ['value'] },
                        ]
                    }
                ],
                raw: false,
                nest: true
            });

            if (!data) {
                resolve({ errCode: 0, data: {} });
                return;
            }

            let plainData = data.get({ plain: true });

            // Lấy thêm thông tin Phòng khám nếu có clinicId
            if (plainData.Markdown && plainData.Markdown.clinicId) {
                let clinic = await db.Clinic.findOne({
                    where: { id: plainData.Markdown.clinicId },
                    attributes: ['id', 'name', 'address', 'image'],
                    raw: true
                });
                plainData.clinicData = clinic || null;
            } else {
                plainData.clinicData = null;
            }

            resolve({ errCode: 0, data: plainData });
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================
// W9: Lưu lịch khám hàng loạt (Bác sĩ tạo lịch rảnh)
// ============================================================
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.schedules || !data.doctorId || !data.date) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' });
                return;
            }

            if (data.schedules.length === 0) {
                resolve({ errCode: 2, errMessage: 'No schedules to save!' });
                return;
            }

            // Xóa lịch cũ của ngày đó trước khi tạo mới
            const Op = db.Sequelize.Op;
            let dateStart = new Date(+data.date);
            dateStart.setHours(0, 0, 0, 0);
            let dateEnd = new Date(+data.date);
            dateEnd.setHours(23, 59, 59, 999);

            await db.Schedule.destroy({
                where: {
                    doctorId: data.doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] }
                }
            });

            // Tạo lịch mới với maxNumber từ input (mặc định 1 nếu không truyền)
            const maxNumber = data.maxNumber && data.maxNumber > 0 ? +data.maxNumber : 1;
            let newSchedules = data.schedules.map(item => ({
                doctorId: item.doctorId,
                date: new Date(+item.date),
                timeType: item.timeType,
                maxNumber: maxNumber,
                currentNumber: 0
            }));

            await db.Schedule.bulkCreate(newSchedules);

            resolve({ errCode: 0, errMessage: 'Save schedule succeed!' });
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================
// W9: Lấy lịch rảnh của Bác sĩ theo ngày (Bệnh nhân xem)
// ============================================================
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' });
                return;
            }

            // Query theo khoảng thời gian trong ngày để tránh lỗi timezone
            const Op = db.Sequelize.Op;
            let dateStart = new Date(+date);
            dateStart.setHours(0, 0, 0, 0);
            let dateEnd = new Date(+date);
            dateEnd.setHours(23, 59, 59, 999);

            let data = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] },
                    // Chỉ hiển thị slot còn chỗ
                    currentNumber: { [Op.lt]: db.Sequelize.col('maxNumber') }
                },
                include: [
                    {
                        model: db.allCode,
                        as: 'timeTypeData',
                        attributes: ['value', 'keyMap']
                    }
                ],
                raw: false,
                nest: true
            });

            if (!data) data = [];

            resolve({ errCode: 0, data: data });
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================
// BOOKING FLOW: Lấy Phòng khám theo Chuyên khoa
// Logic: Markdowns lưu specialtyId + clinicId của từng bác sĩ
// → Tìm tất cả clinicId có bác sĩ thuộc specialtyId đó
// ============================================================
let getClinicsBySpecialty = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId) {
                resolve({ errCode: 1, errMessage: 'Missing specialtyId' });
                return;
            }
            // Lấy tất cả clinicId từ bảng Markdowns theo specialtyId
            let markdowns = await db.Markdown.findAll({
                where: { specialtyId },
                attributes: ['clinicId'],
                raw: true
            });
            const clinicIds = [...new Set(
                markdowns.map(m => m.clinicId).filter(id => id)
            )];
            if (clinicIds.length === 0) {
                resolve({ errCode: 0, data: [] });
                return;
            }
            // Lấy thông tin các phòng khám
            let clinics = await db.Clinic.findAll({
                where: { id: clinicIds },
                attributes: ['id', 'name', 'image', 'address'],
                raw: true
            });
            resolve({ errCode: 0, data: clinics });
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================
// BOOKING FLOW: Lấy Bác sĩ theo Phòng khám + Chuyên khoa
// ============================================================
let getDoctorsByClinicAndSpecialty = (clinicId, specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId || !specialtyId) {
                resolve({ errCode: 1, errMessage: 'Missing parameters' });
                return;
            }
            // Tìm doctorId từ Markdowns theo clinicId + specialtyId
            let markdowns = await db.Markdown.findAll({
                where: { clinicId, specialtyId },
                attributes: ['doctorId', 'description'],
                raw: true
            });
            if (markdowns.length === 0) {
                resolve({ errCode: 0, data: [] });
                return;
            }
            const doctorIds = markdowns.map(m => m.doctorId);
            const descMap = {};
            markdowns.forEach(m => { descMap[m.doctorId] = m.description; });

            // Lấy thông tin bác sĩ
            let doctors = await db.User.findAll({
                where: { id: doctorIds, roleId: 'R2' },
                attributes: ['id', 'firstName', 'lastName', 'image'],
                include: [
                    { model: db.allCode, as: 'positionData', attributes: ['value'] }
                ],
                raw: true,
                nest: true
            });

            let result = doctors.map(doc => ({
                ...doc,
                description: descMap[doc.id] || ''
            }));

            resolve({ errCode: 0, data: result });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getProfileDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getClinicsBySpecialty,
    getDoctorsByClinicAndSpecialty,
}