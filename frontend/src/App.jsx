import React, { Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <Fragment>
            <Router>
                <div className="main-container">
                    <main className="content-container">
                        <AppRoutes />
                    </main>
                    <ToastContainer position="bottom-right" autoClose={3000} />
                </div>
            </Router>
        </Fragment>
    );
}

export default App;
