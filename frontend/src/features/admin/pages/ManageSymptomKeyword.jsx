import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import {
    getAllSymptomKeywords, createSymptomKeyword,
    updateSymptomKeyword, deleteSymptomKeyword
} from '../services/symptomKeywordService';
import { getAllSpecialty } from '../services/specialtyService';

const EMPTY_FORM = { keyword: '', specialtyId: '' };
const LABEL = 'block text-xs font-medium text-gray-500 mb-1.5';
const INPUT = 'w-full bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all';

const ManageSymptomKeyword = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);

    const [keywords, setKeywords] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchKeywords = async (q) => {
        setIsLoading(true);
        try {
            const res = await getAllSymptomKeywords(q || '');
            const list = res?.data?.data || [];
            setKeywords(Array.isArray(list) ? list : []);
        } catch { /* silent */ }
        finally { setIsLoading(false); }
    };

    const fetchSpecialties = async () => {
        try {
            const res = await getAllSpecialty();
            const list = res?.data?.data || res?.data || [];
            setSpecialties(Array.isArray(list) ? list : []);
        } catch { /* silent */ }
    };

    useEffect(() => {
        fetchKeywords();
        fetchSpecialties();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => fetchKeywords(searchText), 300);
        return () => clearTimeout(t);
    }, [searchText]);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
    };

    const handleSubmit = async () => {
        if (!form.keyword.trim() || !form.specialtyId) {
            toast.error('Please fill in keyword and specialty.');
            return;
        }
        const payload = {
            keyword: form.keyword.trim(),
            specialtyId: Number(form.specialtyId)
        };
        try {
            const res = editingId
                ? await updateSymptomKeyword({ ...payload, id: editingId })
                : await createSymptomKeyword(payload);
            const ok = res?.data?.errCode === 0;
            if (ok) {
                toast.success(editingId ? 'Keyword updated.' : 'Keyword added.');
                resetForm();
                fetchKeywords(searchText);
            } else {
                toast.error(res?.data?.errMessage || 'Operation failed.');
            }
        } catch {
            toast.error('Connection error.');
        }
    };

    const handleEdit = (kw) => {
        setEditingId(kw.id);
        setForm({
            keyword: kw.keyword || '',
            specialtyId: kw.specialtyId ? String(kw.specialtyId) : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (kw) => {
        if (!window.confirm(`Delete keyword "${kw.keyword}"?`)) return;
        try {
            const res = await deleteSymptomKeyword(kw.id);
            if (res?.data?.errCode === 0) {
                toast.success('Keyword deleted.');
                fetchKeywords(searchText);
            } else {
                toast.error(res?.data?.errMessage || 'Deletion failed.');
            }
        } catch {
            toast.error('Connection error.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Symptom Keywords</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {editingId
                            ? <span className="text-amber-600 font-medium">Editing keyword</span>
                            : `${keywords.length} keyword${keywords.length !== 1 ? 's' : ''} mapped to specialties`}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-6 space-y-5">
                <h2 className="text-sm font-semibold text-gray-900">
                    {editingId ? 'Edit Keyword' : 'Add New Keyword'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={LABEL}>Keyword</label>
                        <input type="text" value={form.keyword}
                            onChange={e => setForm(p => ({ ...p, keyword: e.target.value }))}
                            placeholder="e.g. headache"
                            className={INPUT} />
                        <p className="text-[11px] text-gray-400 mt-1.5">Lowercase English. Min 3 characters to match.</p>
                    </div>
                    <div>
                        <label className={LABEL}>Specialty</label>
                        <select value={form.specialtyId}
                            onChange={e => setForm(p => ({ ...p, specialtyId: e.target.value }))}
                            className={INPUT}>
                            <option value="">Select specialty</option>
                            {specialties.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    {editingId && (
                        <button onClick={resetForm}
                            className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            Cancel Edit
                        </button>
                    )}
                    <button onClick={handleSubmit}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl active:scale-[0.98] transition-all duration-200 shadow-sm ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {!editingId && <Plus className="w-4 h-4" />}
                        {editingId ? 'Update Keyword' : 'Add Keyword'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Keyword List
                        <span className="ml-2 text-gray-400 font-normal">({keywords.length})</span>
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-56">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <input type="text" placeholder="Search keyword..."
                            value={searchText} onChange={e => setSearchText(e.target.value)}
                            className="text-sm bg-transparent border-0 outline-none text-gray-700 placeholder-gray-400 w-full" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-sm text-gray-400 animate-pulse">Loading...</div>
                ) : keywords.length === 0 ? (
                    <div className="text-center py-12 text-sm text-gray-400">No keywords found</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {keywords.map(kw => (
                            <div key={kw.id}
                                className={`flex items-center gap-4 px-6 py-3 transition-colors ${editingId === kw.id ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{kw.keyword}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        → {kw.Specialty?.name || `Specialty #${kw.specialtyId}`}
                                    </p>
                                </div>
                                <div className="flex gap-1.5">
                                    <button onClick={() => handleEdit(kw)}
                                        className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors">
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(kw)}
                                        className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
                                        <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSymptomKeyword;
