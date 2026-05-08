import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search, Filter, Star, X, ChevronLeft, ChevronRight,
    Stethoscope, Building2, User as UserIcon
} from 'lucide-react';
import axios from '../../../app/axios';
import { fullSearchService } from '../services/searchService';

const TYPE_OPTIONS = [
    { value: 'all',         label: 'All' },
    { value: 'doctors',     label: 'Doctors' },
    { value: 'specialties', label: 'Specialties' }
];

const GENDER_OPTIONS = [
    { value: '',  label: 'All' },
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' }
];

const RATING_OPTIONS = [5, 4, 3, 2, 1];

// ----- helpers --------------------------------------------------------------

const arrayParam = (sp, key) => sp.getAll(key).filter(Boolean);

const numberParam = (sp, key, fallback = '') => {
    const v = sp.get(key);
    if (v == null || v === '') return fallback;
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
};

// ----- subcomponents --------------------------------------------------------

const StarRow = ({ rating = 0 }) => {
    const filled = Math.round(rating);
    return (
        <div className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i}
                    className={`w-3.5 h-3.5 ${i <= filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
            ))}
        </div>
    );
};

const DoctorCard = ({ doctor, onClick }) => (
    <button onClick={onClick}
        className="w-full bg-white rounded-2xl border border-gray-200/60 p-5 flex gap-4 items-start text-left hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-200/50 hover:border-blue-200 transition-all duration-300 group">
        <img
            src={doctor.image || '/default-avatar.svg'}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover border border-gray-200 flex-shrink-0 group-hover:border-blue-200 transition-colors"
        />
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                    {doctor.position && (
                        <span className="inline-block text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium mb-1">
                            {doctor.position}
                        </span>
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                        Dr. {doctor.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {doctor.specialtyName || '—'}
                        {doctor.clinicName ? ` · ${doctor.clinicName}` : ''}
                    </p>
                </div>
                {doctor.price && (
                    <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">
                        {doctor.price}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <StarRow rating={doctor.averageRating || 0} />
                <span className="text-xs text-gray-400">
                    {doctor.reviewCount > 0
                        ? `${doctor.averageRating.toFixed(1)} (${doctor.reviewCount})`
                        : 'No reviews yet'}
                </span>
            </div>
        </div>
    </button>
);

const SpecialtyCard = ({ specialty, onClick }) => (
    <button onClick={onClick}
        className="w-full bg-white rounded-2xl border border-gray-200/60 p-5 flex gap-4 items-center text-left hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-200/50 hover:border-blue-200 transition-all duration-300 group">
        {specialty.image ? (
            <img src={specialty.image} alt={specialty.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
        ) : (
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Stethoscope className="w-6 h-6 text-blue-400" />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Specialty</p>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                {specialty.name}
            </h3>
        </div>
    </button>
);

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse flex gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
            <div className="h-3.5 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
    </div>
);

const FilterSection = ({ title, children }) => (
    <div className="border-b border-gray-100 py-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">{title}</h4>
        {children}
    </div>
);

// ----- main page ------------------------------------------------------------

const SearchResults = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter state mirrored from URL.
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const specialtyIds = arrayParam(searchParams, 'specialtyId');
    const clinicIds = arrayParam(searchParams, 'clinicId');
    const minPrice = numberParam(searchParams, 'minPrice');
    const maxPrice = numberParam(searchParams, 'maxPrice');
    const minRating = searchParams.get('minRating') || '';
    const gender = searchParams.get('gender') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const [queryInput, setQueryInput] = useState(q);
    const [results, setResults] = useState({
        doctors: [], specialties: [],
        total: 0, page: 1, totalPages: 1
    });
    const [isLoading, setIsLoading] = useState(false);
    const [allSpecialties, setAllSpecialties] = useState([]);
    const [allClinics, setAllClinics] = useState([]);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Sync local input when URL changes (e.g. browser back).
    useEffect(() => { setQueryInput(q); }, [q]);

    // One-shot fetch for filter dropdowns.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [specRes, clinicRes] = await Promise.all([
                    axios.get('/api/get-all-specialty'),
                    axios.get('/api/get-all-clinic')
                ]);
                if (cancelled) return;
                setAllSpecialties(specRes?.data?.data || []);
                setAllClinics(clinicRes?.data?.data || []);
            } catch { /* silent */ }
        })();
        return () => { cancelled = true; };
    }, []);

    // Debounced search whenever URL params change.
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fullSearchService({
                    q,
                    type,
                    specialtyId: specialtyIds,
                    clinicId: clinicIds,
                    minPrice: minPrice === '' ? '' : minPrice,
                    maxPrice: maxPrice === '' ? '' : maxPrice,
                    minRating,
                    gender,
                    page,
                    limit: 10
                });
                if (cancelled) return;
                if (res?.data?.errCode === 0) {
                    setResults({
                        doctors: res.data.doctors || [],
                        specialties: res.data.specialties || [],
                        total: res.data.total || 0,
                        page: res.data.page || 1,
                        totalPages: res.data.totalPages || 1
                    });
                }
            } catch { /* silent */ }
            finally {
                if (!cancelled) setIsLoading(false);
            }
        }, 300);
        return () => { cancelled = true; clearTimeout(timer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, type, specialtyIds.join(','), clinicIds.join(','), minPrice, maxPrice, minRating, gender, page]);

    // ----- URL mutations ----------------------------------------------------

    const updateParams = useCallback((mutator) => {
        const next = new URLSearchParams(searchParams);
        mutator(next);
        // Any filter change resets to page 1.
        if (!mutator.__keepPage) next.set('page', '1');
        setSearchParams(next, { replace: false });
    }, [searchParams, setSearchParams]);

    const goToPage = (p) => {
        const next = new URLSearchParams(searchParams);
        next.set('page', String(p));
        setSearchParams(next, { replace: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateParams(p => p.set('q', queryInput.trim()));
    };

    const handleTypeChange = (value) => updateParams(p => {
        if (value === 'all') p.delete('type');
        else p.set('type', value);
    });

    const toggleArrayParam = (key, value) => updateParams(p => {
        const current = p.getAll(key);
        if (current.includes(String(value))) {
            const remaining = current.filter(x => x !== String(value));
            p.delete(key);
            remaining.forEach(v => p.append(key, v));
        } else {
            p.append(key, String(value));
        }
    });

    const handlePriceChange = (key, raw) => updateParams(p => {
        if (raw === '' || raw == null) p.delete(key);
        else p.set(key, String(raw));
    });

    const handleRatingClick = (value) => updateParams(p => {
        if (String(p.get('minRating')) === String(value)) p.delete('minRating');
        else p.set('minRating', String(value));
    });

    const handleGenderChange = (value) => updateParams(p => {
        if (!value) p.delete('gender');
        else p.set('gender', value);
    });

    const clearFilters = () => {
        const next = new URLSearchParams();
        if (q) next.set('q', q);
        setSearchParams(next, { replace: false });
    };

    const activeFilterCount = useMemo(() => {
        let n = 0;
        if (type !== 'all') n++;
        n += specialtyIds.length;
        n += clinicIds.length;
        if (minPrice !== '') n++;
        if (maxPrice !== '') n++;
        if (minRating) n++;
        if (gender) n++;
        return n;
    }, [type, specialtyIds, clinicIds, minPrice, maxPrice, minRating, gender]);

    // ----- handlers for clicking results -----------------------------------

    const handleDoctorClick = (doctor) => navigate(`/doctor-profile/${doctor.id}`);
    const handleSpecialtyClick = (specialty) => navigate(`/booking?specialtyId=${specialty.id}`);

    // ----- render ----------------------------------------------------------

    const showDoctors = (type === 'all' || type === 'doctors') && results.doctors.length > 0;
    const showSpecialties = (type === 'all' || type === 'specialties') && results.specialties.length > 0;
    const isEmpty = !isLoading && !showDoctors && !showSpecialties;

    const sidebar = (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Filter className="w-4 h-4" /> Filters
                    {activeFilterCount > 0 && (
                        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button onClick={clearFilters}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Clear all
                    </button>
                )}
            </div>

            <FilterSection title="Type">
                <div className="space-y-1.5">
                    {TYPE_OPTIONS.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="radio" name="search-type"
                                checked={(type || 'all') === opt.value}
                                onChange={() => handleTypeChange(opt.value)}
                                className="w-4 h-4 text-blue-600" />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Specialty">
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {allSpecialties.length === 0 && (
                        <p className="text-xs text-gray-400">No specialties</p>
                    )}
                    {allSpecialties.map(s => (
                        <label key={s.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox"
                                checked={specialtyIds.includes(String(s.id))}
                                onChange={() => toggleArrayParam('specialtyId', s.id)}
                                className="w-4 h-4 text-blue-600 rounded" />
                            <span className="truncate">{s.name}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Clinic">
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {allClinics.length === 0 && (
                        <p className="text-xs text-gray-400">No clinics</p>
                    )}
                    {allClinics.map(c => (
                        <label key={c.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox"
                                checked={clinicIds.includes(String(c.id))}
                                onChange={() => toggleArrayParam('clinicId', c.id)}
                                className="w-4 h-4 text-blue-600 rounded" />
                            <span className="truncate">{c.name}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Price">
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" min={0}
                        value={minPrice}
                        onChange={e => handlePriceChange('minPrice', e.target.value)}
                        className="w-full text-xs bg-gray-100 border-0 rounded-lg px-2 py-1.5 focus:bg-white focus:ring-2 focus:ring-blue-500/30 outline-none" />
                    <span className="text-gray-400 text-xs">—</span>
                    <input type="number" placeholder="Max" min={0}
                        value={maxPrice}
                        onChange={e => handlePriceChange('maxPrice', e.target.value)}
                        className="w-full text-xs bg-gray-100 border-0 rounded-lg px-2 py-1.5 focus:bg-white focus:ring-2 focus:ring-blue-500/30 outline-none" />
                </div>
            </FilterSection>

            <FilterSection title="Minimum Rating">
                <div className="flex flex-wrap gap-1.5">
                    {RATING_OPTIONS.map(r => (
                        <button key={r}
                            onClick={() => handleRatingClick(r)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                                String(minRating) === String(r)
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                            }`}>
                            <Star className={`w-3 h-3 ${String(minRating) === String(r) ? 'fill-white' : 'fill-amber-400 text-amber-400'}`} /> {r}+
                        </button>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Doctor Gender">
                <div className="space-y-1.5">
                    {GENDER_OPTIONS.map(g => (
                        <label key={g.value || 'all'} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="radio" name="gender"
                                checked={gender === g.value}
                                onChange={() => handleGenderChange(g.value)}
                                className="w-4 h-4 text-blue-600" />
                            {g.label}
                        </label>
                    ))}
                </div>
            </FilterSection>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Top search bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={queryInput}
                    onChange={e => setQueryInput(e.target.value)}
                    placeholder="Search doctors, specialties, symptoms..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 text-sm border border-gray-200/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
            </form>

            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    {isLoading
                        ? 'Searching...'
                        : <>Showing <span className="font-semibold text-gray-900">{results.total}</span> result{results.total !== 1 ? 's' : ''}{q ? <> for <span className="font-semibold text-gray-900">"{q}"</span></> : null}</>}
                </p>
                <button onClick={() => setMobileFilterOpen(true)}
                    className="md:hidden flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                    <Filter className="w-3.5 h-3.5" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
                {/* Sidebar (desktop) */}
                <aside className="hidden md:block">{sidebar}</aside>

                {/* Sidebar (mobile drawer) */}
                {mobileFilterOpen && (
                    <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setMobileFilterOpen(false)}>
                        <div onClick={e => e.stopPropagation()}
                            className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-gray-50 p-4 overflow-y-auto">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">Filters</h3>
                                <button onClick={() => setMobileFilterOpen(false)}
                                    className="p-1 rounded-lg hover:bg-gray-200">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                            {sidebar}
                        </div>
                    </div>
                )}

                {/* Results */}
                <main className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : isEmpty ? (
                        <div className="bg-white rounded-2xl border border-gray-200/60 p-12 text-center">
                            <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
                                <Search className="w-7 h-7 text-gray-400" />
                            </div>
                            <h3 className="text-base font-medium text-gray-900 mb-1">No results found</h3>
                            <p className="text-sm text-gray-500 mb-5">Try a different keyword or remove some filters.</p>
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters}
                                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {showSpecialties && (
                                <section>
                                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5" /> Specialties
                                    </h2>
                                    <div className="space-y-3">
                                        {results.specialties.map(s => (
                                            <SpecialtyCard key={s.id} specialty={s}
                                                onClick={() => handleSpecialtyClick(s)} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {showDoctors && (
                                <section>
                                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <UserIcon className="w-3.5 h-3.5" /> Doctors
                                    </h2>
                                    <div className="space-y-3">
                                        {results.doctors.map(d => (
                                            <DoctorCard key={d.id} doctor={d}
                                                onClick={() => handleDoctorClick(d)} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Pagination */}
                            {results.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-4">
                                    <button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page <= 1}
                                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {Array.from({ length: results.totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === results.totalPages || Math.abs(p - page) <= 2)
                                        .map((p, idx, arr) => (
                                            <React.Fragment key={p}>
                                                {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                    <span className="text-gray-400 px-1">…</span>
                                                )}
                                                <button onClick={() => goToPage(p)}
                                                    className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                                                        p === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                    }`}>
                                                    {p}
                                                </button>
                                            </React.Fragment>
                                        ))}
                                    <button onClick={() => goToPage(Math.min(results.totalPages, page + 1))} disabled={page >= results.totalPages}
                                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchResults;
