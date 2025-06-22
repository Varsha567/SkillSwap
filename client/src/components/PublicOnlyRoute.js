    import React from 'react';
    import { Outlet, Navigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';

    const PublicOnlyRoute = () => {
        const { isLoggedIn, loading } = useAuth();

        if (loading) {
            // You can render a loading spinner or placeholder here
            return <div>Loading authentication...</div>;
        }

        // If logged in, redirect away from public-only routes (e.g., to dashboard)
        return !isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
    };

    export default PublicOnlyRoute;
    