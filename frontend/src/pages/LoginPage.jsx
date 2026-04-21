import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, motDePasse);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (cart.length > 0) {
        navigate('/user/checkout');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background decorations */}
      <div className="auth-page__bg">
        <div className="auth-page__blob auth-page__blob--1" />
        <div className="auth-page__blob auth-page__blob--2" />
        <div className="auth-page__pattern" />
      </div>

      <div className="auth-wrapper">
        {/* Logo */}
        <div className="auth-logo">
          <Link to="/" className="auth-logo__link">
            <div className="auth-logo__icon">
              <Package size={28} />
            </div>
            <span className="auth-logo__name">Packedia</span>
          </Link>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card__header">
            <h2>Bon retour! 👋</h2>
            <p>Connectez-vous à votre compte</p>
          </div>

          {error && (
            <div className="auth-error">
              <div className="auth-error__dot" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Mot de passe</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-input-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <>
                  <Loader2 size={18} className="auth-spinner" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Pas encore de compte?{' '}
              <Link to="/register">S'inscrire</Link>
            </p>
          </div>
        </div>

        <p className="auth-back">
          <Link to="/">← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}