import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'Tenant'
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const newUser = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.role,
                formData.phone
            );
            navigate(newUser.role === 'Admin' ? '/admin' : '/tenant');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="auth-card">
            <h2>Create Account</h2>
            {error && <div className="alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 555-0199"
                    />
                </div>
                <div className="form-group">
                    <label>Account Type (Role)</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="Tenant">Tenant (Resident)</option>
                        <option value="Admin">Property Manager (Admin)</option>
                    </select>
                </div>
                <button type="submit" className="btn">Register</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                Already registered? <Link to="/login">Sign In</Link>
            </p>
        </div>
    );
};

export default Register;