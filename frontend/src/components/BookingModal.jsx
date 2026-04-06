import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBookingService } from '../services/bookingService';

// Map errCode → thông báo thân thiện
const ERROR_MESSAGES = {
    1: 'Thiếu thông tin đặt lịch. Vui lòng thử lại!',
    2: 'Khung giờ này không còn tồn tại. Vui lòng chọn giờ khác!',
    3: 'Khung giờ này đã hết chỗ! Vui lòng chọn khung giờ khác.',
    4: 'Bạn đã đặt lịch cho khung giờ này rồi!',
   '-1': 'Lỗi máy chủ, vui lòng thử lại sau.',
};

const BookingModal = ({ isOpen, onClose, bookingInfo }) => {
    const userInfo = useSelector(state => state.user.userInfo);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const navigate = useNavigate();
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // Ngăn submit 2 lần

    if (!isOpen || !bookingInfo) return null;

    const handleSubmit = async () => {
        if (isSubmitting || isSuccess) return; // Chặn double-click
        if (!isLoggedIn || !userInfo) {
            toast.error("Vui lòng đăng nhập để đặt lịch!");
            return;
        }

        const patientId = userInfo.id || userInfo.userId || null;
        if (!patientId) {
            toast.error("Không xác định được tài khoản. Vui lòng đăng nhập lại!");
            return;
        }

        setIsSubmitting(true); // ← Disable nút ngay lập tức

        try {
            const payload = {
                doctorId: bookingInfo.doctorId,
                date: bookingInfo.date,
                timeType: bookingInfo.timeType,
                patientId,
                reason: reason || ''
            };

            let res = await createBookingService(payload);
            const errCode = res?.data?.errCode ?? res?.errCode;
            const errMessage = res?.data?.errMessage ?? res?.errMessage;

            if (errCode === 0) {
                setIsSuccess(true); // Đánh dấu đã thành công, không cho submit lại
                toast.success("Đặt lịch thành công! Bác sĩ sẽ xác nhận sớm.");
                setReason('');
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    navigate('/my-bookings'); // ✅ Chuyển sang trang lịch hẹn
                }, 1500);
            } else {
                // Hiện đúng thông báo lỗi theo errCode
                const msg = ERROR_MESSAGES[errCode] || errMessage || 'Đặt lịch thất bại!';
                toast.error(msg);
                setIsSubmitting(false); // Cho phép thử lại nếu lỗi
            }
        } catch (error) {
            console.error('Lỗi đặt lịch:', error);
            toast.error("Lỗi kết nối máy chủ!");
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return; // Không cho đóng khi đang xử lý
        setReason('');
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
    };

    const isButtonDisabled = isSubmitting || isSuccess || !isLoggedIn;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">Xác nhận đặt lịch khám</h3>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-white/80 hover:text-white text-2xl leading-none disabled:opacity-50"
                    >×</button>
                </div>

                {/* Thông tin lịch */}
                <div className="px-6 py-4 bg-indigo-50 border-b">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">📅</span>
                        <div>
                            <p className="text-sm text-gray-500">Thời gian khám</p>
                            <p className="font-semibold text-gray-800">{bookingInfo.timeValue}</p>
                            <p className="text-sm text-indigo-600">{bookingInfo.dateLabel}</p>
                            {/* Hiển thị số chỗ còn lại trong modal */}
                            {bookingInfo.remainingSlots !== undefined && (
                                <p className={`text-xs mt-1 font-medium ${bookingInfo.remainingSlots <= 2 ? 'text-orange-500' : 'text-green-600'}`}>
                                    Còn {bookingInfo.remainingSlots} chỗ trống
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    {isLoggedIn && userInfo ? (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Thông tin bệnh nhân</p>
                            <p className="font-semibold text-gray-800">{userInfo.firstName} {userInfo.lastName}</p>
                            <p className="text-sm text-gray-600">{userInfo.email}</p>
                            {userInfo.phoneNumber && (
                                <p className="text-sm text-gray-600">📞 {userInfo.phoneNumber}</p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200 text-red-600 text-sm">
                            ⚠️ Vui lòng <strong>đăng nhập</strong> để đặt lịch khám.
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Lý do khám <span className="text-gray-400 font-normal">(không bắt buộc)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isSubmitting || isSuccess}
                            placeholder="Mô tả triệu chứng hoặc lý do muốn khám..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none disabled:bg-gray-50 disabled:text-gray-400"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                        className={`flex-1 py-2.5 rounded-lg font-semibold transition relative
                            ${isSuccess
                                ? 'bg-green-500 text-white cursor-default'
                                : isButtonDisabled
                                    ? 'bg-indigo-400 text-white cursor-not-allowed opacity-70'
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
                        ) : 'Xác nhận đặt lịch'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;