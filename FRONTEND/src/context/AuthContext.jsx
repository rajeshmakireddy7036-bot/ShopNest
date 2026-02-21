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
            }
        }
        if (savedAdmin) {
            try {
                setAdminUser(JSON.parse(savedAdmin));
            } catch (e) {
                console.error("Error parsing adminUser from localStorage:", e);
                localStorage.removeItem('adminUser');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, role) => {
        if (role === 'ADMIN') {
            setAdminUser(userData);
            localStorage.setItem('adminUser', JSON.stringify(userData));
        } else {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    const logout = (role) => {
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

    return (
        <AuthContext.Provider value={{ user, adminUser, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
