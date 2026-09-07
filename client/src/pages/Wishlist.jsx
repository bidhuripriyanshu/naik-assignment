import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/product/ProductCard';

export default function Wishlist() {
  const { user } = useSelector(s => s.auth);

  // Mock wishlist products
  const wishlistItems = [
    {
      _id: '1',
      name: 'Bhajani Special Chakali',
      marathiName: 'भाजणी चकली',
      category: 'Chakali',
      price: 180,
      originalPrice: 200,
      rating: 4.9,
      numReviews: 88,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
      variants: [{ weight: '500g', price: 180, countInStock: 25 }]
    },
    {
      _id: '2',
      name: 'Pure Cow Ghee Besan Laddoo',
      marathiName: 'बेसन लाडू',
      category: 'Laddoo',
      price: 240,
      originalPrice: 280,
      rating: 4.9,
      numReviews: 120,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80',
      variants: [{ weight: '500g', price: 240, countInStock: 15 }]
    }
  ];

  return (
    <div className="container py-5">
      <h1 className="page-title">My Wishlist ❤️</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="product-grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {wishlistItems.map(item => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
