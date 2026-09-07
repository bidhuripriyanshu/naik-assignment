import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { productAPI } from '../api';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  
  // Review form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    productAPI.getById(id)
      .then(res => {
        if (res.data) {
          setProduct(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('getById failed, attempting fallback getAll search:', err);
        productAPI.getAll()
          .then(res => {
            const list = res.data.products || res.data || [];
            const found = list.find(p => p._id === id || p.slug === id || p.name?.toLowerCase().includes(id?.toLowerCase())) || list[0];
            setProduct(found || null);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container pdp-loading">
        <div className="skeleton-card" style={{ height: '450px' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container pdp-error">
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const selectedVariant = product.variants && product.variants.length > 0
    ? product.variants[selectedVariantIndex]
    : { weight: product.weight || '250g', price: product.price, countInStock: product.countInStock || 10 };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      image: product.image,
      variant: selectedVariant.weight,
      price: selectedVariant.price,
      countInStock: selectedVariant.countInStock || 10,
      qty
    }));
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setPincodeMsg('Enter valid 6-digit Pincode');
      return;
    }
    setPincodeMsg('⚡ Estimated Delivery in 2-3 Days to ' + pincode);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    productAPI.addReview(product._id, { rating: userRating, comment: userComment })
      .then(res => {
        setSubmittingReview(false);
        setReviewSuccessMsg('Review added successfully!');
        setUserComment('');
        // Refresh product
        productAPI.getById(id).then(r => setProduct(r.data));
      })
      .catch(err => {
        setSubmittingReview(false);
        // Fallback for local update if server endpoint is stubbed
        const newRev = { _id: Date.now(), name: 'You', rating: userRating, comment: userComment, createdAt: new Date() };
        setProduct(prev => ({
          ...prev,
          reviews: [newRev, ...(prev.reviews || [])],
          numReviews: (prev.numReviews || 0) + 1
        }));
        setReviewSuccessMsg('Review added!');
        setUserComment('');
      });
  };

  return (
    <div className="pdp-page container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/shop">Shop</Link> &gt; <span>{product.name}</span>
      </nav>

      <div className="pdp-layout">
        {/* Gallery Image */}
        <div className="pdp-gallery">
          <img src={product.image || '/chakali.png'} alt={product.name} className="main-image" />
          <div className="pdp-badges">
            <span className="badge badge-amber svg-badge">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>100% Traditional</span>
            </span>
            <span className="badge badge-green svg-badge">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>FSSAI Certified</span>
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="pdp-info">
          <span className="pdp-category">{product.category}</span>
          <h1 className="pdp-title">{product.name}</h1>
          {product.marathiName && <p className="pdp-marathi">{product.marathiName}</p>}

          <div className="pdp-rating">
            <span className="rating-stars">★ {product.rating ? product.rating.toFixed(1) : '4.7'}</span>
            <span className="review-count">({product.numReviews || 90} reviews)</span>
          </div>

          <div className="pdp-price">
            <span className="price-curr">₹{selectedVariant.price}</span>
            {product.originalPrice && product.originalPrice > selectedVariant.price && (
              <span className="price-orig">₹{product.originalPrice}</span>
            )}
            <span className="tax-inclusive">Inclusive of all taxes</span>
          </div>

          <p className="pdp-desc">{product.description}</p>

          {/* Weight Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="pdp-section">
              <label className="section-label">Select Pack Size:</label>
              <div className="weight-selector">
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    className={`weight-btn ${selectedVariantIndex === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedVariantIndex(idx)}
                  >
                    <span>{v.weight}</span>
                    <strong>₹{v.price}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector + Add to Cart */}
          <div className="pdp-actions">
            <div className="qty-picker">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)}>+</button>
            </div>

            <button 
              type="button" 
              className={`btn btn-primary btn-lg flex-grow flex-btn-center ${addedToast ? 'added-success' : ''}`} 
              onClick={handleAddToCart}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>{addedToast ? `Added ${qty} to Cart! ✓` : `Add to Cart • ₹${selectedVariant.price * qty}`}</span>
            </button>
          </div>

          {addedToast && (
            <div className="cart-notification-toast">
              <svg width="18" height="18" fill="none" stroke="#15803d" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Added <strong>{qty}x {product.name} ({selectedVariant.weight})</strong> to cart!</span>
              <Link to="/cart" className="toast-cart-link">View Cart →</Link>
            </div>
          )}

          {/* Pincode checker */}
          <div className="pdp-pincode">
            <form onSubmit={handlePincodeCheck} className="pincode-inline-form">
              <span className="pincode-label">
                <svg width="15" height="15" fill="none" stroke="#EA580C" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Delivery Check:</span>
              </span>
              <input
                type="text"
                placeholder="Enter Pincode"
                maxLength={6}
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" className="btn btn-sm btn-dark">Check</button>
            </form>
            {pincodeMsg && <p className="pincode-msg">{pincodeMsg}</p>}
          </div>

          {/* Product Highlights */}
          <div className="pdp-highlights">
            <div className="highlight-item">
              <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <div>
                <strong>Ingredients:</strong> {product.ingredients || 'Rice Flour, Urad Dal, Sesame Seeds, Cumin, Red Chilli, Pure Ghee, Salt'}
              </div>
            </div>
            <div className="highlight-item">
              <svg width="18" height="18" fill="none" stroke="#ea580c" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <strong>Shelf Life:</strong> {product.shelfLife || '4 Months from manufacturing'}
              </div>
            </div>
            <div className="highlight-item">
              <svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <strong>FSSAI Lic No:</strong> 11521034000123
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="pdp-reviews-section">
        <h2>Customer Reviews & Ratings</h2>

        <div className="reviews-layout">
          {/* Write a Review Form */}
          <div className="review-form-card">
            <h3>Write a Review</h3>
            {reviewSuccessMsg && <div className="alert alert-success">{reviewSuccessMsg}</div>}
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Rating:</label>
                <select value={userRating} onChange={e => setUserRating(Number(e.target.value))}>
                  <option value={5}>★ 5/5 Excellent</option>
                  <option value={4}>★ 4/5 Good</option>
                  <option value={3}>★ 3/5 Average</option>
                  <option value={2}>★ 2/5 Below Average</option>
                  <option value={1}>★ 1/5 Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Review:</label>
                <textarea
                  rows={4}
                  placeholder="Share your experience with taste, crispiness, packaging..."
                  value={userComment}
                  onChange={e => setUserComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* List of Reviews */}
          <div className="reviews-list">
            {(!product.reviews || product.reviews.length === 0) ? (
              <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
            ) : (
              product.reviews.map((rev, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <strong>{rev.name || 'Verified Buyer'}</strong>
                    <span className="review-stars">{'★'.repeat(rev.rating)}</span>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                  <span className="review-date">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
