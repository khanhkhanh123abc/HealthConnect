import React from 'react';
import Header from './Header/Header'; // Đã chuyển vào containers

const DefaultLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header luôn cố định ở trên cùng */}
            <Header />
            
            {/* Nội dung các trang sẽ thay đổi tại đây */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default DefaultLayout;