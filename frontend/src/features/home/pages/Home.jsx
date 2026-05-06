import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin, Stethoscope, Building2 } from 'lucide-react';
import HomeHeader from '../../../shared/components/Header/Header';
import { getTopDoctorHomeService } from '../../doctor/services/doctorService';
import { getAllClinicsService } from '../../clinic/services/clinicService';
import axios from '../../../app/axios';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const location = useLocation();

    const [topDoctors, setTopDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
    const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);
    const [isLoadingClinics, setIsLoadingClinics] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ doctors: [], specialties: [] });
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (location.pathname !== '/home') return;
        const fetchDoctors = async () => {
            try {
                let res = await getTopDoctorHomeService(8);
                if (res?.data?.errCode === 0) setTopDoctors(res.data.data || []);
            } catch {}
            finally { setIsLoadingDoctors(false); }
        };
        const fetchSpecialties = async () => {
            try {
                let res = await axios.get('/api/get-all-specialty');
                if (res?.data?.errCode === 0) setSpecialties((res.data.data || []).slice(0, 8));
            } catch {}
            finally { setIsLoadingSpecialties(false); }
        };
        const fetchClinics = async () => {
            try {
                let res = await getAllClinicsService();
                if (res?.data?.errCode === 0) setClinics((res.data.data || []).slice(0, 6));
            } catch {}
            finally { setIsLoadingClinics(false); }
        };
        fetchDoctors();
        fetchSpecialties();
        fetchClinics();
    }, [location.pathname]);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults({ doctors: [], specialties: [] });
            setSearchOpen(false);
            return;
        }
        const timer = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await axios.get(`/api/global-search?q=${encodeURIComponent(searchQuery)}`);
                if (res?.data?.errCode === 0) {
                    setSearchResults({ doctors: res.data.doctors || [], specialties: res.data.specialties || [] });
                    setSearchOpen(true);
                }
            } catch {}
            finally { setSearchLoading(false); }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3" />
            <div className="h-3.5 bg-gray-200 rounded-lg w-3/4 mx-auto mb-2" />
            <div className="h-3 bg-gray-100 rounded-lg w-1/2 mx-auto" />
        </div>
    );

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <HomeHeader />

            {/* ── HERO ── */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-500 w-full pt-28 pb-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.07]">
                    <div className="absolute top-8 left-16 w-48 h-48 rounded-full bg-white" />
                    <div className="absolute bottom-8 right-24 w-64 h-64 rounded-full bg-white" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white" />
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
                        Easy Appointment Booking
                    </h1>
                    <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                        Connect with hundreds of top specialists in just a few simple steps
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-10 relative">
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onFocus={() => (searchResults.doctors.length > 0 || searchResults.specialties.length > 0) && setSearchOpen(true)}
                                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                                placeholder="Search doctors, specialties, symptoms..."
                                className="w-full pl-12 pr-10 py-4 rounded-2xl text-gray-800 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            {searchLoading && (
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                            )}
                        </div>
                        {searchOpen && (searchResults.doctors.length > 0 || searchResults.specialties.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 text-left border border-gray-100">
                                {searchResults.specialties.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">Specialties</div>
                                        {searchResults.specialties.map(s => (
                                            <button key={s.id} onMouseDown={() => { navigate('/booking'); setSearchOpen(false); setSearchQuery(''); }}
                                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors">
                                                <Stethoscope className="w-4 h-4 text-blue-500 shrink-0" />
                                                <span className="font-medium">{s.name}</span>
                                            </button>
                                        ))}
                                    </>
                                )}
                                {searchResults.doctors.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">Doctors</div>
                                        {searchResults.doctors.map(d => (
                                            <button key={d.id} onMouseDown={() => { navigate(`/doctor-profile/${d.id}`); setSearchOpen(false); setSearchQuery(''); }}
                                                className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors">
                                                {d.image
                                                    ? <img src={d.image} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                    : <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">{d.name?.[0]}</div>
                                                }
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                                                    {d.position && <p className="text-xs text-gray-400">{d.position}</p>}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="flex gap-3 justify-center flex-wrap">
                        <button onClick={() => navigate('/booking')}
                            className="bg-white text-blue-600 font-medium px-8 py-3.5 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 shadow-sm text-sm">
                            Book an Appointment
                        </button>
                        {isLoggedIn && (
                            <button onClick={() => navigate('/my-bookings')}
                                className="bg-white/15 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-white/25 active:scale-[0.98] transition-all duration-200 border border-white/30 text-sm">
                                My Appointments
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-12 mt-12 flex-wrap">
                        {[{ num: '100+', label: 'Doctors' }, { num: '20+', label: 'Specialties' }, { num: '50+', label: 'Clinics' }].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl font-semibold text-white">{s.num}</p>
                                <p className="text-blue-200 text-sm mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── SPECIALTIES ── */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Featured Specialties</h2>
                            <p className="text-sm text-gray-500 mt-1">Choose a specialty to start booking</p>
                        </div>
                        <button onClick={() => navigate('/booking')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
                            View all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {isLoadingSpecialties ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center p-4 rounded-2xl animate-pulse">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 mb-2" />
                                    <div className="h-3 w-16 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : specialties.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                            {specialties.map(spec => (
                                <button key={spec.id} onClick={() => navigate('/booking')}
                                    className="flex flex-col items-center p-4 rounded-2xl hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 group">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 group-hover:border-blue-200 transition-colors mb-2">
                                        <img src={spec.image || '/default-avatar.svg'} alt={spec.name} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-700 group-hover:text-blue-600 leading-tight text-center transition-colors">
                                        {spec.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-sm">No specialties available</div>
                    )}
                </div>
            </section>

            {/* ── FEATURED CLINICS ── */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Featured Clinics</h2>
                            <p className="text-sm text-gray-500 mt-1">Trusted medical facilities near you</p>
                        </div>
                        <button onClick={() => navigate('/booking')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
                            View all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {isLoadingClinics ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse flex gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-2 pt-1">
                                        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-100 rounded w-full" />
                                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : clinics.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {clinics.map(clinic => (
                                <button key={clinic.id} onClick={() => navigate(`/clinic/${clinic.id}`)}
                                    className="bg-white rounded-2xl border border-gray-200/60 p-5 flex gap-4 items-start text-left hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-200/50 hover:border-blue-200 transition-all duration-300 group">
                                    {clinic.image ? (
                                        <img
                                            src={clinic.image}
                                            alt={clinic.name}
                                            className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0 group-hover:border-blue-200 transition-colors"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                            <Building2 className="w-7 h-7 text-blue-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors leading-snug">
                                            {clinic.name}
                                        </h3>
                                        {clinic.address && (
                                            <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1 leading-relaxed line-clamp-2">
                                                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                                                {clinic.address}
                                            </p>
                                        )}
                                        <span className="inline-block mt-2 text-xs text-blue-600 font-medium group-hover:underline">
                                            View details →
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-sm">No clinics available</div>
                    )}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-semibold text-gray-900 text-center mb-10">Book in 4 Simple Steps</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { step: '1', Icon: Stethoscope, title: 'Choose a Specialty', desc: 'Find the right specialty for your needs' },
                            { step: '2', Icon: MapPin, title: 'Choose a Clinic', desc: 'Find a convenient clinic near you' },
                            { step: '3', Icon: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Choose a Doctor', desc: 'View profiles and choose the right doctor' },
                            { step: '4', Icon: Calendar, title: 'Book', desc: 'Select a date and time and confirm' },
                        ].map(({ step, Icon, title, desc }) => (
                            <div key={step} className="bg-white rounded-2xl border border-gray-200/60 p-6 text-center hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-semibold text-sm mx-auto mb-4">
                                    {step}
                                </div>
                                <Icon className="w-6 h-6 text-blue-500 mx-auto mb-3" />
                                <h3 className="font-medium text-gray-900 text-sm mb-1">{title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <button onClick={() => navigate('/booking')}
                            className="bg-blue-600 text-white font-medium px-10 py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm text-sm">
                            Start Booking Now
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TOP DOCTORS ── */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Top Doctors</h2>
                            <p className="text-sm text-gray-500 mt-1">Our top medical experts</p>
                        </div>
                        <button onClick={() => navigate('/booking')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
                            View all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {isLoadingDoctors ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : topDoctors.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {topDoctors.map(doctor => (
                                <div key={doctor.id}
                                    className="bg-white rounded-2xl border border-gray-200/60 p-5 text-center hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-200/50 transition-all duration-300 group">
                                    <div onClick={() => navigate(`/doctor-profile/${doctor.id}`)} className="cursor-pointer">
                                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border border-gray-200 group-hover:border-blue-200 transition-colors">
                                            <img src={doctor.image || '/default-avatar.svg'}
                                                alt={`${doctor.lastName} ${doctor.firstName}`}
                                                className="w-full h-full object-cover" />
                                        </div>
                                        {doctor.positionData?.value && (
                                            <span className="inline-block text-[11px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full mb-1.5 font-medium">
                                                {doctor.positionData.value}
                                            </span>
                                        )}
                                        <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                            {doctor.lastName} {doctor.firstName}
                                        </h3>
                                    </div>
                                    <button onClick={() => navigate('/booking')}
                                        className="mt-3 w-full text-xs bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium">
                                        Book Appointment
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">No doctors available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
                    <div>
                        <h3 className="text-base font-semibold mb-3 text-blue-400">HealthConnect</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The leading appointment booking platform. Connecting patients with the best doctors.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li onClick={() => navigate('/booking')} className="hover:text-white cursor-pointer transition-colors">Book Appointment</li>
                            <li onClick={() => navigate('/my-bookings')} className="hover:text-white cursor-pointer transition-colors">My Appointments</li>
                            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Contact</h3>
                        <p className="text-gray-400 text-sm">support@healthconnect.io.vn</p>
                        <p className="text-gray-400 text-sm mt-1">1800-HEALTH</p>
                    </div>
                </div>
                <div className="text-center text-gray-500 text-xs mt-8">
                    © 2026 HealthConnect. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
