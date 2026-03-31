import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/Header/Header';
import { getTopDoctorHomeService } from '../services/doctorService';

const Home = () => {
    const navigate = useNavigate();
    const [topDoctors, setTopDoctors] = useState([]);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                let res = await getTopDoctorHomeService(8);
                if (res && res.data && res.data.errCode === 0) {
                    setTopDoctors(res.data.data || []);
                }
            } catch (error) {
                console.log("Lỗi fetch doctors:", error);
            } finally {
                setIsLoadingDoctors(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleViewDoctorDetail = (doctorId) => {
        navigate(`/doctor-profile/${doctorId}`);
    };

    return (
        <div className="w-full font-sans">
            <HomeHeader />

            {/* HERO */}
            <div className="hero-section bg-gradient-to-r from-cyan-500 to-blue-600 w-full pt-28 pb-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-md">
                        Nền tảng đặt lịch khám, tư vấn sức khỏe hàng đầu
                    </h1>
                    <div className="flex justify-center">
                        <div className="bg-white rounded-full flex items-center w-full max-w-2xl p-2 shadow-lg">
                            <svg className="w-6 h-6 text-gray-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Tìm chuyên khoa, bác sĩ, phòng khám..."
                                className="w-full px-4 py-2 outline-none text-gray-700 bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* DỊCH VỤ */}
            <section className="py-12 bg-white w-full">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Dịch vụ nổi bật</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: '🩺', label: 'Khám chuyên khoa', color: 'bg-blue-100 text-blue-600' },
                            { icon: '📱', label: 'Tư vấn từ xa', color: 'bg-green-100 text-green-600' },
                            { icon: '🏥', label: 'Khám tổng quát', color: 'bg-purple-100 text-purple-600' },
                            { icon: '🧪', label: 'Xét nghiệm', color: 'bg-pink-100 text-pink-600' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition cursor-pointer border hover:border-indigo-200"
                            >
                                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <span className="text-2xl">{item.icon}</span>
                                </div>
                                <h3 className="font-semibold text-gray-700 text-sm">{item.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BÁC SĨ NỔI BẬT */}
            <section className="py-12 bg-gray-50 w-full">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Bác sĩ nổi bật</h2>
                        <button className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition text-sm border border-indigo-200">
                            Xem tất cả →
                        </button>
                    </div>

                    {isLoadingDoctors ? (
                        // Skeleton loading
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 animate-pulse border">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded mx-auto w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : topDoctors.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {topDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    onClick={() => handleViewDoctorDetail(doctor.id)}
                                    className="bg-white rounded-xl p-5 text-center hover:shadow-lg transition cursor-pointer border hover:border-indigo-300 group"
                                >
                                    {/* Avatar */}
                                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-indigo-100 group-hover:border-indigo-400 transition">
                                        <img
                                            src={doctor.image || 'https://via.placeholder.com/80'}
                                            alt={`${doctor.lastName} ${doctor.firstName}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Chức danh */}
                                    {doctor.positionData?.value && (
                                        <span className="inline-block text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full mb-1 font-medium">
                                            {doctor.positionData.value}
                                        </span>
                                    )}

                                    {/* Tên */}
                                    <h3 className="font-semibold text-gray-800 text-sm mt-1 group-hover:text-indigo-600 transition">
                                        {doctor.lastName} {doctor.firstName}
                                    </h3>

                                    {/* Nút đặt lịch */}
                                    <button className="mt-3 w-full text-xs bg-indigo-600 text-white py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">
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

            {/* FOOTER */}
            <footer className="bg-gray-800 text-white w-full pt-12 pb-8">
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
                            <li className="hover:text-white cursor-pointer transition">Về chúng tôi</li>
                            <li className="hover:text-white cursor-pointer transition">Dành cho bệnh nhân</li>
                            <li className="hover:text-white cursor-pointer transition">Dành cho bác sĩ</li>
                            <li className="hover:text-white cursor-pointer transition">Điều khoản dịch vụ</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Tải ứng dụng</h3>
                        <div className="flex gap-2">
                            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">🍏 App Store</button>
                            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">🤖 Google Play</button>
                        </div>
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