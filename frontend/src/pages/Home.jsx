import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const userInfo = useSelector(state => state.user.userInfo);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
            <h1 className="text-4xl font-bold text-indigo-600 mb-4">
                Welcome to Health Connect!
            </h1>
            <p className="text-lg text-gray-600">
                Hello, <span className="font-bold">{userInfo?.firstName} {userInfo?.lastName}</span>.
            </p>
            <p className="mt-2 text-sm text-gray-500 italic">
                You are logged in as:
                <span className="text-indigo-500 font-semibold ml-1">
                    {userInfo?.roleId === 'ADMIN' ? 'Administrator' : (userInfo?.roleId === 'DOCTOR' ? 'Doctor' : 'Patient')}
                </span>
            </p>

            <div className="mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-md text-center">
                <h3 className="font-bold text-gray-800">Quick Start</h3>
                <p className="text-sm text-gray-600 mt-2">
                    Use the navigation bar above to manage users, clinics, or your medical schedule.
                </p>
            </div>
        </div>
    );
};

export default Home;