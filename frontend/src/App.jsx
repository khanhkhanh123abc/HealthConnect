import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

// Import các Page/Component
import Login from './pages/Login';
// import Home from './pages/Home'; 
// import System from './pages/System';
// import Header from './components/Header/Header';

function App() {
  // Lấy trạng thái đăng nhập từ Redux Slice mới
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Fragment>
      <Router>
        <div className="main-container">
          {/* Hiển thị Header nếu đã đăng nhập thành công */}
          {isLoggedIn && <Header />}

          <span className="content-container">
            <Routes>
              {/* Cấu hình Route theo chuẩn React Router v6 */}
              <Route path="/login" element={
                !isLoggedIn ? <Login /> : <Navigate to="/home" />
              } />

              <Route path="/home" element={
                isLoggedIn ? <Home /> : <Navigate to="/login" />
              } />

              <Route path="/system/*" element={
                isLoggedIn ? <System /> : <Navigate to="/login" />
              } />

              {/* Điều hướng mặc định */}
              <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
          </span>

          {/* Giữ nguyên ToastContainer để thông báo lỗi/thành công */}
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </Fragment>
  );
}

export default App;