import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>My Account</h2>
        <p className="auth-subtitle">Manage profile details & account security</p>

        <div className="account-details" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FULL NAME</label>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.name}</div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.email}</div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PHONE</label>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.phone || '+91 98765 43210'}</div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ROLE</label>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: user.isAdmin ? 'var(--primary)' : 'inherit' }}>
              {user.isAdmin ? '👑 Administrator' : 'Customer'}
            </div>
          </div>
        </div>

        <button className="btn btn-outline text-red w-full" onClick={handleLogout}>
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}
