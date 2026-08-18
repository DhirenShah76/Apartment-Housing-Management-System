import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="brand">Apartment360</Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <span>Hello, <strong>{user.name}</strong> ({user.role})</span>
                        {user.role === 'Admin' ? (
                            <Link to="/admin">Admin Dashboard</Link>
                        ) : (
                            <Link to="/tenant">Tenant Portal</Link>
                        )}
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;