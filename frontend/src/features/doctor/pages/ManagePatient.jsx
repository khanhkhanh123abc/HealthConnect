import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../app/axios';
import { toast } from 'react-toastify';

// ─── Constants ────────────────────────────────────────────────
const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_FULL = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const STATUS_CFG = {
    S1: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    S2: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    S3: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    S4: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-300' },
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

const formatDateShort = (d) => `${new Date(d).getDate()}/${new Date(d).getMonth() + 1}`;

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

const PatientModal = ({ booking, onClose, onComplete, onSendRecord }) => {
    const [tab, setTab] = useState('info');
    const [recordContent, setRecordContent] = useState('');
    const [loading, setLoading] = useState(false);

    if (!booking) return null;

    const handleAction = async (actionFn, ...args) => {
        setLoading(true);
        await actionFn(...args);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-lg">{booking.patientName}</h3>
                        <p className="text-indigo-200 text-sm mt-0.5">{formatDateFull(booking.date)} · {booking.timeValue}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
                </div>

                <div className="flex border-b border-gray-100">
                    {[['info', '👤 Thông tin'], ['record', '📋 Hồ sơ / Đơn thuốc']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === key ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {tab === 'info' ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-500 overflow-hidden">
                                    {booking.patientImage ? <img src={booking.patientImage} alt="" className="w-full h-full object-cover" /> : (booking.patientName?.[0] || '?')}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">{booking.patientName}</p>
                                    <StatusBadge statusId={booking.statusId} />
                                </div>
                            </div>
                            {[['📧 Email', booking.patientEmail], ['📞 SĐT', booking.patientPhone], ['🏠 Địa chỉ', booking.patientAddress], ['💬 Lý do khám', booking.reason]].map(([label, value]) => value && (
                                <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
                                    <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
                                    <span className="text-sm text-gray-800 font-medium">{value}</span>
                                </div>
                            ))}
                            {booking.statusId === 'S2' && (
                                <button onClick={() => handleAction(onComplete, booking.id)} disabled={loading}
                                    className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition disabled:opacity-60">
                                    {loading ? 'Đang xử lý...' : '✅ Đánh dấu hoàn thành'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <textarea value={recordContent} onChange={e => setRecordContent(e.target.value)} rows={8}
                                placeholder="Nhập nội dung hồ sơ/đơn thuốc..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-indigo-400 outline-none resize-none" />
                            <button onClick={() => handleAction(onSendRecord, booking.id, recordContent)} disabled={loading}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition disabled:opacity-60">
                                {loading ? 'Đang gửi...' : '📤 Gửi hồ sơ qua Email'}
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

    const [weekStart, setWeekStart] = useState(getMonday());
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancelModal, setCancelModal] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    }), [weekStart]);

    const fetchBookings = useCallback(async () => {
        if (!doctorId) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/get-bookings-by-doctor?doctorId=${doctorId}&weekStart=${weekStart.getTime()}`);
            if (res?.data?.errCode === 0) setBookings(res.data.data || []);
        } catch (e) {
            toast.error('Lỗi kết nối máy chủ!');
        } finally {
            setIsLoading(false);
        }
    }, [doctorId, weekStart]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const bookingsOfDay = useMemo(() => bookings.filter(b => isSameDay(b.date, selectedDay)), [bookings, selectedDay]);

    const stats = useMemo(() => ({
        S1: bookings.filter(b => b.statusId === 'S1').length,
        S2: bookings.filter(b => b.statusId === 'S2').length,
        S3: bookings.filter(b => b.statusId === 'S3').length,
    }), [bookings]);

    const handleComplete = async (bookingId) => {
        try {
            const res = await axios.put('/api/complete-booking', { bookingId, doctorId });
            if (res?.data?.errCode === 0) {
                toast.success('Đã hoàn thành!');
                fetchBookings();
                setSelectedBooking(null);
            }
        } catch { toast.error('Lỗi kết nối!'); }
    };

    const handleDoctorCancel = async () => {
        if (!cancelModal) return;
        setCancelling(true);
        try {
            const res = await axios.put('/api/doctor-cancel-booking', {
                bookingId: cancelModal.id,
                doctorId,
                cancelReason: cancelReason.trim() || 'Bác sĩ hủy lịch'
            });
            if (res?.data?.errCode === 0) {
                toast.success('Đã hủy lịch!');
                setCancelModal(null);
                setCancelReason('');
                fetchBookings();
            } else {
                toast.error(res?.data?.errMessage || 'Hủy thất bại!');
            }
        } catch { toast.error('Lỗi kết nối!'); }
        finally { setCancelling(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân</h1>
                        <p className="text-sm text-gray-500">Tuần từ {formatDateShort(weekDays[0])} đến {formatDateShort(weekDays[6])}</p>
                    </div>
                    <button onClick={() => { setWeekStart(getMonday()); setSelectedDay(new Date()); }}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                        Hôm nay
                    </button>
                </div>

                {/* Week Navigator */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => setWeekStart(prev => new Date(prev.setDate(prev.getDate() - 7)))} className="p-2 hover:bg-gray-100 rounded-full">‹</button>
                        <span className="text-sm font-bold text-gray-700">Tháng {selectedDay.getMonth() + 1} / {selectedDay.getFullYear()}</span>
                        <button onClick={() => setWeekStart(prev => new Date(prev.setDate(prev.getDate() + 7)))} className="p-2 hover:bg-gray-100 rounded-full">›</button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, i) => {
                            const isActive = isSameDay(day, selectedDay);
                            const count = bookings.filter(b => isSameDay(b.date, day)).length;
                            return (
                                <button key={i} onClick={() => setSelectedDay(day)}
                                    className={`flex flex-col items-center py-3 rounded-xl transition ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}>
                                    <span className="text-[10px] font-bold uppercase opacity-70">{DAY_LABELS[day.getDay()]}</span>
                                    <span className="text-lg font-black">{day.getDate()}</span>
                                    {count > 0 && <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isActive ? 'bg-white' : 'bg-indigo-500'}`} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Patient List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-800">{formatDateFull(selectedDay)}</h2>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{bookingsOfDay.length} LỊCH HẸN</span>
                    </div>

                    {isLoading ? (
                        <div className="p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" /></div>
                    ) : bookingsOfDay.length === 0 ? (
                        <div className="py-20 text-center text-gray-400">
                            <p className="text-4xl mb-2">🍃</p>
                            <p>Không có lịch hẹn nào cho ngày này</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {bookingsOfDay.map((booking) => (
                                <div key={booking.id} onClick={() => setSelectedBooking(booking)}
                                    className="flex items-center gap-4 px-6 py-5 hover:bg-indigo-50/30 transition cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                                        {booking.patientImage ? <img src={booking.patientImage} className="w-full h-full rounded-full object-cover" alt=""/> : booking.patientName?.[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{booking.patientName}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-bold text-indigo-500">{booking.timeValue}</span>
                                            <span className="text-gray-300">•</span>
                                            <StatusBadge statusId={booking.statusId} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                        {['S1', 'S2'].includes(booking.statusId) && (
                                            <button onClick={() => setCancelModal(booking)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">❌</button>
                                        )}
                                        <button onClick={() => setSelectedBooking(booking)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">👁</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    {[['Chờ khám', stats.S1, 'bg-amber-50 text-amber-600'], ['Đã xác nhận', stats.S2, 'bg-blue-50 text-blue-600'], ['Hoàn thành', stats.S3, 'bg-emerald-50 text-emerald-600']].map(([label, val, style]) => (
                        <div key={label} className={`${style} p-4 rounded-2xl border border-current border-opacity-10 text-center shadow-sm`}>
                            <p className="text-2xl font-black">{val}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {selectedBooking && (
                <PatientModal 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)} 
                    onComplete={handleComplete} 
                    onSendRecord={handleSendRecord} 
                />
            )}

            {cancelModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="bg-red-600 p-6 text-white">
                            <h3 className="font-bold text-xl">Xác nhận hủy lịch</h3>
                            <p className="text-red-100 text-sm mt-1">{cancelModal.patientName} - {cancelModal.timeValue}</p>
                        </div>
                        <div className="p-6">
                            {cancelModal.statusId === 'S2' && cancelModal.paymentMethod === 'BANK' && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg font-medium">
                                    ⚠️ Lịch đã thanh toán. Hệ thống sẽ hoàn tiền tự động cho bệnh nhân.
                                </div>
                            )}
                            <label className="text-xs font-bold text-gray-500 uppercase">Lý do hủy</label>
                            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 mt-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" rows={3} placeholder="Bác sĩ bận việc đột xuất..." />
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => {setCancelModal(null); setCancelReason('');}} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition">Đóng</button>
                                <button onClick={handleDoctorCancel} disabled={cancelling} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition disabled:opacity-50">
                                    {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatient;