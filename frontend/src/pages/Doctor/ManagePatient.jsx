import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

// ─── Constants ────────────────────────────────────────────────
const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_FULL   = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const STATUS_CFG = {
    S1: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    S2: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800 border-blue-300' },
    S3: { label: 'Hoàn thành',   color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    S4: { label: 'Đã hủy',       color: 'bg-red-100 text-red-800 border-red-300' },
};

// ─── Helpers ──────────────────────────────────────────────────
const getMonday = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const formatDateShort = (d) =>
    `${new Date(d).getDate()}/${new Date(d).getMonth() + 1}`;

const formatDateFull = (d) => {
    const date = new Date(d);
    return `${DAY_FULL[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const isSameDay = (d1, d2) => {
    const a = new Date(d1), b = new Date(d2);
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
};

// ─── Sub-components ───────────────────────────────────────────
const StatusBadge = ({ statusId }) => {
    const cfg = STATUS_CFG[statusId] || STATUS_CFG.S1;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
            {cfg.label}
        </span>
    );
};

// Modal xem thông tin bệnh nhân + gửi hồ sơ
const PatientModal = ({ booking, onClose, onComplete, onSendRecord }) => {
    const [tab, setTab] = useState('info'); // 'info' | 'record'
    const [recordContent, setRecordContent] = useState('');
    const [sending, setSending] = useState(false);
    const [completing, setCompleting] = useState(false);

    if (!booking) return null;

    const handleComplete = async () => {
        setCompleting(true);
        await onComplete(booking.id);
        setCompleting(false);
        onClose();
    };

    const handleSend = async () => {
        if (!recordContent.trim()) {
            toast.warning('Vui lòng nhập nội dung hồ sơ/đơn thuốc!');
            return;
        }
        setSending(true);
        await onSendRecord(booking.id, recordContent);
        setSending(false);
        setRecordContent('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-lg">{booking.patientName}</h3>
                        <p className="text-indigo-200 text-sm mt-0.5">{formatDateFull(booking.date)} · {booking.timeValue}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none transition-colors">×</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    {[['info', '👤 Thông tin'], ['record', '📋 Hồ sơ / Đơn thuốc']].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                tab === key
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="p-6">
                    {tab === 'info' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 mb-4">
                                {booking.patientImage
                                    ? <img src={booking.patientImage} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100" />
                                    : <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-500">
                                        {booking.patientName?.[0] || '?'}
                                      </div>
                                }
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">{booking.patientName}</p>
                                    <StatusBadge statusId={booking.statusId} />
                                </div>
                            </div>
                            {[
                                ['📧 Email', booking.patientEmail],
                                ['📞 SĐT', booking.patientPhone],
                                ['🏠 Địa chỉ', booking.patientAddress],
                                ['💬 Lý do khám', booking.reason],
                            ].map(([label, value]) => value ? (
                                <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
                                    <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
                                    <span className="text-sm text-gray-800 font-medium">{value}</span>
                                </div>
                            ) : null)}

                            {/* Action button */}
                            {booking.statusId === 'S2' && (
                                <button
                                    onClick={handleComplete}
                                    disabled={completing}
                                    className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                                >
                                    {completing ? 'Đang xử lý...' : '✅ Đánh dấu hoàn thành'}
                                </button>
                            )}
                        </div>
                    )}

                    {tab === 'record' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Nhập nội dung hồ sơ khám bệnh, đơn thuốc hoặc hóa đơn để gửi qua email cho bệnh nhân.</p>
                            <textarea
                                value={recordContent}
                                onChange={e => setRecordContent(e.target.value)}
                                rows={8}
                                placeholder={`Đơn thuốc / Hồ sơ khám bệnh cho ${booking.patientName}\n\nNgày khám: ...\nChẩn đoán: ...\nĐơn thuốc:\n  1. ...\n  2. ...\nLưu ý: ...`}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                            >
                                {sending ? 'Đang gửi...' : '📤 Gửi qua email cho bệnh nhân'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────
const ManagePatient = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const doctorId = userInfo?.id;

    const [weekStart, setWeekStart]     = useState(getMonday());
    const [bookings, setBookings]       = useState([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [selectedDay, setSelectedDay] = useState(new Date()); // ngày đang xem chi tiết
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Các ngày trong tuần (Mon → Sun)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    // Fetch dữ liệu
    const fetchBookings = useCallback(async () => {
        if (!doctorId) return;
        setIsLoading(true);
        try {
            const res = await axios.get(
                `/api/get-bookings-by-doctor?doctorId=${doctorId}&weekStart=${weekStart.getTime()}`
            );
            if (res?.data?.errCode === 0) {
                setBookings(res.data.data || []);
            } else {
                toast.error('Không thể tải danh sách bệnh nhân!');
            }
        } catch (e) {
            toast.error('Lỗi kết nối máy chủ!');
        } finally {
            setIsLoading(false);
        }
    }, [doctorId, weekStart]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    // Điều hướng tuần
    const prevWeek = () => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() - 7);
        setWeekStart(d);
    };
    const nextWeek = () => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + 7);
        setWeekStart(d);
    };
    const goToday = () => {
        setWeekStart(getMonday());
        setSelectedDay(new Date());
    };

    // Bookings của ngày đang chọn
    const bookingsOfDay = bookings.filter(b => isSameDay(b.date, selectedDay));

    // Đếm booking theo ngày (cho calendar strip)
    const countByDay = (day) => bookings.filter(b => isSameDay(b.date, day)).length;

    // Action: hoàn thành
    const handleComplete = async (bookingId) => {
        try {
            const res = await axios.put('/api/complete-booking', { bookingId, doctorId });
            if (res?.data?.errCode === 0) {
                toast.success('Đã đánh dấu hoàn thành!');
                fetchBookings();
            } else {
                toast.error(res?.data?.errMessage || 'Lỗi!');
            }
        } catch {
            toast.error('Lỗi kết nối!');
        }
    };

    // Action: gửi hồ sơ
    const handleSendRecord = async (bookingId, content) => {
        try {
            const res = await axios.post('/api/send-medical-record', { bookingId, doctorId, content });
            if (res?.data?.errCode === 0) {
                toast.success('Đã gửi hồ sơ qua email!');
            } else {
                toast.error(res?.data?.errMessage || 'Gửi thất bại!');
            }
        } catch {
            toast.error('Lỗi kết nối!');
        }
    };

    const today = new Date();
    const weekLabel = `${formatDateShort(weekDays[0])} – ${formatDateShort(weekDays[6])}/${weekDays[6].getFullYear()}`;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {bookings.length} lịch hẹn trong tuần {weekLabel}
                        </p>
                    </div>
                    <button
                        onClick={goToday}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                        Hôm nay
                    </button>
                </div>

                {/* ── Week navigator ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={prevWeek} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                            ‹
                        </button>
                        <span className="text-sm font-semibold text-gray-700">Tuần {weekLabel}</span>
                        <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                            ›
                        </button>
                    </div>

                    {/* Day strip */}
                    <div className="grid grid-cols-7 gap-1">
                        {weekDays.map((day, i) => {
                            const isToday  = isSameDay(day, today);
                            const isActive = isSameDay(day, selectedDay);
                            const count    = countByDay(day);
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDay(day)}
                                    className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : isToday
                                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                            : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    <span className="text-xs font-medium mb-1">{DAY_LABELS[(i + 1) % 7]}</span>
                                    <span className="text-base font-bold">{day.getDate()}</span>
                                    {count > 0
                                        ? <span className={`mt-1 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                                            isActive ? 'bg-white/30 text-white' : 'bg-indigo-100 text-indigo-700'
                                          }`}>{count}</span>
                                        : <span className="mt-1 w-5 h-5" />
                                    }
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Patient list of selected day ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Sub-header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">
                            {formatDateFull(selectedDay)}
                        </h2>
                        <span className="text-sm text-gray-400">{bookingsOfDay.length} bệnh nhân</span>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Đang tải...</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && bookingsOfDay.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="text-5xl mb-3">📅</div>
                            <p className="text-gray-500 font-medium">Không có lịch hẹn nào</p>
                            <p className="text-gray-400 text-sm mt-1">Chọn ngày khác để xem</p>
                        </div>
                    )}

                    {/* Patient rows */}
                    {!isLoading && bookingsOfDay.map((booking, idx) => (
                        <div
                            key={booking.id}
                            className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                idx !== bookingsOfDay.length - 1 ? 'border-b border-gray-50' : ''
                            }`}
                            onClick={() => setSelectedBooking(booking)}
                        >
                            {/* Avatar */}
                            {booking.patientImage
                                ? <img src={booking.patientImage} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 shrink-0" />
                                : <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {booking.patientName?.[0] || '?'}
                                  </div>
                            }

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{booking.patientName}</p>
                                <p className="text-sm text-gray-500 truncate">{booking.patientEmail}</p>
                            </div>

                            {/* Time */}
                            <div className="text-center shrink-0">
                                <p className="text-sm font-semibold text-indigo-600">{booking.timeValue}</p>
                                <p className="text-xs text-gray-400">#{booking.id}</p>
                            </div>

                            {/* Status */}
                            <div className="shrink-0">
                                <StatusBadge statusId={booking.statusId} />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                                {booking.statusId === 'S2' && (
                                    <button
                                        onClick={() => handleComplete(booking.id).then(fetchBookings)}
                                        title="Đánh dấu hoàn thành"
                                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors text-sm"
                                    >
                                        ✅
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedBooking(booking)}
                                    title="Xem chi tiết"
                                    className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors text-sm"
                                >
                                    👁
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Summary stats ── */}
                {!isLoading && bookings.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        {[
                            { label: 'Chờ xác nhận', key: 'S1', color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'Đã xác nhận',  key: 'S2', color: 'text-blue-600',  bg: 'bg-blue-50' },
                            { label: 'Hoàn thành',   key: 'S3', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        ].map(({ label, key, color, bg }) => (
                            <div key={key} className={`${bg} rounded-xl p-4 text-center`}>
                                <p className={`text-2xl font-bold ${color}`}>
                                    {bookings.filter(b => b.statusId === key).length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            {selectedBooking && (
                <PatientModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onComplete={async (id) => { await handleComplete(id); fetchBookings(); }}
                    onSendRecord={handleSendRecord}
                />
            )}
        </div>
    );
};

export default ManagePatient;