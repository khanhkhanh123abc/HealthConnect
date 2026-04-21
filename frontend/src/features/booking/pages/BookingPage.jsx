import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../../../app/axios';
import DoctorSchedule from '../../../shared/components/DoctorSchedule';
import BookingModal from '../components/BookingModal';

// ─── STEPPER HEADER ───────────────────────────────────────────
const STEPS = ['Specialty', 'Clinic', 'Doctor', 'Booking'];

const StepHeader = ({ current }) => (
    <div className="flex items-center justify-center mb-8 gap-0">
        {STEPS.map((label, idx) => {
            const step = idx + 1;
            const done = step < current;
            const active = step === current;
            return (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-200
                            ${done ? 'bg-blue-600 border-blue-600 text-white'
                                : active ? 'bg-white border-blue-600 text-blue-600'
                                    : 'bg-white border-gray-200 text-gray-400'}`}>
                            {done ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : step}
                        </div>
                        <span className={`text-[11px] mt-1.5 font-medium ${active ? 'text-blue-600' : done ? 'text-blue-400' : 'text-gray-400'}`}>
                            {label}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div className={`h-0.5 w-14 mx-1 mb-5 transition-all duration-300 ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />
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
                        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
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
                        <span className="mt-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Selected</span>
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
            ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
            <button onClick={() => onSelect(doctor)} className="flex items-center gap-4 flex-1 text-left">
                <img
                    src={doctor.image || 'https://via.placeholder.com/56'}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">
                        {position ? `${position}, Dr. ${name}` : `Dr. ${name}`}
                    </p>
                    {doctor.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{doctor.description}</p>
                    )}
                </div>
                {isSelected && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full flex-shrink-0">✓</span>
                )}
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); onViewProfile ? onViewProfile() : navigate(`/doctor-profile/${doctor.id}`); }}
                className="flex-shrink-0 text-xs text-blue-600 border border-blue-300 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
            >
                View profile →
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

    const [specialties, setSpecialties] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingInfo, setBookingInfo] = useState(null);

    useEffect(() => {
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
            } catch (_e) { toast.error('Failed to load specialties.'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

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
                toast.info('No clinics available for this specialty.');
            } else {
                setStep(2);
            }
        } catch (_e) { toast.error('Failed to load clinics.'); }
        finally { setLoading(false); }
    };

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
                toast.info('No doctors available at this clinic.');
            } else {
                setStep(3);
            }
        } catch (_e) { toast.error('Failed to load doctors.'); }
        finally { setLoading(false); }
    };

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(4);
    };

    const handleSelectTime = (timeInfo) => {
        if (!isLoggedIn) {
            toast.warn('Please sign in to book an appointment.');
            navigate('/login');
            return;
        }
        setBookingInfo({
            ...timeInfo,
            doctorId: selectedDoctor.id,
            doctorName: `Dr. ${selectedDoctor.lastName || ''} ${selectedDoctor.firstName || ''}`.trim()
        });
        setIsModalOpen(true);
    };

    const goBack = () => setStep(prev => Math.max(1, prev - 1));

    const renderSummary = () => {
        if (step === 1) return null;
        return (
            <div className="flex items-center gap-2 flex-wrap mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm">
                {selectedSpecialty && (
                    <span className="flex items-center gap-1.5 bg-white border border-blue-200 px-3 py-1 rounded-full text-blue-700 font-medium">
                        <img src={selectedSpecialty.image} className="w-4 h-4 rounded-full object-cover" alt="" />
                        {selectedSpecialty.name}
                    </span>
                )}
                {selectedClinic && (
                    <>
                        <span className="text-blue-300">›</span>
                        <span className="bg-white border border-blue-200 px-3 py-1 rounded-full text-blue-700 font-medium">
                            {selectedClinic.name}
                        </span>
                    </>
                )}
                {selectedDoctor && (
                    <>
                        <span className="text-blue-300">›</span>
                        <span className="bg-white border border-blue-200 px-3 py-1 rounded-full text-blue-700 font-medium">
                            Dr. {selectedDoctor.lastName} {selectedDoctor.firstName}
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
                    <h1 className="text-2xl font-semibold text-gray-900">Book an Appointment</h1>
                    <p className="text-gray-500 text-sm mt-1">Select step by step to find the right doctor</p>
                </div>

                {/* Stepper */}
                <StepHeader current={step} />

                {/* Summary breadcrumb */}
                {renderSummary()}

                {/* Back button */}
                {step > 1 && (
                    <button onClick={goBack}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition">
                        ← Back
                    </button>
                )}

                {/* ── STEP 1: Specialty ── */}
                {step === 1 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Specialty</h2>
                        {loading ? <SkeletonGrid /> : (
                            <CardGrid items={specialties} selected={selectedSpecialty} onSelect={handleSelectSpecialty} type="specialty" />
                        )}
                    </div>
                )}

                {/* ── STEP 2: Clinic ── */}
                {step === 2 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Select Clinic — <span className="text-blue-600">{selectedSpecialty?.name}</span>
                        </h2>
                        {loading ? <SkeletonGrid count={4} /> : (
                            <CardGrid items={clinics} selected={selectedClinic} onSelect={handleSelectClinic} type="clinic" />
                        )}
                    </div>
                )}

                {/* ── STEP 3: Doctor ── */}
                {step === 3 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Select Doctor — <span className="text-blue-600">{selectedClinic?.name}</span>
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
                                className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                            />
                            <div>
                                <p className="font-semibold text-gray-900 text-base">
                                    {selectedDoctor.positionData?.value && `${selectedDoctor.positionData.value}, `}
                                    Dr. {selectedDoctor.lastName} {selectedDoctor.firstName}
                                </p>
                                <p className="text-sm text-blue-600">{selectedClinic?.name}</p>
                                <p className="text-xs text-gray-400">{selectedClinic?.address}</p>
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-700 mb-2">Select Date and Time Slot</h3>
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
