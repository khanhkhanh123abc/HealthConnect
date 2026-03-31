import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/System/Login/Login';
import Home from './pages/Home';
import System from './pages/System/System';
import Doctor from './pages/Doctor/Doctor';
import DefaultLayout from './layout/DefaultLayout';
import DoctorDetail from './pages/System/Doctor/DoctorDetail';

function App() {
  const { isLoggedIn, userInfo } = useSelector((state) => state.user);

  return (
    <Fragment>
      <Router>
        <div className="main-container">
          <main className="content-container">
            <Routes>

              {/* HOME */}
              <Route path="/home" element={<Home />} />

              {/* W8: TRANG CHI TIẾT BÁC SĨ (Public - ai cũng xem được) */}
              <Route
                path="/doctor-profile/:id"
                element={
                  <DefaultLayout>
                    <DoctorDetail />
                  </DefaultLayout>
                }
              />

              {/* LOGIN */}
              <Route
                path="/login"
                element={
                  !isLoggedIn ? (
                    <Login />
                  ) : (
                    <Navigate
                      to={
                        userInfo?.roleId === 'R1'
                          ? '/system'
                          : userInfo?.roleId === 'R2'
                            ? '/doctor'
                            : '/home'
                      }
                    />
                  )
                }
              />

              {/* ADMIN ROUTES */}
              <Route
                path="/system/*"
                element={
                  isLoggedIn && userInfo?.roleId === 'R1' ? (
                    <DefaultLayout>
                      <System />
                    </DefaultLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* DOCTOR ROUTES */}
              <Route
                path="/doctor/*"
                element={
                  isLoggedIn && userInfo?.roleId === 'R2' ? (
                    <DefaultLayout>
                      <Doctor />
                    </DefaultLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* DEFAULT */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="*" element={<Navigate to="/home" />} />

            </Routes>
          </main>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </Fragment>
  );
}

export default App;