import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { productAPI, orderAPI } from '../api';
import { CartIcon, LocationPinIcon, DeliveryScooterIcon } from '../components/common/Icons';
import './Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  useEffect(() => {
    productAPI.getAll()
      .then(res => {
        setFeaturedProducts(res.data.products || res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products', err);
        setLoading(false);
      });
  }, []);

  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setDeliveryStatus({ success: false, msg: 'Please enter a valid 6-digit Pincode' });
      return;
    }
    try {
      const { data } = await orderAPI.checkPincode(pincode);
      if (data && typeof data.isServiceable !== 'undefined') {
        setDeliveryStatus({ success: data.isServiceable, msg: data.message });
        return;
      }
    } catch (err) {
      console.warn('Backend pincode check fallback activated', err);
    }

    const SERVICEABLE_REGIONS = {
      Pune: [/^(411|412)\d{3}$/],
      Vidarbha: [/^(440|441|442|443|444|445)\d{3}$/],
      Konkan: [/^(400|401|402|415|416)\d{3}$/],
      Nashik: [/^(422|423)\d{3}$/]
    };

    const pin = pincode.trim();
    let matchedRegion = null;
    for (const [region, regexes] of Object.entries(SERVICEABLE_REGIONS)) {
      if (regexes.some(r => r.test(pin))) {
        matchedRegion = region;
        break;
      }
    }

    if (matchedRegion) {
      setDeliveryStatus({
        success: true,
        msg: `⚡ Express Delivery available for ${pin} (${matchedRegion} Region)!`
      });
    } else {
      setDeliveryStatus({
        success: false,
        msg: `❌ Delivery restricted: Naik Foods serves only Pune, Vidarbha, Konkan, and Nashik regions.`
      });
    }
  };

  // Local authentic food image sources from client/public/
  const categoryImages = {
    chakali: "/chakali.png",
    laddoo: "/laado.png",
    masala: "/masala.png",
    pickle: "/pickle.png"
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge badge-amber hero-pill">Authentic Maharashtrian Delicacies</span>
            <h1 className="hero-title">
              Taste the True Tradition of <span className="highlight-text">Homemade Flavors</span>
            </h1>
            <p className="hero-subtitle">
              From crunchy Bhajani Chakali & melt-in-mouth Besan Laddoos to fiery Kanda Lasun Masala. Made with pure ghee and 100% natural ingredients.
            </p>

            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg flex-btn">
                <CartIcon size={22} className="btn-icon" /> Shop All Flavors
              </Link>
              <a href="#pincode-checker" className="btn btn-secondary btn-lg flex-btn">
                <DeliveryScooterIcon size={30} className="btn-icon" /> Check Delivery
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">50,000+</span>
                <span className="stat-label">Happy Families Served</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Preservative Free</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">4.9 ★</span>
                <span className="stat-label">Rating from 5K+ Reviews</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img 
              src={categoryImages.chakali} 
              alt="Authentic Bhajani Chakali" 
              className="hero-img"
            />
            <div className="hero-floating-badge">
              <span>100% Traditional Recipe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Pincode Checker */}
      <section id="pincode-checker" className="pincode-section">
        <div className="container">
          <div className="pincode-box">
            <div className="pincode-info">
              <div className="pincode-header-row">
                <LocationPinIcon size={28} />
                <h3>Check Express Delivery in Your City</h3>
              </div>
              <p>Enter your 6-digit Pincode to check shipping speeds & COD availability.</p>
            </div>

            <form onSubmit={handlePincodeCheck} className="pincode-form">
              <input
                type="text"
                placeholder="Enter Pincode (e.g. 411038)"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" className="btn btn-dark">Check</button>
            </form>

            {deliveryStatus && (
              <div className={`pincode-result ${deliveryStatus.success ? 'success' : 'error'}`}>
                {deliveryStatus.msg}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Real Local Food Image Category Cards from /public */}
      <section className="categories-section container">
        <div className="section-header">
          <h2 className="section-title">Explore Our Special Categories</h2>
          <p className="section-subtitle">Crafted using authentic age-old Maharashtrian recipes passed down generations.</p>
        </div>

        <div className="category-grid">
          {/* Card 1: Bhajani Chakali */}
          <Link to="/shop?category=Chakali" className="category-card-real">
            <div className="category-img-wrapper">
              <img src={categoryImages.chakali} alt="Bhajani Chakali" />
            </div>
            <div className="category-card-content">
              <h3>Bhajani Chakali</h3>
              <p>Crispy, roasted 12-grain spice chakalis</p>
              <span className="cat-link-text">Explore Products →</span>
            </div>
          </Link>

          {/* Card 2: Pure Ghee Laddoos */}
          <Link to="/shop?category=Laddoo" className="category-card-real">
            <div className="category-img-wrapper">
              <img src={categoryImages.laddoo} alt="Pure Ghee Laddoos" />
            </div>
            <div className="category-card-content">
              <h3>Pure Ghee Laddoos</h3>
              <p>Besan, Dink, and Rava Laddoos</p>
              <span className="cat-link-text">Explore Products →</span>
            </div>
          </Link>

          {/* Card 3: Special Masalas */}
          <Link to="/shop?category=Masala" className="category-card-real">
            <div className="category-img-wrapper">
              <img src={categoryImages.masala} alt="Special Masalas" />
            </div>
            <div className="category-card-content">
              <h3>Special Masalas</h3>
              <p>Kanda Lasun & Goda Masala</p>
              <span className="cat-link-text">Explore Products →</span>
            </div>
          </Link>

          {/* Card 4: Grandma's Pickles */}
          <Link to="/shop?category=Pickle" className="category-card-real">
            <div className="category-img-wrapper">
              <img src={categoryImages.pickle} alt="Grandma's Pickles" />
            </div>
            <div className="category-card-content">
              <h3>Grandma's Pickles</h3>
              <p>Raw Mango, Lemon, & Green Chilli</p>
              <span className="cat-link-text">Explore Products →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <div className="section-header flex-header">
          <div>
            <h2 className="section-title">Bestselling Delicacies</h2>
            <p className="section-subtitle">Most loved snacks & spices by thousands of customers across India.</p>
          </div>
          <Link to="/shop" className="btn btn-outline">View All Products →</Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="why-us-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Naik Foods?</h2>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-badge">Purity</div>
              <h4>100% Pure & Natural</h4>
              <p>No artificial colors, flavors, or harmful chemical preservatives used.</p>
            </div>
            <div className="why-card">
              <div className="why-badge">Heritage</div>
              <h4>Authentic Family Recipes</h4>
              <p>Prepared in traditional brass handis using roasted grains & pure cow ghee.</p>
            </div>
            <div className="why-card">
              <div className="why-badge">Freshness</div>
              <h4>Vacuum Sealed Freshness</h4>
              <p>Packed with nitrogen flush to maintain crispiness and long shelf life.</p>
            </div>
            <div className="why-card">
              <div className="why-badge">Delivery</div>
              <h4>Pan India Delivery</h4>
              <p>Safe express delivery to 19,000+ pincodes across India & overseas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
