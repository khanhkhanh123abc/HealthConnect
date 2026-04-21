import React, { useEffect, useState, useCallback } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, Stethoscope, CalendarCheck, TrendingUp, XCircle, RefreshCw, DollarSign } from 'lucide-react';
import axios from '../../../app/axios';

const KPICard = ({ icon: Icon, label, value, sub, iconBg, iconColor }) => (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
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

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/admin-stats');
            if (res?.data?.errCode === 0) setData(res.data.data);
        } catch { /* silent */ } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-200/60 h-28 animate-pulse" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 h-72 animate-pulse" />
                    <div className="bg-white rounded-2xl border border-gray-200/60 h-72 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!data) return (
        <div className="flex items-center justify-center py-24 text-sm text-gray-400">
            Failed to load statistics
        </div>
    );

    const { kpis, bookingTrend, statusDist, specialtyDist } = data;
    const successRate = kpis.totalBookings > 0 ? ((kpis.completedBookings / kpis.totalBookings) * 100).toFixed(1) : 0;
    const cancelRate  = kpis.totalBookings > 0 ? ((kpis.cancelledBookings / kpis.totalBookings) * 100).toFixed(1) : 0;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Overview Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">System-wide statistics</p>
                </div>
                <button onClick={fetchStats}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard icon={DollarSign} label="Total Revenue"
                    value={formatRevenue(kpis.totalRevenue)}
                    sub={`${kpis.completedBookings} completed appointments`}
                    iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                <KPICard icon={Stethoscope} label="Doctors"
                    value={kpis.totalDoctors}
                    sub={`+${kpis.newDoctorsMonth} new this month`}
                    iconBg="bg-blue-50" iconColor="text-blue-600" />
                <KPICard icon={Users} label="Patients"
                    value={kpis.totalPatients}
                    sub={`+${kpis.newPatientsMonth} new this month`}
                    iconBg="bg-purple-50" iconColor="text-purple-600" />
                <KPICard icon={CalendarCheck} label="Total Bookings"
                    value={kpis.totalBookings}
                    sub={`${successRate}% completed · ${cancelRate}% cancelled`}
                    iconBg="bg-amber-50" iconColor="text-amber-600" />
            </div>

            {/* Row 2: Trend + Status Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

                {/* Booking trend line chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 p-5">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Booking Trend (30 days)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={bookingTrend} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="date" tickFormatter={formatDateShort} tick={{ fontSize: 11, fill: '#9CA3AF' }} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="count" name="Bookings"
                                stroke="#2563EB" strokeWidth={2} dot={false}
                                activeDot={{ r: 4, fill: '#2563EB' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Status distribution pie */}
                <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                                dataKey="value" paddingAngle={3}>
                                {statusDist.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                        {statusDist.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                <span className="text-[11px] text-gray-500 truncate">{s.name}</span>
                                <span className="text-[11px] font-medium text-gray-700 ml-auto">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Specialty bar chart */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Bookings by Specialty</h2>
                    <span className="text-xs text-gray-400">Number of bookings per specialty</span>
                </div>
                {specialtyDist.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-400">No specialty data available</div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={specialtyDist} margin={{ top: 4, right: 8, bottom: 20, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} angle={-20} textAnchor="end" interval={0} />
                            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="Bookings" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={48} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
