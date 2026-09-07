import { useState } from 'react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section container">
      <div className="newsletter-banner">
        <div className="newsletter-content">
          <h2 className="newsletter-title">
            Get updates regularly and best offer subscribe us
          </h2>
          <p className="newsletter-subtitle">
            Subscribe to get exclusive discount coupons, seasonal snack offers, and fresh recipes directly in your inbox.
          </p>

          {subscribed ? (
            <div className="newsletter-success">
              🎉 Thank you for subscribing! Check your email for a special discount code.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>

        <div className="newsletter-chef-wrapper">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
            alt="Naik Foods Chef"
            className="newsletter-chef-img"
          />
        </div>
      </div>
    </section>
  );
}
