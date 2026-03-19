import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { supabase } from '../../../supabaseClient';
import { toast } from 'react-toastify';
import { createNewClinicService } from '../../../services/clinicService';

const mdParser = new MarkdownIt();

const ManageClinic = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState(''); // State mới cho Địa chỉ
    const [imageBase64, setImageBase64] = useState('');
    const [previewImgURL, setPreviewImgURL] = useState('');
    const [descriptionHTML, setDescriptionHTML] = useState('');
    const [descriptionMarkdown, setDescriptionMarkdown] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleEditorChange = ({ html, text }) => {
        setDescriptionHTML(html);
        setDescriptionMarkdown(text);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `clinics/${fileName}`; // Lưu vào folder clinics trên Supabase

        const { error: uploadError } = await supabase.storage
            .from('healthconnect')
            .upload(filePath, file);

        if (uploadError) {
            toast.error("Lỗi upload ảnh lên Supabase!");
            setIsUploading(false);
            return;
        }

        const { data } = supabase.storage
            .from('healthconnect')
            .getPublicUrl(filePath);

        setImageBase64(data.publicUrl);
        setPreviewImgURL(data.publicUrl);
        setIsUploading(false);
    };

    const handleSaveNewClinic = async () => {
        if (!name || !address || !imageBase64 || !descriptionHTML || !descriptionMarkdown) {
            toast.error("Vui lòng điền đầy đủ thông tin phòng khám!");
            return;
        }

        const dataToSend = {
            name: name,
            address: address, // Gửi thêm địa chỉ xuống Backend
            image: imageBase64,
            descriptionHTML: descriptionHTML,
            descriptionMarkdown: descriptionMarkdown
        };

        let response = await createNewClinicService(dataToSend);
        
        if (response && (response.errCode === 0 || (response.data && response.data.errCode === 0))) {
            toast.success("Thêm mới phòng khám thành công!");
            setName('');
            setAddress('');
            setImageBase64('');
            setPreviewImgURL('');
            setDescriptionHTML('');
            setDescriptionMarkdown('');
        } else {
            toast.error("Lỗi khi thêm phòng khám!");
            console.log(response);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">Quản lý Phòng khám</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Cột trái: Tên và Địa chỉ */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Tên phòng khám / Bệnh viện</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ví dụ: Bệnh viện Chợ Rẫy"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Địa chỉ phòng khám</label>
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ví dụ: 201B Nguyễn Chí Thanh, Phường 12, Quận 5"
                        />
                    </div>
                </div>

                {/* Cột phải: Ảnh đại diện */}
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
                    {previewImgURL && (
                        <div 
                            className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg mt-2 bg-cover bg-center"
                            style={{ backgroundImage: `url(${previewImgURL})` }}
                        ></div>
                    )}
                </div>
            </div>

            {/* Markdown Editor */}
            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Bài viết giới thiệu phòng khám</label>
                <MdEditor 
                    style={{ height: '400px' }} 
                    renderHTML={text => mdParser.render(text)} 
                    onChange={handleEditorChange} 
                    value={descriptionMarkdown}
                />
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={handleSaveNewClinic}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md"
                >
                    Lưu phòng khám
                </button>
            </div>
        </div>
    );
};

export default ManageClinic;