import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { supabase } from '../../../shared/utils/supabaseClient';
import { toast } from 'react-toastify';
import {
    createNewClinicService,
    getAllClinics,
    updateClinicService,
    deleteClinicService
} from '../services/clinicService';

const mdParser = new MarkdownIt();

const EMPTY_FORM = {
    name: '', address: '', image: '', descriptionHTML: '', descriptionMarkdown: ''
};

const ManageClinic = () => {
    // --- FORM STATE ---
    const [form, setForm] = useState(EMPTY_FORM);
    const [previewImgURL, setPreviewImgURL] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = thêm mới, số = đang sửa

    // --- LIST STATE ---
    const [clinicList, setClinicList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoadingList, setIsLoadingList] = useState(false);

    // Fetch danh sách
    const fetchClinics = async () => {
        setIsLoadingList(true);
        try {
            let res = await getAllClinics();
            let data = res?.data?.data || res?.data || [];
            // Nếu data là object có errCode thì lấy .data
            if (data && data.errCode === 0) data = data.data;
            setClinicList(Array.isArray(data) ? data : []);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingList(false);
        }
    };

    useEffect(() => { fetchClinics(); }, []);

    // Upload ảnh
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `clinics/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('healthconnect').upload(filePath, file);
        if (error) { toast.error("Lỗi upload ảnh!"); setIsUploading(false); return; }
        const { data } = supabase.storage.from('healthconnect').getPublicUrl(filePath);
        setForm(prev => ({ ...prev, image: data.publicUrl }));
        setPreviewImgURL(data.publicUrl);
        setIsUploading(false);
    };

    // Submit form (thêm mới hoặc cập nhật)
    const handleSubmit = async () => {
        if (!form.name || !form.address || !form.image || !form.descriptionHTML) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        let res;
        if (editingId) {
            res = await updateClinicService({ ...form, id: editingId });
        } else {
            res = await createNewClinicService(form);
        }
        const ok = res?.errCode === 0 || res?.data?.errCode === 0;
        if (ok) {
            toast.success(editingId ? "Cập nhật phòng khám thành công!" : "Thêm phòng khám thành công!");
            resetForm();
            fetchClinics();
        } else {
            toast.error("Có lỗi xảy ra!");
        }
    };

    // Bấm Edit → đổ data vào form
    const handleEdit = (clinic) => {
        setEditingId(clinic.id);
        setForm({
            name: clinic.name || '',
            address: clinic.address || '',
            image: clinic.image || '',
            descriptionHTML: clinic.descriptionHTML || '',
            descriptionMarkdown: clinic.descriptionMarkdown || ''
        });
        setPreviewImgURL(clinic.image || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info(`Đang chỉnh sửa: ${clinic.name}`);
    };

    // Xóa
    const handleDelete = async (clinic) => {
        if (!window.confirm(`Bạn chắc muốn xóa "${clinic.name}"?`)) return;
        let res = await deleteClinicService(clinic.id);
        const ok = res?.errCode === 0 || res?.data?.errCode === 0;
        if (ok) {
            toast.success("Đã xóa phòng khám!");
            fetchClinics();
        } else {
            toast.error("Xóa thất bại!");
        }
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setPreviewImgURL('');
        setEditingId(null);
    };

    // Lọc theo search
    const filteredList = clinicList.filter(c =>
        c.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        c.address?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-screen">

            {/* ===== PHẦN FORM ===== */}
            <div className={`mb-2 px-4 py-2 rounded-lg text-sm font-semibold inline-block ${editingId ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-50 text-indigo-700'}`}>
                {editingId ? '✏️ Đang chỉnh sửa phòng khám' : '➕ Thêm phòng khám mới'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">Quản lý Phòng khám</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Tên phòng khám / Bệnh viện</label>
                        <input type="text" value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ví dụ: Bệnh viện Chợ Rẫy" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Địa chỉ phòng khám</label>
                        <input type="text" value={form.address}
                            onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ví dụ: 201B Nguyễn Chí Thanh, Phường 12, Quận 5" />
                    </div>
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
                <label className="text-sm font-semibold text-gray-700 block mb-2">Bài viết giới thiệu phòng khám</label>
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
                    {editingId ? '💾 Cập nhật phòng khám' : 'Lưu phòng khám'}
                </button>
            </div>

            {/* ===== PHẦN DANH SÁCH ===== */}
            <div className="border-t pt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-700">
                        📋 Danh sách phòng khám
                        <span className="ml-2 text-sm font-normal text-gray-400">({filteredList.length} kết quả)</span>
                    </h3>
                    <input
                        type="text"
                        placeholder="🔍 Tìm theo tên hoặc địa chỉ..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {isLoadingList ? (
                    <div className="text-center py-10 text-gray-400 animate-pulse">Đang tải...</div>
                ) : filteredList.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">Chưa có phòng khám nào</div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                                <tr>
                                    <th className="py-3 px-4 text-left w-16">STT</th>
                                    <th className="py-3 px-4 text-left w-20">Ảnh</th>
                                    <th className="py-3 px-4 text-left">Tên phòng khám</th>
                                    <th className="py-3 px-4 text-left">Địa chỉ</th>
                                    <th className="py-3 px-4 text-center w-36">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.map((clinic, idx) => (
                                    <tr key={clinic.id} className={`border-t hover:bg-gray-50 transition ${editingId === clinic.id ? 'bg-yellow-50' : ''}`}>
                                        <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                                        <td className="py-3 px-4">
                                            <img src={clinic.image || 'https://via.placeholder.com/48'}
                                                alt={clinic.name}
                                                className="w-12 h-10 object-cover rounded-lg border border-gray-200" />
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-800">{clinic.name}</td>
                                        <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{clinic.address}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button onClick={() => handleEdit(clinic)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded mr-2 transition">
                                                ✏️ Sửa
                                            </button>
                                            <button onClick={() => handleDelete(clinic)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded transition">
                                                🗑️ Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageClinic;