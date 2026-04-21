import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Calendar, Users, Save } from 'lucide-react';
import { getAllCodeService } from '../../auth/services/userService';
import { saveBulkScheduleDoctor } from '../services/doctorService';
import axios from '../../../app/axios';

const ManageSchedule = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const doctorId = userInfo?.id;

    const [currentDate, setCurrentDate] = useState('');
    const [rangeTime, setRangeTime] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [maxNumber, setMaxNumber] = useState(1);
    const [scheduledDates, setScheduledDates] = useState({});
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchTime = async () => {
            try {
                let resTime = await getAllCodeService('TIME');
                if (resTime?.data?.errCode === 0)
                    setRangeTime(resTime.data.data.map(item => ({ ...item, isSelected: false })));
            } catch {
                toast.error('Failed to load time slots.');
            }
        };
        fetchTime();
    }, []);

    const loadScheduleForDate = useCallback(async (dateStr) => {
        if (!doctorId || !dateStr) return;
        setIsLoadingSlots(true);
        try {
            const timestamp = new Date(dateStr).getTime();
            let res = await axios.get(`/api/get-schedule-with-slots?doctorId=${doctorId}&date=${timestamp}`);
            const slots = res?.data?.data || [];
            const existingTimeTypes = slots.map(s => s.timeType);
            setScheduledDates(prev => ({ ...prev, [dateStr]: existingTimeTypes }));
            setRangeTime(prev => prev.map(item => ({ ...item, isSelected: existingTimeTypes.includes(item.keyMap) })));
            setMaxNumber(slots.length > 0 ? (slots[0].maxNumber || 1) : 1);
        } catch {
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
        if (!currentDate) { toast.warn('Please select a date first.'); return; }
        setRangeTime(prev => prev.map(item =>
            item.keyMap === time.keyMap ? { ...item, isSelected: !item.isSelected } : item
        ));
    };

    const handleSaveSchedule = async () => {
        if (!currentDate) { toast.error('Please select a date.'); return; }
        const selectedTimeSlots = rangeTime.filter(item => item.isSelected);
        if (selectedTimeSlots.length === 0) { toast.error('Please select at least one time slot.'); return; }

        setIsSaving(true);
        try {
            const formattedDate = new Date(currentDate).getTime();
            let res = await saveBulkScheduleDoctor({
                schedules: selectedTimeSlots.map(s => ({ doctorId: +doctorId, date: formattedDate, timeType: s.keyMap })),
                doctorId: +doctorId,
                date: formattedDate,
                maxNumber: +maxNumber
            });
            if (res?.data?.errCode === 0) {
                toast.success('Schedule saved successfully.');
                setScheduledDates(prev => ({ ...prev, [currentDate]: selectedTimeSlots.map(s => s.keyMap) }));
            } else {
                toast.error(res?.data?.errMessage || 'Failed to save schedule.');
            }
        } catch {
            toast.error('Connection error. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const hasSchedule = (dateStr) => scheduledDates[dateStr]?.length > 0;
    const selectedCount = rangeTime.filter(t => t.isSelected).length;
    const doctorName = `${userInfo?.lastName || ''} ${userInfo?.firstName || ''}`.trim();

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Schedule Management</h1>
                <p className="text-sm text-gray-500 mt-1">Set up your available appointment slots</p>
            </div>

            {/* Doctor info */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {doctorName[0] || 'D'}
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-900">Dr. {doctorName}</p>
                    <p className="text-xs text-blue-500 mt-0.5">Managing your appointment schedule</p>
                </div>
            </div>

            <div className="space-y-4">

                {/* Date picker */}
                <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                        <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                        Select Date
                    </label>
                    <div className="relative inline-block">
                        <input type="date" min={today}
                            className="bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all w-56"
                            value={currentDate} onChange={handleDateChange} />
                        {currentDate && hasSchedule(currentDate) && (
                            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                                Scheduled
                            </span>
                        )}
                    </div>
                    {isLoadingSlots && (
                        <span className="ml-3 text-xs text-blue-500 animate-pulse">Loading schedule...</span>
                    )}
                    {currentDate && !isLoadingSlots && (
                        <p className="mt-2 text-xs text-gray-500">
                            {hasSchedule(currentDate)
                                ? `This date has ${scheduledDates[currentDate]?.length} time slot(s). You can edit them below.`
                                : 'No schedule for this date. Select time slots and save.'}
                        </p>
                    )}
                </div>

                {/* Max patients per slot */}
                <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-0.5">
                                <Users className="w-3.5 h-3.5" />
                                Max patients per slot
                            </div>
                            <p className="text-xs text-gray-400">Applies to all slots on the selected date</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMaxNumber(prev => Math.max(1, +prev - 1))}
                                className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 font-semibold text-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                                −
                            </button>
                            <span className="text-2xl font-semibold text-gray-900 w-8 text-center">{maxNumber}</span>
                            <button onClick={() => setMaxNumber(prev => Math.min(20, +prev + 1))}
                                className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 font-semibold text-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Time slots */}
                <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                    <p className="text-xs font-medium text-gray-500 mb-3">
                        Select available time slots
                        {currentDate && selectedCount > 0 && (
                            <span className="ml-2 text-blue-600 font-medium">({selectedCount} selected)</span>
                        )}
                    </p>

                    {isLoadingSlots ? (
                        <div className="flex gap-3 flex-wrap">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-32 h-10 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2.5">
                            {rangeTime.map(item => (
                                <button key={item.keyMap} onClick={() => handleClickBtnTime(item)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${item.isSelected
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    {item.value}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save button */}
                <button onClick={handleSaveSchedule} disabled={isSaving || !currentDate}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Schedule'}
                </button>
            </div>
        </div>
    );
};

export default ManageSchedule;
