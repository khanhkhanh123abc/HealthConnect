import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X, Banknote, CreditCard } from 'lucide-react';
import { createBookingService } from '../services/bookingService';

const ERROR_MESSAGES = {
    1: 'Missing booking information. Please try again.',
    2: 'This time slot no longer exists. Please choose another.',
    3: 'This time slot is fully booked. Please choose another.',
    4: 'You have already booked this time slot.',
    '-1': 'Server error. Please try again later.',
};

const BACKEND_URL = 'https://api.healthconnect.io.vn';

const Spinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
);

const BookingModal = ({ isOpen, onClose, bookingInfo }) => {
    const userInfo = useSelector(state => state.user.userInfo);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const navigate = useNavigate();

    const [reason, setReason] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen || !bookingInfo) return null;

    const handleSubmit = async () => {
        if (isSubmitting || isSuccess) return;
        if (!isLoggedIn || !userInfo) { toast.error('Please sign in to continue.'); return; }

        const patientId = userInfo.id || userInfo.userId;
        if (!patientId) { toast.error('Unable to identify account.'); return; }

        setIsSubmitting(true);
        try {
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
                toast.error(ERROR_MESSAGES[errCode] || errMessage || 'Booking failed.');
                setIsSubmitting(false);
                return;
            }

            const bookingId = res?.data?.bookingId;
            const usd = res?.data?.amountUsd || 0;

            if (paymentMethod === 'CASH') {
                toast.success('Booking successful! Please check your email to confirm.');
                setIsSuccess(true);
                setTimeout(() => { handleClose(); navigate('/my-bookings'); }, 1500);
                return;
            }

            if (paymentMethod === 'BANK') {
                const payRes = await fetch(`${BACKEND_URL}/api/create-paypal-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId, amountUsd: usd }),
                });
                const payData = await payRes.json();
                if (payData.errCode === 0 && payData.approvalUrl) {
                    window.location.href = payData.approvalUrl;
                    return;
                }
                toast.error('Could not create PayPal order. Please try again.');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Connection error. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        setReason('');
        setPaymentMethod('CASH');
        setIsSubmitting(false);
        setIsSuccess(false);
        onClose();
    };

    const isButtonDisabled = isSubmitting || isSuccess || !isLoggedIn;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Confirm Booking</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Review your details before confirming</p>
                    </div>
                    <button onClick={handleClose} disabled={isSubmitting}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-6 flex flex-col gap-4">

                    {/* Appointment info */}
                    <div className="bg-blue-50 p-4 rounded-xl ring-1 ring-blue-100">
                        <p className="font-medium text-gray-900">{bookingInfo.timeValue}</p>
                        <p className="text-sm text-blue-600 mt-0.5">{bookingInfo.dateLabel}</p>
                        {bookingInfo.remainingSlots !== undefined && (
                            <p className={`text-xs mt-1.5 font-medium ${bookingInfo.remainingSlots <= 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {bookingInfo.remainingSlots} slot{bookingInfo.remainingSlots !== 1 ? 's' : ''} remaining
                            </p>
                        )}
                    </div>

                    {/* Patient info */}
                    {isLoggedIn && userInfo && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Patient</p>
                            <p className="font-medium text-gray-900">{userInfo.lastName} {userInfo.firstName}</p>
                            <p className="text-sm text-gray-500">{userInfo.email}</p>
                        </div>
                    )}

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Reason for visit <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Describe your symptoms or reason for visit..."
                            rows={3}
                            className="w-full bg-gray-100 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-200 resize-none"
                        />
                    </div>

                    {/* Payment method */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment method</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { key: 'CASH', Icon: Banknote, label: 'Cash', sub: 'Pay at the clinic' },
                                { key: 'BANK', Icon: CreditCard, label: 'Online', sub: 'Pay via PayPal' },
                            ].map(({ key, Icon, label, sub }) => (
                                <button key={key} onClick={() => setPaymentMethod(key)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                                        paymentMethod === key
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}>
                                    <Icon className={`w-5 h-5 ${paymentMethod === key ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${paymentMethod === key ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
                                    <span className="text-xs text-gray-400 text-center leading-tight">{sub}</span>
                                </button>
                            ))}
                        </div>
                        <p className={`text-xs px-4 py-2.5 rounded-xl ${
                            paymentMethod === 'BANK'
                                ? 'text-blue-700 bg-blue-50'
                                : 'text-gray-500 bg-gray-50'
                        }`}>
                            {paymentMethod === 'BANK'
                                ? 'You will be redirected to PayPal. Booking is confirmed immediately after successful payment.'
                                : 'You will receive a confirmation email. Click the link in the email to hold your appointment.'}
                        </p>
                    </div>

                    {/* Submit */}
                    <button onClick={handleSubmit} disabled={isButtonDisabled}
                        className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98] ${
                            isSuccess
                                ? 'bg-emerald-500 text-white cursor-default'
                                : isButtonDisabled
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}>
                        {isSuccess ? 'Booking confirmed' : isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <Spinner /> Processing...
                            </span>
                        ) : paymentMethod === 'BANK' ? 'Pay via PayPal' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
