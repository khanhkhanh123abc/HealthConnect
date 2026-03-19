import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import { getAllDoctorsService, saveDetailDoctorService } from '../../../services/doctorService';
import { getAllCodeService } from '../../../services/userService';
import { getAllSpecialty } from '../../../services/specialtyService';
import { getAllClinics } from '../../../services/clinicService';

const mdParser = new MarkdownIt();

// --- HELPERS (Tách ra ngoài để tối ưu bộ nhớ) ---
const buildDataSelect = (inputData, type) => {
    let result = [];
    let response = inputData?.data ? inputData.data : inputData;

    if (response?.errCode === 0 && Array.isArray(response.data)) {
        result = response.data.map((item) => {
            if (type === 'DOCTOR') {
                return { label: `${item.lastName} ${item.firstName}`, value: item.id };
            }
            if (type === 'SPECIALTY_CLINIC') {
                return { label: item.name, value: item.id };
            }
            return { label: item.value, value: item.keyMap }; // For Price, Payment, Province
        });
    }
    return result;
};

const ManageDoctor = () => {
    // 1. States cho Editor
    const [descriptionHTML, setDescriptionHTML] = useState('');
    const [descriptionMarkdown, setDescriptionMarkdown] = useState('');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');

    // 2. States cho Selected Values
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);

    // 3. States cho Lists (Data từ API)
    const [lists, setLists] = useState({
        doctors: [],
        specialties: [],
        clinics: [],
        prices: [],
        payments: [],
        provinces: []
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Chạy song song tất cả các API để tối ưu tốc độ load
                const [resDoc, resSpec, resClinic, resPrice, resPay, resProv] = await Promise.all([
                    getAllDoctorsService(),
                    getAllSpecialty(),
                    getAllClinics(),
                    getAllCodeService('PRICE'),
                    getAllCodeService('PAYMENT'),
                    getAllCodeService('PROVINCE')
                ]);

                setLists({
                    doctors: buildDataSelect(resDoc, 'DOCTOR'),
                    specialties: buildDataSelect(resSpec, 'SPECIALTY_CLINIC'),
                    clinics: buildDataSelect(resClinic, 'SPECIALTY_CLINIC'),
                    prices: buildDataSelect(resPrice),
                    payments: buildDataSelect(resPay),
                    provinces: buildDataSelect(resProv)
                });
            } catch (error) {
                console.error("Lỗi khi fetch data: ", error);
                toast.error("Không thể tải danh sách dữ liệu!");
            }
        };

        fetchAllData();
    }, []);

    const handleEditorChange = ({ html, text }) => {
        setDescriptionHTML(html);
        setDescriptionMarkdown(text);
    };

    const handleSaveDoctorInfo = async () => {
        // Validation
        if (!selectedDoctor || !descriptionHTML || !selectedPrice || !selectedPayment || !selectedProvince) {
            toast.error("Vui lòng điền đầy đủ các trường thông tin bắt buộc!");
            return;
        }

        const dataToSend = {
            doctorId: selectedDoctor.value,
            contentHTML: descriptionHTML,
            contentMarkdown: descriptionMarkdown,
            description,
            priceId: selectedPrice.value,
            provinceId: selectedProvince.value,
            paymentId: selectedPayment.value,
            specialtyId: selectedSpecialty?.value || null,
            clinicId: selectedClinic?.value || null,
            note
        };

        const res = await saveDetailDoctorService(dataToSend);
        
        // Check errCode linh hoạt hơn
        const isSuccess = res?.errCode === 0 || res?.data?.errCode === 0;

        if (isSuccess) {
            toast.success("Lưu thông tin Bác sĩ thành công!");
            clearForm();
        } else {
            toast.error("Lỗi khi lưu thông tin!");
        }
    };

    const clearForm = () => {
        setSelectedDoctor(null);
        setSelectedPrice(null);
        setSelectedPayment(null);
        setSelectedProvince(null);
        setSelectedSpecialty(null);
        setSelectedClinic(null);
        setDescription('');
        setNote('');
        setDescriptionHTML('');
        setDescriptionMarkdown('');
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">Quản lý Thông tin Bác sĩ</h2>

            {/* BLOCK 1: CHỌN BÁC SĨ & LỜI GIỚI THIỆU NGẮN */}
            <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Chọn Bác sĩ</label>
                    <Select
                        value={selectedDoctor}
                        onChange={setSelectedDoctor}
                        options={lists.doctors}
                        placeholder="Gõ để tìm kiếm..."
                        className="text-sm"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Đoạn giới thiệu ngắn</label>
                    <textarea
                        className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Bác sĩ chuyên khoa II..."
                    />
                </div>
            </div>

            {/* BLOCK 2: THÔNG TIN KHÁM BỆNH */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Giá khám</label>
                    <Select value={selectedPrice} onChange={setSelectedPrice} options={lists.prices} placeholder="Chọn giá..." />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Phương thức thanh toán</label>
                    <Select value={selectedPayment} onChange={setSelectedPayment} options={lists.payments} placeholder="Chọn phương thức..." />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Tỉnh thành</label>
                    <Select value={selectedProvince} onChange={setSelectedProvince} options={lists.provinces} placeholder="Chọn tỉnh thành..." />
                </div>
            </div>

            {/* BLOCK 3: PHÒNG KHÁM & CHUYÊN KHOA */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Chuyên khoa</label>
                    <Select value={selectedSpecialty} onChange={setSelectedSpecialty} options={lists.specialties} placeholder="Chọn chuyên khoa..." />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Phòng khám</label>
                    <Select value={selectedClinic} onChange={setSelectedClinic} options={lists.clinics} placeholder="Chọn phòng khám..." />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Ghi chú thêm</label>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="VD: Không khám chủ nhật"
                    />
                </div>
            </div>

            {/* BLOCK 4: MARKDOWN EDITOR */}
            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Bài viết giới thiệu chi tiết</label>
                <MdEditor
                    style={{ height: '400px' }}
                    renderHTML={text => mdParser.render(text)}
                    onChange={handleEditorChange}
                    value={descriptionMarkdown}
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveDoctorInfo}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md"
                >
                    Lưu thông tin
                </button>
            </div>
        </div>
    );
};

export default ManageDoctor;