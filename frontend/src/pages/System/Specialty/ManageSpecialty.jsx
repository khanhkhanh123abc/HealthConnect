import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Import CSS chuẩn của Editor
import { supabase } from '../../../supabaseClient'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';
import { createNewSpecialtyService } from '../../../services/specialtyService';

// Khởi tạo bộ parser Markdown sang HTML
const mdParser = new MarkdownIt();

const ManageSpecialty = () => {
    // Quản lý state cho form
    const [name, setName] = useState('');
    const [imageBase64, setImageBase64] = useState(''); // Lưu URL ảnh từ Supabase
    const [previewImgURL, setPreviewImgURL] = useState('');
    const [descriptionHTML, setDescriptionHTML] = useState('');
    const [descriptionMarkdown, setDescriptionMarkdown] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Bắt sự kiện gõ text trong Editor
    const handleEditorChange = ({ html, text }) => {
        setDescriptionHTML(html); // Code HTML để lưu vào DB và render lên web
        setDescriptionMarkdown(text); // Code Markdown để hiển thị lại trong khung soạn thảo
    };

    // Hàm Upload ảnh lên Supabase (Tái sử dụng logic hoàn hảo từ ModalUser)
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `specialties/${fileName}`; // Lưu vào folder specialties

        // 1. Upload lên bucket 'healthconnect'
        const { error: uploadError } = await supabase.storage
            .from('healthconnect')
            .upload(filePath, file);

        if (uploadError) {
            toast.error("Lỗi upload ảnh lên Supabase!");
            setIsUploading(false);
            return;
        }

        // 2. Lấy URL public
        const { data } = supabase.storage
            .from('healthconnect')
            .getPublicUrl(filePath);

        setImageBase64(data.publicUrl);
        setPreviewImgURL(data.publicUrl);
        setIsUploading(false);
    };

    // Hàm lưu Chuyên khoa
    const handleSaveNewSpecialty = async () => {
        if (!name || !imageBase64 || !descriptionHTML || !descriptionMarkdown) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const dataToSend = {
            name: name,
            image: imageBase64,
            descriptionHTML: descriptionHTML,
            descriptionMarkdown: descriptionMarkdown
        };

        let response = await createNewSpecialtyService(dataToSend);

        // Cập nhật lại đoạn IF này: check thêm response.data
        if (response && (response.errCode === 0 || (response.data && response.data.errCode === 0))) {
            toast.success("Thêm mới chuyên khoa thành công!");
            // Reset form
            setName('');
            setImageBase64('');
            setPreviewImgURL('');
            setDescriptionHTML('');
            setDescriptionMarkdown('');
        } else {
            toast.error("Lỗi khi thêm chuyên khoa!");
            console.log("Check lỗi:", response);
        }
        };

        return (
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">Quản lý chuyên khoa</h2>

                {/* Khu vực Form nhập liệu */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Tên chuyên khoa</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ví dụ: Cơ xương khớp"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Ảnh đại diện</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {isUploading && <span className="text-sm text-blue-500 animate-pulse">Uploading...</span>}
                        </div>
                        {/* Hiển thị ảnh xem trước */}
                        {previewImgURL && (
                            <div
                                className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg mt-2 bg-cover bg-center"
                                style={{ backgroundImage: `url(${previewImgURL})` }}
                            ></div>
                        )}
                    </div>
                </div>

                {/* Khu vực Markdown Editor */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Bài viết giới thiệu</label>
                    <MdEditor
                        style={{ height: '400px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={handleEditorChange}
                        value={descriptionMarkdown}
                    />
                </div>

                {/* Nút lưu */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSaveNewSpecialty}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md"
                    >
                        Lưu chuyên khoa
                    </button>
                </div>
            </div>
        );
    };

    export default ManageSpecialty;