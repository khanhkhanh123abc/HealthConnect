import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/System/Login/Login';
import Register from './pages/System/Login/Register';
import Home from './pages/Home';
import System from './pages/System/System';
import Doctor from './pages/Doctor/Doctor';
import DefaultLayout from './layout/DefaultLayout';
import DoctorDetail from './pages/System/Doctor/DoctorDetail';
import MyBookings from './pages/MyBookings';
import ConfirmBooking from './pages/ConfirmBooking';
import BookingPage from './pages/BookingPage';
import PaymentResult from './pages/PaymentResult';

function App() {
  const { isLoggedIn, userInfo } = useSelector((state) => state.user);

  return (
    <Fragment>
      <Router>
        <div className="main-container">
          <main className="content-container">
            <Routes>

              {/* ===== PUBLIC ROUTES ===== */}
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

              {/* 🔥 FIX QUAN TRỌNG */}
              <Route path="/register" element={
                !isLoggedIn ? <Register /> : (
                  <Navigate to="/home" replace />
                )
              } />

              <Route path="/confirm-booking" element={<ConfirmBooking />} />

              <Route path="/booking" element={
                <DefaultLayout><BookingPage /></DefaultLayout>
              } />

              <Route path="/doctor-profile/:id" element={
                <DefaultLayout><DoctorDetail /></DefaultLayout>
              } />

              <Route path="/payment-result" element={<PaymentResult />} />

              {/* ===== PRIVATE ROUTES ===== */}
              <Route path="/my-bookings" element={
                isLoggedIn
                  ? <DefaultLayout><MyBookings /></DefaultLayout>
                  : <Navigate to="/login" replace />
              } />

              <Route path="/system/*" element={
                isLoggedIn && userInfo?.roleId === 'R1'
                  ? <DefaultLayout><System /></DefaultLayout>
                  : <Navigate to="/login" replace />
              } />

              <Route path="/doctor/*" element={
                isLoggedIn && userInfo?.roleId === 'R2'
                  ? <DefaultLayout><Doctor /></DefaultLayout>
                  : <Navigate to="/login" replace />
              } />

              {/* ===== DEFAULT ===== */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />

            </Routes>
          </main>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </Fragment>
  );
}

export default App;