import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, createNewUser, deleteUser, editUser } from '../../../services/userService';
import ModalUser from './ModalUser';

const UserManage = () => {

    const [arrUsers, setArrUsers] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const fetchAllUsers = async () => {
        try {
            const response = await getAllUsers('All');

            if (response && response.data && response.data.errCode === 0) {
                setArrUsers(response.data.users || []);
            }

        } catch (error) {
            console.error("Fetch user error:", error);
            toast.error("Cannot load users");
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            try {
                const response = await getAllUsers('All');
                if (isMounted && response?.data?.errCode === 0) {
                    setArrUsers(response.data.users || []);
                }
            } catch (error) {
                console.error("Fetch user error:", error);
                if (isMounted) toast.error("Cannot load users");
            }
        };

        loadUsers();

        return () => { isMounted = false; };
    }, []);

    const handleAddNewUser = () => {
        setIsEditMode(false);
        setUserToEdit(null);
        setIsOpenModal(true);
    };

    const handleEditUser = (user) => {
        setIsEditMode(true);
        setUserToEdit(user);
        setIsOpenModal(true);
    };

    const toggleUserModal = () => {
        setIsOpenModal(!isOpenModal);
    };

    const handleSaveUser = async (data) => {

        try {

            let response;

            if (isEditMode) {
                response = await editUser({ ...data, id: userToEdit.id });
            } else {
                response = await createNewUser(data);
            }

            if (response && response.data.errCode !== 0) {
                toast.error(response.data.errMessage);
            } else {
                await fetchAllUsers();
                setIsOpenModal(false);

                toast.success(
                    isEditMode
                        ? "Update user succeed!"
                        : "Create user succeed!"
                );
            }

        } catch (error) {
            console.error(error);
            toast.error("Process failed!");
        }
    };

    const handleDeleteUser = async (userId) => {

        if (!window.confirm("Are you sure to delete this user?")) return;

        try {

            const response = await deleteUser(userId);

            if (response && response.data.errCode === 0) {
                await fetchAllUsers();
                toast.success("User deleted successfully!");
            } else {
                toast.error(response.data.errMessage || "Delete failed");
            }

        } catch (error) {
            console.error(error);
            toast.error("Delete user failed!");
        }
    };

    return (

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">

            <ModalUser
                isOpen={isOpenModal}
                toggleFromParent={toggleUserModal}
                saveUser={handleSaveUser}
                isEditMode={isEditMode}
                currentUser={userToEdit}
            />

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                    Manage Users
                </h2>

                <button
                    onClick={handleAddNewUser}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    + Add New User
                </button>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-sm font-bold">
                            <th className="py-3 px-6 border-b">Avatar</th>
                            <th className="py-3 px-6 border-b">Email</th>
                            <th className="py-3 px-6 border-b">Full Name</th>
                            <th className="py-3 px-6 border-b">Role</th>
                            <th className="py-3 px-6 border-b text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {arrUsers.map((item) => {

                            const avatar =
                                item.image ||
                                "https://via.placeholder.com/100";

                            return (

                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 border-b"
                                >

                                    <td className="py-3 px-6">

                                        <img
                                            src={avatar}
                                            className="w-10 h-10 rounded-full object-cover border"
                                            alt="avatar"
                                        />

                                    </td>

                                    <td className="py-3 px-6">
                                        {item.email}
                                    </td>

                                    <td className="py-3 px-6">
                                        {item.firstName} {item.lastName}
                                    </td>

                                    <td className="py-3 px-6 font-semibold">
                                        {item.roleId === 'R1'
                                            ? 'Admin'
                                            : item.roleId === 'R2'
                                                ? 'Doctor'
                                                : 'Patient'}
                                    </td>

                                    <td className="py-3 px-6 text-center space-x-3">

                                        <button
                                            onClick={() => handleEditUser(item)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteUser(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            );
                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default UserManage;