import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ShoppingBag, ShoppingCart, Search, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/QuickViewContext';

const AllCategories = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, products]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
            setFilteredProducts(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))].filter(cat =>
        !['footwear', 'accessories'].includes(cat?.toLowerCase())
    );

    return (
        <div className="category-page container">
            <div className="category-hero" style={{
                height: '40vh',
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '2.4rem',
                marginTop: '1.4rem'
            }}>
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
                    alt="All Collections"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '1rem' }}>Our Collections</h1>
                    <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Explore everything ShopNest has to offer.</p>
                </div>
            </div>

            <div className="filters-section" style={{
                marginBottom: '3rem',
                padding: '1.5rem',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '20px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '0.6rem 1.5rem', borderRadius: '50px' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button
                            onClick={() => setSelectedCategory('Footwear')}
                            className={`btn ${selectedCategory?.toLowerCase() === 'footwear' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.6rem 1.5rem', borderRadius: '50px' }}
                        >
                            Footwear
                        </button>
                        <button
                            onClick={() => setSelectedCategory('Accessories')}
                            className={`btn ${selectedCategory?.toLowerCase() === 'accessories' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.6rem 1.5rem', borderRadius: '50px' }}
                        >
                            Accessories
                        </button>
                    </div>
                </div>
            </div>

            <div className="section-title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className="section-title" style={{ margin: 0 }}>{selectedCategory} Products</h2>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>{filteredProducts.length} products found</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#6b7280' }}>Curating the collection...</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <ProductCardInline key={product.id} product={product} addToCart={addToCart} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <ShoppingBag size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-main)' }}>No products found</h3>
                    <p style={{ color: 'var(--gray)' }}>Try adjusting your search or category filters.</p>
                </div>
            )}
        </div>
    );
};

// Internal reusable ProductCard
const ProductCardInline = ({ product, addToCart }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { openQuickView } = useQuickView();
    const navigate = useNavigate();
    const [activeImg, setActiveImg] = useState(0);
    const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
    return (
        <div className="product-card">
            <div className="product-img-container" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    height: '100%'
                }} onScroll={(e) => {
                    const box = e.target;
                    const index = Math.round(box.scrollLeft / box.offsetWidth);
                    if (index !== activeImg && index < allImages.length) setActiveImg(index);
                }}>
                    {allImages.map((img, idx) => (
                        <div key={idx} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', height: '100%' }}>
                            <img
                                src={img}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />
                        </div>
                    ))}
                </div>
                {allImages.length > 1 && (
                    <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '3px',
                        zIndex: 5
                    }}>
                        {allImages.map((_, idx) => (
                            <div key={idx} style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                background: activeImg === idx ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.3s'
                            }} />
                        ))}
                    </div>
                )}

                <div className="product-actions" style={{ top: '5px', right: '5px' }}>
                    <button
                        className={`action-btn ${isInWishlist(product.id) ? 'wishlist-active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        style={{ width: '36px', height: '36px' }}
                    >
                        <Heart size={20} fill={isInWishlist(product.id) ? "#e53e3e" : "none"} />
                    </button>
                    <button
                        className="action-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (product.sizes && product.sizes.length > 0) {
                                openQuickView(product);
                            } else {
                                addToCart(product);
                            }
                        }}
                        style={{ width: '36px', height: '36px' }}
                        title="Add to Cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
            <div className="product-info">
                <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                <div className="product-meta">
                    <span className="product-price">₹{product.price}</span>
                    <p className="product-category">{product.category}</p>
                </div>
            </div>
        </div>
    );
};

export default AllCategories;
