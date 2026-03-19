import doctorService from "../services/doctorService";

// Lấy danh sách bác sĩ nổi bật
let getTopDoctorHome = async (req, res) => {
    // Lấy tham số limit từ đường dẫn (ví dụ: ?limit=10)
    let limit = req.query.limit;
    if (!limit) limit = 10; // Nếu frontend không truyền, mặc định lấy 10 người

    try {
        // Gọi hàm bên file Service, thêm dấu + để ép kiểu string thành số (integer)
        let response = await doctorService.getTopDoctorHome(+limit);
        
        // Trả kết quả về cho Frontend
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi tại getTopDoctorHome Controller: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        });
    }
}

// Lấy tất cả bác sĩ
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log("Lỗi tại getAllDoctors Controller: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        });
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Lỗi tại postInforDoctor Controller: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor
}