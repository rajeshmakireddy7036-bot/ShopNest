import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', subCategory: '', gender: '', sizes: [], imageUrl: '', images: [], stock: ''
    });

    // Filter states
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [genderFilter, setGenderFilter] = useState('All');
    const [subCategoryFilter, setSubCategoryFilter] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetchWithAuth('/api/admin/products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure imageUrl is set to the first image if it's empty
        const finalData = { ...formData };
        if (!finalData.imageUrl && finalData.images.length > 0) {
            finalData.imageUrl = finalData.images[0];
        }

        const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            await fetchWithAuth(url, {
                method,
                body: JSON.stringify(finalData)
            });
            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', subCategory: '', gender: '', sizes: [], imageUrl: '', images: [], stock: '' });
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            ...product,
            sizes: product.sizes || [],
            images: product.images || [],
            gender: product.gender || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            await fetchWithAuth(`/api/admin/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

    return (
        <div className="admin-content">
            <div className="admin-header product-admin-header">
                <h1>Product Management</h1>
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> <span className="hide-mobile">Add Product</span><span className="show-mobile">Add</span>
                </button>
            </div>

            {/* Filters Section */}
            <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div className="admin-filters">
                    <div className="admin-filter-group">
                        <label>Category:</label>
                        <select
                            className="form-control"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div className="admin-filter-group">
                        <label>Gender:</label>
                        <select
                            className="form-control"
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                        </select>
                    </div>

                    <div className="admin-filter-group">
                        <label>Sub-Category:</label>
                        <select
                            className="form-control"
                            value={subCategoryFilter}
                            onChange={(e) => setSubCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Sub-Categories</option>
                            {categoryFilter === 'Men' && (
                                <>
                                    <option value="Shirts">Shirts</option>
                                    <option value="Pants">Pants</option>
                                    <option value="Hoodies">Hoodies</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Watches">Watches</option>
                                </>
                            )}
                            {categoryFilter === 'Women' && (
                                <>
                                    <option value="Dresses">Dresses</option>
                                    <option value="Tops">Tops</option>
                                    <option value="Bottoms">Bottoms</option>
                                    <option value="Skirts">Skirts</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Watches">Watches</option>
                                </>
                            )}
                            {categoryFilter === 'Footwear' && (
                                <>
                                    <option value="Sneakers">Sneakers</option>
                                    <option value="Boots">Boots</option>
                                    <option value="Loafers">Loafers</option>
                                    <option value="Formal">Formal</option>
                                </>
                            )}
                            {categoryFilter === 'Accessories' && (
                                <>
                                    {genderFilter === 'Men' && (
                                        <>
                                            <option value="Rings">Rings</option>
                                            <option value="Chains">Chains</option>
                                            <option value="Belts">Belts</option>
                                        </>
                                    )}
                                    {genderFilter === 'Women' && (
                                        <>
                                            <option value="Earrings">Earrings</option>
                                            <option value="Bangles">Bangles</option>
                                            <option value="Necklace">Necklace</option>
                                            <option value="Bags">Bags</option>
                                            <option value="Rings">Rings</option>
                                            <option value="Chains">Chains</option>
                                        </>
                                    )}
                                    {genderFilter === 'All' && (
                                        <>
                                            <option value="Earrings">Earrings</option>
                                            <option value="Bangles">Bangles</option>
                                            <option value="Necklace">Necklace</option>
                                            <option value="Bags">Bags</option>
                                            <option value="Rings">Rings</option>
                                            <option value="Chains">Chains</option>
                                            <option value="Belts">Belts</option>
                                        </>
                                    )}
                                </>
                            )}
                            {categoryFilter === 'All' && (
                                <>
                                    <option value="Watches">Watches</option>
                                    <option value="Pants">Pants</option>
                                    <option value="Shirts">Shirts</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Hoodies">Hoodies</option>
                                    <option value="Dresses">Dresses</option>
                                    <option value="Sneakers">Sneakers</option>
                                    <option value="Bags">Bags</option>
                                </>
                            )}
                        </select>
                    </div>

                    {(categoryFilter !== 'All' || genderFilter !== 'All' || subCategoryFilter !== 'All') && (
                        <button
                            onClick={() => { setCategoryFilter('All'); setGenderFilter('All'); setSubCategoryFilter('All'); }}
                            className="clear-filters-btn"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Gender</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products
                                .filter(product => {
                                    const matchCat = categoryFilter === 'All' || product.category === categoryFilter;
                                    const matchGender = genderFilter === 'All' || product.gender === genderFilter;
                                    const matchSub = subCategoryFilter === 'All' || product.subCategory === subCategoryFilter;
                                    return matchCat && matchGender && matchSub;
                                })
                                .map(product => (
                                    <tr key={product.id}>
                                        <td><img src={product.imageUrl} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} alt="" /></td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.gender || 'N/A'}</td>
                                        <td>₹{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button onClick={() => handleEdit(product)} className="icon-btn" title="Edit"><Edit size={16} color="#4a5568" /></button>
                                                <button onClick={() => handleDelete(product.id)} className="icon-btn" title="Delete"><Trash2 size={16} color="#e53e3e" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="product-form-card">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '2rem' }}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Price</label>
                                    <input type="number" step="0.01" className="form-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input type="number" className="form-input" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                                </div>
                            </div>
                            <div className="grid-3">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value, gender: '', subCategory: '' })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Footwear">Footwear</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender / Collection</label>
                                    <select
                                        className="form-input"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        required={formData.category === 'Footwear'}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Sub-Category</label>
                                    <select
                                        className="form-input"
                                        value={formData.subCategory}
                                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Sub-Category</option>
                                        {formData.category === 'Men' && (
                                            <>
                                                <option value="Shirts">Shirts</option>
                                                <option value="Pants">Pants</option>
                                                <option value="Hoodies">Hoodies</option>
                                                <option value="Jackets">Jackets</option>
                                                <option value="Watches">Watches</option>
                                            </>
                                        )}
                                        {formData.category === 'Women' && (
                                            <>
                                                <option value="Dresses">Dresses</option>
                                                <option value="Tops">Tops</option>
                                                <option value="Bottoms">Bottoms</option>
                                                <option value="Skirts">Skirts</option>
                                                <option value="Jackets">Jackets</option>
                                                <option value="Watches">Watches</option>
                                            </>
                                        )}
                                        {formData.category === 'Footwear' && (
                                            <>
                                                <option value="Sneakers">Sneakers</option>
                                                <option value="Boots">Boots</option>
                                                <option value="Loafers">Loafers</option>
                                                {formData.gender === 'Women' && <option value="Heels">Heels</option>}
                                                {formData.gender === 'Women' && <option value="Sandals">Sandals</option>}
                                                <option value="Formal">Formal</option>
                                            </>
                                        )}
                                        {formData.category === 'Accessories' && (
                                            <>
                                                {formData.gender === 'Men' && (
                                                    <>
                                                        <option value="Rings">Rings</option>
                                                        <option value="Chains">Chains</option>
                                                        <option value="Belts">Belts</option>
                                                    </>
                                                )}
                                                {formData.gender === 'Women' && (
                                                    <>
                                                        <option value="Earrings">Earrings</option>
                                                        <option value="Bangles">Bangles</option>
                                                        <option value="Necklace">Necklace</option>
                                                        <option value="Bags">Bags</option>
                                                        <option value="Rings">Rings</option>
                                                        <option value="Chains">Chains</option>
                                                    </>
                                                )}
                                                {!formData.gender && (
                                                    <>
                                                        <option value="Earrings">Earrings</option>
                                                        <option value="Bangles">Bangles</option>
                                                        <option value="Necklace">Necklace</option>
                                                        <option value="Bags">Bags</option>
                                                        <option value="Rings">Rings</option>
                                                        <option value="Chains">Chains</option>
                                                        <option value="Belts">Belts</option>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {!formData.category && <option value="" disabled>Select a main category first</option>}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Available Sizes</label>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11'].map(size => (
                                        <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.sizes?.includes(size)}
                                                onChange={(e) => {
                                                    const newSizes = e.target.checked
                                                        ? [...(formData.sizes || []), size]
                                                        : (formData.sizes || []).filter(s => s !== size);
                                                    setFormData({ ...formData, sizes: newSizes });
                                                }}
                                            />
                                            {size}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Main Image URL</label>
                                <input
                                    className="form-input"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="Enter primary image URL"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Additional Images
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                                        style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                                    >
                                        + Add URL
                                    </button>
                                </label>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            className="form-input"
                                            value={img}
                                            onChange={(e) => {
                                                const newImgs = [...formData.images];
                                                newImgs[idx] = e.target.value;
                                                setFormData({ ...formData, images: newImgs });
                                            }}
                                            placeholder={`Thumbnail/Angle ${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="icon-btn"
                                            onClick={() => {
                                                const newImgs = formData.images.filter((_, i) => i !== idx);
                                                setFormData({ ...formData, images: newImgs });
                                            }}
                                            style={{ color: '#e53e3e' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {formData.images.length === 0 && <p style={{ fontSize: '0.8rem', color: '#a0aec0' }}>No additional images added.</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingProduct ? 'Update' : 'Create'}</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1, color: '#4a5568' }} onClick={() => { setShowForm(false); setEditingProduct(null); setFormData({ name: '', description: '', price: '', category: '', subCategory: '', gender: '', sizes: [], imageUrl: '', images: [], stock: '' }); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
