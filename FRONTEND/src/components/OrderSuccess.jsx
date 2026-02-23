import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="animate-fadeIn" style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center',
                background: 'var(--card-bg)',
                padding: '4rem 2rem',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#dcfce7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem'
                }}>
                    <CheckCircle size={48} color="#166534" />
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Order Placed!</h1>
                <p style={{ color: 'var(--gray)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                    Your order has been successfully placed. We've sent a confirmation email to your registered address.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => navigate('/', { state: { openOrders: true } })}
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            padding: '1rem'
                        }}
                    >
                        <Package size={20} />
                        View Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-outline"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            padding: '1rem'
                        }}
                    >
                        <ShoppingBag size={20} />
                        Continue Shopping
                    </button>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '2rem',
                    color: 'var(--gray)',
                    fontSize: '0.9rem'
                }}>
                    <p>Need help with your order? <a href="#" style={{ color: 'var(--primary)', fontWeight: '600' }}>Contact Support</a></p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
