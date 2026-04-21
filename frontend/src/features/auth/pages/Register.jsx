import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { registerUserService } from '../../auth/services/userService';
import { Activity } from 'lucide-react';

const Register = () => {
    const [userData, setUserData] = useState({ email: '', password: '', firstName: '', lastName: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const set = (key) => (e) => setUserData(prev => ({ ...prev, [key]: e.target.value }));

    const handleRegister = async () => {
        if (!userData.lastName || !userData.firstName || !userData.email || !userData.password) {
            toast.error('Please fill in all required fields.');
            return;
        }
        try {
            const res = await registerUserService(userData);
            if (res?.data?.errCode === 0) {
                toast.success('Registration successful! Redirecting to login in 3 seconds...');
                setIsSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                toast.error(res?.data?.message || 'Registration failed.');
            }
        } catch {
            toast.error('Server error, please try again.');
        }
    };

    const inputClass = "w-full bg-gray-100 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-200 disabled:opacity-50";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign up to use HealthConnect</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Last name</label>
                                <input type="text" placeholder="Smith" value={userData.lastName}
                                    onChange={set('lastName')} disabled={isSuccess} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">First name</label>
                                <input type="text" placeholder="John" value={userData.firstName}
                                    onChange={set('firstName')} disabled={isSuccess} className={inputClass} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input type="email" placeholder="you@example.com" value={userData.email}
                                onChange={set('email')} disabled={isSuccess} className={inputClass} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input type="password" placeholder="••••••••" value={userData.password}
                                onChange={set('password')} disabled={isSuccess} className={inputClass} />
                        </div>

                        <button onClick={handleRegister} disabled={isSuccess}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-1">
                            {isSuccess ? 'Redirecting...' : 'Sign Up'}
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
