import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { processLogout } from "../../store/slices/userSlice";
import logo from '../../assets/logo.svg';

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
        dispatch(processLogout());
        navigate('/home');
    }

    const renderNavLinks = () => {
        // 1. ADMIN Menu
        if (isLoggedIn && userInfo?.roleId === 'R1') {
            return (
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <Link to="/system/user-manage" className="hover:text-indigo-600 uppercase transition-colors">User Management</Link>
                    <Link to="/system/clinic-manage" className="hover:text-indigo-600 uppercase transition-colors">Clinic Management</Link>
                    <Link to="/system/specialty-manage" className="hover:text-indigo-600 uppercase transition-colors">Specialty Management</Link>
                    <Link to="/system/doctor-manage" className="hover:text-indigo-600 uppercase transition-colors">Doctor Management</Link>
                </div>
            );
        }

        // 2. DOCTOR Menu
        if (isLoggedIn && userInfo?.roleId === 'R2') {
            return (
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <Link to="/doctor/manage-schedule" className="hover:text-indigo-600 uppercase transition-colors">Schedule</Link>
                    <Link to="/doctor/manage-patient" className="hover:text-indigo-600 uppercase transition-colors">Patients</Link>
                </div>
            );
        }

        // 3. DEFAULT (Guest or Patient)
        return (
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Specialties</div>
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Facilities</div>
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Doctors</div>
                <div className="hover:text-indigo-600 cursor-pointer uppercase transition-colors">Packages</div>
            </div>
        );
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={returnToHome}>
                <img src={logo} alt="HealthConnect" className="w-[160px] h-auto" />
            </div>

            {renderNavLinks()}

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 mr-2 hover:text-indigo-600 cursor-pointer">
                    <i className="fas fa-question-circle"></i>
                    <span className="text-xs font-medium">Support</span>
                </div>

                {isLoggedIn ? (
                    <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
                        <span className="text-sm font-medium text-slate-700">
                            Hello, <span className="font-bold text-indigo-600">{userInfo?.firstName}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-1.5 rounded-md text-sm font-bold transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        Log In
                    </button>
                )}
            </div>
        </div>
    );
};

export default HomeHeader;