import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import DefaultLayout from '../layouts/DefaultLayout';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Home from '../features/home/pages/Home';
import System from '../features/admin/pages/System';
import Doctor from '../features/doctor/pages/Doctor';
import DoctorDetail from '../features/doctor/pages/DoctorDetail';
import MyBookings from '../features/booking/pages/MyBookings';
import ConfirmBooking from '../features/booking/pages/ConfirmBooking';
import BookingPage from '../features/booking/pages/BookingPage';
import PaymentResult from '../features/booking/pages/PaymentResult';
import ClinicDetail from '../features/clinic/pages/ClinicDetail';

const AppRoutes = () => {
    const { isLoggedIn, userInfo } = useSelector((state) => state.user);

    return (
        <Routes>
            {/* ===== PUBLIC ===== */}
            <Route path="/home" element={<Home />} />

            <Route path="/login" element={
                !isLoggedIn ? <Login /> : (
                    <Navigate to={
                        userInfo?.roleId === 'R1' ? '/system'
                        : userInfo?.roleId === 'R2' ? '/doctor'
                        : '/home'
                    } replace />
                )
            } />

            <Route path="/register" element={
                !isLoggedIn ? <Register /> : <Navigate to="/home" replace />
            } />

            <Route path="/confirm-booking" element={<ConfirmBooking />} />
            <Route path="/booking" element={<DefaultLayout><BookingPage /></DefaultLayout>} />
            <Route path="/doctor-profile/:id" element={<DefaultLayout><DoctorDetail /></DefaultLayout>} />
            <Route path="/clinic/:id" element={<ClinicDetail />} />
            <Route path="/payment-result" element={<PaymentResult />} />

            {/* ===== PRIVATE ===== */}
            <Route path="/my-bookings" element={
                <PrivateRoute><DefaultLayout><MyBookings /></DefaultLayout></PrivateRoute>
            } />

            <Route path="/system/*" element={
                <RoleRoute role="R1"><DefaultLayout><System /></DefaultLayout></RoleRoute>
            } />

            <Route path="/doctor/*" element={
                <RoleRoute role="R2"><DefaultLayout><Doctor /></DefaultLayout></RoleRoute>
            } />

            {/* ===== DEFAULT ===== */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
};

export default AppRoutes;
