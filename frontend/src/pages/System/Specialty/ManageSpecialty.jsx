import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { supabase } from '../../../supabaseClient';
import { toast } from 'react-toastify';
import {
    createNewSpecialtyService,
    getAllSpecialty,
    updateSpecialtyService,
    deleteSpecialtyService
} from '../../../services/specialtyService';

const mdParser = new MarkdownIt();

const EMPTY_FORM = { name: '', image: '', descriptionHTML: '', descriptionMarkdown: '' };

const ManageSpecialty = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [previewImgURL, setPreviewImgURL] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [specialtyList, setSpecialtyList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoadingList, setIsLoadingList] = useState(false);

    const fetchSpecialties = async () => {
        setIsLoadingList(true);
        try {
            let res = await getAllSpecialty();
            let data = res?.data?.data || res?.data || [];
            if (data && data.errCode === 0) data = data.data;
            setSpecialtyList(Array.isArray(data) ? data : []);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingList(false);
        }
    };

    useEffect(() => { fetchSpecialties(); }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `specialties/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('healthconnect').upload(filePath, file);
        if (error) { toast.error("Lỗi upload ảnh!"); setIsUploading(false); return; }
        const { data } = supabase.storage.from('healthconnect').getPublicUrl(filePath);
        setForm(prev => ({ ...prev, image: data.publicUrl }));
        setPreviewImgURL(data.publicUrl);
        setIsUploading(false);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.image || !form.descriptionHTML) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        let res;
        if (editingId) {
            res = await updateSpecialtyService({ ...form, id: editingId });
        } else {
            res = await createNewSpecialtyService(form);
        }
        const ok = res?.errCode === 0 || res?.data?.errCode === 0;
        if (ok) {
            toast.success(editingId ? "Cập nhật chuyên khoa thành công!" : "Thêm chuyên khoa thành công!");
            resetForm();
            fetchSpecialties();
        } else {
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleEdit = (spec) => {
        setEditingId(spec.id);
        setForm({
            name: spec.name || '',
            image: spec.image || '',
            descriptionHTML: spec.descriptionHTML || '',
            descriptionMarkdown: spec.descriptionMarkdown || ''
        });
        setPreviewImgURL(spec.image || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info(`Đang chỉnh sửa: ${spec.name}`);
    };

    const handleDelete = async (spec) => {
        if (!window.confirm(`Bạn chắc muốn xóa "${spec.name}"?`)) return;
        let res = await deleteSpecialtyService(spec.id);
        const ok = res?.errCode === 0 || res?.data?.errCode === 0;
        if (ok) {
            toast.success("Đã xóa chuyên khoa!");
            fetchSpecialties();
        } else {
            toast.error("Xóa thất bại!");
        }
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setPreviewImgURL('');
        setEditingId(null);
    };

    const filteredList = specialtyList.filter(s =>
        s.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-screen">

            {/* ===== FORM ===== */}
            <div className={`mb-2 px-4 py-2 rounded-lg text-sm font-semibold inline-block ${editingId ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-50 text-indigo-700'}`}>
                {editingId ? '✏️ Đang chỉnh sửa chuyên khoa' : '➕ Thêm chuyên khoa mới'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">Quản lý chuyên khoa</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Tên chuyên khoa</label>
                    <input type="text" value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ví dụ: Cơ xương khớp" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Ảnh đại diện</label>
                    <div className="flex items-center gap-4">
                        <input type="file" onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        {isUploading && <span className="text-sm text-blue-500 animate-pulse">Uploading...</span>}
                    </div>
                    {previewImgURL && (
                        <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg mt-2 bg-cover bg-center"
                            style={{ backgroundImage: `url(${previewImgURL})` }} />
                    )}
                </div>
            </div>

            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Bài viết giới thiệu</label>
                <MdEditor style={{ height: '350px' }} renderHTML={text => mdParser.render(text)}
                    onChange={({ html, text }) => setForm(p => ({ ...p, descriptionHTML: html, descriptionMarkdown: text }))}
                    value={form.descriptionMarkdown} />
            </div>

            <div className="flex justify-end gap-3 mb-10">
                {editingId && (
                    <button onClick={resetForm}
                        className="border border-gray-300 text-gray-600 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-50">
                        Hủy chỉnh sửa
                    </button>
                )}
                <button onClick={handleSubmit}
                    className={`text-white font-bold py-2.5 px-6 rounded-lg transition shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {editingId ? '💾 Cập nhật chuyên khoa' : 'Lưu chuyên khoa'}
                </button>
            </div>

            {/* ===== DANH SÁCH ===== */}
            <div className="border-t pt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-700">
                        📋 Danh sách chuyên khoa
                        <span className="ml-2 text-sm font-normal text-gray-400">({filteredList.length} kết quả)</span>
                    </h3>
                    <input
                        type="text"
                        placeholder="🔍 Tìm theo tên..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {isLoadingList ? (
                    <div className="text-center py-10 text-gray-400 animate-pulse">Đang tải...</div>
                ) : filteredList.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">Chưa có chuyên khoa nào</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredList.map((spec, idx) => (
                            <div key={spec.id}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition hover:shadow-md ${editingId === spec.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
                                <img src={spec.image || 'https://via.placeholder.com/56'}
                                    alt={spec.name}
                                    className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">{spec.name}</p>
                                    <p className="text-xs text-gray-400">#{idx + 1}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => handleEdit(spec)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded transition">
                                        ✏️ Sửa
                                    </button>
                                    <button onClick={() => handleDelete(spec)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded transition">
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSpecialty;