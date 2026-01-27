import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminMenu, doctorMenu } from './menuConfig';
import { Link, useNavigate } from 'react-router-dom';
import { processLogout } from '../../store/slices/userSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.user.userInfo);

    // Tính toán menu trực tiếp để tránh lỗi render lặp
    const role = userInfo?.roleId?.trim(); // Khớp với ADMIN/DOCTOR trong DB
    const menu = role === 'ADMIN' ? adminMenu : (role === 'DOCTOR' ? doctorMenu : []);

    const handleLogout = () => {
        dispatch(processLogout());
        navigate('/login');
    };

    return (
        <header className="w-full bg--700 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                
                {/* Khối bên trái: Logo & Menu */}
                <div className="flex items-center space-x-10">
                    <Link to="/home" className="text-xl font-extrabold tracking-tighter uppercase hover:opacity-80 transition-opacity">
                        Health<span className="text-indigo-300">Connect</span>
                    </Link>
                    
                    <nav className="hidden md:flex items-center space-x-1">
                        {menu.map((item, index) => (
                            <Link 
                                key={index}
                                to={item.link}
                                className="px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 transition-all duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Khối bên phải: User Info & Logout */}
                <div className="flex items-center space-x-6">
                    <div className="hidden sm:block text-right">
                        <p className="text-xs text-indigo-200 leading-none">Logged in as</p>
                        <p className="text-sm font-semibold">{userInfo?.firstName || 'User'}</p>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full border border-white/30 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
                    >
                        <span>Logout</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;