import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// Đường dẫn import đã được chỉnh lại chuẩn theo thư mục trong ảnh của bạn
import { getAllDoctors } from '../../services/doctorService'; 
import { getAllCodeService } from '../../services/userService'; 

const ManageSchedule = () => {
    const [listDoctors, setListDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [rangeTime, setRangeTime] = useState([]);

    // 1. Lấy danh sách Bác sĩ và Danh sách Giờ (T1 -> T8) từ Database
    useEffect(() => {
        const fetchData = async () => {
            try {
                let resDoctors = await getAllDoctors();
                let resTime = await getAllCodeService('TIME');

                if (resDoctors && resDoctors.errCode === 0) {
                    setListDoctors(resDoctors.data);
                } else {
                    toast.error("Không thể tải danh sách bác sĩ!");
                }

                if (resTime && resTime.errCode === 0) {
                    // Thêm trạng thái isSelected để làm hiệu ứng click đổi màu
                    let dataTimeWithStatus = resTime.data.map(item => ({
                        ...item,
                        isSelected: false 
                    }));
                    setRangeTime(dataTimeWithStatus);
                } else {
                    toast.error("Không thể tải danh sách khung giờ!");
                }
            } catch (error) {
                console.log("Lỗi fetch data ManageSchedule: ", error);
                toast.error("Lỗi kết nối máy chủ!");
            }
        };
        fetchData();
    }, []);

    // 2. Logic khi click vào 1 nút giờ
    const handleClickBtnTime = (time) => {
        if (!currentDate || !selectedDoctor) {
            toast.error("Vui lòng chọn Bác sĩ và Ngày trước khi chọn giờ rảnh!");
            return;
        }

        let updatedRangeTime = rangeTime.map(item => {
            if (item.keyMap === time.keyMap) {
                return { ...item, isSelected: !item.isSelected };
            }
            return item;
        });

        setRangeTime(updatedRangeTime);
    };

    // 3. Logic khi bấm nút Lưu
    const handleSaveSchedule = () => {
        if (!selectedDoctor) {
            toast.error("Chưa chọn Bác sĩ!"); return;
        }
        if (!currentDate) {
            toast.error("Chưa chọn Ngày!"); return;
        }

        let selectedTimeSlots = rangeTime.filter(item => item.isSelected === true);

        if (selectedTimeSlots.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 khung giờ rảnh!"); return;
        }

        let formattedDate = new Date(currentDate).getTime(); 
        let result = [];

        selectedTimeSlots.map(schedule => {
            let object = {};
            object.doctorId = selectedDoctor;
            object.date = formattedDate;
            object.timeType = schedule.keyMap;
            result.push(object);
        });

        console.log("🚀 DỮ LIỆU SẼ GỬI XUỐNG BACKEND: ", result);
        toast.success("Tạo mảng dữ liệu thành công! (Check Console F12)");
    };

    return (
        <div className="p-6 md:p-10 bg-white min-h-screen rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase border-b pb-4">
                Quản lý kế hoạch khám bệnh của Bác sĩ
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Chọn bác sĩ</label>
                    <select 
                        className="border border-gray-300 rounded p-2 outline-none focus:border-blue-500"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                        <option value="">--- Chọn bác sĩ ---</option>
                        {listDoctors && listDoctors.map((doc, index) => (
                            <option key={index} value={doc.id}>
                                Bác sĩ {doc.lastName} {doc.firstName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Chọn ngày</label>
                    <input 
                        type="date" 
                        className="border border-gray-300 rounded p-2 outline-none focus:border-blue-500"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} 
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="font-semibold text-gray-700 block mb-4">Lựa chọn các khung giờ rảnh</label>
                <div className="flex flex-wrap gap-4">
                    {rangeTime && rangeTime.map((item, index) => {
                        return (
                            <button 
                                key={index}
                                onClick={() => handleClickBtnTime(item)}
                                className={`px-6 py-2 rounded font-medium transition shadow-sm border 
                                    ${item.isSelected 
                                        ? 'bg-yellow-400 text-white border-yellow-500 shadow-md transform scale-105' 
                                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                    }`}
                            >
                                {item.value}
                            </button>
                        )
                    })}
                </div>
            </div>

            <button 
                onClick={handleSaveSchedule}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded transition"
            >
                Lưu thông tin
            </button>
        </div>
    );
};

export default ManageSchedule;