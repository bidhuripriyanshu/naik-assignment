import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { authAPI } from '../api';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    authAPI.register({ name, email, phone, password })
      .then(res => {
        setLoading(false);
        dispatch(setUser(res.data));
        navigate('/');
      })
      .catch(err => {
        setLoading(false);
        setError(err.response?.data?.message || 'Registration failed');
      });
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Create Naik Foods Account</h2>
        <p className="auth-subtitle">Join thousands of food lovers enjoying authentic snacks</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Rahul Deshmukh"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input 
              type="tel" 
              required 
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
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
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
