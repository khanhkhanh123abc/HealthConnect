import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status');

    const config = {
        success: {
            Icon: CheckCircle,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-50',
            title: 'Payment Successful',
            desc: 'Your appointment has been confirmed. Please check your email for details.',
            btnText: 'View my appointments',
            btnAction: () => navigate('/my-bookings'),
        },
        failed: {
            Icon: XCircle,
            iconColor: 'text-red-500',
            iconBg: 'bg-red-50',
            title: 'Payment Failed',
            desc: 'The transaction was unsuccessful or cancelled. Your appointment has not been confirmed.',
            btnText: 'Try again',
            btnAction: () => navigate('/booking'),
        },
        error: {
            Icon: AlertTriangle,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-50',
            title: 'Something went wrong',
            desc: 'The system encountered an error. Please contact support if your payment was charged.',
            btnText: 'Go home',
            btnAction: () => navigate('/home'),
        },
    };

    const c = config[status] || config.error;
    const { Icon } = c;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200/60 p-10 max-w-md w-full text-center">
                <div className={`w-16 h-16 ${c.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                    <Icon className={`w-8 h-8 ${c.iconColor}`} />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">{c.title}</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">{c.desc}</p>
                <button onClick={c.btnAction}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl active:scale-[0.98] transition-all duration-200 text-sm">
                    {c.btnText}
                </button>
            </div>
        </div>
    );
};

export default PaymentResult;
