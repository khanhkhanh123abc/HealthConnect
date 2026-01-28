import React, { useState, useEffect } from 'react';

const initialState = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        gender: '1',
        roleId: 'PATIENT',
        positionId: 'P0'
    };
const ModalUser = (props) => {

    const [userData, setUserData] = useState(initialState);

    // Tự động điền dữ liệu khi vào chế độ Edit
    // src/containers/System/ModalUser.jsx
    useEffect(() => {
        const fillUserData = () => {
            // Chỉ cập nhật khi Modal mở và đang ở chế độ Edit
            if (props.isOpen && props.isEditMode && props.currentUser) {
                setUserData({
                    ...props.currentUser,
                    password: 'hardcode_password' // Giữ nguyên logic bảo mật của bạn
                });
            }

            // Reset form khi Modal đóng hoặc chuyển sang chế độ Add New
            if (!props.isOpen) {
                setUserData(initialState);
            }
        };

        fillUserData();
    }, [props.isOpen, props.isEditMode, props.currentUser]); // Chỉ chạy khi 1 trong 3 giá trị này thay đổi [props.isOpen, props.currentUser, props.isEditMode]);

    const handleOnChangeInput = (e, field) => {
        setUserData({
            ...userData,
            [field]: e.target.value
        });
    }

    const handleSaveUser = () => {
        // Validation cơ bản
        if (!userData.email || (!props.isEditMode && !userData.password)) {
            alert("Missing required fields!");
            return;
        }

        // Gọi hàm saveUser chung của cha (xử lý cả Create/Edit)
        props.saveUser(userData);
    };

    return (
        <div className={`fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 transition-opacity duration-300 ${props.isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            } backdrop-blur-sm`}>
            <div className="relative m-4 p-6 w-full max-w-[800px] rounded-xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex shrink-0 items-center pb-4 text-2xl font-bold text-slate-800 border-b border-slate-100">
                    {props.isEditMode ? "Edit User" : "Create New User"}
                </div>

                <div className="relative py-6 grid grid-cols-2 gap-x-6 gap-y-4 text-slate-600">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1 text-slate-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:bg-gray-200"
                            value={userData.email}
                            disabled={props.isEditMode} // Không cho sửa email khi edit
                            onChange={(e) => handleOnChangeInput(e, 'email')}
                        />
                    </div>
                    {!props.isEditMode && ( // Chỉ hiện ô Password khi thêm mới
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1 text-slate-700">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                value={userData.password}
                                onChange={(e) => handleOnChangeInput(e, 'password')}
                            />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1 text-slate-700">First Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                            value={userData.firstName}
                            onChange={(e) => handleOnChangeInput(e, 'firstName')}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1 text-slate-700">Last Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                            value={userData.lastName}
                            onChange={(e) => handleOnChangeInput(e, 'lastName')}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1 text-slate-700">Address</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                            value={userData.address}
                            onChange={(e) => handleOnChangeInput(e, 'address')}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1 text-slate-700">Phone Number</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                            value={userData.phoneNumber}
                            onChange={(e) => handleOnChangeInput(e, 'phoneNumber')}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1 text-slate-700">Gender</label>
                        <select
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                            value={userData.gender}
                            onChange={(e) => handleOnChangeInput(e, 'gender')}
                        >
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                        </select>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end border-t border-slate-100">
                    <button onClick={props.toggleFromParent} className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-md">
                        Cancel
                    </button>
                    <button onClick={handleSaveUser} className="ml-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md">
                        {props.isEditMode ? "Update Changes" : "Confirm Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalUser;