import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { orderAPI } from '../api';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Pune');
  const [postalCode, setPostalCode] = useState('411038');
  const [state, setState] = useState('Maharashtra');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      orderItems: items.map(i => ({
        name: i.name,
        qty: i.qty,
        image: i.image,
        price: i.price,
        variant: i.variant,
        product: i.id
      })),
      shippingAddress: { address, city, postalCode, state, phone },
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    };

    orderAPI.create(orderData)
      .then(res => {
        setLoading(false);
        dispatch(clearCart());
        navigate(`/track-order?orderId=${res.data._id || 'ORD' + Date.now()}`);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        // Fallback demo order placement
        dispatch(clearCart());
        navigate(`/track-order?orderId=ORD${Math.floor(100000 + Math.random() * 900000)}`);
      });
  };

  return (
    <div className="checkout-page container">
      <h1 className="page-title">Checkout & Payment</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        {/* Shipping Form */}
        <div className="shipping-card">
          <h2>1. Shipping Address</h2>

          <div className="form-group">
            <label>Full Address / House No / Street</label>
            <textarea 
              rows={3} 
              required 
              value={address} 
              placeholder="e.g. Flat 402, Sai Shraddha Residency, FC Road"
              onChange={e => setAddress(e.target.value)} 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" required value={city} onChange={e => setCity(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input type="text" required maxLength={6} value={postalCode} onChange={e => setPostalCode(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input type="text" required value={state} onChange={e => setState(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Mobile Number (for SMS Tracking updates)</label>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>

          <h2 className="mt-4">2. Select Payment Method</h2>

          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === 'Razorpay' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="Razorpay" 
                checked={paymentMethod === 'Razorpay'} 
                onChange={() => setPaymentMethod('Razorpay')} 
              />
              <div className="option-info">
                <strong>Razorpay (UPI / GPay / PhonePe / Credit Card)</strong>
                <span>Fastest & recommended. 100% secure payment gateway.</span>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="COD" 
                checked={paymentMethod === 'COD'} 
                onChange={() => setPaymentMethod('COD')} 
              />
              <div className="option-info">
                <strong>Cash on Delivery (COD)</strong>
                <span>Pay cash upon package delivery.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Order Breakdown */}
        <div className="checkout-summary-sidebar">
          <div className="summary-card">
            <h3>Items in Order</h3>
            <div className="mini-item-list">
              {items.map(item => (
                <div key={`${item.id}-${item.variant}`} className="mini-item">
                  <span>{item.name} ({item.variant}) x {item.qty}</span>
                  <strong>₹{item.price * item.qty}</strong>
                </div>
              ))}
            </div>

            <div className="summary-rows mt-4">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>₹{itemsPrice}</span>
              </div>
              <div className="summary-row">
                <span>GST Tax (5%)</span>
                <span>₹{taxPrice}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Fee</span>
                <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
              </div>
              <div className="summary-row total-row">
                <span>Payable Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full mt-4" disabled={loading}>
              {loading ? 'Processing Order...' : `🔒 Place Order • ₹${totalPrice}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
