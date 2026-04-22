import './LandingPage.css';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Box,
  CheckCircle,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  Printer,
  Recycle,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  Truck,
  Users,
  X,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { produitService, categorieService } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

/* ─── static data ─── */
const whyCards = [
  { icon: ShoppingCart, title: 'Achat simplifié', text: 'Une interface claire pour commander rapidement et en toute simplicité.', gradient: 'from-blue-500 to-blue-600' },
  { icon: Truck, title: 'Livraison rapide', text: 'Expédition optimisée avec suivi en temps réel de vos commandes.', gradient: 'from-purple-500 to-purple-600' },
  { icon: Shield, title: 'Qualité premium', text: 'Produits fiables avec un contrôle qualité continu et rigoureux.', gradient: 'from-pink-500 to-pink-600' },
  { icon: Box, title: 'Support réactif', text: 'Accompagnement humain et personnalisé pour chaque besoin.', gradient: 'from-orange-500 to-orange-600' },
];

const serviceCards = [
  { icon: Printer, title: 'Impression HD', text: 'Impressions haute définition sur tous types de supports flexibles.', color: '#22c55e', bgGradient: 'from-green-50 to-emerald-50' },
  { icon: Recycle, title: 'Éco-responsable', text: 'Emballages recyclables et solutions durables pour votre marque.', color: '#3b82f6', bgGradient: 'from-blue-50 to-cyan-50' },
  { icon: Zap, title: 'Délais express', text: 'Production rapide et livraison en 48h sur tout le territoire.', color: '#f59e0b', bgGradient: 'from-amber-50 to-yellow-50' },
  { icon: Users, title: 'Accompagnement', text: 'Un conseiller dédié vous guide de la conception à la livraison.', color: '#8b5cf6', bgGradient: 'from-purple-50 to-pink-50' },
];

const trustLogos = ['FlexPack', 'BioWrap', 'GreenBox', 'PackPro', 'EcoPouche', 'FreshPak'];

const stats = [
  { value: '500+', label: 'Clients satisfaits', icon: '👥' },
  { value: '10K+', label: 'Commandes livrées', icon: '📦' },
  { value: '98%', label: 'Taux de satisfaction', icon: '⭐' },
  { value: '24h', label: 'Support réactif', icon: '⚡' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart, getItemCount, cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    produitService
      .getAll()
      .then((r) => setProduits(r.data || []))
      .catch(() => setProduits([]));

    categorieService
      .getAll()
      .then((r) => setCategories(r.data || []))
      .catch(() => setCategories([]));
  }, []);

  const cartCount = getItemCount();
  const handleAdd = (produit) => {
    addToCart(produit);
    setAddedId(produit.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="landing-root">
      {/* ════════════════════════════════════════
          NAVBAR
          ════════════════════════════════════════ */}
      <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav__inner">
          <Link to="/" className="landing-brand">
            <div className="landing-brand__icon">
              <Package size={20} />
            </div>
            <span className="landing-brand__name">Packedia</span>
          </Link>

          <div className="landing-nav__links">
            <a href="#hero">Accueil</a>
            <a href="#produits">Produits</a>
            <a href="#categories">Catégories</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="landing-nav__actions">
            <div className="landing-cart-wrapper">
              <button className="landing-cart-btn" onClick={() => setCartOpen(v => !v)}>
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="landing-cart-badge">{cartCount}</span>}
              </button>

              {/* ── Cart Popup ── */}
              {cartOpen && (
                <>
                  <div className="landing-cart-overlay" onClick={() => setCartOpen(false)} />
                  <div className="landing-cart-popup">
                    <div className="landing-cart-popup__header">
                      <h3>Mon Panier ({cartCount})</h3>
                      <button onClick={() => setCartOpen(false)} className="landing-cart-popup__close"><X size={18} /></button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="landing-cart-popup__empty">
                        <ShoppingCart size={36} />
                        <p>Votre panier est vide</p>
                      </div>
                    ) : (
                      <>
                        <div className="landing-cart-popup__items">
                          {cart.map((item) => (
                            <div key={item.produit.id} className="landing-cart-item">
                              <div className="landing-cart-item__icon"><Package size={20} /></div>
                              <div className="landing-cart-item__info">
                                <p className="landing-cart-item__name">{item.produit.nom}</p>
                                <p className="landing-cart-item__price">{Number(item.produit.prix).toFixed(2)} TND</p>
                              </div>
                              <div className="landing-cart-item__qty">
                                <button onClick={() => updateQuantity(item.produit.id, item.quantite - 1)}><Minus size={14} /></button>
                                <span>{item.quantite}</span>
                                <button onClick={() => updateQuantity(item.produit.id, item.quantite + 1)}><Plus size={14} /></button>
                              </div>
                              <button className="landing-cart-item__remove" onClick={() => removeFromCart(item.produit.id)}><Trash2 size={15} /></button>
                            </div>
                          ))}
                        </div>
                        <div className="landing-cart-popup__footer">
                          <div className="landing-cart-popup__total">
                            <span>Total</span>
                            <strong>{getTotal().toFixed(2)} TND</strong>
                          </div>
                          <Link to="/user/checkout" className="landing-btn landing-btn--solid" style={{width:'100%',justifyContent:'center'}} onClick={() => setCartOpen(false)}>Passer la commande</Link>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            <Link to="/login" className="landing-btn landing-btn--outline">Connexion</Link>
            <Link to="/register" className="landing-btn landing-btn--solid">Commencer</Link>
          </div>

          <button className="landing-nav__burger" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="landing-mobile-menu">
            <a href="#hero" onClick={() => setMenuOpen(false)}>Accueil</a>
            <a href="#produits" onClick={() => setMenuOpen(false)}>Produits</a>
            <a href="#categories" onClick={() => setMenuOpen(false)}>Catégories</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <div className="landing-mobile-menu__btns">
              <Link to="/login" className="landing-btn landing-btn--outline" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link to="/register" className="landing-btn landing-btn--solid" onClick={() => setMenuOpen(false)}>Créer un compte</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════ */}
      <section id="hero" className="landing-hero" ref={heroRef}>
        <div className="landing-container">
          <div className="landing-hero__card">
            {/* Decorative blobs */}
            <div className="landing-hero__blob landing-hero__blob--1" />
            <div className="landing-hero__blob landing-hero__blob--2" />

            <div className="landing-hero__content">
              <div className="landing-hero__left">
                <span className="landing-hero__badge">
                  <Sparkles size={14} /> Packaging moderne
                </span>
                <h1 className="landing-hero__title">
                  Le packaging flexible
                  <br />
                  <span className="landing-hero__title--accent">qui valorise votre marque</span>
                </h1>
                <p className="landing-hero__subtitle">
                  Une vitrine claire, structurée et professionnelle pour présenter vos produits,
                  augmenter vos ventes et rassurer vos clients.
                </p>
                <div className="landing-hero__btns">
                  <a href="#produits" className="landing-btn landing-btn--white">
                    Découvrir nos produits <ArrowRight size={16} />
                  </a>
                  <Link to="/register" className="landing-btn landing-btn--ghost-white">
                    Demander un devis
                  </Link>
                </div>
              </div>

              <div className="landing-hero__right">
                <div className="landing-hero__product-showcase">
                  <div className="landing-hero__float-card landing-hero__float-card--1">
                    <Package size={28} />
                    <span>Pochettes</span>
                  </div>
                  <div className="landing-hero__float-card landing-hero__float-card--2">
                    <Box size={28} />
                    <span>Sachets</span>
                  </div>
                  <div className="landing-hero__float-card landing-hero__float-card--3">
                    <ShoppingCart size={28} />
                    <span>Boîtes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY CHOOSE US
          ════════════════════════════════════════ */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section__header">
            <p className="landing-section__label">Pourquoi</p>
            <h2 className="landing-section__title">Nous <span>Choisir ?</span></h2>
          </div>
          <div className="landing-grid landing-grid--4">
            {whyCards.map((item, idx) => (
              <div key={idx} className="landing-why-card">
                <div className="landing-why-card__icon">
                  <item.icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          POPULAR PRODUCTS
          ════════════════════════════════════════ */}
      <section id="produits" className="landing-section landing-section--gray">
        <div className="landing-container">
          <div className="landing-section__header">
            <span className="landing-pill">Best sellers</span>
            <h2 className="landing-section__title">Nos Produits <span>Populaires</span></h2>
            <p className="landing-section__desc">Des produits dynamiques récupérés directement depuis votre catalogue.</p>
          </div>

          {produits.length === 0 ? (
            <div className="landing-empty">
              <Box size={48} />
              <h3>Aucun produit pour le moment</h3>
              <p>Ajoutez des produits côté admin pour remplir cette section automatiquement.</p>
            </div>
          ) : (
            <div className="landing-grid landing-grid--4">
              {produits.slice(0, 8).map((p) => (
                <article key={p.id} className="landing-product-card">
                  <div className="landing-product-card__img">
                    {p.image ? (
                      <img src={p.image} alt={p.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={36} />
                    )}
                  </div>
                  <div className="landing-product-card__body">
                    <span className="landing-product-card__cat">{p.categorie?.nom || 'Produit'}</span>
                    <h3>{p.nom}</h3>
                    <div className="landing-product-card__meta">
                      <p className="landing-product-card__price">{Number(p.prix || 0).toFixed(2)} TND</p>
                      <span className="landing-product-card__stock">Stock: {p.stock ?? 0}</span>
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={Number(p.stock || 0) <= 0}
                      className={`landing-btn landing-btn--add ${
                        addedId === p.id ? 'landing-btn--added' : ''
                      } ${Number(p.stock || 0) <= 0 ? 'landing-btn--disabled' : ''}`}
                    >
                      {addedId === p.id ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          COLLECTIONS (CATEGORIES)
          ════════════════════════════════════════ */}
      <section id="categories" className="landing-section">
        <div className="landing-container">
          <div className="landing-section__header">
            <h2 className="landing-section__title">Découvrez Nos <span>Collections</span></h2>
            <p className="landing-section__desc">Explorez nos différentes gammes d'emballages flexibles.</p>
          </div>

          {categories.length > 0 ? (
            <div className="landing-grid landing-grid--5">
              {categories.slice(0, 10).map((cat) => (
                <div key={cat.id} className="landing-cat-card">
                  <div className="landing-cat-card__circle">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '999px' }} />
                    ) : (
                      <Package size={30} />
                    )}
                  </div>
                  <p>{cat.nom}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="landing-empty landing-empty--small">
              <Package size={36} />
              <p>Les catégories apparaîtront ici une fois ajoutées.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES
          ════════════════════════════════════════ */}
      <section id="services" className="landing-section landing-section--white">
        <div className="landing-container">
          <div className="landing-section__header">
            <h2 className="landing-section__title">Nos Services <span>Exceptionnels</span></h2>
          </div>
          <div className="landing-grid landing-grid--4">
            {serviceCards.map((item, idx) => (
              <div key={idx} className="landing-service-card">
                <div className="landing-service-card__icon" style={{ background: item.color + '18', color: item.color }}>
                  <item.icon size={24} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
          ════════════════════════════════════════ */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-cta-banner">
            <div className="landing-cta-banner__blob" />
            <h2>Quel que soit votre produit,</h2>
            <p className="landing-cta-banner__accent">nous avons la pochette qu'il mérite.</p>
            <div className="landing-cta-banner__btns">
              <Link to="/register" className="landing-btn landing-btn--white">Demander un devis</Link>
              <Link to="/login" className="landing-btn landing-btn--ghost-white">Service client</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST SECTION
          ════════════════════════════════════════ */}
      <section className="landing-section landing-section--gray">
        <div className="landing-container">
          <div className="landing-section__header">
            <h2 className="landing-section__title">Ils nous font <span>CONFIANCE</span></h2>
          </div>
          <div className="landing-trust-row">
            {trustLogos.map((name, idx) => (
              <div key={idx} className="landing-trust-logo">
                <Package size={22} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS / GROWTH
          ════════════════════════════════════════ */}
      <section className="landing-section landing-section--white">
        <div className="landing-container">
          <div className="landing-section__header">
            <h2 className="landing-section__title">Nous Grandissons <span>Avec Vous</span></h2>
          </div>
          <div className="landing-stats-row">
            {stats.map((s, idx) => (
              <div key={idx} className="landing-stat">
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════ */}
      <footer id="contact" className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer__grid">
            <div className="landing-footer__col">
              <div className="landing-brand landing-brand--footer">
                <div className="landing-brand__icon landing-brand__icon--footer">
                  <Package size={20} />
                </div>
                <span className="landing-brand__name landing-brand__name--footer">Packedia</span>
              </div>
              <p className="landing-footer__desc">
                Solution packaging moderne, orientée performance et expérience client.
              </p>
              <div className="landing-footer__socials">
                <a href="#"><Instagram size={18} /></a>
                <a href="#"><Facebook size={18} /></a>
                <a href="#"><Linkedin size={18} /></a>
              </div>
            </div>

            <div className="landing-footer__col">
              <h4>Navigation</h4>
              <a href="#hero">Accueil</a>
              <a href="#produits">Produits</a>
              <a href="#categories">Catégories</a>
              <a href="#services">Services</a>
            </div>

            <div className="landing-footer__col">
              <h4>Services</h4>
              <a href="#">Impression HD</a>
              <a href="#">Éco-responsable</a>
              <a href="#">Délais express</a>
              <a href="#">Accompagnement</a>
            </div>

            <div className="landing-footer__col">
              <h4>Contact</h4>
              <div className="landing-footer__contact-item">
                <Mail size={14} /> contact@packedia.com
              </div>
              <div className="landing-footer__contact-item">
                <Phone size={14} /> +216 70 123 456
              </div>
              <div className="landing-footer__contact-item">
                <MapPin size={14} /> Tunis, Tunisie
              </div>
            </div>
          </div>

          <div className="landing-footer__bottom">
            <p>© 2026 Packedia. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}