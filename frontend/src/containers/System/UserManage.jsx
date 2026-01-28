import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, createNewUser, deleteUser, editUser } from '../../services/userService';
import ModalUser from './ModalUser';

const UserManage = () => {
    const [arrUsers, setArrUsers] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    // State mới để phân biệt đang Add hay Edit
    const [isEditMode, setIsEditMode] = useState(false);
    const [userToEdit, setUserToEdit] = useState({});

    const fetchAllUsers = async () => {
        try {
            let response = await getAllUsers('All');
            if (response && response.data.errCode === 0) {
                setArrUsers(response.data.users);
            }
        } catch (e) {
            console.error("Lỗi lấy danh sách user:", e);
        }
    };

    useEffect(() => {
        const initData = async () => await fetchAllUsers();
        initData();
    }, []);

    const handleAddNewUser = () => {
        setIsEditMode(false); // Chế độ thêm mới
        setIsOpenModal(true);
    };

    const handleEditUser = (user) => {
        setIsEditMode(true); // Chế độ chỉnh sửa
        setUserToEdit(user); // Truyền thông tin user cần sửa vào modal
        setIsOpenModal(true);
    };

    const toggleUserModal = () => {
        setIsOpenModal(!isOpenModal);
    };

    // Hàm xử lý chung cho cả Create và Update
    const handleSaveUser = async (data) => {
        try {
            let response;
            if (isEditMode) {
                // Gọi API Edit nếu đang ở mode sửa
                response = await editUser({ ...data, id: userToEdit.id });
            } else {
                // Gọi API Create nếu đang ở mode thêm
                response = await createNewUser(data);
            }

            if (response && response.data.errCode !== 0) {
                alert(response.data.errMessage);
            } else {
                await fetchAllUsers();
                setIsOpenModal(false);
                toast.success(isEditMode ? "Update user succeed!" : "Create user succeed!");
            }
        } catch (e) {
            console.log(e);
            toast.error("Process failed!");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                let response = await deleteUser(userId);
                if (response && response.data.errCode === 0) {
                    await fetchAllUsers();
                    toast.success("User deleted successfully!");
                } else {
                    toast.error(response.data.errMessage || "User not found"); // Xử lý lỗi thông báo bạn gặp
                }
            } catch (e) {
                console.log(e);
                toast.error("Delete user failed!");
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <ModalUser
                isOpen={isOpenModal}
                toggleFromParent={toggleUserModal}
                saveUser={handleSaveUser}
                isEditMode={isEditMode}
                currentUser={userToEdit} // Truyền dữ liệu user đang chọn qua props
            />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    onClick={handleAddNewUser}
                >
                    + Add New User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal font-bold">
                            <th className="py-3 px-6 border-b">Email</th>
                            <th className="py-3 px-6 border-b">Full Name</th>
                            <th className="py-3 px-6 border-b">Address</th>
                            <th className="py-3 px-6 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {arrUsers && arrUsers.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors border-b">
                                <td className="py-3 px-6">{item.email}</td>
                                <td className="py-3 px-6">{item.firstName} {item.lastName}</td>
                                <td className="py-3 px-6">{item.address}</td>
                                <td className="py-3 px-6 text-center space-x-4">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 font-bold"
                                        onClick={() => handleEditUser(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 font-bold"
                                        onClick={() => handleDeleteUser(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManage;