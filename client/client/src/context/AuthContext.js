import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // You might need this if you want to decode JWTs on the client

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // Stores full user object from backend
    const [loading, setLoading] = useState(true); // To indicate if initial check is done
    const navigate = useNavigate();

    const checkAuth = useCallback(async () => {
        console.log('AuthContext: checkAuth called - Re-evaluating auth state...');
        setLoading(true);
        const token = localStorage.getItem('token');
        const userDataString = localStorage.getItem('user');

        if (token && userDataString) {
            try {
                const parsedUserData = JSON.parse(userDataString);
                if (parsedUserData && (parsedUserData._id || parsedUserData.id)) {
                    setUser(parsedUserData);
                    setIsLoggedIn(true);
                    console.log('AuthContext: Session found. User:', parsedUserData.username || parsedUserData.email || parsedUserData._id);
                } else {
                    console.log('AuthContext: Invalid user data in localStorage, clearing session.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("AuthContext: Error parsing user data from localStorage:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                setUser(null);
            }
        } else {
            console.log('AuthContext: No valid session data in localStorage.');
            setIsLoggedIn(false);
            setUser(null);
        }
        setLoading(false);
        // FIX: Removed isLoggedIn from this console.log to avoid ESLint warning
        // It's logging the value from the closure, which can be stale after state updates within the same function run.
        console.log('AuthContext: checkAuth finished. Current session status determined.'); 
    }, []); 

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback((token, userData) => {
        console.log('AuthContext: Login function called. User data received:', userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUser(userData);
        console.log('AuthContext: State updated: isLoggedIn=true, user=', userData.username || userData.email || 'N/A');
    }, []); 

    const logout = useCallback(() => {
        console.log('AuthContext: Logout function called.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        console.log('AuthContext: State updated: isLoggedIn=false, user=null');
        navigate('/login', { replace: true });
    }, [navigate]); 

    const authContextValue = {
        isLoggedIn,
        user,
        loading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
