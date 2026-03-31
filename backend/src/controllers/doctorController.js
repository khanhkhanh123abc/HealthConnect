import doctorService from "../services/doctorService";

// Lấy danh sách bác sĩ nổi bật (trang chủ)
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi getTopDoctorHome:", e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from the server...' });
    }
}

// Lấy tất cả bác sĩ (admin)
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log("Lỗi getAllDoctors:", e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from the server...' });
    }
}

// Lưu thông tin bác sĩ (admin)
let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi postInforDoctor:", e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
}

// W8: Lấy profile bác sĩ (có province + clinic)
let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) {
        console.log("Lỗi getProfileDoctorById:", e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

// W9: Bác sĩ tạo lịch rảnh hàng loạt
let bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi bulkCreateSchedule:", e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

// W9: Bệnh nhân xem lịch rảnh của bác sĩ theo ngày
let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDate(
            req.query.doctorId,
            req.query.date
        );
        return res.status(200).json(info);
    } catch (e) {
        console.log("Lỗi getScheduleByDate:", e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctor,
    getProfileDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
}