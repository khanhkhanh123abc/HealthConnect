import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getPendingBankBookingsService, confirmPaymentService } from '../../../services/bookingService';

const ManageBookingPayment = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState(null);

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            let res = await getPendingBankBookingsService();
            setBookings(res?.data?.data || []);
        } catch (e) {
            toast.error('Không thể tải danh sách!');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleConfirm = async (booking) => {
        if (!window.confirm(`Xác nhận đã nhận tiền từ bệnh nhân ${booking.patientName}?`)) return;
        setConfirmingId(booking.id);
        try {
            let res = await confirmPaymentService(booking.id);
            const errCode = res?.data?.errCode ?? res?.errCode;
            if (errCode === 0) {
                toast.success('Xác nhận thành công! Email đã gửi cho bệnh nhân.');
                setBookings(prev => prev.filter(b => b.id !== booking.id));
            } else {
                toast.error(res?.data?.errMessage || 'Xác nhận thất bại!');
            }
        } catch (e) {
            toast.error('Lỗi kết nối!');
        } finally {
            setConfirmingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Xác nhận thanh toán</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Danh sách lịch chờ xác nhận chuyển khoản
                        <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {bookings.length} chờ xử lý
                        </span>
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                >
                    🔄 Làm mới
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!isLoading && bookings.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-gray-500 font-medium">Không có lịch nào chờ xác nhận</p>
                    <p className="text-gray-400 text-sm mt-1">Tất cả lịch chuyển khoản đã được xử lý</p>
                </div>
            )}

            {/* List */}
            {!isLoading && bookings.length > 0 && (
                <div className="space-y-3">
                    {bookings.map(booking => {
                        const refCode = `TTKHAM ${booking.token?.slice(-8)?.toUpperCase()}`;
                        const isConfirming = confirmingId === booking.id;
                        return (
                            <div key={booking.id}
                                className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                        {booking.patientName?.[0] || '?'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-gray-900">{booking.patientName}</p>
                                            <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                                🏦 Chuyển khoản
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5">{booking.patientEmail}</p>
                                        {booking.patientPhone && (
                                            <p className="text-sm text-gray-500">📞 {booking.patientPhone}</p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                                            <span className="text-indigo-600 font-medium">⏰ {booking.timeValue}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">{formatDate(booking.date)}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">{booking.doctorName}</span>
                                        </div>
                                        {/* Mã tham chiếu */}
                                        <div className="mt-2 inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg">
                                            <span className="text-xs text-gray-500">Mã CK:</span>
                                            <span className="text-xs font-mono font-bold text-gray-800">{refCode}</span>
                                        </div>
                                    </div>

                                    {/* Confirm button */}
                                    <button
                                        onClick={() => handleConfirm(booking)}
                                        disabled={isConfirming}
                                        className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                            isConfirming
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow'
                                        }`}
                                    >
                                        {isConfirming ? (
                                            <span className="flex items-center gap-1.5">
                                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                                </svg>
                                                Đang xử lý...
                                            </span>
                                        ) : '✓ Đã nhận tiền'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageBookingPayment;