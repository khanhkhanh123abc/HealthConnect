import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLoginApi } from '../services/userService';
import { loginSuccess } from '../store/slices/userSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await handleLoginApi(email, password);

            if (response?.data?.errCode === 0) {
                const user = response.data.user;

                // Lưu user vào Redux
                dispatch(loginSuccess(user));

                // Điều hướng theo role
                if (user.roleId === 'ADMIN') {
                    navigate('/system/UserManage');
                } else if (user.roleId === 'DOCTOR') {
                    navigate('/doctor/schedule');
                } else {
                    navigate('/home');
                }
            } else {
                setErrorMessage(
                    response?.data?.errMessage || 'Invalid email or password'
                );
            }
        } catch {
            setErrorMessage('Server connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-center">
                    <svg
                        className="h-12 w-auto"
                        viewBox="0 0 30 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="m8 4.55 6.75 3.884 6.75-3.885M8 27.83v-7.755L1.25 16.19m27 0-6.75 3.885v7.754M1.655 8.658l13.095 7.546 13.095-7.546M14.75 31.25V16.189m13.5 5.976V10.212a2.98 2.98 0 0 0-1.5-2.585L16.25 1.65a3.01 3.01 0 0 0-3 0L2.75 7.627a3 3 0 0 0-1.5 2.585v11.953a2.98 2.98 0 0 0 1.5 2.585l10.5 5.977a3.01 3.01 0 0 0 3 0l10.5-5.977a3 3 0 0 0 1.5-2.585"
                            stroke="#4f46e5"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h2 className="mt-10 text-center text-2xl font-bold text-gray-900 uppercase">
                    Health Connect
                </h2>
                <p className="mt-2 text-center text-lg text-gray-600">
                    Sign in to your account
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Email address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 block w-full rounded-md px-3 py-1.5 outline outline-1 outline-gray-300 focus:outline-indigo-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full rounded-md px-3 py-1.5 outline outline-1 outline-gray-300 focus:outline-indigo-600"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-600 italic">
                            * {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-md bg-indigo-600 py-2 text-white font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
