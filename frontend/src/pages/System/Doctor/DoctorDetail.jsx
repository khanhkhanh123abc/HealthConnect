import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDetailInfoDoctor } from '../../../services/doctorService';
import DoctorSchedule from './DoctorSchedule';

const DoctorDetail = () => {
    const { id } = useParams(); 
    const [detailDoctor, setDetailDoctor] = useState({});

    useEffect(() => {
        const fetchDoctorDetail = async () => {
            try {
                let res = await getDetailInfoDoctor(id);
                console.log("Data từ API: ", res);

                if (res && res.errCode === 0) {
                    setDetailDoctor(res.data);
                }
            } catch (error) {
                console.log("Lỗi fetch chi tiết bác sĩ: ", error);
            }
        };
        
        // Chỉ gọi API khi có id
        if (id) {
            fetchDoctorDetail();
        }
    }, [id]);

    // Xử lý tên và chức danh Bác sĩ (tránh lỗi undefined)
    let nameVi = '';
    if (detailDoctor && detailDoctor.positionData) {
        // Vì lúc nãy bạn đã đổi valueVi thành value trong DB, nên ta gọi .value
        nameVi = `${detailDoctor.positionData.value}, Bác sĩ ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header của trang (bạn có thể import component Header vào đây) */}
            
            <div className="container mx-auto px-4 lg:px-24 py-8 mt-4 md:mt-10">
                
                {/* ================= BLOCK 1: ẢNH, TÊN VÀ MÔ TẢ NGẮN ================= */}
                <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    {/* Ảnh Avatar (Đã dùng link public từ Supabase) */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100 shadow-sm mx-auto md:mx-0">
                        <img 
                            src={detailDoctor.image ? detailDoctor.image : 'https://via.placeholder.com/150'} 
                            alt={`Avatar ${nameVi}`} 
                            className="w-full h-full object-cover bg-gray-100"
                        />
                    </div>
                    
                    {/* Thông tin Text */}
                    <div className="flex flex-col flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800 mb-3">{nameVi}</h1>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {/* Lấy mô tả ngắn từ bảng Markdown */}
                            {detailDoctor.Markdown?.description || "Bác sĩ chưa cập nhật mô tả ngắn."}
                        </p>
                    </div>
                </div>

                {/* ================= BLOCK 2: ĐẶT LỊCH & ĐỊA CHỈ, GIÁ KHÁM ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    {/* Cột Trái: Component Đặt lịch (Dành cho thẻ W9) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                        <div className="font-semibold text-gray-800 uppercase border-b pb-3 mb-4 flex items-center gap-2">
                            <span className="text-blue-600 text-xl">📅</span> Lịch khám
                        </div>
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-gray-400 font-medium">Khung giờ đặt lịch</p>
                            <p className="text-xs text-gray-400 mt-1">(Sẽ tích hợp ở thẻ W9)</p>
                        </div>
                    </div>

                    {/* Cột Phải: Thông tin phòng khám & Giá khám (Lấy từ bảng Doctor_Info) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6 border-t-4 border-t-blue-500">
                        
                        {/* Địa chỉ khám */}
                        <div>
                            <h3 className="font-semibold text-gray-800 uppercase mb-3 flex items-center gap-2">
                                <span className="text-blue-500">🏥</span> ĐỊA CHỈ KHÁM
                            </h3>
                            <p className="font-bold text-gray-800 mb-1">
                                {detailDoctor.Doctor_Info?.nameClinic || "Chưa cập nhật tên phòng khám"}
                            </p>
                            <p className="text-sm text-gray-600">
                                {detailDoctor.Doctor_Info?.addressClinic || "Chưa cập nhật địa chỉ"}
                            </p>
                        </div>
                        
                        <hr className="border-gray-100" />
                        
                        {/* Giá khám & Thanh toán */}
                        <div>
                            <h3 className="font-semibold text-gray-800 uppercase mb-3 flex items-center gap-2">
                                <span className="text-blue-500">💰</span> CHI PHÍ KHÁM
                            </h3>
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <span className="text-gray-700 font-medium">Giá khám cơ bản:</span>
                                <span className="text-red-500 font-bold text-lg">
                                    {detailDoctor.Doctor_Info?.priceTypeData?.value || 'Đang cập nhật'}
                                </span>
                            </div>
                            
                            {/* Phương thức thanh toán */}
                            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                                <span className="font-medium text-gray-700">Phòng khám thanh toán bằng:</span> 
                                {detailDoctor.Doctor_Info?.paymentTypeData?.value || 'Đang cập nhật'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= BLOCK 3: BÀI VIẾT CHI TIẾT (HTML) ================= */}
                <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
                    {detailDoctor.Markdown?.contentHTML ? (
                        <div 
                            className="prose max-w-none text-gray-800 prose-headings:text-blue-800 prose-a:text-blue-600" 
                            dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }} 
                        />
                    ) : (
                        <p className="text-gray-400 italic text-center py-10">Bác sĩ chưa cập nhật bài viết giới thiệu chi tiết.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DoctorDetail;