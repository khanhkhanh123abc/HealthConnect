import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService';

const UserManage = () => {
    const [arrUsers, setArrUsers] = useState([]);
    const fetchAllUsers = async () => {
        try {
            // Truyền tham số 'All' để lấy toàn bộ danh sách
            let response = await getAllUsers('All');
            if (response && response.data.errCode === 0) {
                setArrUsers(response.data.users);
            }
        } catch (e) {
            console.error("Lỗi lấy danh sách user:", e);
        }
    };
    useEffect(() => {
        const loadData = async () => {
            await fetchAllUsers();
        };
        loadData();
    }, []);

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    + Add New User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 border-b">Email</th>
                            <th className="py-3 px-6 border-b">First Name</th>
                            <th className="py-3 px-6 border-b">Last Name</th>
                            <th className="py-3 px-6 border-b">Address</th>
                            <th className="py-3 px-6 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {arrUsers && arrUsers.length > 0 ? (
                            arrUsers.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors border-b">
                                    <td className="py-3 px-6">{item.email}</td>
                                    <td className="py-3 px-6">{item.firstName}</td>
                                    <td className="py-3 px-6">{item.lastName}</td>
                                    <td className="py-3 px-6">{item.address}</td>
                                    <td className="py-3 px-6 text-center space-x-4">
                                        <button className="text-blue-500 hover:text-blue-700 font-semibold transition-colors">
                                            Edit
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 font-semibold transition-colors">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-10 text-center text-gray-400 italic">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManage;