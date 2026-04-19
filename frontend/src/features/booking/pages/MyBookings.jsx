import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getBookingsByPatientService, cancelBookingService } from '../services/bookingService';

const STATUS_CONFIG = {
    S1: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    S2: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    S3: { label: 'Completed', color: 'bg-green-100 text-green-800 border-green-300' },
    S4: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' },
};

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MyBookings = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.user.userInfo);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchBookings = useCallback(async () => {
        if (!userInfo?.id) return;
        setIsLoading(true);
        try {
            let res = await getBookingsByPatientService(userInfo.id);
            setBookings(res?.data?.data || []);
        } catch (e) {
            toast.error('Cannot load appointment list!');
        } finally {
            setIsLoading(false);
        }
    }, [userInfo?.id]);

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        fetchBookings();
    }, [isLoggedIn, fetchBookings, navigate]);

    const handleCancel = async (booking) => {
        // ✅ MỚI: thông báo khác nhau cho S1 vs S2
        const isConfirmed = booking.statusId === 'S2';
        const isPaidVNPay = isConfirmed && booking.paymentMethod === 'BANK';

        let confirmMsg = `Are you sure you want to cancel the appointment at ${booking.timeValue}?`;
        if (isPaidVNPay) {
            confirmMsg += '\n\n💰 This appointment was paid via VNPay. You will receive a 100% refund within 5-7 business days.';
        }

        if (!window.confirm(confirmMsg)) return;

        setCancellingId(booking.id);
        try {
            let res = await cancelBookingService(booking.id, userInfo.id);
            const data = res?.data || res;
            const errCode = data?.errCode;

            if (errCode === 0) {
                // ✅ MỚI: hiển thị thông báo hoàn tiền
                if (data?.refundStatus === 'REFUNDED') {
                    toast.success(`Cancelled! Refund of ${(data.refundAmount || 0).toLocaleString('vi-VN')}đ is being processed.`);
                } else if (data?.refundStatus === 'FAILED') {
                    toast.warning('Cancelled, but automatic refund failed. Please contact support.');
                } else {
                    toast.success('Cancel appointment successfully!');
                }
                setBookings(prev => prev.map(b =>
                    b.id === booking.id ? { ...b, statusId: 'S4' } : b
                ));
            } else {
                toast.error(data?.errMessage || 'Failed to cancel appointment!');
            }
        } catch (e) {
            toast.error('Connection error, please try again!');
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${DAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Hello, <span className="font-medium text-indigo-600">
                            {userInfo?.lastName} {userInfo?.firstName}
                        </span>
                        {' '}· {bookings.length} appointments
                    </p>
                </div>
                <button onClick={() => navigate('/')} className="text-sm text-indigo-600 hover:underline">
                    ← Back to home
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                    <div className="text-5xl mb-4">📅</div>
                    <p className="text-gray-500 text-lg font-medium">You don't have any appointments yet</p>
                    <p className="text-gray-400 text-sm mt-2 mb-6">Book an appointment with a doctor to get started</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Find a doctor now
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookings.map((booking) => {
                        const status = STATUS_CONFIG[booking.statusId] || STATUS_CONFIG['S1'];
                        const isCancelling = cancellingId === booking.id;
                        // ✅ MỚI: cho phép hủy cả S1 và S2
                        const canCancel = ['S1', 'S2'].includes(booking.statusId);
                        const isPaidVNPay = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';

                        return (
                            <div
                                key={booking.id}
                                className={`bg-white rounded-xl border p-5 transition hover:shadow-md
                                    ${booking.statusId === 'S4' ? 'opacity-60' : ''} border-gray-200`}
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={booking.doctorImage || 'https://via.placeholder.com/56'}
                                        alt="doctor"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-gray-800">
                                                {booking.doctorName}
                                            </h3>
                                            <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-600">
                                            <span>📅</span>
                                            <span>{formatDate(booking.date)}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="font-semibold text-indigo-600">
                                                {booking.timeValue}
                                            </span>
                                        </div>

                                        {(booking.clinicName || booking.clinicAddress) && (
                                            <div className="flex items-start gap-1.5 mt-1 text-sm text-gray-500">
                                                <span className="mt-0.5">🏥</span>
                                                <span>
                                                    {booking.clinicName && (
                                                        <span className="font-medium text-gray-700">{booking.clinicName}</span>
                                                    )}
                                                    {booking.clinicName && booking.clinicAddress && ' — '}
                                                    {booking.clinicAddress}
                                                </span>
                                            </div>
                                        )}

                                        {booking.reason && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                <span className="font-medium">Reason: </span>
                                                {booking.reason}
                                            </p>
                                        )}

                                        {/* ✅ MỚI: hiện phương thức thanh toán */}
                                        {booking.paymentMethod && booking.statusId !== 'S4' && (
                                            <p className="mt-1 text-xs text-gray-400">
                                                💳 {booking.paymentMethod === 'BANK' ? 'VNPay' : 'Cash'}
                                            </p>
                                        )}

                                        {/* ✅ MỚI: nút hủy cho cả S1 và S2 */}
                                        {canCancel && (
                                            <div className="mt-3 flex items-center gap-3">
                                                <button
                                                    onClick={() => handleCancel(booking)}
                                                    disabled={isCancelling}
                                                    className="text-xs font-semibold text-red-500 border border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                                                >
                                                    {isCancelling ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                                {isPaidVNPay && (
                                                    <span className="text-xs text-green-600">
                                                        💰 100% refund if cancelled
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