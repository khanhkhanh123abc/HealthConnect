import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const STATUS = {
    loading: 'loading',
    success: 'success',
    already: 'already',
    cancelled: 'cancelled',
    error: 'error'
};

const ConfirmBooking = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState(STATUS.loading);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus(STATUS.error);
            setMessage('Link không hợp lệ!');
            return;
        }
        confirmBooking();
    }, [token]); // eslint-disable-line

    const confirmBooking = async () => {
        try {
            let res = await axios.get(`/api/confirm-booking?token=${token}`);
            const errCode = res?.data?.errCode;
            const errMessage = res?.data?.errMessage;

            if (errCode === 0) {
                if (res?.data?.alreadyConfirmed) {
                    setStatus(STATUS.already);
                } else {
                    setStatus(STATUS.success);
                }
                setMessage(errMessage);
            } else if (errCode === 3) {
                setStatus(STATUS.cancelled);
                setMessage(errMessage);
            } else {
                setStatus(STATUS.error);
                setMessage(errMessage || 'Đã có lỗi xảy ra!');
            }
        } catch (e) {
            setStatus(STATUS.error);
            setMessage('Không thể kết nối máy chủ. Vui lòng thử lại!');
        }
    };

    const CONFIG = {
        [STATUS.loading]: {
            icon: (
                <svg className="animate-spin h-16 w-16 text-indigo-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            ),
            title: 'Đang xác nhận...',
            subtitle: 'Vui lòng chờ trong giây lát',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200'
        },
        [STATUS.success]: {
            icon: <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">✓</div>,
            title: 'Xác nhận thành công!',
            subtitle: message,
            color: 'text-green-700',
            bg: 'bg-green-50',
            border: 'border-green-200'
        },
        [STATUS.already]: {
            icon: <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-4xl">ℹ</div>,
            title: 'Đã xác nhận trước đó',
            subtitle: message,
            color: 'text-blue-700',
            bg: 'bg-blue-50',
            border: 'border-blue-200'
        },
        [STATUS.cancelled]: {
            icon: <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-4xl">✕</div>,
            title: 'Lịch hẹn đã bị hủy',
            subtitle: message,
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200'
        },
        [STATUS.error]: {
            icon: <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-4xl">⚠</div>,
            title: 'Không thể xác nhận',
            subtitle: message,
            color: 'text-yellow-700',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200'
        }
    };

    const cfg = CONFIG[status];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="bg-indigo-600 px-8 py-6 text-center">
                    <h1 className="text-white font-bold text-xl">HealthConnect</h1>
                    <p className="text-indigo-200 text-sm mt-1">Xác nhận lịch khám</p>
                </div>

                {/* Content */}
                <div className={`px-8 py-10 text-center ${cfg.bg} border-b ${cfg.border}`}>
                    <div className="flex justify-center mb-5">
                        {cfg.icon}
                    </div>
                    <h2 className={`text-xl font-bold mb-2 ${cfg.color}`}>
                        {cfg.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {cfg.subtitle}
                    </p>
                </div>

                {/* Actions */}
                {status !== STATUS.loading && (
                    <div className="px-8 py-6 flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                        >
                            Xem lịch hẹn của tôi
                        </button>
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full py-3 border border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition"
                        >
                            Về trang chủ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmBooking;