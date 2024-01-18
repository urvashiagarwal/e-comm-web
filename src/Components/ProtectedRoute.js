// ProtectedRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const loginUser = localStorage.getItem('authToken');

        if (!loginUser) {
            navigate('/');
        }
    }, [navigate]);

    return <>{children}</>;
};

export default ProtectedRoute;
