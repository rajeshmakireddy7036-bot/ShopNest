import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, Trash2, User as UserIcon, UserPlus, X, Eye, EyeOff } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetchWithAuth('/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminFormChange = (e) => {
        const { name, value } = e.target;
        setAdminFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitAdmin = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setFormLoading(true);

        try {
            const res = await fetchWithAuth('/api/admin/register-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adminFormData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to register admin');
            }

            setFormSuccess('Admin registered successfully!');
            setAdminFormData({ username: '', fullName: '', email: '', password: '' });
            fetchUsers();
            setTimeout(() => setShowAdminForm(false), 2000);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="admin-content">
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>User Management</h1>
                    <p style={{ color: '#718096' }}>View and manage registered accounts</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAdminForm(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <UserPlus size={18} />
                    Add Admin
                </button>
            </div>

            {/* Admin Registration Modal */}
            {showAdminForm && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="admin-card" style={{ width: '450px', position: 'relative', padding: '2rem' }}>
                        <button
                            onClick={() => setShowAdminForm(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#718096' }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={24} color="#4f46e5" />
                            Register New Admin
                        </h2>
                        <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Create a new administrator account with full access.</p>

                        {formError && <div style={{ background: '#fff5f5', color: '#c53030', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #feb2b2' }}>{formError}</div>}
                        {formSuccess && <div style={{ background: '#f0fff4', color: '#2f855a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #9ae6b4' }}>{formSuccess}</div>}

                        <form onSubmit={handleSubmitAdmin}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={adminFormData.username}
                                    onChange={handleAdminFormChange}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={adminFormData.fullName}
                                    onChange={handleAdminFormChange}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={adminFormData.email}
                                    onChange={handleAdminFormChange}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={adminFormData.password}
                                        onChange={handleAdminFormChange}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#718096' }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={formLoading}
                                style={{ width: '100%', padding: '0.75rem' }}
                            >
                                {formLoading ? 'Creating Admin...' : 'Create Admin Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="admin-card">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    {/* <th>Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: user.role === 'ROLE_ADMIN' ? '#fef3c7' : '#f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <UserIcon size={16} color={user.role === 'ROLE_ADMIN' ? '#d97706' : '#64748b'} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{user.fullName || 'No Name'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
                                                <Mail size={14} />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-user'}`} style={{
                                                padding: '0.25rem 0.6rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                background: user.role === 'ROLE_ADMIN' ? '#fef3c7' : '#f1f5f9',
                                                color: user.role === 'ROLE_ADMIN' ? '#92400e' : '#475569',
                                                textTransform: 'uppercase'
                                            }}>
                                                {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38a169', fontSize: '0.85rem' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38a169' }}></div>
                                                Active
                                            </div>
                                        </td>
                                        {/* <td>
                                            <button className="icon-btn" title="Delete User"><Trash2 size={16} color="#e53e3e" /></button>
                                        </td> */}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
