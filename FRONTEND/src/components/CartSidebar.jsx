import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, addToCart, removeFromCart, updateQuantity, cartCount } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
                <div className="cart-sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <ShoppingBag size={24} color="#f59e0b" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Your Cart ({cartCount})</h2>
                    </div>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items-container">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-view">
                            <ShoppingBag size={64} color="#e5e7eb" style={{ marginBottom: '1.5rem' }} />
                            <h3>Your cart is empty</h3>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                            <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={onClose}>
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={`${item.id}-${item.selectedSize || 'none'}`} className="cart-item">
                                <div className="cart-item-img">
                                    <img src={item.imageUrl} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 className="cart-item-title">{item.name}</h4>
                                        <button className="remove-item-btn" onClick={() => removeFromCart(item.id, item.selectedSize)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="cart-item-category">
                                        {item.category} {item.selectedSize && <span style={{ marginLeft: '0.5rem', padding: '2px 6px', background: 'var(--input-bg)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>Size: {item.selectedSize}</span>}
                                    </p>
                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                                                className="qty-btn"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity || 1}</span>
                                            <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="qty-btn">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="cart-item-price" style={{ fontWeight: '700' }}>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-sidebar-footer">
                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span style={{ fontWeight: '700' }}>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span style={{ color: '#10b981', fontWeight: '600' }}>Free</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary checkout-btn"
                            style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem' }}
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
