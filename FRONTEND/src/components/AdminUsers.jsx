import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, Trash2, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>User Management</h1>
                <p style={{ color: '#718096' }}>View and manage registered accounts</p>
            </div>

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
