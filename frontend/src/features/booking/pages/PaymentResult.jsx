import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status'); // 'success' | 'failed' | 'error'

    const config = {
        success: {
            icon: '✅',
            title: 'Thanh toán thành công!',
            desc: 'Lịch khám của bạn đã được xác nhận. Vui lòng kiểm tra email để xem chi tiết.',
            btnText: 'Xem lịch hẹn của tôi',
            btnAction: () => navigate('/my-bookings'),
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
        },
        failed: {
            icon: '❌',
            title: 'Thanh toán thất bại',
            desc: 'Giao dịch không thành công hoặc bị huỷ. Lịch khám chưa được xác nhận.',
            btnText: 'Thử lại',
            btnAction: () => navigate('/booking'),
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
        },
        error: {
            icon: '⚠️',
            title: 'Có lỗi xảy ra',
            desc: 'Hệ thống gặp sự cố. Vui lòng liên hệ hỗ trợ nếu tiền đã bị trừ.',
            btnText: 'Về trang chủ',
            btnAction: () => navigate('/home'),
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
        },
    };

    const c = config[status] || config.error;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className={`bg-white rounded-2xl shadow-lg border ${c.border} p-10 max-w-md w-full text-center`}>
                <div className="text-6xl mb-4">{c.icon}</div>
                <h1 className={`text-2xl font-bold mb-3 ${c.color}`}>{c.title}</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">{c.desc}</p>
                <button
                    onClick={c.btnAction}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
                >
                    {c.btnText}
                </button>
            </div>
        </div>
    );
};

export default PaymentResult;