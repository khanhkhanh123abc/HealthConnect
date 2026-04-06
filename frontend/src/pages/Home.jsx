import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeHeader from '../components/Header/Header';
import { getTopDoctorHomeService } from '../services/doctorService';
import axios from '../utils/axios';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    const [topDoctors, setTopDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
    const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);

    useEffect(() => {
        // Load top doctors
        const fetchDoctors = async () => {
            try {
                let res = await getTopDoctorHomeService(8);
                if (res?.data?.errCode === 0) setTopDoctors(res.data.data || []);
            } catch (_e) {}
            finally { setIsLoadingDoctors(false); }
        };

        // Load specialties
        const fetchSpecialties = async () => {
            try {
                let res = await axios.get('/api/get-all-specialty');
                if (res?.data?.errCode === 0) setSpecialties((res.data.data || []).slice(0, 8));
            } catch (_e) {}
            finally { setIsLoadingSpecialties(false); }
        };

        fetchDoctors();
        fetchSpecialties();
    }, []);

    const goToBooking = (specialtyId) => {
        // Navigate to booking page - specialty pre-selection handled via state if needed
        navigate('/booking');
    };

    return (
        <div className="w-full font-sans">
            <HomeHeader />

            {/* ── HERO ── */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 w-full pt-28 pb-20 text-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
                    <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white" />
                </div>
                <div className="container mx-auto px-4 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-sm">
                        Đặt lịch khám dễ dàng
                    </h1>
                    <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                        Kết nối với hàng trăm bác sĩ chuyên khoa hàng đầu trong vài bước đơn giản
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-3 justify-center flex-wrap">
                        <button
                            onClick={() => navigate('/booking')}
                            className="bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition shadow-lg text-base"
                        >
                            Đặt lịch khám ngay →
                        </button>
                        {isLoggedIn && (
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="bg-indigo-700 bg-opacity-60 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-opacity-80 transition border border-indigo-300 text-base"
                            >
                                Lịch hẹn của tôi
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-10 mt-10 flex-wrap">
                        {[
                            { num: '100+', label: 'Bác sĩ' },
                            { num: '20+', label: 'Chuyên khoa' },
                            { num: '50+', label: 'Phòng khám' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl font-bold text-white">{s.num}</p>
                                <p className="text-indigo-200 text-sm">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CHUYÊN KHOA ── */}
            <section className="py-14 bg-white w-full">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Chuyên khoa nổi bật</h2>
                            <p className="text-sm text-gray-400 mt-1">Chọn chuyên khoa để bắt đầu đặt lịch</p>
                        </div>
                        <button
                            onClick={() => navigate('/booking')}
                            className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition text-sm border border-indigo-200"
                        >
                            Xem tất cả →
                        </button>
                    </div>

                    {isLoadingSpecialties ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center p-4 rounded-xl border animate-pulse">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 mb-2" />
                                    <div className="h-3 w-16 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : specialties.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                            {specialties.map(spec => (
                                <button
                                    key={spec.id}
                                    onClick={() => navigate('/booking')}
                                    className="flex flex-col items-center p-4 rounded-xl border-2 border-transparent hover:border-indigo-300 hover:bg-indigo-50 transition text-center group"
                                >
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-indigo-300 transition mb-2">
                                        <img
                                            src={spec.image || 'https://via.placeholder.com/56'}
                                            alt={spec.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 leading-tight">
                                        {spec.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">Chưa có chuyên khoa</div>
                    )}
                </div>
            </section>

            {/* ── QUY TRÌNH ── */}
            <section className="py-14 bg-indigo-50 w-full">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Đặt lịch chỉ trong 4 bước</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { step: '1', icon: '🩺', title: 'Chọn chuyên khoa', desc: 'Tìm đúng chuyên khoa bạn cần khám' },
                            { step: '2', icon: '🏥', title: 'Chọn phòng khám', desc: 'Phòng khám gần bạn, tiện lợi nhất' },
                            { step: '3', icon: '👨‍⚕️', title: 'Chọn bác sĩ', desc: 'Xem hồ sơ và chọn bác sĩ phù hợp' },
                            { step: '4', icon: '📅', title: 'Đặt lịch', desc: 'Chọn ngày giờ và xác nhận' },
                        ].map(item => (
                            <div key={item.step} className="bg-white rounded-xl p-5 text-center shadow-sm border border-indigo-100">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                                    {item.step}
                                </div>
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate('/booking')}
                            className="bg-indigo-600 text-white font-bold px-10 py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-md"
                        >
                            Bắt đầu đặt lịch ngay
                        </button>
                    </div>
                </div>
            </section>

            {/* ── BÁC SĨ NỔI BẬT ── */}
            <section className="py-14 bg-white w-full">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Bác sĩ nổi bật</h2>
                            <p className="text-sm text-gray-400 mt-1">Đội ngũ chuyên gia hàng đầu</p>
                        </div>
                        <button
                            onClick={() => navigate('/booking')}
                            className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition text-sm border border-indigo-200"
                        >
                            Xem tất cả →
                        </button>
                    </div>

                    {isLoadingDoctors ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={`skel-${i}`} className="bg-white rounded-xl p-4 animate-pulse border"> 
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3" />
                                    <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded mx-auto w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : topDoctors.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {topDoctors.map((doctor) => (
                                <div
                                    key={`doc-${doctor.id}`}
                                    className="bg-white rounded-xl p-5 text-center hover:shadow-lg transition border hover:border-indigo-300 group"
                                >
                                    <div
                                        onClick={() => navigate(`/doctor-profile/${doctor.id}`)}
                                        className="cursor-pointer"
                                    >
                                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-indigo-100 group-hover:border-indigo-400 transition">
                                            <img
                                                src={doctor.image || 'https://via.placeholder.com/80'}
                                                alt={`${doctor.lastName} ${doctor.firstName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {doctor.positionData?.value && (
                                            <span className="inline-block text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full mb-1 font-medium">
                                                {doctor.positionData.value}
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-gray-800 text-sm mt-1 group-hover:text-indigo-600 transition">
                                            {doctor.lastName} {doctor.firstName}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => navigate('/booking')}
                                        className="mt-3 w-full text-xs bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
                                    >
                                        Đặt lịch khám
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl block mb-3">👨‍⚕️</span>
                            Chưa có dữ liệu bác sĩ
                        </div>
                    )}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-900 text-white w-full pt-12 pb-8">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-indigo-400">HealthConnect</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Nền tảng đặt lịch khám hàng đầu. Kết nối bệnh nhân với bác sĩ tốt nhất một cách dễ dàng.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li onClick={() => navigate('/booking')} className="hover:text-white cursor-pointer transition">Đặt lịch khám</li>
                            <li onClick={() => navigate('/my-bookings')} className="hover:text-white cursor-pointer transition">Lịch hẹn của tôi</li>
                            <li className="hover:text-white cursor-pointer transition">Về chúng tôi</li>
                            <li className="hover:text-white cursor-pointer transition">Điều khoản dịch vụ</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                        <p className="text-gray-400 text-sm">📧 support@healthconnect.vn</p>
                        <p className="text-gray-400 text-sm mt-1">📞 1800-HEALTH</p>
                    </div>
                </div>
                <div className="text-center text-gray-500 text-sm mt-8">
                    © 2026 HealthConnect. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;