import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { RefreshCw, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { getPendingBankBookingsService, confirmPaymentService } from '../services/bookingService';

const ManageBookingPayment = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState(null);

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            let res = await getPendingBankBookingsService();
            setBookings(res?.data?.data || []);
        } catch {
            toast.error('Failed to load bookings.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleConfirm = async (booking) => {
        if (!window.confirm(`Confirm payment received from patient ${booking.patientName}?`)) return;
        setConfirmingId(booking.id);
        try {
            let res = await confirmPaymentService(booking.id);
            const errCode = res?.data?.errCode ?? res?.errCode;
            if (errCode === 0) {
                toast.success('Payment confirmed. Confirmation email sent to patient.');
                setBookings(prev => prev.filter(b => b.id !== booking.id));
            } else {
                toast.error(res?.data?.errMessage || 'Confirmation failed.');
            }
        } catch {
            toast.error('Connection error.');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Confirm Payment</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Appointments awaiting bank transfer confirmation
                        {bookings.length > 0 && (
                            <span className="ml-2 bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-xs font-medium px-2.5 py-1 rounded-full">
                                {bookings.length} pending
                            </span>
                        )}
                    </p>
                </div>
                <button onClick={fetchBookings}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200/60 p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                                <div className="flex-1 space-y-2.5">
                                    <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
                                    <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                                    <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && bookings.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/60">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">All caught up</h3>
                    <p className="text-sm text-gray-400">No appointments awaiting payment confirmation</p>
                </div>
            )}

            {/* Booking list */}
            {!isLoading && bookings.length > 0 && (
                <div className="space-y-3">
                    {bookings.map(booking => {
                        const refCode = `TTKHAM ${booking.token?.slice(-8)?.toUpperCase()}`;
                        const isConfirming = confirmingId === booking.id;
                        return (
                            <div key={booking.id}
                                className="bg-white rounded-2xl border border-amber-200/70 p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
                                <div className="flex items-start gap-4">

                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm shrink-0">
                                        {booking.patientName?.[0] || '?'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="font-medium text-gray-900 text-sm">{booking.patientName}</p>
                                            <span className="bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" /> Bank Transfer
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-500">{booking.patientEmail}</p>
                                        {booking.patientPhone && (
                                            <p className="text-xs text-gray-500">{booking.patientPhone}</p>
                                        )}

                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                <Clock className="w-3 h-3" /> {booking.timeValue}
                                            </span>
                                            <span className="text-gray-300">·</span>
                                            <span>{formatDate(booking.date)}</span>
                                            <span className="text-gray-300">·</span>
                                            <span>{booking.doctorName}</span>
                                        </div>

                                        <div className="mt-2 inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                                            <span className="text-xs text-gray-500">Ref:</span>
                                            <span className="text-xs font-mono font-semibold text-gray-800">{refCode}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => handleConfirm(booking)} disabled={isConfirming}
                                        className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.97] ${isConfirming
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'}`}>
                                        {isConfirming ? (
                                            <>
                                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-3.5 h-3.5" /> Payment Received
                                            </>
                                        )}
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
