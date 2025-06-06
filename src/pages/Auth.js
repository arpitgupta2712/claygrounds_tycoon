import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PasswordInput from '../components/auth/PasswordInput';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

const Auth = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Please enter your phone number and password');
      return;
    }
    setLoading(true);
    
    console.log('Attempting login with:', { phone, password: '***' });
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    
    try {
      const response = await api.post('/employees/auth/login', {
        phone,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        if (isTokenExpired(response.data.token)) {
          setError('Authentication token is expired. Please try again.');
          setLoading(false);
          return;
        }
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      } else {
        setError(response.data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid phone number or password');
      } else if (err.message.includes('Network Error')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cg-auth-page">
      <div className="cg-auth-container">
        <div className="cg-auth-header">
          <h1 className="cg-auth-title">ClayGrounds Tycoon</h1>
          <p className="cg-auth-subtitle">Employee Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="cg-auth-form">
          <div className="cg-input-group">
            <label htmlFor="phone" className="cg-label">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="cg-input"
              placeholder="Enter your phone number"
              autoComplete="tel"
            />
          </div>
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            className="cg-auth-password"
            placeholder="Enter your password"
          />
          {error && <div className="cg-error-message">{error}</div>}
          <button
            type="submit"
            className="cg-btn cg-btn-primary cg-btn-block"
            disabled={loading || !phone || !password}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth; 