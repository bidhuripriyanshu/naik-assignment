import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, applyCoupon, clearCart } from '../store/cartSlice';
import DeliveryProgress from '../components/cart/DeliveryProgress';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice, couponCode } = useSelector((s) => s.cart);

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    if (inputCoupon.toUpperCase() === 'NAIK10') {
      dispatch(applyCoupon({ code: 'NAIK10', discountPercent: 10 }));
      setCouponMsg('✅ Coupon NAIK10 applied! (10% OFF)');
    } else if (inputCoupon.toUpperCase() === 'FREE50') {
      dispatch(applyCoupon({ code: 'FREE50', discountFlat: 50 }));
      setCouponMsg('✅ Coupon FREE50 applied! (₹50 OFF)');
    } else {
      setCouponMsg('❌ Invalid Coupon Code. Try NAIK10');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container cart-empty-page">
        <div className="cart-empty-box">
          <div className="empty-icon-svg">
            <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>You haven't added any tasty Maharashtrian delicacies to your cart yet.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">Explore Delicacies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Shopping Cart ({items.length} Items)</h1>

      <DeliveryProgress />

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-list">
          {items.map((item) => (
            <div key={`${item.id}-${item.variant}`} className="cart-item-card">
              <img src={item.image} alt={item.name} className="cart-item-img" />

              <div className="cart-item-details">
                <Link to={`/product/${item.id}`} className="cart-item-title">{item.name}</Link>
                <div className="cart-item-variant">Pack: <strong>{item.variant}</strong></div>
                <div className="cart-item-price">₹{item.price} each</div>
              </div>

              <div className="cart-item-qty">
                <button onClick={() => dispatch(updateQuantity({ id: item.id, variant: item.variant, qty: item.qty - 1 }))}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => dispatch(updateQuantity({ id: item.id, variant: item.variant, qty: item.qty + 1 }))}>+</button>
              </div>

              <div className="cart-item-total">
                ₹{item.price * item.qty}
              </div>

              <button 
                className="cart-item-remove-btn"
                title="Remove Item"
                aria-label="Remove Item"
                onClick={() => dispatch(removeFromCart({ id: item.id, variant: item.variant }))}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}

          <div className="cart-actions-bar">
            <Link to="/shop" className="btn btn-outline">← Continue Shopping</Link>
            <button className="btn btn-ghost text-red" onClick={() => dispatch(clearCart())}>Clear Cart</button>
          </div>
        </div>

        {/* Cart Order Summary Sidebar */}
        <div className="cart-summary-sidebar">
          <div className="summary-card">
            <h3>Order Summary</h3>

            {/* Coupon form */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Coupon (e.g. NAIK10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                />
                <button type="submit" className="btn btn-dark btn-sm">Apply</button>
              </div>
              {couponMsg && <p className="coupon-msg">{couponMsg}</p>}
            </form>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                <span>₹{itemsPrice}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="summary-row">
                <span>GST (5%)</span>
                <span>₹{taxPrice}</span>
              </div>

              <div className="summary-row">
                <span>Shipping Charge</span>
                <span>{shippingPrice === 0 ? <strong className="text-green">FREE</strong> : `₹${shippingPrice}`}</span>
              </div>

              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-lg w-full mt-4"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
