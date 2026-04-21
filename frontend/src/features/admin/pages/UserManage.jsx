import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';
import { getAllUsers, createNewUser, deleteUser, editUser } from '../../auth/services/userService';
import ModalUser from '../components/ModalUser';

const ROLE_BADGE = {
    R1: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    R2: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    R3: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};
const ROLE_LABEL = { R1: 'Admin', R2: 'Doctor', R3: 'Patient' };

const UserManage = () => {
    const [arrUsers, setArrUsers] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const fetchAllUsers = async () => {
        try {
            const response = await getAllUsers('All');
            if (response?.data?.errCode === 0) setArrUsers(response.data.users || []);
        } catch { toast.error('Failed to load users.'); }
    };

    useEffect(() => { fetchAllUsers(); }, []);

    const handleAddNewUser = () => { setIsEditMode(false); setUserToEdit(null); setIsOpenModal(true); };
    const handleEditUser = (user) => { setIsEditMode(true); setUserToEdit(user); setIsOpenModal(true); };

    const handleSaveUser = async (data) => {
        try {
            const response = isEditMode
                ? await editUser({ ...data, id: userToEdit.id })
                : await createNewUser(data);
            if (response?.data?.errCode !== 0) {
                toast.error(response?.data?.errMessage || 'Operation failed.');
            } else {
                await fetchAllUsers();
                setIsOpenModal(false);
                toast.success(isEditMode ? 'User updated successfully.' : 'User created successfully.');
            }
        } catch { toast.error('Operation failed.'); }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const response = await deleteUser(userId);
            if (response?.data?.errCode === 0) {
                await fetchAllUsers();
                toast.success('User deleted successfully.');
            } else {
                toast.error(response?.data?.errMessage || 'Deletion failed.');
            }
        } catch { toast.error('Deletion failed.'); }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ModalUser isOpen={isOpenModal} toggleFromParent={() => setIsOpenModal(false)}
                saveUser={handleSaveUser} isEditMode={isEditMode} currentUser={userToEdit} />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{arrUsers.length} users in the system</p>
                </div>
                <button onClick={handleAddNewUser}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium active:scale-[0.98] transition-all duration-200 shadow-sm">
                    <UserPlus className="w-4 h-4" /> Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Avatar</th>
                            <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Email</th>
                            <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Full Name</th>
                            <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Role</th>
                            <th className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {arrUsers.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center text-blue-700 text-sm font-semibold flex-shrink-0">
                                        {item.image
                                            ? <img src={item.image} className="w-full h-full object-cover" alt="" />
                                            : (item.firstName?.[0] || item.lastName?.[0] || 'U')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.lastName} {item.firstName}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_BADGE[item.roleId] || ''}`}>
                                        {ROLE_LABEL[item.roleId] || item.roleId}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleEditUser(item)}
                                            className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteUser(item.id)}
                                            className="text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {arrUsers.length === 0 && (
                    <div className="text-center py-16 text-sm text-gray-400">No users found</div>
                )}
            </div>
        </div>
    );
};

export default UserManage;
