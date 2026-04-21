import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { supabase } from '../../../shared/utils/supabaseClient';

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

const FIELD_INPUT = 'bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed';
const LABEL = 'block text-xs font-medium text-gray-500 mb-1.5';

const ModalUser = ({ isOpen, isEditMode, currentUser, toggleFromParent, saveUser }) => {
    const [userData, setUserData] = useState(initialState);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

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

    const handleChange = (e, field) => setUserData(prev => ({ ...prev, [field]: e.target.value }));

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('healthconnect').upload(filePath, file);
        if (error) { console.error('Upload error:', error); setIsUploading(false); return; }
        const { data } = supabase.storage.from('healthconnect').getPublicUrl(filePath);
        setUserData(prev => ({ ...prev, image: data.publicUrl }));
        setPreviewUrl(data.publicUrl);
        setIsUploading(false);
    };

    const handleSave = () => {
        if (!userData.email || (!isEditMode && !userData.password)) {
            alert('Please fill in all required fields.');
            return;
        }
        const data = { ...userData };
        if (isEditMode) delete data.password;
        saveUser(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl border border-gray-200/60 w-full max-w-lg overflow-hidden shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">
                            {isEditMode ? 'Edit User' : 'Add New User'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEditMode ? 'Update account information' : 'Fill in details to create an account'}
                        </p>
                    </div>
                    <button onClick={toggleFromParent}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">

                    {/* Avatar preview */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center text-blue-600 flex-shrink-0">
                            {previewUrl
                                ? <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
                                : <User className="w-7 h-7" />}
                        </div>
                        <div className="flex-1">
                            <label className={LABEL}>Avatar</label>
                            <input type="file" accept="image/*" onChange={handleImageChange}
                                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
                            {isUploading && <p className="text-xs text-blue-500 mt-1">Uploading image...</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Last Name <span className="text-red-400">*</span></label>
                            <input className={FIELD_INPUT} placeholder="Smith" value={userData.lastName}
                                onChange={(e) => handleChange(e, 'lastName')} />
                        </div>
                        <div>
                            <label className={LABEL}>First Name <span className="text-red-400">*</span></label>
                            <input className={FIELD_INPUT} placeholder="John" value={userData.firstName}
                                onChange={(e) => handleChange(e, 'firstName')} />
                        </div>
                    </div>

                    <div>
                        <label className={LABEL}>Email <span className="text-red-400">*</span></label>
                        <input className={FIELD_INPUT} type="email" placeholder="email@example.com"
                            value={userData.email} onChange={(e) => handleChange(e, 'email')}
                            disabled={isEditMode} />
                    </div>

                    {!isEditMode && (
                        <div>
                            <label className={LABEL}>Password <span className="text-red-400">*</span></label>
                            <input className={FIELD_INPUT} type="password" placeholder="••••••••"
                                value={userData.password} onChange={(e) => handleChange(e, 'password')} />
                        </div>
                    )}

                    <div>
                        <label className={LABEL}>Role</label>
                        <select className={FIELD_INPUT} value={userData.roleId}
                            onChange={(e) => handleChange(e, 'roleId')}>
                            <option value="R1">Admin</option>
                            <option value="R2">Doctor</option>
                            <option value="R3">Patient</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button onClick={toggleFromParent}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isUploading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                        {isEditMode ? 'Save Changes' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalUser;
