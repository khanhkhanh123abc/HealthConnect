import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Home from './pages/Home';
import HomePage from './containers/HomePage/HomePage';
import System from './containers/System/System';
import DefaultLayout from './containers/DefaultLayout';

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Fragment>
      <Router>
        <div className="main-container">
          <main className="content-container">
            <Routes>
              <Route path="/homepage" element={
                  <HomePage />
              } />


              <Route path="/login" element={
                !isLoggedIn ? <Login /> : <Navigate to="/system" />
              } />

              <Route path="/system/*" element={
                isLoggedIn ? (
                  <DefaultLayout>
                    <System />
                  </DefaultLayout>
                ) : <Navigate to="/login" />
              } />

              <Route path="/" element={<Navigate to="/homepage" />} />


              <Route path="*" element={<Navigate to="/homepage" />} />
            </Routes>
          </main>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </Fragment>
  );
}

export default App;