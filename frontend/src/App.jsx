import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Sửa lại đường dẫn CSS chuẩn

// Import các Page/Component
import Login from './pages/Login';
import Home from './pages/Home';
import System from './containers/System/System'; // Cập nhật đường dẫn containers
import Header from './containers/Header/Header'; // Cập nhật đường dẫn containers
import DefaultLayout from './containers/DefaultLayout';

function App() {
  // Lấy trạng thái đăng nhập từ Redux
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Fragment>
      <Router>
        <div className="main-container">
          {/* Header sẽ hiện ra ngay khi isLoggedIn là true */}
          {/* {isLoggedIn && <Header />} */}

          <main className="content-container">
            <Routes>
              {/* Login: Nếu đã login thì đá sang /home */}
              <Route path="/login" element={
                !isLoggedIn ? <Login /> : <Navigate to="/home" />
              } />

              {/* Home: Dành cho mọi user đã login */}
              <Route path="/home" element={
                isLoggedIn ? (
                  <DefaultLayout>
                    <Home />
                  </DefaultLayout>
                ) : <Navigate to="/login" />
              } />

              {/* System: Dành cho Admin/Doctor */}
              <Route path="/system/*" element={
                isLoggedIn ? (
                  <DefaultLayout>
                    <System />
                  </DefaultLayout>
                ) : <Navigate to="/login" />
              } />

              {/* Mặc định điều hướng dựa trên trạng thái login */}
              <Route path="/" element={
                isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
              } />
            </Routes>

          </main>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </Fragment>
  );
}

export default App;