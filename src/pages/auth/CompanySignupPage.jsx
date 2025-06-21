// src/pages/auth/CompanySignupPage.jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const CompanySignupPage = () => {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signup(email, password, { companyName }, 'companies');
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
                <h2>Register Company Account</h2>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Company Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                <p className="redirect-link">Have an account? <Link to="/company/login">Login</Link></p>
            </form>
        </div>
    );
};
export default CompanySignupPage;
