import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManage from './UserManage';

const System = () => {
    return (
        <div className="system-container">
            <Routes>
                {/* Trang quản lý người dùng dành cho Admin */}
                <Route path="/user-manage" element={<UserManage />} />

                {/* Điều hướng mặc định của hệ thống quản trị */}
                <Route path="/" element={<Navigate to="/system/user-manage" />} />
            </Routes>
        </div>
    );
};

export default System;