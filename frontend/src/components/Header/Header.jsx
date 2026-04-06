import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { processLogout } from '../../store/slices/userSlice';
import { adminMenu, doctorMenu } from './menuConfig';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isLoggedIn, userInfo } = useSelector(state => state.user);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(processLogout());
        setMenuOpen(false);
        navigate('/login');
    };

    const roleId = userInfo?.roleId;
    const displayName = `${userInfo?.lastName || ''} ${userInfo?.firstName || ''}`.trim() || 'User';
    const initial = (userInfo?.firstName?.[0] || userInfo?.lastName?.[0] || 'U').toUpperCase();

    // Lấy menu theo role
    const roleMenu = roleId === 'R1' ? adminMenu : roleId === 'R2' ? doctorMenu : [];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">

                {/* Logo */}
                <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <span className="font-bold text-indigo-700 text-lg hidden sm:block">HealthConnect</span>
                </Link>

                {/* Nav - Desktop */}
                <nav className="hidden md:flex items-center gap-1">

                    {/* Admin & Doctor: hiển thị menu từ menuConfig */}
                    {isLoggedIn && roleMenu.length > 0 ? (
                        roleMenu.map(item => (
                            <Link
                                key={item.link}
                                to={item.link}
                                className={`px-3 py-2 text-sm rounded-lg transition font-medium
                                    ${location.pathname === item.link
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))
                    ) : (
                        // Patient & Guest: hiển thị menu public
                        <>
                            <Link to="/home"
                                className={`px-3 py-2 text-sm rounded-lg transition font-medium
                                    ${location.pathname === '/home' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                Trang chủ
                            </Link>
                            <Link to="/booking"
                                className={`px-3 py-2 text-sm font-semibold rounded-lg transition
                                    ${location.pathname === '/booking' ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                                Đặt lịch khám
                            </Link>
                            {isLoggedIn && roleId === 'R3' && (
                                <Link to="/my-bookings"
                                    className={`px-3 py-2 text-sm rounded-lg transition font-medium
                                        ${location.pathname === '/my-bookings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                    Lịch hẹn của tôi
                                </Link>
                            )}
                        </>
                    )}
                </nav>

                {/* Right: User dropdown */}
                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {initial}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                                    {displayName}
                                </span>
                                <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {menuOpen && (
                                <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                                        <p className="text-xs text-gray-400 truncate">{userInfo?.email}</p>
                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                                            {roleId === 'R1' ? 'Admin' : roleId === 'R2' ? 'Bác sĩ' : 'Bệnh nhân'}
                                        </span>
                                    </div>

                                    {/* Role menu items trong dropdown */}
                                    {roleMenu.map(item => (
                                        <Link key={item.link} to={item.link}
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            {item.name}
                                        </Link>
                                    ))}

                                    {/* Patient dropdown items */}
                                    {roleId === 'R3' && (
                                        <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            📅 Lịch hẹn của tôi
                                        </Link>
                                    )}

                                    <hr className="my-1 border-gray-100" />
                                    <button onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition">
                                        🚪 Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/login')}
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                                Đăng nhập
                            </button>
                            <button onClick={() => navigate('/booking')}
                                className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                                Đặt lịch
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay đóng dropdown */}
            {menuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            )}
        </header>
    );
};

export default Header;