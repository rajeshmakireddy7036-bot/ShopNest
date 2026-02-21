import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

const AdminLogin = () => {
    const { login: authLogin } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Login failed');
            }

            const user = await response.json();

            if (user.role === 'ROLE_ADMIN') {
                authLogin(user, 'ADMIN');
                navigate('/admin/dashboard');
            } else {
                throw new Error('Access denied. This is a User account. Please login via the main ShopNest portal.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper" style={{ backgroundColor: '#1a2233', minHeight: '100vh', marginTop: 0 }}>
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Lock size={32} color="#f59e0b" />
                    </div>
                </div>
                <h2 className="auth-title">Admin Portal</h2>
                <p className="auth-subtitle">Secure access for ShopNest administrators</p>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="admin@shopnest.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
