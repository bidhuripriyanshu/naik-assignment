import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { authAPI } from '../api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    authAPI.login({ email, password })
      .then(res => {
        setLoading(false);
        dispatch(setUser(res.data));
        navigate('/');
      })
      .catch(err => {
        setLoading(false);
        setError(err.response?.data?.message || 'Invalid email or password');
      });
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Welcome Back to Naik Foods</h2>
        <p className="auth-subtitle">Sign in to manage orders, wishlist, and exclusive offers</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="e.g. user@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full mt-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
