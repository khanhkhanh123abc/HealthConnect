import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllCodeService } from '../../services/userService';
import { saveBulkScheduleDoctor, getScheduleDoctorByDate } from '../../services/doctorService';
import axios from '../../utils/axios';

const ManageSchedule = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const doctorId = userInfo?.id; // ✅ Lấy từ Redux, không cần chọn

    const [currentDate, setCurrentDate] = useState('');
    const [rangeTime, setRangeTime] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [maxNumber, setMaxNumber] = useState(1);

    // ✅ Map ngày → set timeType đã có lịch (để highlight calendar)
    const [scheduledDates, setScheduledDates] = useState({}); // { '2026-04-06': ['T1','T2'], ... }
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Load danh sách time slots
    useEffect(() => {
        const fetchTime = async () => {
            try {
                let resTime = await getAllCodeService('TIME');
                if (resTime?.data?.errCode === 0) {
                    setRangeTime(resTime.data.data.map(item => ({ ...item, isSelected: false })));
                }
            } catch (_e) {
                toast.error('Không thể tải khung giờ!');
            }
        };
        fetchTime();
    }, []);

    // ✅ Khi đổi ngày → load lịch đã có của ngày đó → highlight slot
    const loadScheduleForDate = useCallback(async (dateStr) => {
        if (!doctorId || !dateStr) return;
        setIsLoadingSlots(true);
        try {
            const timestamp = new Date(dateStr).getTime();
            let res = await axios.get(`/api/get-schedule-with-slots?doctorId=${doctorId}&date=${timestamp}`);
            const slots = res?.data?.data || [];

            // Lấy danh sách timeType đã có lịch trong ngày này
            const existingTimeTypes = slots.map(s => s.timeType);

            // Cập nhật scheduledDates
            setScheduledDates(prev => ({
                ...prev,
                [dateStr]: existingTimeTypes
            }));

            // ✅ Highlight những slot đã có lịch
            setRangeTime(prev => prev.map(item => ({
                ...item,
                isSelected: existingTimeTypes.includes(item.keyMap),
                // Lưu maxNumber từ slot đầu tiên nếu có
            })));

            // Lấy maxNumber từ slot đầu tiên
            if (slots.length > 0) {
                setMaxNumber(slots[0].maxNumber || 1);
            } else {
                setMaxNumber(1);
            }
        } catch (_e) {
            // Không có lịch → reset
            setRangeTime(prev => prev.map(item => ({ ...item, isSelected: false })));
        } finally {
            setIsLoadingSlots(false);
        }
    }, [doctorId]);

    const handleDateChange = (e) => {
        const dateStr = e.target.value;
        setCurrentDate(dateStr);
        loadScheduleForDate(dateStr);
    };

    const handleClickBtnTime = (time) => {
        if (!currentDate) {
            toast.warn('Vui lòng chọn Ngày trước khi chọn giờ rảnh!');
            return;
        }
        setRangeTime(prev => prev.map(item =>
            item.keyMap === time.keyMap ? { ...item, isSelected: !item.isSelected } : item
        ));
    };

    const handleSaveSchedule = async () => {
        if (!currentDate) { toast.error('Chưa chọn Ngày!'); return; }

        const selectedTimeSlots = rangeTime.filter(item => item.isSelected);
        if (selectedTimeSlots.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 khung giờ rảnh!');
            return;
        }

        setIsSaving(true);
        try {
            const formattedDate = new Date(currentDate).getTime();
            const schedules = selectedTimeSlots.map(s => ({
                doctorId: +doctorId,
                date: formattedDate,
                timeType: s.keyMap
            }));

            let res = await saveBulkScheduleDoctor({
                schedules,
                doctorId: +doctorId,
                date: formattedDate,
                maxNumber: +maxNumber
            });

            if (res?.data?.errCode === 0) {
                toast.success('Lưu lịch khám thành công!');
                // Cập nhật scheduledDates để highlight ngày này
                setScheduledDates(prev => ({
                    ...prev,
                    [currentDate]: selectedTimeSlots.map(s => s.keyMap)
                }));
            } else {
                toast.error(res?.data?.errMessage || 'Lỗi khi lưu lịch!');
            }
        } catch (_e) {
            toast.error('Lỗi kết nối máy chủ!');
        } finally {
            setIsSaving(false);
        }
    };

    // ✅ Kiểm tra ngày đã có lịch chưa (để hiện badge)
    const hasSchedule = (dateStr) => {
        return scheduledDates[dateStr] && scheduledDates[dateStr].length > 0;
    };

    const selectedCount = rangeTime.filter(t => t.isSelected).length;
    const doctorName = `${userInfo?.lastName || ''} ${userInfo?.firstName || ''}`.trim();

    return (
        <div className="p-6 md:p-10 bg-white min-h-screen rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 uppercase border-b pb-4">
                Quản lý kế hoạch khám bệnh
            </h1>

            {/* Doctor info */}
            <div className="flex items-center gap-3 mb-6 mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {doctorName[0] || 'D'}
                </div>
                <div>
                    <p className="font-semibold text-indigo-800 text-sm">BS. {doctorName}</p>
                    <p className="text-xs text-indigo-400">Đang quản lý lịch khám của bạn</p>
                </div>
            </div>

            {/* Chọn ngày */}
            <div className="mb-6">
                <label className="font-semibold text-gray-700 block mb-2">Chọn ngày</label>
                <div className="relative inline-block">
                    <input
                        type="date"
                        min={today}
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 w-64"
                        value={currentDate}
                        onChange={handleDateChange}
                    />
                    {/* ✅ Highlight badge nếu ngày đã có lịch */}
                    {currentDate && hasSchedule(currentDate) && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            Đã có lịch
                        </span>
                    )}
                </div>

                {/* Loading indicator */}
                {isLoadingSlots && (
                    <span className="ml-3 text-sm text-indigo-500 animate-pulse">Đang tải lịch...</span>
                )}

                {/* Thông tin ngày đã chọn */}
                {currentDate && !isLoadingSlots && (
                    <p className="mt-2 text-sm text-gray-500">
                        {hasSchedule(currentDate)
                            ? `✅ Ngày này đã có ${scheduledDates[currentDate]?.length} khung giờ. Bạn có thể chỉnh sửa bên dưới.`
                            : '📭 Ngày này chưa có lịch khám. Chọn khung giờ và lưu.'
                        }
                    </p>
                )}
            </div>

            {/* Số bệnh nhân / slot */}
            <div className="mb-8 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-6">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="font-semibold text-indigo-800 text-sm">
                        Số bệnh nhân tối đa mỗi khung giờ
                    </label>
                    <p className="text-xs text-indigo-500">Áp dụng chung cho tất cả khung giờ trong ngày đã chọn</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setMaxNumber(prev => Math.max(1, +prev - 1))}
                        className="w-9 h-9 rounded-full border-2 border-indigo-400 text-indigo-600 font-bold text-lg flex items-center justify-center hover:bg-indigo-100 transition">
                        −
                    </button>
                    <span className="text-2xl font-bold text-indigo-700 w-10 text-center">{maxNumber}</span>
                    <button onClick={() => setMaxNumber(prev => Math.min(20, +prev + 1))}
                        className="w-9 h-9 rounded-full border-2 border-indigo-400 text-indigo-600 font-bold text-lg flex items-center justify-center hover:bg-indigo-100 transition">
                        +
                    </button>
                    <span className="text-sm text-indigo-500 ml-1">bệnh nhân</span>
                </div>
            </div>

            {/* Khung giờ */}
            <div className="mb-8">
                <label className="font-semibold text-gray-700 block mb-4">
                    Chọn các khung giờ rảnh
                    {currentDate && (
                        <span className="ml-2 text-sm text-indigo-500 font-normal">
                            ({selectedCount} khung giờ đã chọn)
                        </span>
                    )}
                </label>

                {isLoadingSlots ? (
                    <div className="flex gap-3 flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="w-36 h-10 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {rangeTime.map(item => (
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
                )}
            </div>

            <button
                onClick={handleSaveSchedule}
                disabled={isSaving || !currentDate}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-lg transition shadow-md
                    ${(isSaving || !currentDate) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isSaving ? 'Đang lưu...' : 'Lưu lịch khám'}
            </button>
        </div>
    );
};

export default ManageSchedule;
