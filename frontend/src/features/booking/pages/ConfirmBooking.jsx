import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Info, XCircle, AlertTriangle, Activity } from 'lucide-react';
import axios from '../../../app/axios';

const STATUS = { loading: 'loading', success: 'success', already: 'already', cancelled: 'cancelled', error: 'error' };

const ConfirmBooking = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState(STATUS.loading);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) { setStatus(STATUS.error); setMessage('Invalid link.'); return; }
        confirmBooking();
    }, [token]); // eslint-disable-line

    const confirmBooking = async () => {
        try {
            let res = await axios.get(`/api/confirm-booking?token=${token}`);
            const errCode = res?.data?.errCode;
            const errMessage = res?.data?.errMessage;
            if (errCode === 0) {
                setStatus(res?.data?.alreadyConfirmed ? STATUS.already : STATUS.success);
                setMessage(errMessage);
            } else if (errCode === 3) {
                setStatus(STATUS.cancelled);
                setMessage(errMessage);
            } else {
                setStatus(STATUS.error);
                setMessage(errMessage || 'An error occurred.');
            }
        } catch {
            setStatus(STATUS.error);
            setMessage('Could not connect to the server. Please try again.');
        }
    };

    const CONFIG = {
        [STATUS.loading]: {
            Icon: null,
            spinner: true,
            title: 'Confirming...',
            subtitle: 'Please wait a moment',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        [STATUS.success]: {
            Icon: CheckCircle,
            title: 'Confirmed Successfully',
            subtitle: message,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-500',
        },
        [STATUS.already]: {
            Icon: Info,
            title: 'Already Confirmed',
            subtitle: message,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        [STATUS.cancelled]: {
            Icon: XCircle,
            title: 'Appointment Cancelled',
            subtitle: message,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
        },
        [STATUS.error]: {
            Icon: AlertTriangle,
            title: 'Unable to Confirm',
            subtitle: message,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
        },
    };

    const cfg = CONFIG[status];
    const { Icon } = cfg;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200/60 w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">HealthConnect</p>
                        <p className="text-xs text-gray-400">Appointment Confirmation</p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-10 text-center">
                    <div className={`w-16 h-16 ${cfg.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                        {cfg.spinner ? (
                            <svg className={`animate-spin w-8 h-8 ${cfg.iconColor}`} viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        ) : Icon && <Icon className={`w-8 h-8 ${cfg.iconColor}`} />}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{cfg.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{cfg.subtitle}</p>
                </div>

                {/* Actions */}
                {status !== STATUS.loading && (
                    <div className="px-8 pb-8 flex flex-col gap-3">
                        <button onClick={() => navigate('/my-bookings')}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200">
                            View my appointments
                        </button>
                        <button onClick={() => navigate('/home')}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 active:scale-[0.98] transition-all duration-200">
                            Go home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmBooking;
