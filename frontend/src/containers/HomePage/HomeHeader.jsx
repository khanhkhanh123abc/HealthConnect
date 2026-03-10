import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as actions from "../../store/index";
import './HomeHeader.scss';

const HomeHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const userInfo = useSelector(state => state.user.userInfo);

    const returnToHome = () => {
        navigate('/home');
    }

    const handleLogin = () => {
        navigate('/login');
    }

    const handleLogout = () => {
        dispatch(actions.processLogout());
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16 px-6 flex items-center justify-between">
            {/* Left: Logo & Branding */}
            <div className="flex items-center gap-3 cursor-pointer">
                <i className="fa-solid fa-bars font-size:25px text-2xl text-slate-600 hover:text-indigo-600"></i>
                <div className="header-logo" onClick={returnToHome}></div>
                
            </div>

            {/* Center: Navigation Links (Public) */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Specialty</div>
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Medical facilities</div>
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Doctor</div>
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Examination package</div>
            </div>

            {/* Right: Auth Buttons & User Info */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 mr-2 hover:text-indigo-600 cursor-pointer">
                    <i className="fas fa-question-circle"></i>
                    <span className="text-xs font-medium">Hỗ trợ</span>
                </div>

                {isLoggedIn ? (
                    <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
                        <span className="text-sm font-medium text-slate-700">
                            Chào, <span className="font-bold">{userInfo?.firstName}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-md text-sm font-bold transition-all"
                        >
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        Đăng nhập
                    </button>
                )}
            </div>
        </div>
    );
};

export default HomeHeader;