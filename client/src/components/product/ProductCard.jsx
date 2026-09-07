import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant = product.variants && product.variants.length > 0 
    ? product.variants[selectedVariantIndex] 
    : { weight: product.weight || '250g', price: product.price, stock: product.countInStock || product.stock || 10 };

  const availableStock = selectedVariant.stock ?? selectedVariant.countInStock ?? product.stock ?? product.countInStock ?? 10;
  const isAvailable = availableStock > 0;

  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      image: product.image,
      variant: selectedVariant.weight,
      price: selectedVariant.price,
      countInStock: availableStock,
      qty: 1
    }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="card-badge-container">
        {product.isBestseller && <span className="badge badge-amber">🔥 Bestseller</span>}
        {product.discount > 0 && <span className="badge badge-green">{product.discount}% OFF</span>}
      </div>

      <Link to={`/product/${product._id}`} className="card-media">
        <img 
          src={product.image || '/chakali.png'} 
          alt={product.name} 
          loading="lazy"
        />
      </Link>

      <div className="card-body">
        <div className="card-category">{product.category || 'DELICACY'}</div>
        <Link to={`/product/${product._id}`} className="card-title-link">
          <h3 className="card-title">{product.name}</h3>
        </Link>

        {/* Rating Stars */}
        <div className="card-rating">
          <span className="stars">★ {product.rating ? product.rating.toFixed(1) : '4.7'}</span>
          <span className="reviews">({product.numReviews || 95})</span>
        </div>

        {/* Variant selector */}
        <div className="variant-pills">
          {product.variants && product.variants.length > 0 ? (
            product.variants.map((v, idx) => (
              <button
                key={idx}
                type="button"
                className={`variant-pill ${selectedVariantIndex === idx ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
              >
                {v.weight}
              </button>
            ))
          ) : (
            <span className="variant-pill active">{product.weight || '250g'}</span>
          )}
        </div>

        <div className="card-footer">
          <div className="card-price">
            <span className="current-price">₹{selectedVariant.price}</span>
            {product.originalPrice && product.originalPrice > selectedVariant.price && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>

          <button 
            type="button"
            className={`add-btn ${!isAvailable ? 'out-of-stock' : ''} ${justAdded ? 'just-added' : ''}`}
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            {justAdded ? 'Added ✓' : (isAvailable ? 'Add' : 'Out of Stock')}
          </button>
        </div>
      </div>
    </div>
  );
}

