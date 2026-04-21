import React, { useState, useEffect } from 'react';
import { getScheduleDoctorByDate } from '../../features/doctor/services/doctorService';
import axios from '../../app/axios';
import { DAY_EN } from '../utils/dateHelpers';

const DoctorSchedule = ({ doctorId, onSelectTime }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [days, setDays] = useState([]);

    useEffect(() => {
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
            let res = await axios.get('/api/get-schedule-with-slots', {
                params: { doctorId, date: date.getTime() }
            });
            if (res?.data?.errCode === 0) {
                setScheduleData(res.data.data || []);
            } else {
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
                dateLabel: `${DAY_EN[selectedDate.getDay()]} - ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`,
                remainingSlots: slot.remainingSlots
            });
        }
    };

    return (
        <div className="mt-2">
            {/* Day picker */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {days.map((day, idx) => {
                    const isSelected = selectedDate?.getTime() === day.getTime();
                    return (
                        <button key={idx} onClick={() => setSelectedDate(day)}
                            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${isSelected
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            <span className="text-xs">{DAY_EN[day.getDay()]}</span>
                            <span className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                {day.getDate()}
                            </span>
                            <span className="text-[10px] opacity-70">{day.getMonth() + 1}</span>
                        </button>
                    );
                })}
            </div>

            {/* Slots */}
            {isLoading ? (
                <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-32 h-14 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : scheduleData.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No appointments available for this day.</p>
            ) : (
                <div className="flex gap-2.5 flex-wrap">
                    {scheduleData.map((slot) => (
                        <button key={slot.timeType} onClick={() => handleSelectSlot(slot)}
                            disabled={slot.isFull}
                            className={`flex flex-col items-center justify-center w-32 h-14 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${slot.isFull
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                : slot.remainingSlots <= 2
                                    ? 'bg-orange-50 ring-1 ring-orange-200 text-orange-700 hover:bg-orange-100'
                                    : 'bg-blue-50 ring-1 ring-blue-200 text-blue-700 hover:bg-blue-100'}`}>
                            <span>{slot.timeValue}</span>
                            <span className={`text-[10px] mt-0.5 ${slot.isFull ? 'text-gray-400' : slot.remainingSlots <= 2 ? 'text-orange-500' : 'text-blue-400'}`}>
                                {slot.isFull ? 'Full' : `${slot.remainingSlots} left`}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;
