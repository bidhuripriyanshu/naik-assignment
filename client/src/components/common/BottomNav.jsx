import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './BottomNav.css';

export default function BottomNav() {
  const { pathname } = useLocation();
  const { items } = useSelector((s) => s.cart);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const links = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/shop', icon: '🔍', label: 'Shop' },
    { to: '/cart', icon: '🛒', label: 'Cart', badge: cartCount },
    { to: '/account', icon: '👤', label: 'Account' },
  ];

  return (
    <nav className="bottom-nav">
      {links.map(({ to, icon, label, badge }) => (
        <Link
          key={to}
          to={to}
          className={`bottom-nav-item ${pathname === to ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">
            {icon}
            {badge > 0 && <span className="bottom-nav-badge">{badge}</span>}
          </span>
          <span className="bottom-nav-label">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
