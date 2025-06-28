// // client/src/components/ProtectedRoutes.js
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = () => {
//     const token = localStorage.getItem('token');
//     return token ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;


    import React from 'react';
    import { Outlet, Navigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';

    const ProtectedRoute = () => {
        const { isLoggedIn, loading } = useAuth();

        if (loading) {
            // You can render a loading spinner or placeholder here
            return <div>Loading authentication...</div>; 
        }

        // If not logged in, redirect to login page
        return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
    };

    export default ProtectedRoute;
    
