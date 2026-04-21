import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Clock, ArrowLeft, CreditCard, Search } from 'lucide-react';
import { getBookingsByPatientService, cancelBookingService } from '../services/bookingService';

const STATUS_CONFIG = {
    S1: { label: 'Pending',    color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
    S2: { label: 'Confirmed',  color: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
    S3: { label: 'Completed',  color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
    S4: { label: 'Cancelled',  color: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
};

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MyBookings = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.user.userInfo);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [filterDate, setFilterDate] = useState('');

    const fetchBookings = useCallback(async () => {
        if (!userInfo?.id) return;
        setIsLoading(true);
        try {
            let res = await getBookingsByPatientService(userInfo.id);
            setBookings(res?.data?.data || []);
        } catch {
            toast.error('Failed to load appointments.');
        } finally {
            setIsLoading(false);
        }
    }, [userInfo?.id]);

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        fetchBookings();
    }, [isLoggedIn, fetchBookings, navigate]);

    const handleCancel = async (booking) => {
        const isPaidVNPay = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';
        let confirmMsg = `Are you sure you want to cancel the ${booking.timeValue} appointment?`;
        if (isPaidVNPay) confirmMsg += '\n\nThis appointment was paid online. You will receive a 100% refund within 5–7 business days.';
        if (!window.confirm(confirmMsg)) return;

        setCancellingId(booking.id);
        try {
            let res = await cancelBookingService(booking.id, userInfo.id);
            const data = res?.data || res;
            const errCode = data?.errCode;
            if (errCode === 0) {
                if (data?.refundStatus === 'REFUNDED') {
                    toast.success(`Cancelled! Processing refund of $${(data.refundAmount || 0).toFixed(2)}.`);
                } else {
                    toast.success('Appointment cancelled successfully.');
                }
                setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, statusId: 'S4' } : b));
            } else {
                toast.error(data?.errMessage || 'Cancellation failed.');
            }
        } catch {
            toast.error('Connection error. Please try again.');
        } finally {
            setCancellingId(null);
        }
    };

    const filteredBookings = useMemo(() => {
        if (!filterDate) return bookings;
        return bookings.filter(b => {
            const d = new Date(b.date);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}` === filterDate;
        });
    }, [bookings, filterDate]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${DAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200/60 p-5 mb-4 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 space-y-2.5">
                                <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
                                <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                                <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My Appointments</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Hello, <span className="font-medium text-blue-600">{userInfo?.lastName} {userInfo?.firstName}</span>
                        {' '}· {filteredBookings.length}{filterDate ? ` / ${bookings.length}` : ''} appointment{bookings.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button onClick={() => navigate('/home')}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Home
                </button>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-3 mb-6 bg-white border border-gray-200/60 rounded-2xl px-4 py-3">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500">Filter by date:</span>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                    className="text-sm bg-gray-100 border-0 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                {filterDate && (
                    <button onClick={() => setFilterDate('')}
                        className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors ml-auto">
                        Clear filter
                    </button>
                )}
            </div>

            {/* Empty states */}
            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/60">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">No appointments yet</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                        You haven't booked any appointments. Start today.
                    </p>
                    <button onClick={() => navigate('/booking')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 active:scale-[0.98] transition-all duration-200">
                        Book an Appointment
                    </button>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-14 bg-white rounded-2xl border border-gray-200/60">
                    <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Search className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">No appointments on this date</p>
                    <button onClick={() => setFilterDate('')}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        Clear filter
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredBookings.map(booking => {
                        const status = STATUS_CONFIG[booking.statusId] || STATUS_CONFIG['S1'];
                        const isCancelling = cancellingId === booking.id;
                        const canCancel = ['S1', 'S2'].includes(booking.statusId);
                        const isPaidVNPay = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';

                        return (
                            <div key={booking.id}
                                className={`bg-white rounded-2xl border border-gray-200/60 p-5 transition-shadow hover:shadow-lg hover:shadow-gray-200/50 duration-300 ${booking.statusId === 'S4' ? 'opacity-60' : ''}`}>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm overflow-hidden flex-shrink-0">
                                        {booking.doctorImage
                                            ? <img src={booking.doctorImage} alt="" className="w-full h-full object-cover" />
                                            : booking.doctorName?.[0]}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-medium text-gray-900 text-sm">{booking.doctorName}</h3>
                                            <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span>{formatDate(booking.date)}</span>
                                            <span className="text-gray-300 mx-1">·</span>
                                            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="font-medium text-blue-600">{booking.timeValue}</span>
                                        </div>

                                        {(booking.clinicName || booking.clinicAddress) && (
                                            <div className="flex items-start gap-1.5 mt-1 text-sm text-gray-500">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                                <span>
                                                    {booking.clinicName && <span className="font-medium text-gray-700">{booking.clinicName}</span>}
                                                    {booking.clinicName && booking.clinicAddress && ' — '}
                                                    {booking.clinicAddress}
                                                </span>
                                            </div>
                                        )}

                                        {booking.paymentMethod && booking.statusId !== 'S4' && (
                                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                                                <CreditCard className="w-3.5 h-3.5" />
                                                {booking.paymentMethod === 'BANK' ? 'PayPal' : 'Cash'}
                                            </div>
                                        )}

                                        {canCancel && (
                                            <div className="mt-3 flex items-center gap-3">
                                                <button onClick={() => handleCancel(booking)} disabled={isCancelling}
                                                    className="text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                                                    {isCancelling ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                                {isPaidVNPay && (
                                                    <span className="text-xs text-emerald-600 font-medium">
                                                        100% refund if cancelled
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
