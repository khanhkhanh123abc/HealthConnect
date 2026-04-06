import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createBookingService } from '../services/bookingService';

// Map errCode → thông báo thân thiện
const ERROR_MESSAGES = {
    1: 'Missing booking information. Please try again!',
    2: 'This time slot no longer exists. Please choose another time!',
    3: 'This time slot is fully booked! Please choose another time slot.',
    4: 'You have already booked this time slot!',
    '-1': 'Server error, please try again later.',
};

const BookingModal = ({ isOpen, onClose, bookingInfo }) => {
    const userInfo = useSelector(state => state.user.userInfo);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // Ngăn submit 2 lần

    if (!isOpen || !bookingInfo) return null;

    const handleSubmit = async () => {
        console.log("bookingInfo:", JSON.stringify(bookingInfo)); 
        console.log("userInfo.id:", userInfo?.id);
        if (isSubmitting || isSuccess) return; // Chặn double-click
        if (!isLoggedIn || !userInfo) {
            toast.error("Please log in to book an appointment!");
            return;
        }

        const patientId = userInfo.id || userInfo.userId || null;
        if (!patientId) {
            toast.error("Unable to identify the account. Please log in again!");
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
                toast.success("Appointment booked successfully! The doctor will confirm soon.");
                setReason('');
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                }, 1500);
            } else {
                // Hiện đúng thông báo lỗi theo errCode
                const msg = ERROR_MESSAGES[errCode] || errMessage || 'Failed to book appointment!';
                toast.error(msg);
                setIsSubmitting(false); // Cho phép thử lại nếu lỗi
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error("Server connection error!");
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
                    <h3 className="text-white font-bold text-lg">Confirm Appointment Booking</h3>
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
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-semibold text-gray-800">{bookingInfo.timeValue}</p>
                            <p className="text-sm text-indigo-600">{bookingInfo.dateLabel}</p>
                            {/* Hiển thị số chỗ còn lại trong modal */}
                            {bookingInfo.remainingSlots !== undefined && (
                                <p className={`text-xs mt-1 font-medium ${bookingInfo.remainingSlots <= 2 ? 'text-orange-500' : 'text-green-600'}`}>
                                    {bookingInfo.remainingSlots} spots remaining
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    {isLoggedIn && userInfo ? (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Patient Information</p>
                            <p className="font-semibold text-gray-800">{userInfo.firstName} {userInfo.lastName}</p>
                            <p className="text-sm text-gray-600">{userInfo.email}</p>
                            {userInfo.phoneNumber && (
                                <p className="text-sm text-gray-600">📞 {userInfo.phoneNumber}</p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200 text-red-600 text-sm">
                            ⚠️ Please <strong>log in</strong> to book an appointment.
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Reason <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isSubmitting || isSuccess}
                            placeholder="Describe your symptoms or reason for the appointment..."
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
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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