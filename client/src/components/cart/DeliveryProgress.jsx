import { useSelector } from 'react-redux';
import './DeliveryProgress.css';

export default function DeliveryProgress() {
  const { itemsPrice, freeDeliveryThreshold, isFreeDelivery, amountNeededForFreeDelivery } = useSelector((s) => s.cart);
  
  const percentage = Math.min(100, Math.round((itemsPrice / freeDeliveryThreshold) * 100));

  return (
    <div className="delivery-progress-card">
      <div className="delivery-header">
        {isFreeDelivery ? (
          <span className="delivery-msg success">
            <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span><strong>Congratulations!</strong> You qualify for <strong>FREE Delivery</strong>!</span>
          </span>
        ) : (
          <span className="delivery-msg">
            <svg width="18" height="18" fill="none" stroke="#EA580C" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Add <strong>₹{amountNeededForFreeDelivery}</strong> more for <strong>FREE Express Delivery</strong></span>
          </span>
        )}
      </div>

      <div className="progress-bar-bg">
        <div className={`progress-bar-fill ${isFreeDelivery ? 'complete' : ''}`} style={{ width: `${percentage}%` }}>
          <span className="truck-icon-svg">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
