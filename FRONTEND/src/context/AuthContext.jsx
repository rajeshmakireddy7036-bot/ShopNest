import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedAdmin = localStorage.getItem('adminUser');

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        if (savedAdmin) {
            try {
                setAdminUser(JSON.parse(savedAdmin));
            } catch (e) {
                console.error("Error parsing adminUser from localStorage:", e);
                localStorage.removeItem('adminUser');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (data, role) => {
        const { user, token } = data;
        localStorage.setItem('token', token);

        if (role === 'ADMIN') {
            setAdminUser(user);
            localStorage.setItem('adminUser', JSON.stringify(user));
        } else {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        }
    };

    const logout = (role) => {
        localStorage.removeItem('token');
        if (role === 'ADMIN') {
            setAdminUser(null);
            localStorage.removeItem('adminUser');
        } else {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const getToken = () => localStorage.getItem('token');

    return (
        <AuthContext.Provider value={{ user, adminUser, login, logout, updateUser, getToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
