import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('apartment360_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        if (res.data.success) {
            const userData = res.data.data;
            setUser(userData);
            localStorage.setItem('apartment360_user', JSON.stringify(userData));
            return userData;
        }
    };

    const register = async (name, email, password, role, phone) => {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name,
            email,
            password,
            role,
            phone
        });
        if (res.data.success) {
            const userData = res.data.data;
            setUser(userData);
            localStorage.setItem('apartment360_user', JSON.stringify(userData));
            return userData;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('apartment360_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};