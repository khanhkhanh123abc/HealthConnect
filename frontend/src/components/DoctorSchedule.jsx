import React, { useState, useEffect } from 'react';

const DoctorSchedule = ({ doctorId }) => {
    const [allDays, setAllDays] = useState([]);
    const [allAvailableTime, setAllAvailableTime] = useState([]);

    // Hàm tự động tạo danh sách 7 ngày tới (Không cần cài thêm thư viện)
    useEffect(() => {
        let arrDays = [];
        for (let i = 0; i < 7; i++) {
            let date = new Date();
            date.setDate(date.getDate() + i);
            
            let dd = String(date.getDate()).padStart(2, '0');
            let mm = String(date.getMonth() + 1).padStart(2, '0');
            let dayName = i === 0 ? 'Hôm nay' : date.toLocaleDateString('vi-VN', { weekday: 'long' });
            
            // Viết hoa chữ cái đầu của tên thứ
            dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

            arrDays.push({
                label: `${dayName} - ${dd}/${mm}`,
                value: date.getTime() // Lưu timestamp để gọi API sau này
            });
        }
        setAllDays(arrDays);
        
        // FAKE DATA Khung giờ (Lát nữa sẽ gọi API getScheduleDoctorByDate ở đây)
        setAllAvailableTime([
            { timeType: 'T1', timeDisplay: '08:00 - 09:00' },
            { timeType: 'T2', timeDisplay: '09:00 - 10:00' },
            { timeType: 'T3', timeDisplay: '10:00 - 11:00' },
            { timeType: 'T4', timeDisplay: '14:00 - 15:00' },
        ]);
    }, [doctorId]);

    const handleOnChangeSelect = (event) => {
        // Lấy value (timestamp) của ngày được chọn
        let dateValue = event.target.value;
        console.log("Ngày chọn: ", dateValue);
        // TODO: Gọi API lấy khung giờ theo dateValue và doctorId
    };

    return (
        <div className="flex flex-col gap-4">
            {/* 1. Thanh chọn Ngày */}
            <div className="w-48">
                <select 
                    className="w-full text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 outline-none bg-transparent cursor-pointer uppercase text-sm"
                    onChange={(event) => handleOnChangeSelect(event)}
                >
                    {allDays && allDays.length > 0 && allDays.map((item, index) => {
                        return (
                            <option value={item.value} key={index} className="text-black">
                                {item.label}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* 2. Tiêu đề Lịch khám */}
            <div className="font-semibold text-gray-800 uppercase flex items-center gap-2 mt-2">
                <span className="text-xl">📅</span> Lịch khám
            </div>

            {/* 3. Lưới các nút Khung giờ */}
            <div className="flex flex-wrap gap-3">
                {allAvailableTime && allAvailableTime.length > 0 ? (
                    allAvailableTime.map((item, index) => {
                        return (
                            <button 
                                key={index}
                                className="px-4 py-2 bg-yellow-100/50 text-gray-800 font-medium rounded hover:bg-yellow-400 hover:text-white transition shadow-sm border border-yellow-300"
                            >
                                {item.timeDisplay}
                            </button>
                        )
                    })
                ) : (
                    <div className="text-gray-500 italic text-sm py-4">
                        Bác sĩ không có lịch hẹn vào ngày này. Vui lòng chọn ngày khác!
                    </div>
                )}
            </div>

            {/* 4. Dòng chú thích */}
            {allAvailableTime && allAvailableTime.length > 0 && (
                <div className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    Chọn <span className="inline-block w-4 h-4 bg-yellow-400 rounded-sm"></span> và đặt (Miễn phí)
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;