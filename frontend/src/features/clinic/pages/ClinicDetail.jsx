import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Stethoscope, Calendar } from 'lucide-react';
import Header from '../../../shared/components/Header/Header';
import { getClinicByIdService, getDoctorsByClinicService } from '../services/clinicService';

const ClinicDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clinicRes, doctorsRes] = await Promise.all([
                    getClinicByIdService(id),
                    getDoctorsByClinicService(id)
                ]);
                if (clinicRes?.data?.errCode === 0) setClinic(clinicRes.data.data);
                if (doctorsRes?.data?.errCode === 0) setDoctors(doctorsRes.data.data || []);
            } catch (_e) {}
            finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-24 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            </div>
        );
    }

    if (!clinic || !clinic.id) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-24 text-center text-gray-400 text-sm">Clinic not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* ── CLINIC HEADER ── */}
            <div className="bg-white border-b pt-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-6 items-start">
                    <img
                        src={clinic.image || 'https://via.placeholder.com/112'}
                        alt={clinic.name}
                        className="w-28 h-28 rounded-2xl object-cover border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-semibold text-gray-900">{clinic.name}</h1>
                        {clinic.address && (
                            <p className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                {clinic.address}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                                <Stethoscope className="w-3.5 h-3.5" />
                                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <button
                            onClick={() => navigate('/booking')}
                            className="mt-4 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 border-t">
                    {[
                        { key: 'about', label: 'About' },
                        { key: 'doctors', label: `Doctors (${doctors.length})` }
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors
                                ${activeTab === tab.key
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

                {/* About tab */}
                {activeTab === 'about' && (
                    <div>
                        {clinic.descriptionHTML ? (
                            <div
                                className="bg-white rounded-2xl border border-gray-200 p-6 prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: clinic.descriptionHTML }}
                            />
                        ) : (
                            <div className="text-center py-16 text-gray-400 text-sm">No description available.</div>
                        )}
                    </div>
                )}

                {/* Doctors tab */}
                {activeTab === 'doctors' && (
                    <div>
                        {doctors.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 text-sm">
                                No doctors registered at this clinic yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctors.map(doc => {
                                    const name = `${doc.lastName || ''} ${doc.firstName || ''}`.trim();
                                    return (
                                        <div key={doc.id}
                                            className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                            <img
                                                src={doc.image || 'https://via.placeholder.com/64'}
                                                alt={name}
                                                className="w-16 h-16 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                {doc.positionData?.value && (
                                                    <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                                        {doc.positionData.value}
                                                    </span>
                                                )}
                                                <h3 className="font-semibold text-gray-900 mt-1 text-sm">{name}</h3>
                                                {doc.specialtyName && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Stethoscope className="w-3 h-3 flex-shrink-0" />
                                                        {doc.specialtyName}
                                                    </p>
                                                )}
                                                {doc.description && (
                                                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                                                        {doc.description}
                                                    </p>
                                                )}
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => navigate(`/doctor-profile/${doc.id}`)}
                                                        className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium"
                                                    >
                                                        View Profile
                                                    </button>
                                                    <button
                                                        onClick={() => navigate('/booking')}
                                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-1"
                                                    >
                                                        <Calendar className="w-3 h-3" /> Book
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClinicDetail;
