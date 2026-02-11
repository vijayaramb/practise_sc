import React, { useState } from 'react';
import './CustomerAuth.css';

function CustomerAuth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin({ email }, false);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin({ name, email, mobile }, true);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
        <p className="auth-subtitle">
          {isRegistering 
            ? 'Register to start placing orders' 
            : 'Enter your email to continue'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="auth-toggle">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)} className="toggle-btn">
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegistering(true)} className="toggle-btn">
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerAuth;
