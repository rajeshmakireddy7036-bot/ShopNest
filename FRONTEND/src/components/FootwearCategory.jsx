import React, { useState, useEffect } from 'react';
import { Filter, ShoppingBag, ShoppingCart, X, ChevronDown, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/QuickViewContext';
import { useNavigate } from 'react-router-dom';

const FootwearCategory = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(2000);
    const [maxPrice, setMaxPrice] = useState(2000); // Track absolute max price
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [sortBy, setSortBy] = useState('newest');

    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { openQuickView } = useQuickView();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, selectedGender, selectedSubCategory, priceRange, selectedSizes, sortBy]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            const footwearOnly = data.filter(p => p.category?.toLowerCase() === 'footwear');

            if (footwearOnly.length > 0) {
                const highestPrice = Math.ceil(Math.max(...footwearOnly.map(p => p.price || 0)));
                setPriceRange(highestPrice || 2000);
                setMaxPrice(highestPrice || 2000);
            }

            setProducts(footwearOnly);
            setFilteredProducts(footwearOnly);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...products];

        // Gender filter - This depends on how data is tagged. 
        // Assuming for now it's either in name or subCategory or just showing all if 'All'
        if (selectedGender !== 'All') {
            result = result.filter(p =>
                p.gender === selectedGender ||
                p.name?.toLowerCase().includes(selectedGender.toLowerCase()) ||
                p.description?.toLowerCase().includes(selectedGender.toLowerCase()) ||
                p.subCategory?.toLowerCase().includes(selectedGender.toLowerCase())
            );
        }

        // Sub-category filter
        if (selectedSubCategory !== 'All') {
            result = result.filter(p => p.subCategory === selectedSubCategory);
        }

        // Price filter
        result = result.filter(p => p.price <= priceRange);

        // Size filter
        if (selectedSizes.length > 0) {
            result = result.filter(p =>
                p.sizes && p.sizes.some(size => selectedSizes.includes(size))
            );
        }

        // Sorting
        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result.reverse();
        }

        setFilteredProducts(result);
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const getSubCategories = () => {
        const base = ['All', 'Sneakers', 'Boots', 'Loafers', 'Formal'];
        if (selectedGender === 'Women') return [...base, 'Heels', 'Sandals'];
        if (selectedGender === 'Men') return base;
        return [...base, 'Heels', 'Sandals'];
    };

    const subCategories = getSubCategories();
    const sizes = ['7', '8', '9', '10', '11'];

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
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop"
                    alt="Premium Footwear"
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
                    <h1 style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '1rem' }}>Footwear</h1>
                    <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Walk with confidence in every step.</p>
                </div>
            </div>

            <div className="section-title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className="section-title" style={{ margin: 0 }}>{selectedGender === 'All' ? 'All' : selectedGender + "'s"} {selectedSubCategory === 'All' ? '' : selectedSubCategory} Footwear</h2>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>{filteredProducts.length} pairs found</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', appearance: 'none' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                    <button
                        className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setShowFilters(!showFilters)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Filter & Sort'}
                    </button>
                </div>
            </div>

            <div className="category-content-wrapper">
                {showFilters && (
                    <div className="admin-card filters-sidebar">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Filters</h3>
                            <button onClick={() => {
                                setSelectedGender('All');
                                setSelectedSubCategory('All');
                                setPriceRange(maxPrice);
                                setSelectedSizes([]);
                                setSortBy('newest');
                            }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}>Reset</button>
                        </div>

                        <div className="filter-group" style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Gender</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {['All', 'Men', 'Women'].map(gender => (
                                    <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={selectedGender === gender}
                                            onChange={() => setSelectedGender(gender)}
                                        />
                                        <span style={{ color: selectedGender === gender ? 'var(--primary)' : 'inherit' }}>{gender}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group" style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Categories</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {subCategories.map(cat => (
                                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="subCategory"
                                            checked={selectedSubCategory === cat}
                                            onChange={() => setSelectedSubCategory(cat)}
                                        />
                                        <span style={{ color: selectedSubCategory === cat ? 'var(--primary)' : 'inherit' }}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>Price</h4>
                                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Up to ₹{priceRange}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={maxPrice}
                                step="1"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>

                        <div className="filter-group">
                            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Sizes</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${selectedSizes.includes(size) ? 'var(--primary)' : '#e5e7eb'}`,
                                            backgroundColor: selectedSizes.includes(size) ? 'var(--primary)' : 'white',
                                            color: selectedSizes.includes(size) ? 'white' : 'var(--text-main)',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        UK {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ flex: 1 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <div className="loading-spinner"></div>
                            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Curating the collection...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-img-container"
                                        style={{ position: 'relative', cursor: 'pointer' }}
                                        onClick={() => navigate(`/product/${product.id}`)}>
                                        <img src={product.imageUrl} alt={product.name} className="product-img" />
                                        <div className="product-actions">
                                            <button
                                                className={`action-btn ${isInWishlist(product.id) ? 'wishlist-active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleWishlist(product);
                                                }}
                                                title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                            >
                                                <Heart size={18} fill={isInWishlist(product.id) ? "#e53e3e" : "none"} />
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
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>
                                        {product.stock < 5 && product.stock > 0 && (
                                            <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#fed7aa', color: '#9a3412', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                Low Stock
                                            </span>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <div className="product-meta">
                                            <h3 className="product-title"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => navigate(`/product/${product.id}`)}>
                                                {product.name}
                                            </h3>
                                            <span className="product-price">₹{product.price}</span>
                                        </div>
                                        <p className="product-category">{product.subCategory || product.category}</p>
                                        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                                            {product.sizes?.map(size => (
                                                <span key={size} style={{ fontSize: '0.7rem', color: '#6b7280', border: '1px solid #e5e7eb', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>UK {size}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                            <ShoppingBag size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151' }}>No matches found</h3>
                            <p style={{ color: '#6b7280' }}>Try adjusting your filters to find your perfect fit.</p>
                            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => {
                                setSelectedGender('All');
                                setSelectedSubCategory('All');
                                setPriceRange(1000);
                                setSelectedSizes([]);
                            }}>Clear All Filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default FootwearCategory;
