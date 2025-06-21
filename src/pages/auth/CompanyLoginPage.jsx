// src/pages/auth/CompanyLoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const CompanyLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, 'companies');
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Company Login</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Company Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <p className="redirect-link">No account? <Link to="/company/signup">Register</Link></p>
      </form>
    </div>
  );
};
export default CompanyLoginPage;
