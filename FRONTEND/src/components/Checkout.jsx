import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartCount, clearCart } = useCart();
    const { user: userData } = useAuth();
    const navigate = useNavigate();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData) {
            alert("Please login to place an order");
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        const orderData = {
            userId: userData.id,
            username: userData.username,
            items: cartItems.map(item => ({
                productId: item.id,
                productName: item.name,
                quantity: item.quantity || 1,
                price: item.price,
                size: item.selectedSize || 'N/A'
            })),
            totalAmount: subtotal,
            status: 'PENDING'
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) throw new Error('Failed to place order');

            setIsProcessing(false);
            alert("Order placed successfully! Thank you for shopping with ShopNest.");
            clearCart();
            navigate('/');
        } catch (error) {
            console.error('Checkout error:', error);
            alert("There was an error placing your order. Please try again.");
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <ShoppingBag size={64} color="var(--gray)" style={{ marginBottom: '2rem' }} />
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Add some items to your cart before checking out.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Shop</button>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn checkout-container">
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--gray)',
                    marginBottom: '2rem'
                }}
            >
                <ArrowLeft size={18} /> Back to Cart
            </button>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2.5rem' }}>Checkout</h1>

            <div className="checkout-grid">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="checkout-form">

                    {/* Shipping Section */}
                    <div style={{ background: 'var(--card-bg)', padding: '0', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <Truck size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Shipping Information</h2>
                        </div>

                        <div className="grid-2">
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Email Address</label>
                                <input type="email" name="email" required className="auth-input" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>First Name</label>
                                <input type="text" name="firstName" required className="auth-input" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Last Name</label>
                                <input type="text" name="lastName" required className="auth-input" onChange={handleInputChange} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Street Address</label>
                                <input type="text" name="address" required className="auth-input" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>City</label>
                                <input type="text" name="city" required className="auth-input" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Zip Code</label>
                                <input type="text" name="zipCode" required className="auth-input" onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div style={{ background: 'var(--card-bg)', padding: '0', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <CreditCard size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Payment Method</h2>
                        </div>

                        <div className="grid-2">
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Card Number</label>
                                <input type="text" name="cardNumber" maxLength="19" placeholder="0000 0000 0000 0000" required className="auth-input" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Expiry Date</label>
                                <input type="text" name="expiry" placeholder="MM/YY" required className="auth-input" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>CVV</label>
                                <input type="text" name="cvv" placeholder="123" required className="auth-input" onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : `Place Order • $${subtotal.toFixed(2)}`}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: 'var(--gray)', fontSize: '0.9rem' }}>
                        <ShieldCheck size={18} color="#10b981" />
                        Secure Checkout Powered by Stripe
                    </div>
                </form>

                {/* Summary Section */}
                <div className="checkout-summary">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        Order Summary ({cartCount})
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                        {cartItems.map(item => (
                            <div key={`${item.id}-${item.selectedSize || 'none'}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray)', fontSize: '0.85rem' }}>
                                        <span>Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}</span>
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray)', fontSize: '0.95rem' }}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray)', fontSize: '0.95rem' }}>
                            <span>Shipping</span>
                            <span style={{ color: '#10b981', fontWeight: '600' }}>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '700', marginTop: '0.5rem' }}>
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
