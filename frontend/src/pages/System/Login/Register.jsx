import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { registerUserService } from '../../../services/userService';

const Register = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        // VALIDATION
        if (!userData.lastName || !userData.firstName || !userData.email || !userData.password) {
            toast.error("Vui lòng điền đầy đủ tất cả thông tin!");
            return;
        }

        try {
            const res = await registerUserService(userData);

            // 🔥 FIX QUAN TRỌNG: res.data
            if (res && res.data && res.data.errCode === 0) {
                toast.success("Đăng ký thành công! Chuyển sang đăng nhập sau 5s...");

                setIsSuccess(true);

                setTimeout(() => {
                    navigate('/login');
                }, 5000);

            } else {
                toast.error(res?.data?.message || "Đăng ký thất bại!");
            }

        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            toast.error("Lỗi server, vui lòng thử lại!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="bg-white p-10 rounded-lg w-full max-w-md border shadow-lg">

                <h2 className="text-2xl font-bold mb-6">Tạo tài khoản</h2>

                <div className="space-y-4">

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Họ"
                            value={userData.lastName}
                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                            disabled={isSuccess}
                            className="w-full border p-2 rounded"
                        />

                        <input
                            type="text"
                            placeholder="Tên"
                            value={userData.firstName}
                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                            disabled={isSuccess}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        disabled={isSuccess}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        disabled={isSuccess}
                        className="w-full border p-2 rounded"
                    />

                    <button
                        onClick={handleRegister}
                        disabled={isSuccess}
                        className={`w-full py-2 rounded text-white font-semibold transition
                            ${isSuccess ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSuccess ? 'Đang chuyển hướng...' : 'Đăng ký'}
                    </button>

                    <div className="text-center text-sm">
                        Đã có tài khoản?{" "}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-blue-600 cursor-pointer"
                        >
                            Đăng nhập
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;