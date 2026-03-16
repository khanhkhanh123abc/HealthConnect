import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const initialState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    gender: '1',
    roleId: 'R1',
    image: ''
};

const ModalUser = ({
    isOpen,
    isEditMode,
    currentUser,
    toggleFromParent,
    saveUser
}) => {

    const [userData, setUserData] = useState(initialState);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    // Sync data khi mở modal
    useEffect(() => {
        if (!isOpen) return;

        if (isEditMode && currentUser) {
            setUserData({ ...initialState, ...currentUser });
            setPreviewUrl(currentUser.image || '');
        } else {
            setUserData(initialState);
            setPreviewUrl('');
        }
    }, [isOpen, isEditMode, currentUser]);

    const handleOnChangeInput = (e, field) => {
        const value = e.target.value;

        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Upload ảnh lên Supabase Storage và lấy URL public
    const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Đặt tên file ngẫu nhiên để không bị trùng
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`; // Lưu vào thư mục avatars

    // 1. Upload file lên Supabase Storage (Bucket tên là 'healthconnect')
    const { error: uploadError } = await supabase.storage
        .from('healthconnect') 
        .upload(filePath, file);

    if (uploadError) {
        console.error("Lỗi upload Supabase:", uploadError);
        setIsUploading(false);
        return;
    }

    // 2. Lấy đường link public để hiển thị và lưu vào DB
    const { data } = supabase.storage
        .from('healthconnect')
        .getPublicUrl(filePath);

    // Cập nhật URL ảnh vào state
    setUserData({ ...userData, image: data.publicUrl });
    setPreviewUrl(data.publicUrl);
    setIsUploading(false);
};

    const handleSave = () => {

        if (!userData.email || (!isEditMode && !userData.password)) {
            alert("Missing required fields");
            return;
        }

        const data = { ...userData };

        if (isEditMode) {
            delete data.password;
        }

        saveUser(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">

                <h3 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit User' : 'Add New User'}
                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        className="border p-2 rounded"
                        placeholder="Email"
                        value={userData.email}
                        onChange={(e) => handleOnChangeInput(e, 'email')}
                        disabled={isEditMode}
                    />

                    {!isEditMode && (
                        <input
                            className="border p-2 rounded"
                            type="password"
                            placeholder="Password"
                            value={userData.password}
                            onChange={(e) => handleOnChangeInput(e, 'password')}
                        />
                    )}

                    <input
                        className="border p-2 rounded"
                        placeholder="First Name"
                        value={userData.firstName}
                        onChange={(e) => handleOnChangeInput(e, 'firstName')}
                    />

                    <input
                        className="border p-2 rounded"
                        placeholder="Last Name"
                        value={userData.lastName}
                        onChange={(e) => handleOnChangeInput(e, 'lastName')}
                    />

                    {/* ROLE */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold">Role</label>

                        <select
                            className="border p-2 rounded"
                            value={userData.roleId}
                            onChange={(e) => handleOnChangeInput(e, 'roleId')}
                        >
                            <option value="R1">Admin</option>
                            <option value="R2">Doctor</option>
                            <option value="R3">Patient</option>
                        </select>
                    </div>

                    {/* AVATAR */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold">Avatar</label>

                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="text-sm"
                        />

                        {isUploading && (
                            <span className="text-blue-500 text-xs">
                                Uploading...
                            </span>
                        )}
                    </div>

                    {/* PREVIEW */}
                    <div className="col-span-2 flex justify-center">
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                className="w-20 h-20 rounded-full object-cover border"
                                alt="preview"
                            />
                        )}
                    </div>

                </div>

                <div className="mt-6 flex justify-end gap-3">

                    <button
                        onClick={toggleFromParent}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {isEditMode ? 'Save Changes' : 'Create User'}
                    </button>

                </div>

            </div>
        </div>
    );

};

export default ModalUser;