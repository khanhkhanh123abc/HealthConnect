import React from 'react';
import HomeHeader from '../Header/Header';

const HomePage = () => {
    return (
        <div className="w-full min-h-screen bg-white text-slate-800 font-sans">
            <HomeHeader />

            {/* 1. HERO SECTION (Banner & Search) */}
            <div className="mt-16 bg-slate-50 pt-16 pb-12 px-4 flex flex-col items-center justify-center border-b border-slate-100">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800 uppercase tracking-wide mb-8 max-w-4xl leading-snug">
                    Premium Medical Booking, Dental Care & Beauty Platform
                </h1>

                {/* Search Bar */}
                <div className="w-full max-w-2xl relative shadow-lg rounded-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-search text-slate-400"></i>
                    </div>
                    <input
                        type="text"
                        className="w-full py-4 pl-12 pr-6 rounded-full border-none outline-none text-slate-600 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search for a specialty, doctor, or clinic..."
                    />
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

                {/* 2. COMPREHENSIVE SERVICES SECTION */}
                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Comprehensive Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Service Item */}
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all">
                            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                                <i className="fas fa-user-md text-indigo-600 text-xl"></i>
                            </div>
                            <span className="font-semibold text-slate-700">Specialist Examination</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                <i className="fas fa-mobile-alt text-blue-600 text-xl"></i>
                            </div>
                            <span className="font-semibold text-slate-700">Telemedicine</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all">
                            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                                <i className="fas fa-stethoscope text-emerald-600 text-xl"></i>
                            </div>
                            <span className="font-semibold text-slate-700">General Checkup</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all">
                            <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                                <i className="fas fa-flask text-rose-600 text-xl"></i>
                            </div>
                            <span className="font-semibold text-slate-700">Medical Tests</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                <i className="fas fa-brain text-purple-600 text-xl"></i>
                            </div>
                            <span className="font-semibold text-slate-700">Mental Health</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all">
                            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                                <i className="fas fa-tooth text-teal-600 text-xl"></i>
                            </div>
                            <span className="font-semibold text-slate-700">Dental Care</span>
                        </div>
                    </div>
                </section>

                {/* 3. POPULAR SPECIALTIES SECTION */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Popular Specialties</h2>
                        <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">
                            See more
                        </button>
                    </div>
                    {/* Grid for specialties */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Card 1 */}
                        <div className="flex flex-col cursor-pointer group">
                            <div className="h-40 rounded-xl overflow-hidden bg-slate-200 mb-3 relative">
                                {/* Dùng thẻ img để chèn ảnh chuyên khoa thực tế */}
                                <div className="absolute inset-0 bg-teal-700/80 group-hover:bg-teal-700/60 transition-colors flex items-center justify-center">
                                    <span className="text-white font-bold tracking-widest uppercase">Specialty</span>
                                </div>
                            </div>
                            <span className="font-semibold text-slate-700 text-center group-hover:text-indigo-600 transition-colors">Musculoskeletal</span>
                        </div>
                        {/* Card 2 */}
                        <div className="flex flex-col cursor-pointer group">
                            <div className="h-40 rounded-xl overflow-hidden bg-slate-200 mb-3 relative">
                                <div className="absolute inset-0 bg-teal-800/80 group-hover:bg-teal-800/60 transition-colors flex items-center justify-center">
                                    <span className="text-white font-bold tracking-widest uppercase">Specialty</span>
                                </div>
                            </div>
                            <span className="font-semibold text-slate-700 text-center group-hover:text-indigo-600 transition-colors">Neurology</span>
                        </div>
                        {/* Card 3 */}
                        <div className="flex flex-col cursor-pointer group">
                            <div className="h-40 rounded-xl overflow-hidden bg-slate-200 mb-3 relative">
                                <div className="absolute inset-0 bg-emerald-700/80 group-hover:bg-emerald-700/60 transition-colors flex items-center justify-center">
                                    <span className="text-white font-bold tracking-widest uppercase">Specialty</span>
                                </div>
                            </div>
                            <span className="font-semibold text-slate-700 text-center group-hover:text-indigo-600 transition-colors">Gastroenterology</span>
                        </div>
                        {/* Card 4 */}
                        <div className="flex flex-col cursor-pointer group">
                            <div className="h-40 rounded-xl overflow-hidden bg-slate-200 mb-3 relative">
                                <div className="absolute inset-0 bg-cyan-700/80 group-hover:bg-cyan-700/60 transition-colors flex items-center justify-center">
                                    <span className="text-white font-bold tracking-widest uppercase">Specialty</span>
                                </div>
                            </div>
                            <span className="font-semibold text-slate-700 text-center group-hover:text-indigo-600 transition-colors">Cardiology</span>
                        </div>
                    </div>
                </section>

                {/* 4. MAIN BANNER SLIDER (Trình chiếu ảnh lớn giữa trang) */}
                <section className="w-full mt-10">
                    <div className="w-full h-[400px] bg-[#f5ebe6] rounded-2xl relative flex items-center justify-center shadow-inner overflow-hidden">
                        {/* Placeholder cho Banner Image */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center max-w-lg z-10">
                            <h2 className="text-3xl font-light tracking-widest text-slate-800 mb-4">MINIMAL</h2>
                            <p className="text-slate-600 font-serif italic">"HealthConnect - Your trusted healthcare companion"</p>
                        </div>

                        {/* Dots Navigation */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        </div>
                    </div>
                </section>

                {/* 5. OUTSTANDING DOCTORS SECTION (Bác sĩ nổi bật) */}
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Outstanding Doctors</h2>
                        <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">
                            See more
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Doctor Card 1 */}
                        <div className="flex flex-col items-center bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-teal-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Doctor" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-center mb-1">Prof. Dr. John Smith</h3>
                            <p className="text-sm text-slate-500 text-center">Gastroenterology</p>
                            <p className="text-xs text-slate-400 text-center mt-2">General Hospital</p>
                        </div>

                        {/* Doctor Card 2 */}
                        <div className="flex flex-col items-center bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-blue-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Doctor" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-center mb-1">Assoc. Prof. Sarah Lee</h3>
                            <p className="text-sm text-slate-500 text-center">Cardiology</p>
                            <p className="text-xs text-slate-400 text-center mt-2">Heart Institute</p>
                        </div>

                        {/* Doctor Card 3 */}
                        <div className="flex flex-col items-center bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-indigo-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" alt="Doctor" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-center mb-1">Dr. Michael Chen</h3>
                            <p className="text-sm text-slate-500 text-center">Neurology</p>
                            <p className="text-xs text-slate-400 text-center mt-2">City Clinic</p>
                        </div>

                        {/* Doctor Card 4 */}
                        <div className="flex flex-col items-center bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-rose-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia" alt="Doctor" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-center mb-1">Dr. Emily Davis</h3>
                            <p className="text-sm text-slate-500 text-center">Dermatology</p>
                            <p className="text-xs text-slate-400 text-center mt-2">Skin Care Center</p>
                        </div>
                    </div>
                </section>

                {/* 6. HANDBOOKS SECTION (Cẩm nang) */}
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Health Handbooks</h2>
                        <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">
                            See more
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Handbook 1 */}
                        <div className="cursor-pointer group">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-teal-800 mb-3">
                                <div className="w-full h-full bg-gradient-to-tr from-teal-900 to-teal-700 flex items-center justify-center p-4">
                                    <span className="text-white font-serif text-center">Dental Implant Guide 2024</span>
                                </div>
                            </div>
                            <h3 className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 line-clamp-2">How much does a dental implant cost in 2024? A comprehensive comparison...</h3>
                        </div>

                        {/* Handbook 2 */}
                        <div className="cursor-pointer group">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-emerald-400 mb-3">
                                <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center p-4"></div>
                            </div>
                            <h3 className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 line-clamp-2">Top 7 best dental clinics for porcelain crowns in the city...</h3>
                        </div>

                        {/* Handbook 3 */}
                        <div className="cursor-pointer group">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-amber-500 mb-3">
                                <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center p-4"></div>
                            </div>
                            <h3 className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 line-clamp-2">Reputable psychological counseling centers: Where to find trust...</h3>
                        </div>

                        {/* Handbook 4 */}
                        <div className="cursor-pointer group">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-green-700 mb-3">
                                <div className="w-full h-full bg-gradient-to-tr from-green-800 to-green-600 flex items-center justify-center p-4">
                                    <span className="text-white font-serif text-center">Aesthetic Surgery</span>
                                </div>
                            </div>
                            <h3 className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 line-clamp-2">Review of top 9 renowned plastic surgeons specialized in...</h3>
                        </div>
                    </div>
                </section>

                {/* 7. MEDIA SECTION (Truyền thông) */}
                <section className="mt-16 mb-20 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Media Coverage about HealthConnect</h2>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Video Player */}
                        <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg bg-slate-800 aspect-video relative flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors">
                                <i className="fas fa-play text-white text-2xl ml-1"></i>
                            </div>
                        </div>

                        {/* Partner Logos Grid */}
                        <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-xl flex items-center justify-center p-4 aspect-square shadow-sm hover:shadow-md transition-shadow grayscale hover:grayscale-0 cursor-pointer">
                                    <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs font-bold text-center">
                                        PARTNER {idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            {/* 8. FOOTER SECTION */}

            <footer className="w-full mt-16 pt-12 pb-6 border-t border-slate-200 bg-[#fbfbfb]">
                {/* Thẻ div này giúp nội dung footer nằm gọn ở giữa, thẳng hàng với các phần trên */}
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {/* Column 1: Company Info */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase">HealthConnect Technology JSC</h3>
                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                <i className="fas fa-map-marker-alt mt-1 text-slate-400 w-4"></i>
                                <span>123 Cau Giay Street, Dich Vong Ward, Cau Giay District, Hanoi</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <i className="fas fa-phone-alt text-slate-400 w-4"></i>
                                <span>024 7301 2468 (7:30 - 18:00)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <i className="fas fa-envelope text-slate-400 w-4"></i>
                                <span>support@healthconnect.vn</span>
                            </div>
                        </div>

                        {/* Column 2: About Us */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-bold text-slate-800 text-sm mb-2">About Us</h3>
                            <a href="#" className="text-sm text-blue-500 hover:text-indigo-600 transition-colors">Partner with us</a>
                            <a href="#" className="text-sm text-blue-500 hover:text-indigo-600 transition-colors">Digital Transformation</a>
                            <a href="#" className="text-sm text-blue-500 hover:text-indigo-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm text-blue-500 hover:text-indigo-600 transition-colors">Terms of Service</a>
                        </div>

                        {/* Column 3: Content Partners */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-bold text-slate-800 text-sm mb-2">Content Partners</h3>
                            <a href="#" className="text-sm text-blue-500 hover:text-indigo-600 transition-colors">Hello Doctor</a>
                            <a href="#" className="text-sm text-blue-500 hover:text-indigo-600 transition-colors">Bernard Healthcare System</a>
                            <a href="#" className="text-sm text-blue-500 hover:text-indigo-600 transition-colors">Doctor Check</a>
                        </div>

                        {/* Column 4: Mobile Apps */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-bold text-slate-800 text-sm mb-2">Get the App</h3>
                            <div className="flex flex-row lg:flex-col gap-3">
                                {/* App Store */}
                                <button className="bg-slate-900 text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors w-max">
                                    <i className="fab fa-apple text-xl"></i>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-slate-300">Download on the</span>
                                        <span className="text-sm font-semibold">App Store</span>
                                    </div>
                                </button>
                                {/* Google Play */}
                                <button className="bg-slate-900 text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors w-max">
                                    <i className="fab fa-google-play text-xl"></i>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-slate-300">GET IT ON</span>
                                        <span className="text-sm font-semibold">Google Play</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright & Socials */}
                    <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            © 2026 HealthConnect. The leading medical booking platform in Vietnam.
                        </p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-blue-500">
                            <a href="#" className="hover:text-indigo-600 transition-colors">Facebook</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">YouTube</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">TikTok</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;