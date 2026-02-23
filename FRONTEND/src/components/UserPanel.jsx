import React, { useState, useEffect } from 'react';
import { X, User, Package, Settings, LogOut, ChevronRight, Mail, Phone, MapPin, Check, Edit2, AtSign, Bell, Shield, CreditCard, Languages, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserPanel = ({ isOpen, onClose, userData, setUserData, onLogout, isDarkMode, setIsDarkMode }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [activeSettingTab, setActiveSettingTab] = useState(null); // To handle sub-views in settings
    const [isEditing, setIsEditing] = useState(false);

    // Settings States
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true
    });
    const [language, setLanguage] = useState('English');
    const [tfaEnabled, setTfaEnabled] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [privacySettings, setPrivacySettings] = useState({
        dataSharing: true,
        personalizedAds: true,
        publicProfile: false
    });
    const [cards, setCards] = useState([
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', name: 'John Doe' }
    ]);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        address: '',
        phone: ''
    });
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleOpenTab = (e) => {
            if (e.detail) {
                setActiveTab(e.detail);
                setActiveSettingTab(null);
            }
        };

        window.addEventListener('open-user-tab', handleOpenTab);
        return () => window.removeEventListener('open-user-tab', handleOpenTab);
    }, []);

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || '',
                username: userData.username || '',
                email: userData.email || '',
                address: userData.address || '123 Fashion Ave, NY 10001',
                phone: userData.phone || '+1 (555) 000-0000'
            });
            if (isOpen) {
                fetchOrders();
            }
        }
    }, [userData, isOpen]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await fetch(`/api/orders/user/${userData.id}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            const response = await fetch(`/api/users/${userData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, ...formData })
            });
            if (!response.ok) throw new Error('Failed to update profile');
            const updatedUser = await response.json();
            setUserData(updatedUser);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch(`/api/users/${userData.id}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to update password');
            }

            alert("Password updated successfully!");
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setActiveSettingTab('privacy');
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAddCard = (e) => {
        e.preventDefault();
        if (!newCard.name || !newCard.number || !newCard.expiry || !newCard.cvv) {
            alert("Please fill in all card details.");
            return;
        }

        const last4 = newCard.number.slice(-4);
        const cardType = newCard.number.startsWith('4') ? 'Visa' : 'Mastercard';

        const newCardObj = {
            id: Date.now(),
            type: cardType,
            last4: last4,
            expiry: newCard.expiry,
            name: newCard.name
        };

        setCards([...cards, newCardObj]);
        setShowAddCard(false);
        setNewCard({ name: '', number: '', expiry: '', cvv: '' });
        alert("Card added successfully!");
    };

    const renderSettingsContent = () => {
        if (!activeSettingTab) {
            return (
                <div className="settings-list animate-fadeIn">
                    <div className="settings-item" onClick={() => setActiveSettingTab('notifications')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Bell size={20} color="var(--primary)" />
                            <span>Notifications</span>
                        </div>
                        <ChevronRight size={18} />
                    </div>
                    <div className="settings-item" onClick={() => setActiveSettingTab('privacy')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Shield size={20} color="var(--primary)" />
                            <span>Privacy & Security</span>
                        </div>
                        <ChevronRight size={18} />
                    </div>
                    <div className="settings-item" onClick={() => setActiveSettingTab('payment')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <CreditCard size={20} color="var(--primary)" />
                            <span>Payment Methods</span>
                        </div>
                        <ChevronRight size={18} />
                    </div>
                    <div className="settings-item" onClick={() => setActiveSettingTab('language')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Languages size={20} color="var(--primary)" />
                            <span>Language ({language})</span>
                        </div>
                        <ChevronRight size={18} />
                    </div>
                    <div className="settings-item" style={{ cursor: 'default' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            {isDarkMode ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--primary)" />}
                            <span>Dark Mode</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isDarkMode}
                                onChange={() => setIsDarkMode(!isDarkMode)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            );
        }

        const renderHeader = (title) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button className="icon-btn" onClick={() => setActiveSettingTab(null)}>
                    <ArrowLeft size={20} />
                </button>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{title}</h3>
            </div>
        );

        switch (activeSettingTab) {
            case 'notifications':
                return (
                    <div className="animate-fadeIn">
                        {renderHeader('Notifications')}
                        <div className="info-card">
                            {Object.entries(notifications).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <label className="switch">
                                        <input type="checkbox" checked={value} onChange={() => toggleNotification(key)} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="animate-fadeIn">
                        {renderHeader('Privacy & Security')}
                        <div className="settings-list">
                            <div className="settings-item" onClick={() => setActiveSettingTab('change-password')}>
                                <span>Change Password</span>
                                <ChevronRight size={16} />
                            </div>
                            <div className="settings-item" onClick={() => setActiveSettingTab('two-factor')}>
                                <span>Two-Factor Auth</span>
                                <span style={{ fontSize: '0.8rem', color: tfaEnabled ? '#10b981' : 'var(--gray)', marginLeft: 'auto', marginRight: '0.5rem' }}>
                                    {tfaEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <ChevronRight size={16} />
                            </div>
                            <div className="settings-item" onClick={() => setActiveSettingTab('data-privacy')}>
                                <span>Data Privacy</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                );
            case 'change-password':
                return (
                    <div className="animate-fadeIn">
                        {renderHeader('Change Password')}
                        <div className="info-card">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    className="edit-input"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    className="edit-input"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    className="edit-input"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1rem' }}
                                onClick={handleChangePassword}
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                );
            case 'two-factor':
                return (
                    <div className="animate-fadeIn">
                        {renderHeader('Two-Factor Authentication')}
                        <div className="info-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <Shield size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ marginBottom: '0.5rem' }}>Secure Your Account</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1.5rem' }}>
                                Add an extra layer of security to your account by requiring more than just a password to log in.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--input-bg)', borderRadius: '12px' }}>
                                <span style={{ fontWeight: '600' }}>2FA Status</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={tfaEnabled}
                                        onChange={() => setTfaEnabled(!tfaEnabled)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'data-privacy':
                return (
                    <div className="animate-fadeIn">
                        {renderHeader('Data Privacy')}
                        <div className="info-card">
                            <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1.5rem' }}>
                                Manage how your data is used and shared within ShopNest.
                            </p>
                            {Object.entries(privacySettings).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={() => setPrivacySettings({ ...privacySettings, [key]: !value })}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            ))}
                            <div style={{ marginTop: '2rem' }}>
                                <button className="btn btn-outline" style={{ width: '100%', color: '#ef4444', borderColor: '#ef4444' }}>
                                    Request Account Deletion
                                </button>
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '0.5rem', textAlign: 'center' }}>
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'payment':
                return (
                    <div className="animate-fadeIn">
                        {renderHeader('Payment Methods')}
                        {showAddCard ? (
                            <div className="info-card animate-fadeIn">
                                <form onSubmit={handleAddCard}>
                                    <div className="form-group">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            className="edit-input"
                                            placeholder="John Doe"
                                            value={newCard.name}
                                            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            className="edit-input"
                                            placeholder="0000 0000 0000 0000"
                                            value={newCard.number}
                                            onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                placeholder="MM/YY"
                                                value={newCard.expiry}
                                                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input
                                                type="password"
                                                className="edit-input"
                                                placeholder="***"
                                                value={newCard.cvv}
                                                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddCard(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Card</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <>
                                {cards.length > 0 ? (
                                    <div className="settings-list">
                                        {cards.map(card => (
                                            <div key={card.id} className="settings-item" style={{ cursor: 'default' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '45px', height: '30px', background: 'var(--input-bg)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', border: '1px solid var(--border-color)' }}>
                                                        {card.type}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>•••• •••• •••• {card.last4}</p>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Expires {card.expiry}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                                                    style={{ background: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600' }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-outline"
                                            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                            onClick={() => setShowAddCard(true)}
                                        >
                                            <CreditCard size={18} /> Add Another Card
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <CreditCard size={40} color="var(--gray)" />
                                        <p>No saved cards found.</p>
                                        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowAddCard(true)}>Add New Card</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            case 'language':
                return (
                    <div className="animate-fadeIn">
                        {renderHeader('Select Language')}
                        <div className="settings-list">
                            {['English', 'Spanish', 'French', 'German', 'Hindi'].map(lang => (
                                <div
                                    key={lang}
                                    className={`settings-item ${language === lang ? 'active-lang' : ''}`}
                                    onClick={() => { setLanguage(lang); setActiveSettingTab(null); }}
                                    style={{ border: language === lang ? '1px solid var(--primary)' : '1px solid var(--border-color)' }}
                                >
                                    <span>{lang}</span>
                                    {language === lang && <Check size={18} color="var(--primary)" />}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-sidebar user-panel" onClick={(e) => e.stopPropagation()}>
                <div className="cart-sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div className="profile-avatar">
                            {userData?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{userData?.fullName || 'User'}</h2>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Member since 2024</p>
                        </div>
                    </div>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="panel-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => { setActiveTab(tab.id); setActiveSettingTab(null); }}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="panel-content">
                    {activeTab === 'profile' && (
                        <div className="tab-section animate-fadeIn">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 className="section-title-small" style={{ margin: 0 }}>Personal Information</h3>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="edit-toggle-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', background: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                ) : (
                                    <button onClick={handleSaveProfile} className="edit-toggle-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', background: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                                        <Check size={16} /> Save
                                    </button>
                                )}
                            </div>

                            <div className="info-card">
                                {isEditing ? (
                                    <div className="edit-form">
                                        <div className="form-group"><label>Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="edit-input" /></div>
                                        <div className="form-group"><label>Username</label><input type="text" name="username" value={formData.username} onChange={handleInputChange} className="edit-input" /></div>
                                        <div className="form-group"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="edit-input" /></div>
                                        <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="edit-input" /></div>
                                        <div className="form-group"><label>Billing Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} className="edit-input" rows="3" /></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="info-item"><User size={16} /><div><label>Full Name</label><p>{userData?.fullName || 'Not specified'}</p></div></div>
                                        <div className="info-item"><AtSign size={16} /><div><label>Username</label><p>{userData?.username || 'user123'}</p></div></div>
                                        <div className="info-item"><Mail size={16} /><div><label>Email Address</label><p>{userData?.email || 'user@example.com'}</p></div></div>
                                        <div className="info-item"><Phone size={16} /><div><label>Phone Number</label><p>{userData?.phone || formData.phone}</p></div></div>
                                        <div className="info-item"><MapPin size={16} /><div><label>Default Address</label><p>{userData?.address || formData.address}</p></div></div>
                                    </>
                                )}
                            </div>
                            {isEditing && <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setIsEditing(false)}>Cancel</button>}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="tab-section animate-fadeIn">
                            <h3 className="section-title-small">Recent Orders</h3>
                            {loadingOrders ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>
                            ) : orders.length > 0 ? (
                                <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {orders.map(order => (
                                        <div key={order.id} className="info-card" style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Order #{order.id?.slice(-8)}</span>
                                                <span className={`status-badge ${order.status?.toLowerCase()}`} style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '20px',
                                                    background: order.status === 'PENDING' ? '#fef3c7' : '#dcfce7',
                                                    color: order.status === 'PENDING' ? '#92400e' : '#166534',
                                                    fontWeight: '600'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '0.8rem' }}>
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </div>
                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                                        <span>{item.productName} x {item.quantity}</span>
                                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                                                <span>Total</span>
                                                <span>₹{order.totalAmount?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Package size={48} color="#e5e7eb" />
                                    <p>You haven't placed any orders yet.</p>
                                    <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Shop Now</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="tab-section">
                            <h3 className="section-title-small">Account Settings</h3>
                            {renderSettingsContent()}
                        </div>
                    )}
                </div>

                <div className="panel-footer">
                    <button className="logout-btn-full" onClick={onLogout}>
                        <LogOut size={18} />
                        <span>Logout from ShopNest</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPanel;
