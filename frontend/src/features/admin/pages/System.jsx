import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManage from './UserManage';
import ManageSpecialty from './ManageSpecialty';
import ManageClinic from './ManageClinic';
import ManageDoctor from './ManageDoctor';
import ManageSymptomKeyword from './ManageSymptomKeyword';
import AdminDashboard from './AdminDashboard';
import ManageBookingPayment from '../../booking/pages/ManageBookingPayment';

const System = () => {
    return (
        <div className="system-container">
            <Routes>
                <Route path="/" element={<Navigate to="/system/dashboard" />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/user-manage" element={<UserManage />} />
                <Route path="/specialty-manage" element={<ManageSpecialty />} />
                <Route path="/clinic-manage" element={<ManageClinic />} />
                <Route path="/doctor-manage" element={<ManageDoctor />} />
                <Route path="/symptom-keyword-manage" element={<ManageSymptomKeyword />} />
                <Route path="/payment-manage" element={<ManageBookingPayment />} />
            </Routes>
        </div>
    );
};

export default System;
