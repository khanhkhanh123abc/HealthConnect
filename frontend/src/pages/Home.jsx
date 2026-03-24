import React from 'react';
import HomeHeader from '../components/Header/Header';

const Home = () => {
    return (
        <div className="w-full font-sans">
            {<HomeHeader />}

            {/* 1. HERO SECTION (Banner & Search) */}
            <div className="hero-section bg-gradient-to-r from-cyan-500 to-blue-600 w-full pt-28 pb-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-md">
                        Premium Medical Booking, Dental Care & Beauty Platform
                    </h1>
                    <div className="flex justify-center">
                        <div className="bg-white rounded-full flex items-center w-full max-w-2xl p-2 shadow-lg">
                            <svg className="w-6 h-6 text-gray-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search for specialty, doctor, clinic..."
                                className="w-full px-4 py-2 outline-none text-gray-700 bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. COMPREHENSIVE SERVICES */}
            <section className="py-12 bg-white w-full">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Comprehensive Services</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Box Dịch vụ (Ví dụ mẫu) */}
                        <div className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition cursor-pointer border">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 text-2xl">🩺</span>
                            </div>
                            <h3 className="font-semibold text-gray-700">Specialized Examination</h3>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition cursor-pointer border">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-green-600 text-2xl">📱</span>
                            </div>
                            <h3 className="font-semibold text-gray-700">Remote Consultation</h3>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition cursor-pointer border">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-purple-600 text-2xl">🏥</span>
                            </div>
                            <h3 className="font-semibold text-gray-700">General Checkup</h3>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition cursor-pointer border">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-pink-600 text-2xl">🧪</span>
                            </div>
                            <h3 className="font-semibold text-gray-700">Medical Tests</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. POPULAR SPECIALTIES */}
            <section className="py-12 bg-gray-100 w-full">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Popular Specialties</h2>
                        <button className="text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition">See more</button>
                    </div>
                    {/* Chỗ này sau sẽ gắn Slider chứa danh sách chuyên khoa */}
                    <div className="bg-white h-48 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                        <span className="text-gray-400">Slider of Specialties (To be integrated with API)</span>
                    </div>
                </div>
            </section>

            {/* 4. OUTSTANDING DOCTORS */}
            <section className="py-12 bg-white w-full">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Outstanding Doctors</h2>
                        <button className="text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition">See more</button>
                    </div>
                    {/* Chỗ này sau sẽ gắn Slider chứa danh sách bác sĩ */}
                    <div className="bg-gray-50 h-64 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                        <span className="text-gray-400">Slider of Outstanding Doctors (Data from Admin Panel)</span>
                    </div>
                </div>
            </section>

            {/* 5. HEALTH HANDBOOKS & MEDIA COVERAGE */}
            <section className="py-12 bg-gray-100 w-full">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
                    {/* Cẩm nang */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Handbooks</h2>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <p className="text-gray-600">Latest medical articles and tips will be displayed here.</p>
                        </div>
                    </div>
                    {/* Truyền thông */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Media Coverage</h2>
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-center h-32">
                            <p className="text-gray-600">Logos of VTV, VnExpress, Dân Trí...</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FULL-WIDTH FOOTER */}
            <footer className="bg-gray-800 text-white w-full pt-12 pb-8">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-blue-400">HealthConnect</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            The leading platform for healthcare and medical booking. Helping you connect with the best doctors and clinics easily.
                        </p>
                        <p className="text-gray-400 text-sm">📍 Address: Hanoi, Vietnam</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li className="hover:text-white cursor-pointer transition">About Us</li>
                            <li className="hover:text-white cursor-pointer transition">For Patients</li>
                            <li className="hover:text-white cursor-pointer transition">For Doctors</li>
                            <li className="hover:text-white cursor-pointer transition">Terms of Service</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Download App</h3>
                        <div className="flex gap-2">
                            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center transition">
                                <span className="mr-2">🍏</span> App Store
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center transition">
                                <span className="mr-2">🤖</span> Google Play
                            </button>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-500 text-sm mt-8">
                    &copy; 2026 HealthConnect. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;