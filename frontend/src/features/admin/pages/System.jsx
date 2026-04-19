import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManage from './UserManage';
import ManageSpecialty from './ManageSpecialty';
import ManageClinic from './ManageClinic';
import ManageDoctor from './ManageDoctor';
import ManageBookingPayment from './ManageBookingPayment';

const System = () => {
    return (
        <div className="system-container">
            <Routes>
                {/* Trang quản lý người dùng dành cho Admin */}
                <Route path="/user-manage" element={<UserManage />} />

                {/* Điều hướng mặc định của hệ thống quản trị */}
                <Route path="/" element={<Navigate to="/system/user-manage" />} />
                {/* Các trang quản lý khác có thể thêm ở đây */}
                <Route path="/specialty-manage" element={<ManageSpecialty />} />
                <Route path="/clinic-manage" element={<ManageClinic />} />
                <Route path="/doctor-manage" element={<ManageDoctor />} />
                <Route path="/payment-manage" element={<ManageBookingPayment />} />
            </Routes>
        </div>
    );
};

export default System;