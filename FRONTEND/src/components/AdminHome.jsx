import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Users, DollarSign, RotateCcw } from 'lucide-react';

const AdminHome = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        newOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching stats:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleReset = async (type) => {
        if (!window.confirm(`Are you sure you want to reset ${type}? This will delete the corresponding orders.`)) {
            return;
        }

        try {
            const endpoint = type === 'Total Sales' ? '/api/admin/stats/sales' : '/api/admin/stats/orders';
            const res = await fetch(endpoint, { method: 'DELETE' });
            if (res.ok) {
                fetchStats();
            } else {
                alert(`Failed to reset ${type}`);
            }
        } catch (err) {
            console.error(`Error resetting ${type}:`, err);
            alert(`Error resetting ${type}`);
        }
    };

    if (loading) return <div className="admin-content"><div className="loading-spinner"></div></div>;

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Overview</h1>
            </div>

            <div className="stat-grid">
                <StatCard
                    icon={<DollarSign color="#38a169" />}
                    label="Total Sales"
                    value={`$${stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    trend="+12.5%"
                    onReset={() => handleReset('Total Sales')}
                />
                <StatCard
                    icon={<ShoppingCart color="#3182ce" />}
                    label="New Orders"
                    value={stats.newOrders.toString()}
                    trend="+5.2%"
                    onReset={() => handleReset('New Orders')}
                />
                <StatCard
                    icon={<Package color="#d97706" />}
                    label="Products"
                    value={stats.totalProducts.toString()}
                    trend="+2"
                />
                <StatCard
                    icon={<Users color="#805ad5" />}
                    label="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    trend="+8.1%"
                />
            </div>

            <div className="admin-card" style={{ marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity) => (
                            <div key={activity.id} className="activity-item" style={{
                                borderLeft: `4px solid ${activity.status === 'PENDING' ? '#3182ce' : activity.status === 'CANCELLED' ? '#e53e3e' : '#38a169'}`
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        <ShoppingCart size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>New order from {activity.username}</p>
                                        <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>
                                            {activity.items?.length} items • {new Date(activity.orderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 700, color: 'var(--primary)' }}>${activity.totalAmount.toFixed(2)}</p>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '50px',
                                        background: activity.status === 'PENDING' ? '#ebf8ff' : activity.status === 'CANCELLED' ? '#fff5f5' : '#f0fff4',
                                        color: activity.status === 'PENDING' ? '#2b6cb0' : activity.status === 'CANCELLED' ? '#c53030' : '#2f855a',
                                        fontWeight: 700
                                    }}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                            No recent activity to show.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, onReset }) => (
    <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--input-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div>
                <p style={{ color: 'var(--gray)', fontSize: '0.8rem', fontWeight: 600 }}>{label}</p>
                <h2 style={{ fontSize: '1.25rem', margin: '0.1rem 0' }}>{value}</h2>
                <span style={{ color: '#38a169', fontSize: '0.7rem', fontWeight: 700 }}>{trend}</span>
            </div>
        </div>
        {onReset && (
            <button
                onClick={onReset}
                className="reset-btn"
                title={`Reset ${label}`}
                style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--gray)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.color = '#ef4444';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--gray)';
                }}
            >
                <RotateCcw size={16} />
            </button>
        )}
    </div>
);

export default AdminHome;
