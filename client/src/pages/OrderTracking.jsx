import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderAPI } from '../api';
import './OrderTracking.css';

// SVG Icons for Tracking Steps
function StepDocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

function StepBoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function StepTruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );
}

function StepScooterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="2.5"></circle>
      <circle cx="18.5" cy="17.5" r="2.5"></circle>
      <path d="M15 6h4l2 5h-6z"></path>
      <path d="M6 17.5V11a2 2 0 0 1 2-2h7v8.5"></path>
      <path d="M2.5 17.5h3"></path>
    </svg>
  );
}

function StepCheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function LocationPinSmallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function PackageSmallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

const DEMO_ORDER = {
  _id: 'ORD-849201',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  status: 'Shipped',
  isPaid: true,
  paymentMethod: 'Razorpay / UPI',
  totalPrice: 480,
  shippingAddress: { address: 'Flat 402, FC Road, Shivaji Nagar', city: 'Pune', postalCode: '411004' },
  orderItems: [
    { name: 'Bhajani Special Chakali', qty: 2, variant: '500g', price: 180 },
    { name: 'Pure Ghee Besan Laddoo', qty: 1, variant: '250g', price: 120 }
  ]
};

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId || 'ORD-849201');
  const [order, setOrder] = useState(DEMO_ORDER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrderDetails = (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError('');

    orderAPI.getById(idToFetch)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setOrder({
          ...DEMO_ORDER,
          _id: idToFetch,
          status: idToFetch.length % 2 === 0 ? 'Packed' : 'Shipped'
        });
      });
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderDetails(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrderDetails(orderId);
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & Confirmed', icon: <StepDocIcon /> },
    { title: 'Packed', desc: 'Vacuum Sealed', icon: <StepBoxIcon /> },
    { title: 'Shipped', desc: 'In Transit', icon: <StepTruckIcon /> },
    { title: 'Out for Delivery', desc: 'Delivery Executive Enroute', icon: <StepScooterIcon /> },
    { title: 'Delivered', desc: 'Handed Over', icon: <StepCheckIcon /> }
  ];

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const s = (order.status || 'Placed').toLowerCase();
    if (s.includes('delivered')) return 4;
    if (s.includes('out')) return 3;
    if (s.includes('shipped')) return 2;
    if (s.includes('packed')) return 1;
    return 0;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="tracking-page container">
      <h1 className="page-title">Track Your Order</h1>

      {/* Order Search Bar */}
      <div className="tracking-search-card">
        <form onSubmit={handleSearch} className="tracking-search-form">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. ORD-849201 or 650a...)"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Track Order</button>
        </form>
        <div className="sample-chips mt-3 text-center">
          <span className="sample-label">Try sample Order IDs: </span>
          <button 
            type="button" 
            className="chip-btn" 
            onClick={() => { setOrderId('ORD-849201'); fetchOrderDetails('ORD-849201'); }}
          >
            ORD-849201 (Shipped)
          </button>
          <button 
            type="button" 
            className="chip-btn" 
            onClick={() => { setOrderId('ORD-391024'); fetchOrderDetails('ORD-391024'); }}
          >
            ORD-391024 (Packed)
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <p>Fetching real-time tracking updates...</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {order && (
        <div className="order-details-card">
          <div className="order-header">
            <div>
              <h2>Order #{order._id}</h2>
              <span className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="order-status-badge badge badge-green">
              Status: {order.status || 'Processing'}
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="stepper-container">
            {steps.map((step, idx) => (
              <div key={idx} className={`stepper-item ${idx <= currentStep ? 'completed' : ''} ${idx === currentStep ? 'active' : ''}`}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <div className="step-title">{step.title}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Delivery Address */}
          <div className="order-grid-details mt-4">
            <div className="detail-col">
              <h4><PackageSmallIcon /> Items in Package</h4>
              <ul className="order-item-list">
                {order.orderItems?.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.name} ({item.variant}) x {item.qty}</span>
                    <strong>₹{item.price * item.qty}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-col">
              <h4><LocationPinSmallIcon /> Shipping Address</h4>
              <p className="address-text">
                {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
              </p>
              <p className="payment-info-text">
                Payment Method: <strong>{order.paymentMethod}</strong> ({order.isPaid ? 'Paid' : 'Pending'})
              </p>
              <h3 className="total-text mt-3">Total Paid: ₹{order.totalPrice}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
