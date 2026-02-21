import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, ShoppingBag, Menu, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../admin.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { adminUser, logout, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !adminUser) {
            navigate('/login');
        }
    }, [adminUser, loading, navigate]);

    const handleLogout = () => {
        logout('ADMIN');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <button className="admin-mobile-toggle" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
            </button>

            <div className={`admin-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

            <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className="admin-logo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShoppingBag size={24} color="#f59e0b" />
                        <span>ShopNest Admin</span>
                    </div>
                    <button className="admin-close-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} end onClick={() => setIsSidebarOpen(false)}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setIsSidebarOpen(false)}>
                        <Package size={20} /> Products
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setIsSidebarOpen(false)}>
                        <ShoppingCart size={20} /> Orders
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setIsSidebarOpen(false)}>
                        <Users size={20} /> Users
                    </NavLink>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div className="admin-nav-item" onClick={handleLogout} style={{ color: '#fc8181' }}>
                        <LogOut size={20} /> Logout
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
