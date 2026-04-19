import React, { useState, useEffect } from 'react';
import { getScheduleDoctorByDate } from '../services/doctorService';
import axios from '../../../app/axios';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DoctorSchedule = ({ doctorId, onSelectTime }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [days, setDays] = useState([]);

    useEffect(() => {
        // Tạo 7 ngày từ hôm nay
        const today = new Date();
        const next7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            d.setHours(0, 0, 0, 0);
            return d;
        });
        setDays(next7);
        setSelectedDate(next7[0]);
    }, []);

    useEffect(() => {
        if (!selectedDate || !doctorId) return;
        fetchSchedule(selectedDate);
    }, [selectedDate, doctorId]);

    const fetchSchedule = async (date) => {
        setIsLoading(true);
        setScheduleData([]);
        try {
            // Gọi API mới trả về kèm remainingSlots
            let res = await axios.get('/api/get-schedule-with-slots', {
                params: { doctorId, date: date.getTime() }
            });
            if (res?.data?.errCode === 0) {
                setScheduleData(res.data.data || []);
            } else {
                // Fallback về API cũ nếu route mới chưa có
                let res2 = await getScheduleDoctorByDate(doctorId, date.getTime());
                let raw = res2?.data?.data || [];
                setScheduleData(raw.map(s => ({
                    ...s,
                    remainingSlots: s.maxNumber - s.currentNumber,
                    isFull: s.currentNumber >= s.maxNumber
                })));
            }
        } catch (e) {
            console.log('fetchSchedule error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectSlot = (slot) => {
        if (slot.isFull) return;
        if (onSelectTime) {
            onSelectTime({
                timeType: slot.timeType,
                timeValue: slot.timeValue,
                date: selectedDate.getTime(),
                dateLabel: formatDateLabel(selectedDate),
                remainingSlots: slot.remainingSlots
            });
        }
    };

    const formatDateLabel = (date) => {
        const day = DAY_LABELS[date.getDay()];
        return `${day} - ${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <div className="mt-6">
            {/* 7 ngày */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {days.map((day, idx) => {
                    const isSelected = selectedDate?.getTime() === day.getTime();
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDate(day)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition
                                ${isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'
                                }`}
                        >
                            <div>{DAY_LABELS[day.getDay()]}</div>
                            <div className="text-xs">{day.getDate()}/{day.getMonth() + 1}</div>
                        </button>
                    );
                })}
            </div>

            {/* Slots */}
            {isLoading ? (
                <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-36 h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : scheduleData.length === 0 ? (
                <p className="text-gray-400 text-sm py-4">'There are no scheduled appointments for this day.'</p>
            ) : (
                <div className="flex gap-3 flex-wrap">
                    {scheduleData.map((slot) => (
                        <button
                            key={slot.timeType}
                            onClick={() => handleSelectSlot(slot)}
                            disabled={slot.isFull}
                            className={`relative flex flex-col items-center justify-center w-36 h-16 rounded-xl border-2 text-sm font-semibold transition
                                ${slot.isFull
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                                    : slot.remainingSlots <= 2
                                        ? 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100'
                                        : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400'
                                }`}
                        >
                            <span>{slot.timeValue}</span>
                            {/* Hiển thị số chỗ còn lại */}
                            {slot.isFull ? (
                                <span className="text-xs mt-0.5 text-gray-400">Hết chỗ</span>
                            ) : (
                                <span className={`text-xs mt-0.5 ${slot.remainingSlots <= 2 ? 'text-orange-500' : 'text-indigo-400'}`}>
                                    '{slot.remainingSlots} spots remaining'
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;