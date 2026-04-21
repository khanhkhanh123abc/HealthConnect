import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, DollarSign, Clock, CalendarCheck, AlertCircle, RefreshCw } from 'lucide-react';
import axios from '../../../app/axios';

const STATUS_CONFIG = {
    S1: { label: 'Pending',   color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
    S2: { label: 'Confirmed', color: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
    S3: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
};

const KPICard = ({ icon: Icon, label, value, sub, iconBg, iconColor, alert }) => (
    <div className={`bg-white rounded-2xl border p-5 ${alert ? 'border-amber-200' : 'border-gray-200/60'}`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {sub && <p className={`text-xs mt-1 ${alert && value > 0 ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>{sub}</p>}
            </div>
            <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
        </div>
    </div>
);

const formatRevenue = (v) => {
    if (!v) return '$0';
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v}`;
};

const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-');
    return `${d}/${m}`;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200/60 rounded-xl px-3 py-2 shadow-lg text-xs">
            <p className="font-medium text-gray-700 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

const DoctorDashboard = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const doctorId = userInfo?.id;

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!doctorId) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/doctor-stats?doctorId=${doctorId}`);
            if (res?.data?.errCode === 0) setData(res.data.data);
        } catch { /* silent */ } finally {
            setIsLoading(false);
        }
    }, [doctorId]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-200/60 h-28 animate-pulse" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-200/60 h-80 animate-pulse" />
                    <div className="bg-white rounded-2xl border border-gray-200/60 h-80 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!data) return (
        <div className="flex items-center justify-center py-24 text-sm text-gray-400">
            Failed to load statistics
        </div>
    );

    const { kpis, todayBookings, weekTrend, statusDist } = data;
    const doctorName = `${userInfo?.lastName || ''} ${userInfo?.firstName || ''}`.trim();

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome, Dr. {doctorName}</h1>
                    <p className="text-sm text-gray-500 mt-1">Your practice overview</p>
                </div>
                <button onClick={fetchStats}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard icon={Users} label="Patients Treated"
                    value={kpis.totalCompleted}
                    sub="Completed appointments"
                    iconBg="bg-blue-50" iconColor="text-blue-600" />
                <KPICard icon={DollarSign} label="Revenue"
                    value={formatRevenue(kpis.totalRevenue)}
                    sub="From completed appointments"
                    iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                <KPICard icon={AlertCircle} label="Pending"
                    value={kpis.pendingCount}
                    sub={kpis.pendingCount > 0 ? 'Needs attention' : 'No pending appointments'}
                    iconBg="bg-amber-50" iconColor="text-amber-600"
                    alert={kpis.pendingCount > 0} />
                <KPICard icon={CalendarCheck} label="Today's Appointments"
                    value={kpis.todayCount}
                    sub="Scheduled today"
                    iconBg="bg-purple-50" iconColor="text-purple-600" />
            </div>

            {/* Row 2: Timeline + Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

                {/* Today's timeline */}
                <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">
                        Today's Schedule
                        {kpis.todayCount > 0 && (
                            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 ring-1 ring-blue-200 px-2 py-0.5 rounded-full">
                                {kpis.todayCount} appointment{kpis.todayCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </h2>

                    {todayBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                                <CalendarCheck className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-400">No appointments today</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {todayBookings.map((b, i) => {
                                const cfg = STATUS_CONFIG[b.statusId] || STATUS_CONFIG.S1;
                                return (
                                    <div key={b.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100/70 transition-colors">
                                        <div className="flex flex-col items-center w-14 flex-shrink-0">
                                            <Clock className="w-3.5 h-3.5 text-blue-500 mb-0.5" />
                                            <span className="text-xs font-medium text-blue-600 text-center leading-tight">{b.timeValue}</span>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200" />
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0 overflow-hidden">
                                            {b.patientImage
                                                ? <img src={b.patientImage} alt="" className="w-full h-full object-cover" />
                                                : b.patientName?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{b.patientName}</p>
                                            {b.reason && <p className="text-xs text-gray-400 truncate">{b.reason}</p>}
                                        </div>
                                        <span className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Week trend bar + Status pie */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Last 7 Days</h2>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={weekTrend} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="date" tickFormatter={formatDateShort} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Bookings" fill="#2563EB" radius={[5, 5, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3">Status Distribution</h2>
                        <div className="flex items-center gap-4">
                            <ResponsiveContainer width={120} height={120}>
                                <PieChart>
                                    <Pie data={statusDist} cx="50%" cy="50%" innerRadius={35} outerRadius={55}
                                        dataKey="value" paddingAngle={3}>
                                        {statusDist.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v) => [v, '']} contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 11 }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-2">
                                {statusDist.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                        <span className="text-xs text-gray-500 flex-1">{s.name}</span>
                                        <span className="text-xs font-semibold text-gray-700">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
