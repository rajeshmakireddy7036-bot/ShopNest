import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, ArrowRight, Globe, Camera, Twitter, LogOut, ShoppingCart, Home as HomeIcon, Heart, X, Menu } from 'lucide-react';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import { useQuickView } from './context/QuickViewContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminHome from './components/AdminHome';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminUsers from './components/AdminUsers';
import MenCategory from './components/MenCategory';
import WomenCategory from './components/WomenCategory';
import CartSidebar from './components/CartSidebar';
import UserPanel from './components/UserPanel';
import AllCategories from './components/AllCategories';
import ProductDetail from './components/ProductDetail';
import AccessoriesCategory from './components/AccessoriesCategory';
import FootwearCategory from './components/FootwearCategory';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import ShippingInfo from './components/ShippingInfo';
import './auth.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Shop Routes with Navbar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/category/men" element={<MenCategory />} />
            <Route path="/category/women" element={<WomenCategory />} />
            <Route path="/category/all" element={<AllCategories />} />
            <Route path="/category/accessories" element={<AccessoriesCategory />} />
            <Route path="/category/footwear" element={<FootwearCategory />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/shipping" element={<ShippingInfo />} />
          </Route>

          {/* Auth Routes without Navbar and Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

function MainLayout() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user: userData, logout: authLogout, updateUser } = useAuth();
  const isLoggedIn = !!userData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { selectedProduct, closeQuickView } = useQuickView();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openOrders) {
      setIsUserPanelOpen(true);
      // We'll also need to tell the UserPanel to switch to orders
      window.dispatchEvent(new CustomEvent('open-user-tab', { detail: 'orders' }));
      // Clear state so it doesn't keep opening
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    authLogout('USER');
    setIsUserPanelOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link to="/" className="logo">
            <ShoppingBag size={28} className="logo-icon" />
            <span className="logo-text">Shop<span className="accent">Nest</span></span>
          </Link>

          <div className={`nav-overlay ${isNavOpen ? 'active' : ''}`} onClick={() => setIsNavOpen(false)}></div>

          <ul className={`nav-links ${isNavOpen ? 'active' : ''}`}>
            <li className="mobile-nav-header">
              <span className="logo-text">Shop<span className="accent">Nest</span></span>
              <button className="icon-btn" onClick={() => setIsNavOpen(false)}>
                <X size={24} />
              </button>
            </li>
            <li><NavLink to="/" end onClick={() => setIsNavOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HomeIcon size={20} /> Home</NavLink></li>
            <li><NavLink to="/category/men" onClick={() => setIsNavOpen(false)}>Men</NavLink></li>
            <li><NavLink to="/category/women" onClick={() => setIsNavOpen(false)}>Women</NavLink></li>
            <li><NavLink to="/category/accessories" onClick={() => setIsNavOpen(false)}>Accessories</NavLink></li>
            <li><NavLink to="/category/footwear" onClick={() => setIsNavOpen(false)}>Footwear</NavLink></li>
          </ul>

          <div className="nav-search-container">
            <Search className="nav-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="nav-search-input"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val) setIsSearchOpen(true);
                else setIsSearchOpen(false);
              }}
              onFocus={() => {
                if (searchQuery) setIsSearchOpen(true);
              }}
            />
          </div>

          <div className="nav-icons">

            {isLoggedIn ? (
              <button
                className="icon-btn"
                onClick={() => setIsUserPanelOpen(true)}
                title="User Profile"
              >
                <User size={25} style={{ color: 'var(--text-main)' }} />
              </button>
            ) : (
              <Link to="/login" className="icon-btn" title="Login">
                <User size={25} style={{ color: 'var(--text-main)' }} />
              </Link>
            )}

            <button className="icon-btn" onClick={() => setIsWishlistOpen(true)} title="Wishlist">
              <Heart size={25} style={{ color: 'var(--text-main)' }} />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </button>

            <button className="icon-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={25} style={{ color: 'var(--text-main)' }} />
              <span className="cart-badge">{cartCount}</span>
            </button>

            <button className="mobile-menu-btn" onClick={() => setIsNavOpen(true)}>
              <Menu size={25} />
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistOverlay isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
      <UserPanel
        isOpen={isUserPanelOpen}
        onClose={() => setIsUserPanelOpen(false)}
        userData={userData}
        setUserData={updateUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {location.pathname === '/' && (
        <footer className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link to="/" className="logo">
                <ShoppingBag size={24} className="logo-icon" />
                <span className="logo-text">Shop<span className="accent">Nest</span></span>
              </Link>
              <p>
                Elevating everyday living through curated high-end fashion and lifestyle essentials. Quality is our baseline.
              </p>
              <div className="social-icons">
                <a href="#" aria-label="Globe"><Globe size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="Instagram"><Camera size={18} /></a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Customer Service</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
                <li><Link to="/shipping">Shipping Information</Link></li>
                <li><a href="#">Track Order</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>The Brand</h4>
              <ul>
                <li><a href="#">About ShopNest</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Journal</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 ShopNest Lifestyle Inc. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <p>United States | EN</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);

  const lookbookImages = [
    { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop", title: "Casual Spring" },
    { url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2671&auto=format&fit=crop", title: "Summer Breeze" },
    { url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2574&auto=format&fit=crop", title: "Urban Essential" },
    { url: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2670&auto=format&fit=crop", title: "Minimalist Chic" },
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2562&auto=format&fit=crop", title: "Modern Classic" },
    { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2673&auto=format&fit=crop", title: "Elegant Evening" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const featuredProducts = products.slice(0, 3); // Just show first 3 as featured

  return (
    <>
      {/* Hero Section */}
      <header className="hero container">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2562&auto=format&fit=crop"
          alt="Spring Collection"
          className="hero-bg"
        />
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-subtitle">New Season Arrival</span>
          <h1 className="hero-title">Step into <br />Spring</h1>
          <p className="hero-desc">
            Embrace the lightness of the season with our meticulously curated Spring Collection.
            Minimalist designs, premium fabrics.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}>Shop Now</button>
            <button className="btn btn-outline" onClick={() => setIsLookbookOpen(true)}>View Lookbook</button>
          </div>
        </div>
      </header>

      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        images={lookbookImages}
      />

      {/* Categories */}
      <section className="categories container" id="categories">
        <div className="section-title-wrapper">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/category/all" className="view-all-link">
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-grid">
          <Link to="/category/men" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop"
              alt="Men"
              className="category-img"
            />
            <div className="category-label">Men</div>
          </Link>
          <Link to="/category/women" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop"
              alt="Women"
              className="category-img"
            />
            <div className="category-label">Women</div>
          </Link>
          <Link to="/category/accessories" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop"
              alt="Accessories"
              className="category-img"
            />
            <div className="category-label">Accessories</div>
          </Link>
          <Link to="/category/footwear" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
              alt="Footwear"
              className="category-img"
            />
            <div className="category-label">Footwear</div>
          </Link>
        </div>
      </section>

      {/* Featured Selections */}
      <section className="featured container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Featured Selections</h2>
          <p style={{ color: '#6b7280', marginTop: '1rem' }}>
            Handpicked essentials that define the ShopNest aesthetic. Quality without compromise.
          </p>
        </div>

        <div className="products-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1' }}>Loading products...</div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1', color: '#6b7280' }}>
              No featured products yet.
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container">
        <div className="newsletter">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Join the Nest</h2>
            <p className="newsletter-desc">
              Be the first to know about new collection launches, editorial content, and exclusive member offers.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
            />
            <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const navigate = useNavigate();
  const { imageUrl, name, category, price, id } = product;

  return (
    <div className="product-card">
      <div className="product-img-container" onClick={() => navigate(`/product/${id}`)} style={{ cursor: 'pointer' }}>
        <img src={imageUrl} alt={name} className="product-img" />
        <div className="product-actions">
          <button
            className={`action-btn ${isInWishlist(id) ? 'wishlist-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={isInWishlist(id) ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={20} fill={isInWishlist(id) ? "#e53e3e" : "none"} />
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
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <h3 className="product-title" onClick={() => navigate(`/product/${id}`)} style={{ cursor: 'pointer' }}>{name}</h3>
          <span className="product-price">₹{price}</span>
        </div>
        <p className="product-category">{product.subCategory || product.category}</p>
      </div>
    </div>
  );
}

function SearchOverlay({ isOpen, onClose, searchQuery, setSearchQuery, searchResults, setSearchResults }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products`);
      const data = await res.json();
      const filtered = data.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay animate-fadeIn" onClick={onClose}>
      <div className="search-container" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <Search size={24} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search for products, categories..."
            className="search-input"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="icon-btn"
            onClick={() => {
              setSearchQuery('');
              onClose();
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="search-status">Searching...</div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="search-status">No results found for "{searchQuery}"</div>
          ) : (
            searchResults.map(product => (
              <div
                key={product.id}
                className="search-result-item"
                onClick={() => {
                  navigate(`/product/${product.id}`); // Or navigate to specific product if route exists
                  setSearchQuery('');
                  onClose();
                }}
              >
                <img src={product.imageUrl} alt={product.name} />
                <div className="result-info">
                  <h4>{product.name}</h4>
                  <p>{product.category}</p>
                </div>
                <div className="result-price">₹{product.price}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LookbookModal({ isOpen, onClose, images }) {
  if (!isOpen) return null;

  return (
    <div className="search-overlay animate-fadeIn" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: 'env(safe-area-inset-top, 20px)' }}>
      <div className="search-container responsive-modal" onClick={e => e.stopPropagation()} style={{ height: 'auto', maxHeight: '95vh' }}>
        <div className="search-header" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Spring Lookbook 2024</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="lookbook-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          padding: '1rem',
          overflowY: 'auto'
        }}>
          {images.map((img, index) => (
            <div key={index} className="lookbook-item" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '350px' }}>
              <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="lookbook-overlay" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{img.title}</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Collection 2024</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WishlistOverlay({ isOpen, onClose }) {
  const { wishlist, removeFromWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="search-overlay animate-fadeIn" onClick={onClose}>
      <div className="search-container responsive-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', height: 'auto', maxHeight: '85vh' }}>
        <div className="search-header" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>My Wishlist</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '1rem', overflowY: 'auto' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Heart size={48} color="var(--gray)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--gray)' }}>Your wishlist is empty.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wishlist.map(product => {
                const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
                return (
                  <div key={product.id} className="search-result-item" style={{
                    padding: '1rem',
                    background: 'var(--input-bg)',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: '1rem'
                  }}>
                    <div style={{ position: 'relative', width: '180px', height: '110px', margin: '0 auto', overflow: 'hidden', borderRadius: '8px' }}>
                      <div className="image-swipe-container" style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        height: '100%'
                      }}>
                        {allImages.map((img, idx) => (
                          <img key={idx} src={img} alt={product.name} style={{ width: '180px', height: '110px', objectFit: 'cover', flexShrink: 0, scrollSnapAlign: 'start' }} />
                        ))}
                      </div>
                    </div>
                    <div className="result-info" style={{ textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{product.name}</h4>
                      <p style={{ color: 'var(--primary)', fontWeight: '700' }}>₹{product.price}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          addToCart(product);
                          removeFromWishlist(product.id);
                        }}
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => removeFromWishlist(product.id)}
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickViewModal({ product, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  if (!product) return null;
  const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="search-container responsive-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px', padding: '1.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Quick View</h3>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ position: 'relative', width: '180px', height: '110px', margin: '0 auto 1.5rem', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div className="image-swipe-container" style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            height: '100%'
          }} onScroll={(e) => {
            const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
            if (index !== activeImg) setActiveImg(index);
          }}>
            {allImages.map((img, idx) => (
              <img key={idx} src={img} alt={product.name} style={{ width: '180px', height: '110px', objectFit: 'cover', flexShrink: 0, scrollSnapAlign: 'start' }} />
            ))}
          </div>
          {allImages.length > 1 && (
            <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
              {allImages.map((_, idx) => (
                <div key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: activeImg === idx ? 'var(--primary)' : 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{product.name}</h4>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.2rem' }}>₹{product.price}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select Size</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: selectedSize === size ? 'var(--primary)' : 'var(--border-color)',
                      background: selectedSize === size ? 'var(--primary)' : 'var(--input-bg)',
                      color: selectedSize === size ? 'white' : 'var(--text-main)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      minWidth: '32px'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '0.5rem' }}>{product.category}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => {
              if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                alert("Please select a size");
                return;
              }
              addToCart({ ...product, selectedSize });
              onClose();
            }}
          >
            Add to Cart
          </button>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { navigate(`/product/${product.id}`); onClose(); }}>Full Details</button>
        </div>
      </div>
    </div>
  );
}

export default App;
