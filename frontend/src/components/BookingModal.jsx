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

// ===== QR SCREEN (fallback) =====
const BankQRScreen = ({ bookingToken, amountVnd, amountUsd, onClose }) => {
    const refCode = `TTKHAM ${bookingToken?.slice(-8)?.toUpperCase()}`;
    const qrUrl = `https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=${amountVnd}&addInfo=${encodeURIComponent(refCode)}&accountName=PHONG%20KHAM%20HEALTHCONNECT`;

    const formatVnd = (n) => n?.toLocaleString('vi-VN') + ' VNĐ';

    return (
        <div className="p-5 text-center space-y-4">
            <h3 className="font-bold text-lg">Quét QR để thanh toán</h3>

            <img src={qrUrl} alt="QR" className="mx-auto w-52 h-52" />

            <div className="text-sm">
                <p><b>Số tiền:</b> {formatVnd(amountVnd)}</p>
                <p><b>Tương đương:</b> ${amountUsd} USD</p>
                <p><b>Nội dung:</b> {refCode}</p>
            </div>

            <button onClick={onClose} className="bg-indigo-600 text-white px-4 py-2 rounded">
                Đóng
            </button>
        </div>
    );
};

// ================= MAIN =================
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
                toast.error(ERROR_MESSAGES[errCode] || errMessage);
                setIsSubmitting(false);
                return;
            }

            const bookingId = res?.data?.bookingId;
            const token = res?.data?.token;
            const amount = res?.data?.amount || 500000;
            const usd = res?.data?.amountUsd || 0;

            // ===== CASH =====
            if (paymentMethod === 'CASH') {
                toast.success('Đặt lịch thành công!');
                setIsSuccess(true);

                setTimeout(() => {
                    handleClose();
                    navigate('/my-bookings');
                }, 1500);
                return;
            }

            // ===== BANK =====
            if (paymentMethod === 'BANK') {
                try {
                    const payRes = await fetch ('/api/create-vnpay-payment', {
                        bookingId,
                        amount,
                        bookingToken: token,
                    });

                    const payUrl = payRes?.data?.paymentUrl;

                    if (payUrl) {
                        // ưu tiên VNPay
                        window.location.href = payUrl;
                        return;
                    }

                    // fallback QR
                    setBookingToken(token);
                    setAmountVnd(amount);
                    setAmountUsd(usd);
                    setShowQR(true);

                } catch (err) {
                    console.error(err);

                    // fallback QR nếu VNPay lỗi
                    setBookingToken(token);
                    setAmountVnd(amount);
                    setAmountUsd(usd);
                    setShowQR(true);
                }

                setIsSubmitting(false);
            }

        } catch (error) {
            console.error(error);
            toast.error('Lỗi server!');
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
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-full max-w-md">

                {/* HEADER */}
                <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between">
                    <h3>{showQR ? 'Thanh toán' : 'Xác nhận đặt lịch'}</h3>
                    <button onClick={handleClose}>×</button>
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
                    <div className="p-5 space-y-4">

                        <div className="bg-indigo-50 p-3 rounded">
                            <p>{bookingInfo.timeValue}</p>
                            <p>{bookingInfo.dateLabel}</p>
                        </div>

                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Lý do khám..."
                            className="w-full border p-2 rounded"
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setPaymentMethod('CASH')}
                                className={paymentMethod === 'CASH' ? 'bg-indigo-200' : 'bg-gray-100'}
                            >
                                Tiền mặt
                            </button>

                            <button
                                onClick={() => setPaymentMethod('BANK')}
                                className={paymentMethod === 'BANK' ? 'bg-amber-200' : 'bg-gray-100'}
                            >
                                Chuyển khoản
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-2 rounded"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Đặt lịch'}
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;