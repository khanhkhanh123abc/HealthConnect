import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDoctorById } from '../../../services/doctorService';
import DoctorSchedule from '../../../components/DoctorSchedule';
import BookingModal from '../../../components/BookingModal';

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detailDoctor, setDetailDoctor] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // W10: Booking Modal state
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchDoctorDetail = async () => {
            setIsLoading(true);
            try {
                let res = await getProfileDoctorById(id);
                if (res && res.data && res.data.errCode === 0) {
                    setDetailDoctor(res.data.data);
                }
            } catch (error) {
                console.log("Lỗi fetch chi tiết bác sĩ:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctorDetail();
    }, [id]);

    // W10: Bệnh nhân chọn khung giờ → mở modal đặt lịch
    const handleSelectTime = (timeInfo) => {
        setSelectedBookingInfo({
            ...timeInfo,
            doctorId: id,
            doctorName: nameVi
        });
        setIsBookingOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span className="text-gray-500">Đang tải thông tin bác sĩ...</span>
                </div>
            </div>
        );
    }

    // ---- Xây dựng tên + chức danh ----
    const position = detailDoctor.positionData?.value || '';
    const nameVi = position
        ? `${position}, Bác sĩ ${detailDoctor.lastName || ''} ${detailDoctor.firstName || ''}`
        : `Bác sĩ ${detailDoctor.lastName || ''} ${detailDoctor.firstName || ''}`;

    // W8: Thông tin địa chỉ - ưu tiên Clinic, fallback về Province
    const province = detailDoctor.Doctor_Info?.provinceData?.value || '';
    const clinicName = detailDoctor.clinicData?.name || '';
    const clinicAddress = detailDoctor.clinicData?.address || '';

    // Xây địa chỉ hiển thị
    const displayAddress = clinicAddress
        ? `${clinicAddress}${province ? ` (${province})` : ''}`
        : province || 'Chưa cập nhật địa chỉ';

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Back button */}
            <div className="container mx-auto px-4 lg:px-24 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition mb-4"
                >
                    ← Quay lại
                </button>
            </div>

            <div className="container mx-auto px-4 lg:px-24 pb-8">

                {/* ====== BLOCK 1: ẢNH + TÊN + MÔ TẢ ====== */}
                <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden flex-shrink-0 border-4 border-indigo-100 shadow-md mx-auto md:mx-0">
                        <img
                            src={detailDoctor.image || 'https://via.placeholder.com/150'}
                            alt={nameVi}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col flex-1 text-center md:text-left justify-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{nameVi}</h1>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {detailDoctor.Markdown?.description || 'Bác sĩ chưa cập nhật mô tả.'}
                        </p>
                    </div>
                </div>

                {/* ====== BLOCK 2: LỊCH KHÁM + THÔNG TIN ====== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* W9: Lịch khám */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <DoctorSchedule
                            doctorId={id}
                            onSelectTime={handleSelectTime}
                        />
                    </div>

                    {/* W8: Địa chỉ + Giá khám */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-indigo-500 flex flex-col gap-5">

                        {/* Địa chỉ khám */}
                        <div>
                            <h3 className="font-bold text-gray-700 uppercase text-sm mb-3 flex items-center gap-2">
                                <span className="text-indigo-500">🏥</span> Địa chỉ khám
                            </h3>
                            {clinicName && (
                                <p className="font-semibold text-gray-800 mb-1">{clinicName}</p>
                            )}
                            <p className="text-sm text-gray-600">{displayAddress}</p>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Giá khám */}
                        <div>
                            <h3 className="font-bold text-gray-700 uppercase text-sm mb-3 flex items-center gap-2">
                                <span className="text-indigo-500">💰</span> Chi phí khám
                            </h3>
                            <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                <span className="text-gray-700 font-medium text-sm">Giá khám:</span>
                                <span className="text-indigo-700 font-bold">
                                    {detailDoctor.Doctor_Info?.priceData?.value || 'Đang cập nhật'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                <span className="font-medium">Thanh toán: </span>
                                {detailDoctor.Doctor_Info?.paymentData?.value || 'Đang cập nhật'}
                            </p>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Ghi chú */}
                        {detailDoctor.Doctor_Info?.note && (
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    <span className="font-semibold">📌 Lưu ý: </span>
                                    {detailDoctor.Doctor_Info.note}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ====== BLOCK 3: BÀI VIẾT CHI TIẾT ====== */}
                <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
                    {detailDoctor.Markdown?.contentHTML ? (
                        <div
                            className="prose max-w-none text-gray-800"
                            dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}
                        />
                    ) : (
                        <p className="text-gray-400 italic text-center py-10">
                            Bác sĩ chưa cập nhật bài viết giới thiệu chi tiết.
                        </p>
                    )}
                </div>
            </div>

            {/* W10: Booking Modal */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                bookingInfo={selectedBookingInfo}
            />
        </div>
    );
};

export default DoctorDetail;