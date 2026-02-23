import React, { useEffect } from 'react';
import { Truck, Clock, Globe, ShieldCheck, MapPin, Package, ArrowRight, Search } from 'lucide-react';

const ShippingInfo = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="animate-fadeIn" style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Shipping Information</h1>
                    <p style={{ color: 'var(--gray)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Everything you need to know about how we get your ShopNest favorites from our home to yours.
                    </p>
                </header>

                <div style={{ display: 'grid', gap: '3rem' }}>
                    {/* Delivery Times Section */}
                    <section style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.8rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                                <Clock size={28} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Delivery Estimates</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Standard Shipping</h4>
                                <p style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>3 - 5 Business Days</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)', marginTop: '0.5rem' }}>FREE on all orders</p>
                            </div>
                            <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Express Shipping</h4>
                                <p style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>1 - 2 Business Days</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)', marginTop: '0.5rem' }}>₹15.00 Flat Rate</p>
                            </div>
                            <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Next Day Delivery</h4>
                                <p style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>Next Business Day</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)', marginTop: '0.5rem' }}>₹25.00 Flat Rate</p>
                            </div>
                        </div>
                    </section>

                    {/* Global Coverage */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                                    <Globe size={24} color="#3b82f6" />
                                </div>
                                <h3 style={{ fontWeight: '700' }}>International Shipping</h3>
                            </div>
                            <p style={{ color: 'var(--gray)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on location and customs.
                            </p>
                        </div>

                        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
                                    <ShieldCheck size={24} color="#10b981" />
                                </div>
                                <h3 style={{ fontWeight: '700' }}>Secure Fulfillment</h3>
                            </div>
                            <p style={{ color: 'var(--gray)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                Every order is meticulously packed in sustainable, eco-friendly packaging and treated with the utmost care until it reaches your doorstep.
                            </p>
                        </div>
                    </div>

                    {/* Tracking Section */}
                    <section style={{ background: 'var(--dark)', borderRadius: '24px', padding: '3rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Track Your Order</h2>
                            <p style={{ opacity: 0.8, marginBottom: '2.5rem', maxWidth: '500px' }}>
                                Enter your order number and email to get real-time updates on your shipment's journey.
                            </p>

                            <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '800px' }} onSubmit={(e) => e.preventDefault()}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Package size={14} /> Order Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="SN-12345"
                                        style={{
                                            width: '100%',
                                            padding: '1.1rem 1.5rem',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            background: 'rgba(255,255,255,0.08)',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--primary)';
                                            e.target.style.background = 'rgba(255,255,255,0.12)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                                            e.target.style.background = 'rgba(255,255,255,0.08)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Globe size={14} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        style={{
                                            width: '100%',
                                            padding: '1.1rem 1.5rem',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            background: 'rgba(255,255,255,0.08)',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--primary)';
                                            e.target.style.background = 'rgba(255,255,255,0.12)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                                            e.target.style.background = 'rgba(255,255,255,0.08)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', height: 'fit-content', boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.3)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                                        <Search size={18} /> Track Shipment
                                    </button>
                                </div>
                            </form>
                        </div>
                        <Truck size={200} style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05, transform: 'rotate(-10deg)' }} />
                    </section>

                    {/* FAQ/Policy List */}
                    <div style={{ padding: '1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>Shipping Policies</h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {[
                                { q: "Do you offer free shipping?", a: "Yes, we offer free standard shipping on all orders, with no minimum spend required." },
                                { q: "How do I change my shipping address?", a: "Please contact our support team within 2 hours of placing your order to update your shipping details." },
                                { q: "What should I do if my package is lost?", a: "If your order hasn't arrived within the estimated time, please contact us and we'll launch an investigation with the carrier." }
                            ].map((item, i) => (
                                <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                                    <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <ArrowRight size={16} color="var(--primary)" /> {item.q}
                                    </h4>
                                    <p style={{ color: 'var(--gray)', fontSize: '0.95rem', paddingLeft: '1.5rem' }}>{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer style={{ textAlign: 'center', marginTop: '5rem', padding: '3rem', borderTop: '1px solid var(--border-color)' }}>
                    <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Still have questions about shipping?</p>
                    <button className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        Contact Customer Support <ArrowRight size={18} />
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ShippingInfo;
