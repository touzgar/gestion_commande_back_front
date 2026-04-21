import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Loader2, Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    confirmMotDePasse: '',
    telephone: '',
    adresse: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.motDePasse !== formData.confirmMotDePasse) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const user = await register({
        nom: formData.nom,
        email: formData.email,
        motDePasse: formData.motDePasse,
        telephone: formData.telephone,
        adresse: formData.adresse,
      });
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <div className="auth-page__blob auth-page__blob--1" />
        <div className="auth-page__blob auth-page__blob--2" />
        <div className="auth-page__pattern" />
      </div>

      <div className="auth-wrapper">
        <div className="auth-logo">
          <Link to="/" className="auth-logo__link">
            <div className="auth-logo__icon">
              <Package size={28} />
            </div>
            <span className="auth-logo__name">Packedia</span>
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
            <h2>Créer un compte ✨</h2>
            <p>Commencez votre aventure</p>
          </div>

          {error && (
            <div className="auth-error">
              <div className="auth-error__dot" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Nom complet</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Jean Dupont" required />
              </div>
            </div>

            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vous@exemple.com" required />
              </div>
            </div>

            <div className="auth-row">
              <div className="auth-field">
                <label>Téléphone</label>
                <div className="auth-input-wrap">
                  <Phone size={16} className="auth-input-icon" />
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+216 70 123" />
                </div>
              </div>
              <div className="auth-field">
                <label>Adresse</label>
                <div className="auth-input-wrap">
                  <MapPin size={16} className="auth-input-icon" />
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Tunis, TN" />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label>Mot de passe</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="motDePasse" value={formData.motDePasse} onChange={handleChange} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-input-toggle">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label>Confirmer le mot de passe</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="confirmMotDePasse" value={formData.confirmMotDePasse} onChange={handleChange} placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <>
                  <Loader2 size={18} className="auth-spinner" />
                  Inscription...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Déjà un compte?{' '}
              <Link to="/login">Se connecter</Link>
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