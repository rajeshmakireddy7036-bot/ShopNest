import React, { useState, useEffect } from 'react';
import { Package, Truck, Check } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetchWithAuth('/api/admin/orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetchWithAuth(`/api/admin/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify(status)
            });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Order Management</h1>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td><span style={{ fontSize: '0.8rem', color: '#718096' }}>#{order.id.substring(18)}</span></td>
                                    <td>{order.username}</td>
                                    <td>₹{order.totalAmount}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'pending'}`}>
                                            {order.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button onClick={() => updateStatus(order.id, 'SHIPPED')} className="icon-btn" title="Mark as Shipped"><Truck size={16} color="#3182ce" /></button>
                                            <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="icon-btn" title="Mark as Delivered"><Check size={16} color="#38a169" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
