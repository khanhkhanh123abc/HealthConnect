import axios from '../../../app/axios';

export const getAllClinicsService = () => axios.get('/api/get-all-clinic');
export const getClinicByIdService = (id) => axios.get(`/api/get-clinic-by-id?id=${id}`);
export const getDoctorsByClinicService = (clinicId) => axios.get(`/api/get-doctors-by-clinic-id?clinicId=${clinicId}`);
