import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../app/axios';
import { toast } from 'react-toastify';

// ─── Constants ────────────────────────────────────────────────
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const STATUS_CFG = {
    S1: { label: 'Pending',   color: 'bg-amber-100 text-amber-800 border-amber-300' },
    S2: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    S3: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    S4: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' },
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

const PatientModal = ({ booking, onClose, onComplete, onSendPrescription }) => {
    const [tab, setTab] = useState('info');
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState([{ name: '', dosage: '' }]);
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    const addMed = () => setMedications(prev => [...prev, { name: '', dosage: '' }]);
    const updateMed = (i, field, val) => setMedications(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
    const removeMed = (i) => setMedications(prev => prev.filter((_, idx) => idx !== i));

    if (!booking) return null;

    const handleAction = async (actionFn, ...args) => {
        setLoading(true);
        await actionFn(...args);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{booking.patientName}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{formatDateFull(booking.date)} · {booking.timeValue}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b border-gray-100">
                    {[['info', 'Information'], ['record', 'Records / Prescription']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {tab === 'info' ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl text-blue-500 overflow-hidden">
                                    {booking.patientImage ? <img src={booking.patientImage} alt="" className="w-full h-full object-cover" /> : (booking.patientName?.[0] || '?')}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">{booking.patientName}</p>
                                    <StatusBadge statusId={booking.statusId} />
                                </div>
                            </div>
                            {[['Email', booking.patientEmail], ['Phone', booking.patientPhone], ['Address', booking.patientAddress], ['Reason', booking.reason]].map(([label, value]) => value && (
                                <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
                                    <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
                                    <span className="text-sm text-gray-800 font-medium">{value}</span>
                                </div>
                            ))}
                            {booking.statusId === 'S2' && (
                                <button onClick={() => handleAction(onComplete, booking.id)} disabled={loading}
                                    className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition disabled:opacity-60">
                                    {loading ? 'Processing...' : 'Mark as Completed'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Diagnosis</label>
                                <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                                    placeholder="Acute pharyngitis, Hypertension..."
                                    className="mt-1.5 w-full bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prescribed Medications</label>
                                    <button type="button" onClick={addMed} className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors">+ Add medication</button>
                                </div>
                                <div className="space-y-2">
                                    {medications.map((med, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input value={med.name} onChange={e => updateMed(i, 'name', e.target.value)}
                                                placeholder="Medication name"
                                                className="flex-1 bg-gray-100 border-0 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all" />
                                            <input value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)}
                                                placeholder="Dosage"
                                                className="w-28 bg-gray-100 border-0 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all" />
                                            {medications.length > 1 && (
                                                <button type="button" onClick={() => removeMed(i)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-lg font-medium leading-none">×</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Instructions</label>
                                <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={3}
                                    placeholder="Take medication after meals, rest well..."
                                    className="mt-1.5 w-full bg-gray-100 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all resize-none" />
                            </div>
                            <button
                                onClick={() => handleAction(onSendPrescription, booking.id, { diagnosis, medications, instructions })}
                                disabled={loading || !diagnosis.trim()}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm">
                                {loading ? 'Sending...' : 'Send Prescription via Email'}
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
            toast.error('Connection error.');
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

    const handleSendPrescription = async (bookingId, { diagnosis, medications, instructions }) => {
        try {
            const res = await axios.post('/api/send-prescription', { bookingId, doctorId, diagnosis, medications, instructions });
            if (res?.data?.errCode === 0) {
                toast.success('Prescription sent via email.');
                setSelectedBooking(null);
            } else {
                toast.error(res?.data?.errMessage || 'Failed to send.');
            }
        } catch { toast.error('Connection error.'); }
    };

    const handleComplete = async (bookingId) => {
        try {
            const res = await axios.put('/api/complete-booking', { bookingId, doctorId });
            if (res?.data?.errCode === 0) {
                toast.success('Marked as completed.');
                fetchBookings();
                setSelectedBooking(null);
            }
        } catch { toast.error('Connection error.'); }
    };

    const handleDoctorCancel = async () => {
        if (!cancelModal) return;
        setCancelling(true);
        try {
            const res = await axios.put('/api/doctor-cancel-booking', {
                bookingId: cancelModal.id,
                doctorId,
                cancelReason: cancelReason.trim() || 'Cancelled by doctor'
            });
            if (res?.data?.errCode === 0) {
                toast.success('Appointment cancelled.');
                setCancelModal(null);
                setCancelReason('');
                fetchBookings();
            } else {
                toast.error(res?.data?.errMessage || 'Cancellation failed.');
            }
        } catch { toast.error('Connection error.'); }
        finally { setCancelling(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Patient Management</h1>
                        <p className="text-sm text-gray-500">Week of {formatDateShort(weekDays[0])} – {formatDateShort(weekDays[6])}</p>
                    </div>
                    <button onClick={() => { setWeekStart(getMonday()); setSelectedDay(new Date()); }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                        Today
                    </button>
                </div>

                {/* Week Navigator */}
                <div className="bg-white rounded-2xl border border-gray-200/60 p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => setWeekStart(prev => new Date(prev.setDate(prev.getDate() - 7)))} className="p-2 hover:bg-gray-100 rounded-full">‹</button>
                        <span className="text-sm font-semibold text-gray-700">{selectedDay.toLocaleString('en', { month: 'long' })} {selectedDay.getFullYear()}</span>
                        <button onClick={() => setWeekStart(prev => new Date(prev.setDate(prev.getDate() + 7)))} className="p-2 hover:bg-gray-100 rounded-full">›</button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, i) => {
                            const isActive = isSameDay(day, selectedDay);
                            const count = bookings.filter(b => isSameDay(b.date, day)).length;
                            return (
                                <button key={i} onClick={() => setSelectedDay(day)}
                                    className={`flex flex-col items-center py-3 rounded-xl transition ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}>
                                    <span className="text-[10px] font-medium uppercase opacity-70">{DAY_LABELS[day.getDay()]}</span>
                                    <span className="text-lg font-semibold">{day.getDate()}</span>
                                    {count > 0 && <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isActive ? 'bg-white' : 'bg-blue-500'}`} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Patient List */}
                <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-gray-900">{formatDateFull(selectedDay)}</h2>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 ring-1 ring-blue-200 px-2.5 py-1 rounded-full">{bookingsOfDay.length} appointment{bookingsOfDay.length !== 1 ? 's' : ''}</span>
                    </div>

                    {isLoading ? (
                        <div className="p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" /></div>
                    ) : bookingsOfDay.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            <p className="text-sm">No appointments for this day</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {bookingsOfDay.map((booking) => (
                                <div key={booking.id} onClick={() => setSelectedBooking(booking)}
                                    className="flex items-center gap-4 px-6 py-5 hover:bg-blue-50/30 transition cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0 overflow-hidden">
                                        {booking.patientImage ? <img src={booking.patientImage} className="w-full h-full rounded-full object-cover" alt=""/> : booking.patientName?.[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition">{booking.patientName}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-medium text-blue-600">{booking.timeValue}</span>
                                            <span className="text-gray-300">•</span>
                                            <StatusBadge statusId={booking.statusId} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                        {['S1', 'S2'].includes(booking.statusId) && (
                                            <button onClick={() => setCancelModal(booking)} className="text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                                        )}
                                        <button onClick={() => setSelectedBooking(booking)} className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    {[['Pending', stats.S1, 'bg-amber-50 text-amber-600'], ['Confirmed', stats.S2, 'bg-blue-50 text-blue-600'], ['Completed', stats.S3, 'bg-emerald-50 text-emerald-600']].map(([label, val, style]) => (
                        <div key={label} className={`${style} p-4 rounded-2xl border border-current border-opacity-10 text-center shadow-sm`}>
                            <p className="text-2xl font-semibold">{val}</p>
                            <p className="text-[10px] font-medium uppercase tracking-wider mt-1 opacity-70">{label}</p>
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
                    onSendPrescription={handleSendPrescription}
                />
            )}

            {cancelModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl border border-gray-200/60 w-full max-w-md overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Confirm Cancellation</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{cancelModal.patientName} · {cancelModal.timeValue}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            {cancelModal.statusId === 'S2' && cancelModal.paymentMethod === 'BANK' && (
                                <div className="mb-4 p-3 bg-amber-50 ring-1 ring-amber-200 text-amber-800 text-xs rounded-xl font-medium">
                                    This appointment was paid online. The system will automatically refund the patient.
                                </div>
                            )}
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason for cancellation</label>
                            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                                className="w-full bg-gray-100 border-0 rounded-xl px-4 py-3 mt-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all resize-none" rows={3} placeholder="Doctor has an urgent matter..." />
                            <div className="flex gap-3 mt-5">
                                <button onClick={() => {setCancelModal(null); setCancelReason('');}} className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Close</button>
                                <button onClick={handleDoctorCancel} disabled={cancelling} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm disabled:opacity-50">
                                    {cancelling ? 'Processing...' : 'Confirm Cancel'}
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
