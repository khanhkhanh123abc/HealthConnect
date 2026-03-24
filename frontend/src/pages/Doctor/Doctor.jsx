import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManageSchedule from './ManageSchedule';
import ManagePatient from './ManagePatient';

const Doctor = () => {
    return (
        <div className="doctor-container">
            <Routes>
                <Route path="manage-schedule" element={<ManageSchedule />} />
                <Route path="manage-patient" element={<ManagePatient />} />

                {/* Default route */}
                <Route path="/" element={<Navigate to="manage-schedule" />} />
            </Routes>
        </div>
    );
};

export default Doctor;