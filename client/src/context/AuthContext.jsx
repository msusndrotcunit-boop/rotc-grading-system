import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            const cadetId = localStorage.getItem('cadetId');
            if (token) {
                setUser({ token, role, cadetId });
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = useCallback(async (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        if (userData.cadetId) localStorage.setItem('cadetId', userData.cadetId);
        
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }, []);

    const logout = useCallback(async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('cadetId');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    const value = useMemo(() => ({ user, login, logout, loading }), [user, login, logout, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
