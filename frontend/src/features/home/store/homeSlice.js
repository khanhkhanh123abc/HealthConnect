import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import HomeHeader from '../components/Header/Header';
import { fetchTopDoctors, fetchSpecialties } from '../store/slices/homeSlice';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        topDoctors,
        specialties,
        loadingDoctors,
        loadingSpecialties,
        loaded
    } = useSelector(state => state.home);

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    // 👉 Fetch API (có cache)
    useEffect(() => {
        if (!loaded) {
            dispatch(fetchTopDoctors());
            dispatch(fetchSpecialties());
        }
    }, [loaded, dispatch]);

    return (
        <div className="w-full font-sans">
            <HomeHeader />

            {/* HERO */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 w-full pt-28 pb-20 text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Đặt lịch khám dễ dàng
                    </h1>
                    <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                        Kết nối với hàng trăm bác sĩ chuyên khoa hàng đầu
                    </p>

                    <div className="flex gap-3 justify-center flex-wrap">
                        <button
                            onClick={() => navigate('/booking')}
                            className="bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition"
                        >
                            Đặt lịch khám ngay →
                        </button>

                        {isLoggedIn && (
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="bg-indigo-700 text-white px-6 py-3.5 rounded-xl hover:bg-indigo-800 transition"
                            >
                                Lịch hẹn của tôi
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* CHUYÊN KHOA */}
            <section className="py-14 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6">Chuyên khoa nổi bật</h2>

                    {loadingSpecialties ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {specialties.map(spec => (
                                <button
                                    key={spec.id}
                                    onClick={() => navigate('/booking')}
                                    className="p-4 border rounded-lg hover:bg-indigo-50 transition"
                                >
                                    <p className="font-semibold">{spec.name}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* BÁC SĨ */}
            <section className="py-14 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6">Bác sĩ nổi bật</h2>

                    {loadingDoctors ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {topDoctors.map(doc => (
                                <div
                                    key={doc.id}
                                    className="p-4 border rounded-lg text-center hover:shadow-md transition"
                                >
                                    <p className="font-semibold">
                                        {doc.lastName} {doc.firstName}
                                    </p>

                                    <button
                                        onClick={() => navigate('/booking')}
                                        className="mt-2 text-sm bg-indigo-600 text-white px-3 py-1 rounded"
                                    >
                                        Đặt lịch
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white text-center py-6">
                © 2026 HealthConnect
            </footer>
        </div>
    );
};

export default Home;