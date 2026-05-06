import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { getProfileDoctorById } from '../services/doctorService';
import DoctorSchedule from '../../../shared/components/DoctorSchedule';
import BookingModal from '../../booking/components/BookingModal';

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detailDoctor, setDetailDoctor] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchDoctorDetail = async () => {
            setIsLoading(true);
            try {
                let res = await getProfileDoctorById(id);
                if (res?.data?.errCode === 0) setDetailDoctor(res.data.data);
            } catch { /* silent */ } finally {
                setIsLoading(false);
            }
        };
        fetchDoctorDetail();
    }, [id]);

    const handleSelectTime = (timeInfo) => {
        setSelectedBookingInfo({ ...timeInfo, doctorId: id, doctorName: nameVi });
        setIsBookingOpen(true);
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-4 animate-pulse">
                    <div className="flex gap-6">
                        <div className="w-28 h-28 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="flex-1 space-y-3 pt-2">
                            <div className="h-5 bg-gray-200 rounded-lg w-1/3" />
                            <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
                            <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-200/60 h-48 animate-pulse" />
                    <div className="bg-white rounded-2xl border border-gray-200/60 h-48 animate-pulse" />
                </div>
            </div>
        );
    }

    const position = detailDoctor.positionData?.value || '';
    const nameVi = position
        ? `${position}, Dr. ${detailDoctor.lastName || ''} ${detailDoctor.firstName || ''}`
        : `Dr. ${detailDoctor.lastName || ''} ${detailDoctor.firstName || ''}`;

    const province = detailDoctor.Doctor_Info?.provinceData?.value || '';
    const clinicName = detailDoctor.clinicData?.name || '';
    const clinicAddress = detailDoctor.clinicData?.address || '';
    const displayAddress = clinicAddress
        ? `${clinicAddress}${province ? ` (${province})` : ''}`
        : province || 'Address not updated';

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">

                {/* Back button */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-5">
                    <ArrowLeft className="w-4 h-4" /> Go back
                </button>

                {/* Doctor profile card */}
                <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-4">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-blue-50">
                            <img
                                src={detailDoctor.image || '/default-avatar.svg'}
                                alt={nameVi}
                                className="w-full h-full object-cover"
                                onError={e => { e.currentTarget.src = '/default-avatar.svg'; }}
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-xl font-semibold text-gray-900 mb-2">{nameVi}</h1>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                                {detailDoctor.Markdown?.description || 'No description available.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Schedule + Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    {/* Schedule */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-1">Appointment Schedule</h2>
                        <p className="text-xs text-gray-400 mb-3">Select a date and time slot</p>
                        <DoctorSchedule doctorId={id} onSelectTime={handleSelectTime} />
                    </div>

                    {/* Info */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 flex flex-col gap-4">

                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                <MapPin className="w-3.5 h-3.5" /> Location
                            </div>
                            {clinicName && (
                                <p className="text-sm font-medium text-gray-900 mb-0.5">{clinicName}</p>
                            )}
                            <p className="text-sm text-gray-500">{displayAddress}</p>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                <CreditCard className="w-3.5 h-3.5" /> Consultation Fee
                            </div>
                            <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 mb-2">
                                <span className="text-sm text-gray-600">Fee</span>
                                <span className="text-sm font-semibold text-blue-700">
                                    {detailDoctor.Doctor_Info?.priceData?.value || 'To be updated'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">Payment: </span>
                                {detailDoctor.Doctor_Info?.paymentData?.value || 'To be updated'}
                            </p>
                        </div>

                        {detailDoctor.Doctor_Info?.note && (
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-4 py-3">
                                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-800">
                                        <span className="font-medium">Note: </span>
                                        {detailDoctor.Doctor_Info.note}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Article */}
                {detailDoctor.Markdown?.contentHTML && (
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-6 md:p-8">
                        <div className="prose max-w-none text-gray-800"
                            dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }} />
                    </div>
                )}
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}
                bookingInfo={selectedBookingInfo} />
        </div>
    );
};

export default DoctorDetail;
