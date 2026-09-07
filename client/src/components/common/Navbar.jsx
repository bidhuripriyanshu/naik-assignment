import { Link } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { productAPI } from '../../api';

/* ─── Clean SVG Logo Mark – chakali spiral motif ───────────────────── */
function NaikLogo({ className = '' }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* outer ring */}
      <circle cx="18" cy="18" r="16" stroke="#EA580C" strokeWidth="2.5"/>
      {/* mid ring */}
      <circle cx="18" cy="18" r="10" stroke="#EA580C" strokeWidth="2" opacity="0.7"/>
      {/* inner ring */}
      <circle cx="18" cy="18" r="5" stroke="#EA580C" strokeWidth="2" opacity="0.5"/>
      {/* centre dot */}
      <circle cx="18" cy="18" r="2" fill="#EA580C"/>
      {/* small top accent dot (chakali texture) */}
      <circle cx="18" cy="4" r="2" fill="#EA580C" opacity="0.4"/>
    </svg>
  );
}

/* ─── Cart icon SVG ─────────────────────────────────────────────────── */
function CartSVG() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

/* ─── User icon SVG ─────────────────────────────────────────────────── */
function UserSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

/* ─── Search icon SVG ───────────────────────────────────────────────── */
function SearchSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

/* ─── Location pin SVG ──────────────────────────────────────────────── */
function PinSVG() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const searchRef = useRef(null);
  const categoryRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await productAPI.getAll({ search: query });
        const list = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
        setSuggestions(list.slice(0, 5));
      } catch { setSuggestions([]); }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestions([]);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setSuggestions([]); setQuery('');
    }
  };

  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const [showCartPopup, setShowCartPopup] = useState(false);
  const prevCartCount = useRef(cartCount);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (cartCount > prevCartCount.current) {
      setShowCartPopup(true);
      const timer = setTimeout(() => setShowCartPopup(false), 3500);
      return () => clearTimeout(timer);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  return (
    <header className="navbar-header">

      {/* ── Announcement bar ─────────────────────────────────────────── */}
      <div className="top-announcement-bar">
        <div className="container announcement-content">
          <span>🌿 Free Express Shipping on orders above ₹999 | 100% Natural, No Preservatives</span>
          <Link to="/track-order" className="announcement-link">
            <PinSVG /> Track Order
          </Link>
        </div>
      </div>

      {/* ── Main navbar row ──────────────────────────────────────────── */}
      <nav className="main-navbar">
        <div className="container nav-inner">

          {/* Brand – SVG chakali logo + text wordmark */}
          <Link to="/" className="nav-brand">
            <NaikLogo className="nav-logo-svg" />
            <div className="nav-brand-text">
              <span className="nav-brand-name">NAIK FOODS</span>
              <span className="nav-brand-tagline">Pure • Authentic • Homemade</span>
            </div>
          </Link>

          {/* Category dropdown */}
          <div className="category-dropdown-container" ref={categoryRef}>
            <button
              className="category-btn-dark-green"
              onClick={() => setCategoryDropdown(!categoryDropdown)}
            >
              <span className="hamburger-icon">☰</span>
              <span>Category</span>
              <span className="caret-arrow">{categoryDropdown ? '▲' : '▼'}</span>
            </button>
            {categoryDropdown && (
              <div className="category-popover-menu">
                {[
                  ['Chakali', 'Bhajani Chakali'],
                  ['Laddoo', 'Pure Ghee Laddoos'],
                  ['Masala', 'Special Masalas'],
                  ['Pickle', "Grandma's Pickles"],
                  ['Faral', 'Diwali Faral'],
                  ['Snacks', 'Traditional Snacks'],
                ].map(([cat, label]) => (
                  <Link key={cat} to={`/shop?category=${cat}`} onClick={() => setCategoryDropdown(false)}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop nav links */}
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#about">About</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/#blogs">Blogs</Link></li>
            <li><Link to="/#contact">Contact</Link></li>
          </ul>

          {/* Search bar */}
          <div className="nav-search-container" ref={searchRef}>
            <form onSubmit={handleSearch} className="nav-search-form">
              <SearchSVG />
              <input
                type="text"
                className="nav-search-input"
                placeholder="Search chakali, masala, pickle..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            {suggestions.length > 0 && (
              <div className="search-autocomplete-dropdown">
                {suggestions.map((p) => (
                  <Link key={p._id} to={`/product/${p._id}`} className="autocomplete-row"
                    onClick={() => { setSuggestions([]); setQuery(''); }}>
                    <img src={p.image} alt={p.name} className="autocomplete-thumb" />
                    <div className="autocomplete-info">
                      <span className="autocomplete-title">{p.name}</span>
                      <span className="autocomplete-price">₹{p.variants?.[0]?.price || p.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="nav-actions-group">
            <div className="cart-btn-wrapper">
              <Link to="/cart" className={`cart-btn-link ${showCartPopup ? 'bounce' : ''}`} aria-label="Cart">
                <CartSVG />
                {cartCount > 0 && <span className={`cart-count-badge ${showCartPopup ? 'pop' : ''}`}>{cartCount}</span>}
              </Link>

              {showCartPopup && (
                <div className="cart-popup-toast">
                  <div className="toast-content">
                    <span className="toast-icon-check">✓</span>
                    <div>
                      <strong>Item added to cart!</strong>
                      <div className="toast-sub">{cartCount} item{cartCount > 1 ? 's' : ''} in cart</div>
                    </div>
                  </div>
                  <Link to="/cart" className="toast-btn" onClick={() => setShowCartPopup(false)}>
                    View Cart →
                  </Link>
                </div>
              )}
            </div>

            {user ? (
              <div className="user-dropdown-wrapper">
                <Link to="/account" className="user-profile-btn">
                  <UserSVG />
                  <span className="user-name-label">{user.name.split(' ')[0]}</span>
                </Link>
                <div className="user-dropdown-menu">
                  <Link to="/account">My Account</Link>
                  <Link to="/track-order">Track Orders</Link>
                  <button onClick={() => dispatch(logout())}>Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            )}

            <button className="mobile-toggle-btn" onClick={() => setMobileMenu(!mobileMenu)}>
              ☰
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenu && (
          <div className="mobile-dropdown-menu">
            <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
            <Link to="/#about" onClick={() => setMobileMenu(false)}>About</Link>
            <Link to="/shop" onClick={() => setMobileMenu(false)}>Shop</Link>
            <Link to="/#blogs" onClick={() => setMobileMenu(false)}>Blogs</Link>
            <Link to="/#contact" onClick={() => setMobileMenu(false)}>Contact</Link>
            <Link to="/track-order" onClick={() => setMobileMenu(false)}>Track Order</Link>
            <Link to="/cart" onClick={() => setMobileMenu(false)}>Cart ({cartCount})</Link>
            {user
              ? <Link to="/account" onClick={() => setMobileMenu(false)}>My Account</Link>
              : <Link to="/login" onClick={() => setMobileMenu(false)}>Login / Register</Link>}
          </div>
        )}
      </nav>
    </header>
  );
}
