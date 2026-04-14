import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBookingService } from '../services/bookingService';

const ERROR_MESSAGES = {
    1: 'Thiếu thông tin đặt lịch. Vui lòng thử lại!',
    2: 'Khung giờ này không còn tồn tại. Vui lòng chọn giờ khác!',
    3: 'Khung giờ này đã hết chỗ! Vui lòng chọn khung giờ khác.',
    4: 'Bạn đã đặt lịch cho khung giờ này rồi!',
    '-1': 'Lỗi máy chủ, vui lòng thử lại sau.',
};

const BACKEND_URL = 'https://api.healthconnect.io.vn';

// ===== QR SCREEN (fallback khi VNPay không khả dụng) =====
const BankQRScreen = ({ bookingToken, amountVnd, amountUsd, onClose }) => {
    const refCode = `TTKHAM ${bookingToken?.slice(-8)?.toUpperCase()}`;
    const qrUrl = `https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=${amountVnd}&addInfo=${encodeURIComponent(refCode)}&accountName=PHONG%20KHAM%20HEALTHCONNECT`;
    const formatVnd = (n) => n?.toLocaleString('vi-VN') + ' VNĐ';

    return (
        <div className="p-5 text-center space-y-4">
            <h3 className="font-bold text-lg">Quét QR để thanh toán</h3>
            <img src={qrUrl} alt="QR" className="mx-auto w-52 h-52 rounded-xl border border-gray-200 shadow" />
            <div className="text-sm space-y-1">
                <p><b>Số tiền:</b> {formatVnd(amountVnd)}</p>
                <p><b>Tương đương:</b> ${amountUsd} USD</p>
                <p><b>Nội dung:</b> {refCode}</p>
            </div>
            <p className="text-red-500 text-xs">⚠ Vui lòng chuyển khoản trong 2 giờ để giữ lịch</p>
            <button onClick={onClose} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-xl">
                Đóng
            </button>
        </div>
    );
};

// ================= MAIN MODAL =================
const BookingModal = ({ isOpen, onClose, bookingInfo }) => {
    const userInfo = useSelector(state => state.user.userInfo);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const navigate = useNavigate();

    const [reason, setReason] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // QR fallback state
    const [showQR, setShowQR] = useState(false);
    const [bookingToken, setBookingToken] = useState('');
    const [amountVnd, setAmountVnd] = useState(0);
    const [amountUsd, setAmountUsd] = useState(0);

    if (!isOpen || !bookingInfo) return null;

    const handleSubmit = async () => {
        if (isSubmitting || isSuccess) return;

        if (!isLoggedIn || !userInfo) {
            toast.error('Vui lòng đăng nhập!');
            return;
        }

        const patientId = userInfo.id || userInfo.userId;
        if (!patientId) {
            toast.error('Không xác định được tài khoản!');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Tạo booking
            const res = await createBookingService({
                doctorId: bookingInfo.doctorId,
                date: bookingInfo.date,
                timeType: bookingInfo.timeType,
                patientId,
                reason,
                paymentMethod,
            });

            const errCode = res?.data?.errCode ?? res?.errCode;
            const errMessage = res?.data?.errMessage ?? res?.errMessage;

            if (errCode !== 0) {
                toast.error(ERROR_MESSAGES[errCode] || errMessage || 'Đặt lịch thất bại!');
                setIsSubmitting(false);
                return;
            }

            const bookingId = res?.data?.bookingId;
            const token = res?.data?.token;
            const amount = res?.data?.amount || 500000;
            const usd = res?.data?.amountUsd || 0;

            // ===== CASH: gửi email xác nhận, chuyển trang =====
            if (paymentMethod === 'CASH') {
                toast.success('Đặt lịch thành công! Vui lòng kiểm tra email để xác nhận.');
                setIsSuccess(true);
                setTimeout(() => {
                    handleClose();
                    navigate('/my-bookings');
                }, 1500);
                return;
            }

            // ===== BANK: gọi VNPay, redirect sang trang thanh toán =====
            if (paymentMethod === 'BANK') {
                try {
                    // ✅ FIX 1: dùng URL tuyệt đối
                    const payRes = await fetch(`${BACKEND_URL}/api/create-vnpay-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                        },
                        body: JSON.stringify({
                            bookingId,
                            amount,
                            bookingToken: token,
                        })
                    });

                    // ✅ FIX 2: fetch cần .json() để parse response
                    const payData = await payRes.json();
                    const payUrl = payData?.paymentUrl;

                    if (payUrl) {
                        // Redirect sang trang VNPay
                        window.location.href = payUrl;
                        return;
                    }

                    // Fallback: hiện QR thủ công nếu không có paymentUrl
                    setBookingToken(token);
                    setAmountVnd(amount);
                    setAmountUsd(usd);
                    setShowQR(true);

                } catch (err) {
                    console.error('VNPay error:', err);
                    // Fallback: hiện QR thủ công nếu VNPay lỗi
                    setBookingToken(token);
                    setAmountVnd(amount);
                    setAmountUsd(usd);
                    setShowQR(true);
                }

                setIsSubmitting(false);
            }

        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Lỗi kết nối máy chủ!');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        setReason('');
        setPaymentMethod('CASH');
        setIsSubmitting(false);
        setIsSuccess(false);
        setShowQR(false);
        setBookingToken('');
        setAmountVnd(0);
        setAmountUsd(0);
        onClose();
        if (showQR) navigate('/my-bookings');
    };

    const isButtonDisabled = isSubmitting || isSuccess || !isLoggedIn;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className={`px-6 py-4 flex items-center justify-between ${showQR ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                    <h3 className="text-white font-bold text-lg">
                        {showQR ? '🏦 Thông tin chuyển khoản' : 'Xác nhận đặt lịch khám'}
                    </h3>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-white/80 hover:text-white text-2xl leading-none disabled:opacity-50"
                    >×</button>
                </div>

                {/* BODY */}
                {showQR ? (
                    <BankQRScreen
                        bookingToken={bookingToken}
                        amountVnd={amountVnd}
                        amountUsd={amountUsd}
                        onClose={handleClose}
                    />
                ) : (
                    <div className="px-6 py-5 flex flex-col gap-4">

                        {/* Thông tin lịch */}
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <p className="font-semibold text-gray-800">{bookingInfo.timeValue}</p>
                            <p className="text-sm text-indigo-600">{bookingInfo.dateLabel}</p>
                            {bookingInfo.remainingSlots !== undefined && (
                                <p className={`text-xs mt-1 font-medium ${bookingInfo.remainingSlots <= 2 ? 'text-orange-500' : 'text-green-600'}`}>
                                    Còn {bookingInfo.remainingSlots} chỗ trống
                                </p>
                            )}
                        </div>

                        {/* Thông tin bệnh nhân */}
                        {isLoggedIn && userInfo && (
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-xs text-gray-400 mb-1">Bệnh nhân</p>
                                <p className="font-semibold text-gray-800">{userInfo.lastName} {userInfo.firstName}</p>
                                <p className="text-sm text-gray-500">{userInfo.email}</p>
                            </div>
                        )}

                        {/* Lý do khám */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Lý do khám <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Mô tả triệu chứng hoặc lý do khám..."
                                rows={3}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                            />
                        </div>

                        {/* Chọn phương thức thanh toán */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phương thức thanh toán
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('CASH')}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                        paymentMethod === 'CASH'
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-2xl">💵</span>
                                    <span className={`text-sm font-semibold ${paymentMethod === 'CASH' ? 'text-indigo-700' : 'text-gray-700'}`}>
                                        Tiền mặt
                                    </span>
                                    <span className="text-xs text-gray-400 text-center">Thanh toán tại phòng khám</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('BANK')}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                        paymentMethod === 'BANK'
                                            ? 'border-amber-500 bg-amber-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-2xl">🏦</span>
                                    <span className={`text-sm font-semibold ${paymentMethod === 'BANK' ? 'text-amber-700' : 'text-gray-700'}`}>
                                        Chuyển khoản
                                    </span>
                                    <span className="text-xs text-gray-400 text-center">Thanh toán qua VNPay</span>
                                </button>
                            </div>

                            {paymentMethod === 'CASH' && (
                                <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                                    ℹ Bạn sẽ nhận email xác nhận. Vui lòng click link trong email để giữ lịch.
                                </p>
                            )}
                            {paymentMethod === 'BANK' && (
                                <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                                    ℹ Bạn sẽ được chuyển sang trang VNPay để thanh toán an toàn. Lịch xác nhận ngay sau khi thanh toán thành công.
                                </p>
                            )}
                        </div>

                        {/* Nút submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={isButtonDisabled}
                            className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${
                                isSuccess
                                    ? 'bg-green-500 text-white cursor-default'
                                    : isButtonDisabled
                                        ? 'bg-indigo-400 text-white cursor-not-allowed opacity-70'
                                        : paymentMethod === 'BANK'
                                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                            {isSuccess ? '✓ Đã đặt lịch!' : isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                    </svg>
                                    Đang xử lý...
                                </span>
                            ) : paymentMethod === 'BANK' ? '💳 Thanh toán qua VNPay' : 'Xác nhận đặt lịch'}
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;