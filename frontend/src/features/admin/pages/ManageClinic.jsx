import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { supabase } from '../../../shared/utils/supabaseClient';
import { toast } from 'react-toastify';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import {
    createNewClinicService, getAllClinics,
    updateClinicService, deleteClinicService
} from '../services/clinicService';

const mdParser = new MarkdownIt();
const EMPTY_FORM = { name: '', address: '', image: '', descriptionHTML: '', descriptionMarkdown: '' };
const LABEL = 'block text-xs font-medium text-gray-500 mb-1.5';
const INPUT = 'w-full bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all';

const ManageClinic = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [previewImgURL, setPreviewImgURL] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [clinicList, setClinicList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoadingList, setIsLoadingList] = useState(false);

    const fetchClinics = async () => {
        setIsLoadingList(true);
        try {
            let res = await getAllClinics();
            let data = res?.data?.data || res?.data || [];
            if (data && data.errCode === 0) data = data.data;
            setClinicList(Array.isArray(data) ? data : []);
        } catch { /* silent */ } finally {
            setIsLoadingList(false);
        }
    };

    useEffect(() => { fetchClinics(); }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `clinics/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('healthconnect').upload(filePath, file);
        if (error) { toast.error('Image upload failed.'); setIsUploading(false); return; }
        const { data } = supabase.storage.from('healthconnect').getPublicUrl(filePath);
        setForm(prev => ({ ...prev, image: data.publicUrl }));
        setPreviewImgURL(data.publicUrl);
        setIsUploading(false);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.address || !form.image || !form.descriptionHTML) {
            toast.error('Please fill in all required fields.');
            return;
        }
        const res = editingId
            ? await updateClinicService({ ...form, id: editingId })
            : await createNewClinicService(form);
        const ok = res?.errCode === 0 || res?.data?.errCode === 0;
        if (ok) {
            toast.success(editingId ? 'Clinic updated successfully.' : 'Clinic added successfully.');
            resetForm(); fetchClinics();
        } else {
            toast.error('An error occurred.');
        }
    };

    const handleEdit = (clinic) => {
        setEditingId(clinic.id);
        setForm({
            name: clinic.name || '', address: clinic.address || '',
            image: clinic.image || '', descriptionHTML: clinic.descriptionHTML || '',
            descriptionMarkdown: clinic.descriptionMarkdown || ''
        });
        setPreviewImgURL(clinic.image || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info(`Editing: ${clinic.name}`);
    };

    const handleDelete = async (clinic) => {
        if (!window.confirm(`Are you sure you want to delete "${clinic.name}"?`)) return;
        const res = await deleteClinicService(clinic.id);
        const ok = res?.errCode === 0 || res?.data?.errCode === 0;
        if (ok) { toast.success('Clinic deleted.'); fetchClinics(); }
        else toast.error('Deletion failed.');
    };

    const resetForm = () => { setForm(EMPTY_FORM); setPreviewImgURL(''); setEditingId(null); };

    const filteredList = clinicList.filter(c =>
        c.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        c.address?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Clinic Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {editingId
                            ? <span className="text-amber-600 font-medium">Editing clinic</span>
                            : `${clinicList.length} clinics in the system`}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-6 space-y-5">
                <h2 className="text-sm font-semibold text-gray-900">
                    {editingId ? 'Edit Information' : 'Add New Clinic'}
                </h2>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className={LABEL}>Clinic / Hospital Name</label>
                        <input type="text" value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className={INPUT} placeholder="City General Hospital" />
                    </div>
                    <div>
                        <label className={LABEL}>Address</label>
                        <input type="text" value={form.address}
                            onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                            className={INPUT} placeholder="123 Main St, District 5" />
                    </div>
                </div>

                <div>
                    <label className={LABEL}>Cover Image</label>
                    <div className="flex items-center gap-4">
                        <input type="file" accept="image/*" onChange={handleImageChange}
                            className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
                        {isUploading && <span className="text-xs text-blue-500 animate-pulse">Uploading...</span>}
                        {previewImgURL && (
                            <img src={previewImgURL} alt="preview"
                                className="w-20 h-14 object-cover rounded-xl border border-gray-200" />
                        )}
                    </div>
                </div>

                <div>
                    <label className={LABEL + ' mb-2'}>Clinic Introduction Article</label>
                    <MdEditor style={{ height: '350px', borderRadius: '12px', overflow: 'hidden' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={({ html, text }) => setForm(p => ({ ...p, descriptionHTML: html, descriptionMarkdown: text }))}
                        value={form.descriptionMarkdown} />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    {editingId && (
                        <button onClick={resetForm}
                            className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            Cancel Edit
                        </button>
                    )}
                    <button onClick={handleSubmit}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl active:scale-[0.98] transition-all duration-200 shadow-sm ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {!editingId && <Plus className="w-4 h-4" />}
                        {editingId ? 'Update Clinic' : 'Add Clinic'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Clinic List
                        <span className="ml-2 text-gray-400 font-normal">({filteredList.length})</span>
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-64">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <input type="text" placeholder="Search by name or address..."
                            value={searchText} onChange={e => setSearchText(e.target.value)}
                            className="text-sm bg-transparent border-0 outline-none text-gray-700 placeholder-gray-400 w-full" />
                    </div>
                </div>

                {isLoadingList ? (
                    <div className="text-center py-12 text-sm text-gray-400 animate-pulse">Loading...</div>
                ) : filteredList.length === 0 ? (
                    <div className="text-center py-12 text-sm text-gray-400">No clinics found</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 w-14">#</th>
                                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 w-20">Image</th>
                                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Name</th>
                                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Address</th>
                                <th className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredList.map((clinic, idx) => (
                                <tr key={clinic.id}
                                    className={`hover:bg-gray-50 transition-colors ${editingId === clinic.id ? 'bg-amber-50' : ''}`}>
                                    <td className="px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <img src={clinic.image || ''} alt={clinic.name}
                                            className="w-12 h-10 object-cover rounded-xl border border-gray-200" />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{clinic.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{clinic.address}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleEdit(clinic)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                                <Pencil className="w-3 h-3" /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(clinic)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageClinic;
