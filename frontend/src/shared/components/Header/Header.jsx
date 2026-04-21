import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { processLogout } from '../../../features/auth/store/userSlice';
import { adminMenu, doctorMenu } from './menuConfig';
import { LogOut, Calendar, ChevronDown, Activity } from 'lucide-react';

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
    const roleMenu = roleId === 'R1' ? adminMenu : roleId === 'R2' ? doctorMenu : [];

    const navLinkClass = (path) =>
        `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            location.pathname === path || location.pathname.startsWith(path + '/')
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
        }`;

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/home" className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 text-[15px] hidden sm:block">HealthConnect</span>
                </Link>

                {/* Nav - Desktop */}
                <nav className="hidden md:flex items-center gap-1">
                    {isLoggedIn && roleMenu.length > 0 ? (
                        roleMenu.map(item => (
                            <Link key={item.link} to={item.link} className={navLinkClass(item.link)}>
                                {item.name}
                            </Link>
                        ))
                    ) : (
                        <>
                            <Link to="/home" className={navLinkClass('/home')}>Home</Link>
                            <Link to="/booking" className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                location.pathname === '/booking' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                            }`}>Book Appointment</Link>
                            {isLoggedIn && roleId === 'R3' && (
                                <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>My Appointments</Link>
                            )}
                        </>
                    )}
                </nav>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold flex-shrink-0">
                                    {initial}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                                    {displayName}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-200/60 py-1.5 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{userInfo?.email}</p>
                                        <span className="inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                                            {roleId === 'R1' ? 'Admin' : roleId === 'R2' ? 'Doctor' : 'Patient'}
                                        </span>
                                    </div>

                                    {roleMenu.map(item => (
                                        <Link key={item.link} to={item.link}
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            {item.name}
                                        </Link>
                                    ))}

                                    {roleId === 'R3' && (
                                        <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            My Appointments
                                        </Link>
                                    )}

                                    <hr className="my-1 border-gray-100" />
                                    <button onClick={handleLogout}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors">
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/login')}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                Sign In
                            </button>
                            <button onClick={() => navigate('/register')}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                Sign Up
                            </button>
                            <button onClick={() => navigate('/booking')}
                                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm">
                                Book
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {menuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            )}
        </header>
    );
};

export default Header;
