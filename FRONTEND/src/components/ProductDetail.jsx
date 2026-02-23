import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, Heart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [zoomedImg, setZoomedImg] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            setProduct(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching product:", err);
            setLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Product not found.</div>;

    const allImages = product.images && product.images.length > 0
        ? [product.imageUrl, ...product.images.filter(img => img !== product.imageUrl)]
        : [product.imageUrl];

    return (
        <div className="container animate-fadeIn product-detail-container">
            <button
                onClick={() => navigate(-1)}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.transform = 'translateX(0)';
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    padding: '15px 0 5px 0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <ArrowLeft size={18} /> Back to Shop
            </button>

            <div className="product-detail-grid">
                {/* Image Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'var(--input-bg)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                        position: 'relative',
                        aspectRatio: '1/1',
                        width: '100%'
                    }}>
                        {/* Swipeable Container */}
                        <div style={{
                            display: 'flex',
                            overflowX: 'auto',
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                            height: '100%'
                        }} className="image-swipe-container" onScroll={(e) => {
                            const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
                            if (index !== activeImg) setActiveImg(index);
                        }}>
                            {allImages.map((img, idx) => (
                                <div key={idx} style={{
                                    flex: '0 0 100%',
                                    scrollSnapAlign: 'start',
                                    height: '100%',
                                    cursor: 'zoom-in'
                                }} onClick={() => setZoomedImg(img)}>
                                    <img
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Indicators */}
                        {allImages.length > 1 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '1rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: '0.5rem',
                                zIndex: 5
                            }}>
                                {allImages.map((_, idx) => (
                                    <div key={idx} style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: activeImg === idx ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                                        transition: 'all 0.3s'
                                    }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {allImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setActiveImg(idx);
                                        const container = document.querySelector('.image-swipe-container');
                                        if (container) container.scrollTo({ left: idx * container.offsetWidth, behavior: 'smooth' });
                                    }}
                                    style={{
                                        width: '55px',
                                        height: '55px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: `2px solid ${activeImg === idx ? 'var(--primary)' : 'transparent'}`,
                                        opacity: activeImg === idx ? 1 : 0.6,
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="product-info-section">
                    <div>
                        <span style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '3px 10px',
                            borderRadius: '50px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            {product.category} {product.gender && `• ${product.gender}`}
                        </span>
                        <h1 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: '0.3rem', color: 'var(--text-main)' }}>
                            {product.name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={15} fill={i < 4 ? "var(--primary)" : "none"} color="var(--primary)" />
                            ))}
                            <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>(4.8 / 5.0)</span>
                        </div>
                    </div>

                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>
                        ₹{product.price}
                    </div>

                    <p style={{ color: 'var(--gray)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        Premium {product.name} from our {product.category} collection.
                        Designed for maximum style and everyday comfort.
                    </p>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div style={{ padding: '0.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>Select Size</label>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>Size Guide</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '10px',
                                            border: '1px solid',
                                            borderColor: selectedSize === size ? 'var(--primary)' : 'var(--border-color)',
                                            background: selectedSize === size ? 'var(--primary)' : 'var(--input-bg)',
                                            color: selectedSize === size ? 'white' : 'var(--text-main)',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            minWidth: '45px'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="product-detail-actions">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.8rem' }}
                            onClick={() => {
                                if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                                    alert("Please select a size first!");
                                    return;
                                }
                                for (let i = 0; i < quantity; i++) {
                                    addToCart({ ...product, selectedSize });
                                }
                                alert("Added to cart!");
                            }}
                        >
                            <ShoppingCart size={18} /> Add to Cart
                        </button>
                        <button
                            className="wishlist-detail-btn"
                            onClick={() => toggleWishlist(product)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                border: '1px solid var(--border-color)',
                                background: isInWishlist(product.id) ? '#fff5f5' : 'var(--input-bg)',
                                color: isInWishlist(product.id) ? '#e53e3e' : 'var(--gray)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <Heart size={20} fill={isInWishlist(product.id) ? "#e53e3e" : "none"} />
                        </button>
                    </div>

                    <div className="product-features-grid">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '10px', background: 'var(--card-bg)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <ShieldCheck size={20} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>2 Year Warranty</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--gray)' }}>Full protection</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '10px', background: 'var(--card-bg)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <Truck size={20} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>Free Shipping</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--gray)' }}>On orders +₹100</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Zoomed Image Modal */}
            {zoomedImg && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.9)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        cursor: 'zoom-out'
                    }}
                    onClick={() => setZoomedImg(null)}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 2001
                        }}
                        onClick={(e) => { e.stopPropagation(); setZoomedImg(null); }}
                    >
                        <X size={24} color="black" />
                    </button>
                    <img
                        src={zoomedImg}
                        alt="Zoomed"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
