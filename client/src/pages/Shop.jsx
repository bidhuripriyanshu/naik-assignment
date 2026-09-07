import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../api';
import './Shop.css';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(1000);

  const categories = [
    'All',
    'Snacks and Namkeen',
    'Pickles & Condiments',
    'Spices & Masalas',
    'Sweets & Bakery',
    'Chakali',
    'Laddoo'
  ];

  useEffect(() => {
    setLoading(true);
    productAPI.getAll({
      category: selectedCategory !== 'All' ? selectedCategory : '',
      search: searchQuery
    })
    .then(res => {
      const data = res.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch products:', err);
      setProducts([]);
      setLoading(false);
    });
  }, [selectedCategory, searchQuery]);

  // Handle URL param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Helper to extract product price safely from variants or document root
  const getProductPrice = (p) => {
    if (typeof p.price === 'number' && !isNaN(p.price)) return p.price;
    if (p.variants && p.variants.length > 0 && typeof p.variants[0].price === 'number') {
      return p.variants[0].price;
    }
    return 0;
  };

  // Filtered & Sorted products
  const filteredProducts = (Array.isArray(products) ? products : [])
    .filter(p => getProductPrice(p) <= maxPrice)
    .sort((a, b) => {
      const priceA = getProductPrice(a);
      const priceB = getProductPrice(b);
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="shop-page container">
      <div className="shop-banner">
        <h1>All Products & Snacks</h1>
        <p>Pure authentic Maharashtrian flavors made with traditional spices & pure ghee</p>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchParams(cat !== 'All' ? { category: cat } : {});
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>Price Range</h3>
            <div className="price-slider">
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="price-label">
                <span>Max Price: <strong>₹{maxPrice}</strong></span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <div className="results-count">
              Showing <strong>{filteredProducts.length}</strong> delicacies
            </div>

            <div className="sort-dropdown">
              <label htmlFor="sort">Sort by: </label>
              <select 
                id="sort" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try resetting filters or search for another keyword like "Chakali" or "Masala".</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setMaxPrice(1000);
                  setSearchParams({});
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
