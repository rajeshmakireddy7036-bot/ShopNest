import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import '../auth.css';

const Login = () => {
    const { login: authLogin } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [role, setRole] = useState('USER'); // USER or ADMIN
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Login failed');
            }

            const data = await response.json();
            const user = data.user;

            // Validate if user belongs to the selected portal
            if (role === 'ADMIN' && user.role !== 'ROLE_ADMIN') {
                throw new Error('Access denied. This account does not have Admin privileges. Please login via the User Portal.');
            }

            if (role === 'USER' && user.role === 'ROLE_ADMIN') {
                throw new Error('This is an Admin account. Please use the Admin Portal for login.');
            }

            authLogin(data, role);

            if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-wrapper ${role === 'ADMIN' ? 'admin-portal-bg' : ''}`} style={{ transition: 'all 0.5s ease' }}>
            <div className={`auth-card ${role === 'ADMIN' ? 'admin-portal-card' : ''}`}>
                <h2 className="auth-title">ShopNest {role === 'ADMIN' ? 'Admin' : ''}</h2>
                <p className="auth-subtitle">Welcome back! Please select your portal</p>

                <div className="role-selector">
                    <button
                        type="button"
                        className={`role-btn ${role === 'USER' ? 'active' : ''}`}
                        onClick={() => setRole('USER')}
                    >
                        User Portal
                    </button>
                    <button
                        type="button"
                        className={`role-btn ${role === 'ADMIN' ? 'active' : ''}`}
                        onClick={() => setRole('ADMIN')}
                    >
                        Admin Portal
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                            {loading ? 'Authenticating...' : `Login to ${role === 'USER' ? 'Shop' : 'Admin Panel'}`}
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/register" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
