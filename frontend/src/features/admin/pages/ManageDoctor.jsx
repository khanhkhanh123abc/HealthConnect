import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import { getAllDoctorsService, saveDetailDoctorService, getProfileDoctorById } from '../../doctor/services/doctorService';
import { getAllCodeService } from '../../auth/services/userService';
import { getAllSpecialty } from '../services/specialtyService';
import { getAllClinics } from '../services/clinicService';

const mdParser = new MarkdownIt();

const LABEL = 'block text-xs font-medium text-gray-500 mb-1.5';
const INPUT = 'w-full bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all';

const buildDataSelect = (inputData, type) => {
    let result = [];
    let response = inputData?.data ? inputData.data : inputData;
    if (response?.errCode === 0 && Array.isArray(response.data)) {
        result = response.data.map((item) => {
            if (type === 'DOCTOR') return { label: `${item.lastName} ${item.firstName}`, value: item.id };
            if (type === 'SPECIALTY_CLINIC') return { label: item.name, value: item.id };
            return { label: item.value, value: item.keyMap };
        });
    }
    return result;
};

const ManageDoctor = () => {
    const [descriptionHTML, setDescriptionHTML] = useState('');
    const [descriptionMarkdown, setDescriptionMarkdown] = useState('');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);

    const [lists, setLists] = useState({
        doctors: [], specialties: [], clinics: [],
        prices: [], payments: [], provinces: []
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
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
            } catch {
                toast.error('Failed to load data.');
            }
        };
        fetchAllData();
    }, []);

    const handleSelectDoctor = async (selectedOption) => {
        setSelectedDoctor(selectedOption);
        if (!selectedOption) { clearForm(); return; }

        setIsLoading(true);
        try {
            let res = await getProfileDoctorById(selectedOption.value);
            if (res?.data?.errCode === 0) {
                let data = res.data.data;
                if (data.Markdown) {
                    setDescriptionHTML(data.Markdown.contentHTML || '');
                    setDescriptionMarkdown(data.Markdown.contentMarkdown || '');
                    setDescription(data.Markdown.description || '');
                    setSelectedSpecialty(lists.specialties.find(s => s.value === data.Markdown.specialtyId) || null);
                    setSelectedClinic(lists.clinics.find(c => c.value === data.Markdown.clinicId) || null);
                } else {
                    setDescriptionHTML(''); setDescriptionMarkdown(''); setDescription('');
                    setSelectedSpecialty(null); setSelectedClinic(null);
                }
                if (data.Doctor_Info) {
                    setSelectedPrice(lists.prices.find(p => p.value === data.Doctor_Info.priceId) || null);
                    setSelectedPayment(lists.payments.find(p => p.value === data.Doctor_Info.paymentId) || null);
                    setSelectedProvince(lists.provinces.find(p => p.value === data.Doctor_Info.provinceId) || null);
                    setNote(data.Doctor_Info.note || '');
                } else {
                    setSelectedPrice(null); setSelectedPayment(null); setSelectedProvince(null); setNote('');
                }
                if (data.Markdown || data.Doctor_Info) toast.info('Doctor info loaded.');
            }
        } catch {
            console.error('Error fetching doctor info');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDoctorInfo = async () => {
        if (!selectedDoctor || !descriptionHTML || !selectedPrice || !selectedPayment || !selectedProvince) {
            toast.error('Please fill in all required fields.');
            return;
        }
        const res = await saveDetailDoctorService({
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
        });
        const isSuccess = res?.errCode === 0 || res?.data?.errCode === 0;
        if (isSuccess) toast.success('Doctor info saved successfully.');
        else toast.error('Failed to save info.');
    };

    const clearForm = () => {
        setSelectedDoctor(null); setSelectedPrice(null); setSelectedPayment(null);
        setSelectedProvince(null); setSelectedSpecialty(null); setSelectedClinic(null);
        setDescription(''); setNote(''); setDescriptionHTML(''); setDescriptionMarkdown('');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Doctor Profile Management</h1>
                <p className="text-sm text-gray-500 mt-1">Select a doctor to view and update their profile</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 space-y-6">

                {/* Doctor select + intro */}
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                    <div>
                        <label className={LABEL}>
                            Select Doctor
                            {isLoading && <span className="ml-2 text-blue-500 font-normal animate-pulse">Loading...</span>}
                        </label>
                        <Select value={selectedDoctor} onChange={handleSelectDoctor}
                            options={lists.doctors} placeholder="Type to search..."
                            className="text-sm" isClearable />
                    </div>
                    <div>
                        <label className={LABEL}>Short Introduction</label>
                        <textarea className={INPUT} rows="3" value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Specialist in..." />
                    </div>
                </div>

                {/* Price / Payment / Province */}
                <div className="grid grid-cols-3 gap-6 pb-6 border-b border-gray-100">
                    <div>
                        <label className={LABEL}>Consultation Fee</label>
                        <Select value={selectedPrice} onChange={setSelectedPrice}
                            options={lists.prices} placeholder="Select fee..." className="text-sm" />
                    </div>
                    <div>
                        <label className={LABEL}>Payment Method</label>
                        <Select value={selectedPayment} onChange={setSelectedPayment}
                            options={lists.payments} placeholder="Select method..." className="text-sm" />
                    </div>
                    <div>
                        <label className={LABEL}>Province / City</label>
                        <Select value={selectedProvince} onChange={setSelectedProvince}
                            options={lists.provinces} placeholder="Select province..." className="text-sm" />
                    </div>
                </div>

                {/* Specialty / Clinic / Note */}
                <div className="grid grid-cols-3 gap-6 pb-6 border-b border-gray-100">
                    <div>
                        <label className={LABEL}>Specialty</label>
                        <Select value={selectedSpecialty} onChange={setSelectedSpecialty}
                            options={lists.specialties} placeholder="Select specialty..." className="text-sm" />
                    </div>
                    <div>
                        <label className={LABEL}>Clinic</label>
                        <Select value={selectedClinic} onChange={setSelectedClinic}
                            options={lists.clinics} placeholder="Select clinic..." className="text-sm" />
                    </div>
                    <div>
                        <label className={LABEL}>Additional Note</label>
                        <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                            className={INPUT} placeholder="E.g. No appointments on Sundays" />
                    </div>
                </div>

                {/* Markdown editor */}
                <div>
                    <label className={LABEL + ' mb-2'}>Detailed Profile Article</label>
                    <MdEditor style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={({ html, text }) => { setDescriptionHTML(html); setDescriptionMarkdown(text); }}
                        value={descriptionMarkdown} />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={clearForm}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                        Clear Form
                    </button>
                    <button onClick={handleSaveDoctorInfo}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl active:scale-[0.98] transition-all duration-200 shadow-sm">
                        Save Info
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageDoctor;
