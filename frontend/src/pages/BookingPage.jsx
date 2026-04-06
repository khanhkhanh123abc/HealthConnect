import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import DoctorSchedule from '../components/DoctorSchedule';
import BookingModal from '../components/BookingModal';

// ─── STEPPER HEADER ───────────────────────────────────────────
const STEPS = ['Chuyên khoa', 'Phòng khám', 'Bác sĩ', 'Đặt lịch'];

const StepHeader = ({ current }) => (
    <div className="flex items-center justify-center mb-8 gap-0">
        {STEPS.map((label, idx) => {
            const step = idx + 1;
            const done = step < current;
            const active = step === current;
            return (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                            ${done ? 'bg-indigo-600 border-indigo-600 text-white'
                                : active ? 'bg-white border-indigo-600 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-400'}`}>
                            {done ? '✓' : step}
                        </div>
                        <span className={`text-xs mt-1 font-medium ${active ? 'text-indigo-600' : done ? 'text-indigo-400' : 'text-gray-400'}`}>
                            {label}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div className={`h-0.5 w-16 mx-1 mb-5 transition-all ${done ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ─── CARD GRID ────────────────────────────────────────────────
const CardGrid = ({ items, onSelect, selected, type }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => {
            const isSelected = selected?.id === item.id;
            return (
                <button key={item.id} onClick={() => onSelect(item)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition hover:shadow-md text-left
                        ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
                    <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-full border border-gray-200 mb-3"
                    />
                    <p className="text-sm font-semibold text-gray-800 text-center leading-tight">{item.name}</p>
                    {type === 'clinic' && item.address && (
                        <p className="text-xs text-gray-400 text-center mt-1 line-clamp-2">{item.address}</p>
                    )}
                    {isSelected && (
                        <span className="mt-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Đã chọn</span>
                    )}
                </button>
            );
        })}
    </div>
);

// ─── DOCTOR CARD ─────────────────────────────────────────────
const DoctorCard = ({ doctor, onSelect, selected, onViewProfile }) => {
    const navigate = useNavigate();
    const isSelected = selected?.id === doctor.id;
    const name = `${doctor.lastName || ''} ${doctor.firstName || ''}`.trim();
    const position = doctor.positionData?.value || '';
    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition hover:shadow-md w-full
            ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
            {/* Ảnh + tên → click chọn bác sĩ */}
            <button onClick={() => onSelect(doctor)} className="flex items-center gap-4 flex-1 text-left">
                <img
                    src={doctor.image || 'https://via.placeholder.com/56'}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">
                        {position ? `${position}, BS. ${name}` : `BS. ${name}`}
                    </p>
                    {doctor.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{doctor.description}</p>
                    )}
                </div>
                {isSelected && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full flex-shrink-0">✓</span>
                )}
            </button>

            {/* Nút xem profile */}
            <button
                onClick={(e) => { e.stopPropagation(); onViewProfile ? onViewProfile() : navigate(`/doctor-profile/${doctor.id}`); }}
                className="flex-shrink-0 text-xs text-indigo-600 border border-indigo-300 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
            >
                Xem hồ sơ →
            </button>
        </div>
    );
};

// ─── LOADING SKELETON ─────────────────────────────────────────
const SkeletonGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-4 rounded-xl border border-gray-200 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
        ))}
    </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────
const BookingPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Selections
    const [specialties, setSpecialties] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Booking modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingInfo, setBookingInfo] = useState(null);

    // Step 1: Load specialties
    useEffect(() => {
        // ✅ Restore state nếu user bấm Back từ trang khác
        const saved = sessionStorage.getItem('hc_booking_state');
        if (saved) {
            try {
                const { step: s, selectedSpecialty: sp, selectedClinic: cl,
                    selectedDoctor: doc, clinics: cls, doctors: dcs } = JSON.parse(saved);
                if (s) setStep(s);
                if (sp) setSelectedSpecialty(sp);
                if (cl) setSelectedClinic(cl);
                if (doc) setSelectedDoctor(doc);
                if (cls) setClinics(cls);
                if (dcs) setDoctors(dcs);
            } catch (_e) { }
            sessionStorage.removeItem('hc_booking_state');
        }

        const load = async () => {
            setLoading(true);
            try {
                let res = await axios.get('/api/get-all-specialty');
                setSpecialties(res?.data?.data || []);
            } catch (_e) { toast.error('Không thể tải chuyên khoa!'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    // Step 2: Load clinics by specialty
    const handleSelectSpecialty = async (spec) => {
        setSelectedSpecialty(spec);
        setSelectedClinic(null);
        setSelectedDoctor(null);
        setLoading(true);
        try {
            let res = await axios.get(`/api/get-clinics-by-specialty?specialtyId=${spec.id}`);
            const data = res?.data?.data || [];
            setClinics(data);
            if (data.length === 0) {
                toast.info('Chuyên khoa này chưa có phòng khám nào!');
            } else {
                setStep(2);
            }
        } catch (_e) { toast.error('Không thể tải phòng khám!'); }
        finally { setLoading(false); }
    };

    // Step 3: Load doctors by clinic + specialty
    const handleSelectClinic = async (clinic) => {
        setSelectedClinic(clinic);
        setSelectedDoctor(null);
        setLoading(true);
        try {
            let res = await axios.get(
                `/api/get-doctors-by-clinic?clinicId=${clinic.id}&specialtyId=${selectedSpecialty.id}`
            );
            const data = res?.data?.data || [];
            setDoctors(data);
            if (data.length === 0) {
                toast.info('Phòng khám này chưa có bác sĩ nào!');
            } else {
                setStep(3);
            }
        } catch (_e) { toast.error('Không thể tải bác sĩ!'); }
        finally { setLoading(false); }
    };

    // Step 4: Doctor selected → show schedule
    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(4);
    };

    // Slot selected → open modal
    const handleSelectTime = (timeInfo) => {
        if (!isLoggedIn) {
            toast.warn('Vui lòng đăng nhập để đặt lịch!');
            navigate('/login');
            return;
        }
        setBookingInfo({
            ...timeInfo,
            doctorId: selectedDoctor.id,
            doctorName: `BS. ${selectedDoctor.lastName || ''} ${selectedDoctor.firstName || ''}`.trim()
        });
        setIsModalOpen(true);
    };

    const goBack = () => setStep(prev => Math.max(1, prev - 1));

    // Summary bar
    const renderSummary = () => {
        if (step === 1) return null;
        return (
            <div className="flex items-center gap-2 flex-wrap mb-6 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-sm">
                {selectedSpecialty && (
                    <span className="flex items-center gap-1.5 bg-white border border-indigo-200 px-3 py-1 rounded-full text-indigo-700 font-medium">
                        <img src={selectedSpecialty.image} className="w-4 h-4 rounded-full object-cover" alt="" />
                        {selectedSpecialty.name}
                    </span>
                )}
                {selectedClinic && (
                    <>
                        <span className="text-indigo-300">›</span>
                        <span className="bg-white border border-indigo-200 px-3 py-1 rounded-full text-indigo-700 font-medium">
                            {selectedClinic.name}
                        </span>
                    </>
                )}
                {selectedDoctor && (
                    <>
                        <span className="text-indigo-300">›</span>
                        <span className="bg-white border border-indigo-200 px-3 py-1 rounded-full text-indigo-700 font-medium">
                            BS. {selectedDoctor.lastName} {selectedDoctor.firstName}
                        </span>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Page title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Đặt lịch khám</h1>
                    <p className="text-gray-500 text-sm mt-1">Chọn theo từng bước để tìm bác sĩ phù hợp</p>
                </div>

                {/* Stepper */}
                <StepHeader current={step} />

                {/* Summary breadcrumb */}
                {renderSummary()}

                {/* Back button */}
                {step > 1 && (
                    <button onClick={goBack}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition">
                        ← Quay lại
                    </button>
                )}

                {/* ── STEP 1: Chuyên khoa ── */}
                {step === 1 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Chọn chuyên khoa</h2>
                        {loading ? <SkeletonGrid /> : (
                            <CardGrid items={specialties} selected={selectedSpecialty} onSelect={handleSelectSpecialty} type="specialty" />
                        )}
                    </div>
                )}

                {/* ── STEP 2: Phòng khám ── */}
                {step === 2 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Chọn phòng khám — <span className="text-indigo-600">{selectedSpecialty?.name}</span>
                        </h2>
                        {loading ? <SkeletonGrid count={4} /> : (
                            <CardGrid items={clinics} selected={selectedClinic} onSelect={handleSelectClinic} type="clinic" />
                        )}
                    </div>
                )}

                {/* ── STEP 3: Bác sĩ ── */}
                {step === 3 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Chọn bác sĩ — <span className="text-indigo-600">{selectedClinic?.name}</span>
                        </h2>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border animate-pulse">
                                        <div className="w-14 h-14 rounded-full bg-gray-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {doctors.map(doc => (
                                    <DoctorCard key={doc.id} doctor={doc}
                                        selected={selectedDoctor}
                                        onSelect={handleSelectDoctor}
                                        onViewProfile={() => {
                                            // ✅ Lưu toàn bộ state trước khi rời trang
                                            sessionStorage.setItem('hc_booking_state', JSON.stringify({
                                                step: 3,
                                                selectedSpecialty,
                                                selectedClinic,
                                                selectedDoctor: doc,
                                                clinics,
                                                doctors
                                            }));
                                            navigate(`/doctor-profile/${doc.id}`);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 4: Slot ── */}
                {step === 4 && selectedDoctor && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        {/* Doctor info */}
                        <div className="flex items-center gap-4 mb-6 pb-5 border-b">
                            <img
                                src={selectedDoctor.image || 'https://via.placeholder.com/56'}
                                alt=""
                                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
                            />
                            <div>
                                <p className="font-bold text-gray-800 text-lg">
                                    {selectedDoctor.positionData?.value && `${selectedDoctor.positionData.value}, `}
                                    BS. {selectedDoctor.lastName} {selectedDoctor.firstName}
                                </p>
                                <p className="text-sm text-indigo-600">{selectedClinic?.name}</p>
                                <p className="text-xs text-gray-400">{selectedClinic?.address}</p>
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-700 mb-2">Chọn ngày và khung giờ</h3>
                        <DoctorSchedule
                            doctorId={selectedDoctor.id}
                            onSelectTime={handleSelectTime}
                        />
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bookingInfo={bookingInfo}
            />
        </div>
    );
};

export default BookingPage;