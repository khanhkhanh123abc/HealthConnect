import db from "../models/index";

// Lấy danh sách Bác sĩ nổi bật (Dành cho trang chủ)
let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' }, // R2 là Role của Bác sĩ trong hệ thống
                order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất
                attributes: {
                    exclude: ['password'] // RẤT QUAN TRỌNG: Không bao giờ trả về mật khẩu
                },
                // Kết nối bảng (Join table) để lấy tên Chức danh (Ví dụ: Thạc sĩ, Tiến sĩ)
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                data: users
            });

        } catch (e) {
            reject(e);
        }
    })
}

// Lấy danh sách TẤT CẢ bác sĩ (Dành cho trang Admin chọn bác sĩ)
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'] // Ẩn password và image (vì image ở danh sách dài thường là base64 rất nặng, nhưng bạn dùng Supabase URL thì có thể bỏ 'image' đi)
                },
                raw: true
            });

            resolve({
                errCode: 0,
                data: doctors
            });
        } catch (e) {
            reject(e);
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Kiểm tra dữ liệu đầu vào (Validate)
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                // 2. XỬ LÝ BẢNG MARKDOWN (Bài viết giới thiệu)
                let markdown = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false // Phải để raw: false thì mới dùng hàm .save() được
                });

                if (markdown) {
                    // Nếu đã có -> Cập nhật
                    markdown.contentHTML = inputData.contentHTML;
                    markdown.contentMarkdown = inputData.contentMarkdown;
                    markdown.description = inputData.description;
                    // Cập nhật luôn chuyên khoa và phòng khám (nếu có truyền lên)
                    markdown.specialtyId = inputData.specialtyId;
                    markdown.clinicId = inputData.clinicId;
                    await markdown.save();
                } else {
                    // Nếu chưa có -> Tạo mới
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    });
                }

                // 3. XỬ LÝ BẢNG DOCTOR_INFO (Thông tin giá khám, địa chỉ...)
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                });

                if (doctorInfo) {
                    // Cập nhật
                    doctorInfo.priceId = inputData.priceId;
                    doctorInfo.provinceId = inputData.provinceId;
                    doctorInfo.paymentId = inputData.paymentId;
                    doctorInfo.note = inputData.note;
                    await doctorInfo.save();
                } else {
                    // Tạo mới
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.priceId,
                        provinceId: inputData.provinceId,
                        paymentId: inputData.paymentId,
                        note: inputData.note,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save doctor information succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor
}