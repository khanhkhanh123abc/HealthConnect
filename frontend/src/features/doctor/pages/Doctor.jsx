import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManageSchedule from './ManageSchedule';
import ManagePatient from './ManagePatient';
import DoctorDashboard from './DoctorDashboard';

const Doctor = () => {
    return (
        <div className="doctor-container">
            <Routes>
                <Route path="/" element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="manage-schedule" element={<ManageSchedule />} />
                <Route path="manage-patient" element={<ManagePatient />} />
            </Routes>
        </div>
    );
};

export default Doctor;