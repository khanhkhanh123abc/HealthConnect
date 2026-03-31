import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllDoctors } from '../../services/doctorService';
import { getAllCodeService } from '../../services/userService';
import { saveBulkScheduleDoctor } from '../../services/doctorService';

const ManageSchedule = () => {
    const [listDoctors, setListDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [rangeTime, setRangeTime] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let [resDoctors, resTime] = await Promise.all([
                    getAllDoctors(),
                    getAllCodeService('TIME')
                ]);

                // getAllDoctors trả về axios response → response.data
                if (resDoctors && resDoctors.data && resDoctors.data.errCode === 0) {
                    setListDoctors(resDoctors.data.data);
                } else {
                    toast.error("Không thể tải danh sách bác sĩ!");
                }

                if (resTime && resTime.data && resTime.data.errCode === 0) {
                    let dataTimeWithStatus = resTime.data.data.map(item => ({
                        ...item,
                        isSelected: false
                    }));
                    setRangeTime(dataTimeWithStatus);
                } else {
                    toast.error("Không thể tải danh sách khung giờ!");
                }
            } catch (error) {
                console.log("Lỗi fetch data ManageSchedule:", error);
                toast.error("Lỗi kết nối máy chủ!");
            }
        };

        fetchData();
    }, []);

    const handleClickBtnTime = (time) => {
        if (!currentDate || !selectedDoctor) {
            toast.warn("Vui lòng chọn Bác sĩ và Ngày trước khi chọn giờ rảnh!");
            return;
        }

        let updatedRangeTime = rangeTime.map(item =>
            item.keyMap === time.keyMap
                ? { ...item, isSelected: !item.isSelected }
                : item
        );
        setRangeTime(updatedRangeTime);
    };

    const handleSaveSchedule = async () => {
        if (!selectedDoctor) { toast.error("Chưa chọn Bác sĩ!"); return; }
        if (!currentDate) { toast.error("Chưa chọn Ngày!"); return; }

        let selectedTimeSlots = rangeTime.filter(item => item.isSelected === true);
        if (selectedTimeSlots.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 khung giờ rảnh!");
            return;
        }

        setIsSaving(true);

        try {
            let formattedDate = new Date(currentDate).getTime();

            let schedules = selectedTimeSlots.map(schedule => ({
                doctorId: +selectedDoctor,
                date: formattedDate,
                timeType: schedule.keyMap
            }));

            let res = await saveBulkScheduleDoctor({
                schedules,
                doctorId: +selectedDoctor,
                date: formattedDate
            });

            if (res && res.data && res.data.errCode === 0) {
                toast.success("Lưu lịch khám thành công!");
                // Reset trạng thái isSelected
                setRangeTime(prev => prev.map(item => ({ ...item, isSelected: false })));
            } else {
                toast.error(res?.data?.errMessage || "Lỗi khi lưu lịch!");
            }
        } catch (error) {
            console.log("Lỗi save schedule:", error);
            toast.error("Lỗi kết nối máy chủ!");
        } finally {
            setIsSaving(false);
        }
    };

    // Ngày tối thiểu là hôm nay
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="p-6 md:p-10 bg-white min-h-screen rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase border-b pb-4">
                Quản lý kế hoạch khám bệnh
            </h1>

            {/* Chọn Bác sĩ & Ngày */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Chọn bác sĩ</label>
                    <select
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                        <option value="">--- Chọn bác sĩ ---</option>
                        {listDoctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                                {doc.lastName} {doc.firstName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Chọn ngày</label>
                    <input
                        type="date"
                        min={today}
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Khung giờ */}
            <div className="mb-8">
                <label className="font-semibold text-gray-700 block mb-4">
                    Chọn các khung giờ rảnh
                    {selectedDoctor && currentDate && (
                        <span className="ml-2 text-sm text-indigo-500 font-normal">
                            ({rangeTime.filter(t => t.isSelected).length} khung giờ đã chọn)
                        </span>
                    )}
                </label>
                <div className="flex flex-wrap gap-3">
                    {rangeTime.map((item) => (
                        <button
                            key={item.keyMap}
                            onClick={() => handleClickBtnTime(item)}
                            className={`px-5 py-2 rounded-lg font-medium transition-all shadow-sm border
                                ${item.isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-200 scale-105'
                                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            {item.value}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSaveSchedule}
                disabled={isSaving}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-lg transition shadow-md
                    ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isSaving ? 'Đang lưu...' : 'Lưu lịch khám'}
            </button>
        </div>
    );
};

export default ManageSchedule;